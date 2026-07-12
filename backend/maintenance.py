from datetime import datetime, timezone

from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from extensions import db
from models import Maintenance, Vehicle
from utils.helpers import error_response, serialize_list, success_response
from utils.validators import parse_datetime, validate_required_fields

maintenance_bp = Blueprint("maintenance", __name__, url_prefix="/api/maintenance")

ALLOWED_STATUSES = {"pending", "completed"}


@maintenance_bp.route("", methods=["POST"])
@jwt_required()
def create_maintenance():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(data, ["vehicle_id", "description", "service_date"])
    if errors:
        return error_response(errors[0], 400)

    vehicle = Vehicle.query.get(data["vehicle_id"])
    if not vehicle:
        return error_response("Vehicle not found", 404)

    service_date, error = parse_datetime(data["service_date"], "service_date")
    if error:
        return error_response(error, 400)

    next_service_date = None
    if data.get("next_service_date"):
        next_service_date, error = parse_datetime(data["next_service_date"], "next_service_date")
        if error:
            return error_response(error, 400)

    record = Maintenance(
        vehicle_id=vehicle.id,
        description=data["description"].strip(),
        cost=data.get("cost", 0),
        service_date=service_date,
        next_service_date=next_service_date,
        status="pending",
    )

    vehicle.status = "maintenance"

    db.session.add(record)
    db.session.commit()

    return success_response(record.to_dict(), "Maintenance record created successfully", 201)


@maintenance_bp.route("", methods=["GET"])
@jwt_required()
def list_maintenance():
    query = Maintenance.query

    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)

    vehicle_id = request.args.get("vehicle_id", type=int)
    if vehicle_id:
        query = query.filter_by(vehicle_id=vehicle_id)

    records = query.order_by(Maintenance.created_at.desc()).all()
    return success_response(serialize_list(records))


@maintenance_bp.route("/<int:record_id>", methods=["GET"])
@jwt_required()
def get_maintenance(record_id):
    record = Maintenance.query.get(record_id)
    if not record:
        return error_response("Maintenance record not found", 404)
    return success_response(record.to_dict())


@maintenance_bp.route("/<int:record_id>", methods=["PUT"])
@jwt_required()
def update_maintenance(record_id):
    record = Maintenance.query.get(record_id)
    if not record:
        return error_response("Maintenance record not found", 404)

    data = request.get_json(silent=True) or {}

    if "description" in data:
        record.description = data["description"].strip()

    if "cost" in data:
        record.cost = data["cost"]

    if "service_date" in data:
        service_date, error = parse_datetime(data["service_date"], "service_date")
        if error:
            return error_response(error, 400)
        record.service_date = service_date

    if "next_service_date" in data:
        next_service_date, error = parse_datetime(data["next_service_date"], "next_service_date")
        if error:
            return error_response(error, 400)
        record.next_service_date = next_service_date

    if "status" in data:
        if data["status"] not in ALLOWED_STATUSES:
            return error_response(f"Status must be one of {sorted(ALLOWED_STATUSES)}", 400)
        record.status = data["status"]

    db.session.commit()
    return success_response(record.to_dict(), "Maintenance record updated successfully")


@maintenance_bp.route("/<int:record_id>", methods=["DELETE"])
@jwt_required()
def delete_maintenance(record_id):
    record = Maintenance.query.get(record_id)
    if not record:
        return error_response("Maintenance record not found", 404)

    db.session.delete(record)
    db.session.commit()
    return success_response(message="Maintenance record deleted successfully")


@maintenance_bp.route("/<int:record_id>/complete", methods=["POST"])
@jwt_required()
def complete_maintenance(record_id):
    record = Maintenance.query.get(record_id)
    if not record:
        return error_response("Maintenance record not found", 404)

    if record.status == "completed":
        return error_response("Maintenance record is already completed", 400)

    record.status = "completed"

    vehicle = Vehicle.query.get(record.vehicle_id)
    if vehicle and vehicle.status == "maintenance":
        vehicle.status = "active"

    db.session.commit()
    return success_response(record.to_dict(), "Maintenance record marked as completed")
