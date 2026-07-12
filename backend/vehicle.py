from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from extensions import db
from models import VEHICLE_STATUSES, Vehicle
from utils.helpers import error_response, serialize_list, success_response
from utils.validators import validate_non_negative, validate_required_fields

vehicle_bp = Blueprint("vehicle", __name__, url_prefix="/api/vehicles")

NUMERIC_FIELDS = ["maximum_load_capacity", "odometer", "acquisition_cost"]


def _validate_numeric_fields(data, fields):
    for field in fields:
        if field in data:
            error = validate_non_negative(data[field], field)
            if error:
                return error
    return None


@vehicle_bp.route("", methods=["POST"])
@jwt_required()
def create_vehicle():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(
        data,
        [
            "registration_number",
            "vehicle_name",
            "vehicle_type",
            "maximum_load_capacity",
            "odometer",
            "acquisition_cost",
        ],
    )
    if errors:
        return error_response("; ".join(errors), 400)

    registration_number = data["registration_number"].strip()
    if not registration_number:
        return error_response("registration_number cannot be empty", 400)

    if Vehicle.query.filter_by(registration_number=registration_number).first():
        return error_response("A vehicle with this registration number already exists", 409)

    numeric_error = _validate_numeric_fields(data, NUMERIC_FIELDS)
    if numeric_error:
        return error_response(numeric_error, 400)

    status = data.get("status", "Available")
    if status not in VEHICLE_STATUSES:
        return error_response(f"Status must be one of {sorted(VEHICLE_STATUSES)}", 400)

    vehicle = Vehicle(
        registration_number=registration_number,
        vehicle_name=data["vehicle_name"].strip(),
        vehicle_model=data.get("vehicle_model"),
        vehicle_type=data["vehicle_type"].strip(),
        maximum_load_capacity=data["maximum_load_capacity"],
        odometer=data["odometer"],
        acquisition_cost=data["acquisition_cost"],
        status=status,
    )

    db.session.add(vehicle)
    db.session.commit()

    return success_response(vehicle.to_dict(), "Vehicle created successfully", 201)


@vehicle_bp.route("", methods=["GET"])
@jwt_required()
def list_vehicles():
    query = Vehicle.query

    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)

    vehicle_type = request.args.get("vehicle_type")
    if vehicle_type:
        query = query.filter_by(vehicle_type=vehicle_type)

    vehicles = query.order_by(Vehicle.created_at.desc()).all()
    return success_response(serialize_list(vehicles))


@vehicle_bp.route("/<int:vehicle_id>", methods=["GET"])
@jwt_required()
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return error_response("Vehicle not found", 404)
    return success_response(vehicle.to_dict())


@vehicle_bp.route("/<int:vehicle_id>", methods=["PUT"])
@jwt_required()
def update_vehicle(vehicle_id):
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return error_response("Vehicle not found", 404)

    data = request.get_json(silent=True) or {}

    if "registration_number" in data:
        registration_number = data["registration_number"].strip()
        if not registration_number:
            return error_response("registration_number cannot be empty", 400)
        existing = Vehicle.query.filter_by(registration_number=registration_number).first()
        if existing and existing.id != vehicle.id:
            return error_response("A vehicle with this registration number already exists", 409)
        vehicle.registration_number = registration_number

    if "vehicle_name" in data:
        vehicle.vehicle_name = data["vehicle_name"].strip()

    if "vehicle_model" in data:
        vehicle.vehicle_model = data["vehicle_model"]

    if "vehicle_type" in data:
        vehicle.vehicle_type = data["vehicle_type"].strip()

    numeric_error = _validate_numeric_fields(data, NUMERIC_FIELDS)
    if numeric_error:
        return error_response(numeric_error, 400)

    if "maximum_load_capacity" in data:
        vehicle.maximum_load_capacity = data["maximum_load_capacity"]

    if "odometer" in data:
        vehicle.odometer = data["odometer"]

    if "acquisition_cost" in data:
        vehicle.acquisition_cost = data["acquisition_cost"]

    if "status" in data:
        if data["status"] not in VEHICLE_STATUSES:
            return error_response(f"Status must be one of {sorted(VEHICLE_STATUSES)}", 400)
        vehicle.status = data["status"]

    db.session.commit()
    return success_response(vehicle.to_dict(), "Vehicle updated successfully")


@vehicle_bp.route("/<int:vehicle_id>", methods=["DELETE"])
@jwt_required()
def delete_vehicle(vehicle_id):
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return error_response("Vehicle not found", 404)

    db.session.delete(vehicle)
    db.session.commit()
    return success_response(message="Vehicle deleted successfully")
