from datetime import datetime, timezone

from flask import Blueprint, request
from utils.decorators import firebase_auth_required as jwt_required

from extensions import db
from models import Driver, Trip, Vehicle
from utils.helpers import error_response, serialize_list, success_response
from utils.validators import parse_datetime, validate_required_fields

trip_bp = Blueprint("trip", __name__, url_prefix="/api/trips")

ALLOWED_STATUSES = {"scheduled", "ongoing", "completed", "cancelled"}


def _active_trip_conflict(vehicle_id, driver_id, exclude_trip_id=None):
    query = Trip.query.filter(
        Trip.status == "ongoing",
        (Trip.vehicle_id == vehicle_id) | (Trip.driver_id == driver_id),
    )
    if exclude_trip_id:
        query = query.filter(Trip.id != exclude_trip_id)
    return query.first()


@trip_bp.route("", methods=["POST"])
@jwt_required()
def create_trip():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(data, ["vehicle_id", "driver_id", "origin", "destination"])
    if errors:
        return error_response(errors[0], 400)

    vehicle = Vehicle.query.get(data["vehicle_id"])
    if not vehicle:
        return error_response("Vehicle not found", 404)
    if vehicle.status != "active":
        return error_response(f"Vehicle is not active (current status: {vehicle.status})", 400)

    driver = Driver.query.get(data["driver_id"])
    if not driver:
        return error_response("Driver not found", 404)
    if driver.status != "active":
        return error_response(f"Driver is not active (current status: {driver.status})", 400)

    scheduled_start = None
    if data.get("scheduled_start"):
        scheduled_start, error = parse_datetime(data["scheduled_start"], "scheduled_start")
        if error:
            return error_response(error, 400)

    trip = Trip(
        vehicle_id=vehicle.id,
        driver_id=driver.id,
        origin=data["origin"].strip(),
        destination=data["destination"].strip(),
        scheduled_start=scheduled_start,
        notes=data.get("notes"),
        status="scheduled",
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

    if trip.status in ("completed", "cancelled"):
        return error_response(f"Cannot modify a {trip.status} trip", 400)

    data = request.get_json(silent=True) or {}

    if "origin" in data:
        trip.origin = data["origin"].strip()

    if "destination" in data:
        trip.destination = data["destination"].strip()

    if "notes" in data:
        trip.notes = data["notes"]

    if "scheduled_start" in data:
        scheduled_start, error = parse_datetime(data["scheduled_start"], "scheduled_start")
        if error:
            return error_response(error, 400)
        trip.scheduled_start = scheduled_start

    if "status" in data:
        if data["status"] not in ALLOWED_STATUSES:
            return error_response(f"Status must be one of {sorted(ALLOWED_STATUSES)}", 400)
        trip.status = data["status"]

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

    if trip.status != "scheduled":
        return error_response(f"Only scheduled trips can be started (current status: {trip.status})", 400)

    conflict = _active_trip_conflict(trip.vehicle_id, trip.driver_id, exclude_trip_id=trip.id)
    if conflict:
        return error_response("Vehicle or driver is already on an ongoing trip", 409)

    trip.status = "ongoing"
    trip.start_time = datetime.now(timezone.utc)
    db.session.commit()

    return success_response(trip.to_dict(), "Trip started")


@trip_bp.route("/<int:trip_id>/complete", methods=["POST"])
@jwt_required()
def complete_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return error_response("Trip not found", 404)

    if trip.status != "ongoing":
        return error_response(f"Only ongoing trips can be completed (current status: {trip.status})", 400)

    data = request.get_json(silent=True) or {}

    trip.status = "completed"
    trip.end_time = datetime.now(timezone.utc)
    if data.get("distance_km") is not None:
        trip.distance_km = data["distance_km"]

    db.session.commit()
    return success_response(trip.to_dict(), "Trip completed")


@trip_bp.route("/<int:trip_id>/cancel", methods=["POST"])
@jwt_required()
def cancel_trip(trip_id):
    trip = Trip.query.get(trip_id)
    if not trip:
        return error_response("Trip not found", 404)

    if trip.status in ("completed", "cancelled"):
        return error_response(f"Cannot cancel a {trip.status} trip", 400)

    trip.status = "cancelled"
    db.session.commit()
    return success_response(trip.to_dict(), "Trip cancelled")
