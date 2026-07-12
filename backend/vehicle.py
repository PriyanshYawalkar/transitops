from flask import Blueprint, request
from utils.decorators import firebase_auth_required as jwt_required

from extensions import db
from models import Vehicle
from utils.helpers import error_response, serialize_list, success_response
from utils.validators import validate_required_fields

vehicle_bp = Blueprint("vehicle", __name__, url_prefix="/api/vehicles")

ALLOWED_STATUSES = {"active", "maintenance", "inactive"}


@vehicle_bp.route("", methods=["POST"])
@jwt_required()
def create_vehicle():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(data, ["registration_number", "type"])
    if errors:
        return error_response(errors[0], 400)

    registration_number = data["registration_number"].strip()

    if Vehicle.query.filter_by(registration_number=registration_number).first():
        return error_response("A vehicle with this registration number already exists", 409)

    status = data.get("status", "active")
    if status not in ALLOWED_STATUSES:
        return error_response(f"Status must be one of {sorted(ALLOWED_STATUSES)}", 400)

    vehicle = Vehicle(
        registration_number=registration_number,
        type=data["type"].strip(),
        model=data.get("model"),
        capacity=data.get("capacity"),
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

    vehicle_type = request.args.get("type")
    if vehicle_type:
        query = query.filter_by(type=vehicle_type)

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
        existing = Vehicle.query.filter_by(registration_number=registration_number).first()
        if existing and existing.id != vehicle.id:
            return error_response("A vehicle with this registration number already exists", 409)
        vehicle.registration_number = registration_number

    if "type" in data:
        vehicle.type = data["type"].strip()

    if "model" in data:
        vehicle.model = data["model"]

    if "capacity" in data:
        vehicle.capacity = data["capacity"]

    if "status" in data:
        if data["status"] not in ALLOWED_STATUSES:
            return error_response(f"Status must be one of {sorted(ALLOWED_STATUSES)}", 400)
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
