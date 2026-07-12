from datetime import datetime, timezone

from flask import Blueprint, request
from utils.decorators import firebase_auth_required as jwt_required

from extensions import db
from models import Driver, Trip, Vehicle
from utils.helpers import error_response, serialize_list, success_response
from utils.validators import parse_datetime, validate_non_negative, validate_required_fields

trip_bp = Blueprint("trip", __name__, url_prefix="/api/trips")


@trip_bp.route("", methods=["POST"])
@jwt_required()
def create_trip():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(
        data, ["vehicle_id", "driver_id", "source", "destination", "cargo_weight"]
    )
    if errors:
        return error_response("; ".join(errors), 400)

    vehicle = Vehicle.query.get(data["vehicle_id"])
    if not vehicle:
        return error_response("Vehicle not found", 404)

    driver = Driver.query.get(data["driver_id"])
    if not driver:
        return error_response("Driver not found", 404)

    cargo_weight = data["cargo_weight"]
    cargo_error = validate_non_negative(cargo_weight, "cargo_weight")
    if cargo_error:
        return error_response(cargo_error, 400)

    if cargo_weight > vehicle.maximum_load_capacity:
        return error_response(
            f"cargo_weight ({cargo_weight}) exceeds vehicle maximum_load_capacity "
            f"({vehicle.maximum_load_capacity})",
            400,
        )

    planned_distance = data.get("planned_distance")
    if planned_distance is not None:
        planned_distance_error = validate_non_negative(planned_distance, "planned_distance")
        if planned_distance_error:
            return error_response(planned_distance_error, 400)

    scheduled_start = None
    if data.get("scheduled_start"):
        scheduled_start, error = parse_datetime(data["scheduled_start"], "scheduled_start")
        if error:
            return error_response(error, 400)

    trip = Trip(
        vehicle_id=vehicle.id,
        driver_id=driver.id,
        source=data["source"].strip(),
        destination=data["destination"].strip(),
        cargo_weight=cargo_weight,
        planned_distance=planned_distance,
        scheduled_start=scheduled_start,
        notes=data.get("notes"),
        status="Draft",
    )

    db.session.add(trip)
    db.session.commit()

    return success_response(trip.to_dict(), "Trip created successfully", 201)


@trip_bp.route("", methods=["GET"])
@jwt_required()
def list_trips():
    query = Trip.query

    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)

    vehicle_id = request.args.get("vehicle_id", type=int)
    if vehicle_id:
        query = query.filter_by(vehicle_id=vehicle_id)

    driver_id = request.args.get("driver_id", type=int)
    if driver_id:
        query = query.filter_by(driver_id=driver_id)

    trips = query.order_by(Trip.created_at.desc()).all()
    return success_response(serialize_list(trips))


@trip_bp.route("/<int:trip_id>", methods=["GET"])
@jwt_required()
def get_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return error_response("Trip not found", 404)
    return success_response(trip.to_dict())


@trip_bp.route("/<int:trip_id>", methods=["PUT"])
@jwt_required()
def update_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return error_response("Trip not found", 404)

    if trip.status in ("Completed", "Cancelled"):
        return error_response(f"Cannot modify a {trip.status} trip", 400)

    data = request.get_json(silent=True) or {}

    if "status" in data:
        return error_response(
            "Trip status cannot be changed directly; use /start, /complete, or /cancel", 400
        )

    if "source" in data:
        trip.source = data["source"].strip()

    if "destination" in data:
        trip.destination = data["destination"].strip()

    if "cargo_weight" in data:
        cargo_weight = data["cargo_weight"]
        cargo_error = validate_non_negative(cargo_weight, "cargo_weight")
        if cargo_error:
            return error_response(cargo_error, 400)
        if cargo_weight > trip.vehicle.maximum_load_capacity:
            return error_response(
                f"cargo_weight ({cargo_weight}) exceeds vehicle maximum_load_capacity "
                f"({trip.vehicle.maximum_load_capacity})",
                400,
            )
        trip.cargo_weight = cargo_weight

    if "planned_distance" in data:
        planned_distance = data["planned_distance"]
        if planned_distance is not None:
            planned_distance_error = validate_non_negative(planned_distance, "planned_distance")
            if planned_distance_error:
                return error_response(planned_distance_error, 400)
        trip.planned_distance = planned_distance

    if "notes" in data:
        trip.notes = data["notes"]

    if "scheduled_start" in data:
        scheduled_start, error = parse_datetime(data["scheduled_start"], "scheduled_start")
        if error:
            return error_response(error, 400)
        trip.scheduled_start = scheduled_start

    db.session.commit()
    return success_response(trip.to_dict(), "Trip updated successfully")


@trip_bp.route("/<int:trip_id>", methods=["DELETE"])
@jwt_required()
def delete_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return error_response("Trip not found", 404)

    db.session.delete(trip)
    db.session.commit()
    return success_response(message="Trip deleted successfully")


@trip_bp.route("/<int:trip_id>/start", methods=["POST"])
@jwt_required()
def start_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return error_response("Trip not found", 404)

    if trip.status != "Draft":
        return error_response(
            f"Only draft trips can be dispatched (current status: {trip.status})", 400
        )

    vehicle = trip.vehicle
    driver = trip.driver

    if vehicle.status != "Available":
        return error_response(
            f"Vehicle is not available for dispatch (current status: {vehicle.status})", 409
        )

    if driver.status == "Suspended":
        return error_response("Driver is suspended and cannot be dispatched", 409)

    if driver.status != "Available":
        return error_response(
            f"Driver is not available for dispatch (current status: {driver.status})", 409
        )

    if driver.is_license_expired():
        return error_response("Driver's license has expired and cannot be dispatched", 409)

    trip.status = "Dispatched"
    trip.start_time = datetime.now(timezone.utc)
    vehicle.status = "On Trip"
    driver.status = "On Trip"
    db.session.commit()

    return success_response(trip.to_dict(), "Trip dispatched")


@trip_bp.route("/<int:trip_id>/complete", methods=["POST"])
@jwt_required()
def complete_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return error_response("Trip not found", 404)

    if trip.status != "Dispatched":
        return error_response(
            f"Only dispatched trips can be completed (current status: {trip.status})", 400
        )

    data = request.get_json(silent=True) or {}

    trip.status = "Completed"
    trip.end_time = datetime.now(timezone.utc)
    if data.get("distance_km") is not None:
        trip.distance_km = data["distance_km"]
    trip.vehicle.status = "Available"
    trip.driver.status = "Available"

    db.session.commit()
    return success_response(trip.to_dict(), "Trip completed")


@trip_bp.route("/<int:trip_id>/cancel", methods=["POST"])
@jwt_required()
def cancel_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return error_response("Trip not found", 404)

    if trip.status in ("Completed", "Cancelled"):
        return error_response(f"Cannot cancel a {trip.status} trip", 400)

    was_dispatched = trip.status == "Dispatched"
    trip.status = "Cancelled"
    if was_dispatched:
        trip.vehicle.status = "Available"
        trip.driver.status = "Available"

    db.session.commit()
    return success_response(trip.to_dict(), "Trip cancelled")
