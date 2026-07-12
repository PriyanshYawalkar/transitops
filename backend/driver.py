from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from extensions import db
from models import DRIVER_STATUSES, Driver
from utils.helpers import error_response, serialize_list, success_response
from utils.validators import parse_datetime, validate_range, validate_required_fields

driver_bp = Blueprint("driver", __name__, url_prefix="/api/drivers")


@driver_bp.route("", methods=["POST"])
@jwt_required()
def create_driver():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(
        data,
        ["name", "license_number", "license_category", "license_expiry_date", "safety_score"],
    )
    if errors:
        return error_response("; ".join(errors), 400)

    license_number = data["license_number"].strip()
    if not license_number:
        return error_response("license_number cannot be empty", 400)

    if Driver.query.filter_by(license_number=license_number).first():
        return error_response("A driver with this license number already exists", 409)

    safety_score_error = validate_range(data["safety_score"], "safety_score", 0, 100)
    if safety_score_error:
        return error_response(safety_score_error, 400)

    license_expiry_date, error = parse_datetime(data["license_expiry_date"], "license_expiry_date")
    if error:
        return error_response(error, 400)

    status = data.get("status", "Available")
    if status not in DRIVER_STATUSES:
        return error_response(f"Status must be one of {sorted(DRIVER_STATUSES)}", 400)

    driver = Driver(
        name=data["name"].strip(),
        license_number=license_number,
        license_category=data["license_category"].strip(),
        license_expiry_date=license_expiry_date,
        contact_number=data.get("contact_number"),
        safety_score=data["safety_score"],
        status=status,
    )

    db.session.add(driver)
    db.session.commit()

    return success_response(driver.to_dict(), "Driver created successfully", 201)


@driver_bp.route("", methods=["GET"])
@jwt_required()
def list_drivers():
    query = Driver.query

    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)

    drivers = query.order_by(Driver.created_at.desc()).all()
    return success_response(serialize_list(drivers))


@driver_bp.route("/<int:driver_id>", methods=["GET"])
@jwt_required()
def get_driver(driver_id):
    driver = Driver.query.get(driver_id)
    if not driver:
        return error_response("Driver not found", 404)
    return success_response(driver.to_dict())


@driver_bp.route("/<int:driver_id>", methods=["PUT"])
@jwt_required()
def update_driver(driver_id):
    driver = Driver.query.get(driver_id)
    if not driver:
        return error_response("Driver not found", 404)

    data = request.get_json(silent=True) or {}

    if "name" in data:
        driver.name = data["name"].strip()

    if "license_number" in data:
        license_number = data["license_number"].strip()
        if not license_number:
            return error_response("license_number cannot be empty", 400)
        existing = Driver.query.filter_by(license_number=license_number).first()
        if existing and existing.id != driver.id:
            return error_response("A driver with this license number already exists", 409)
        driver.license_number = license_number

    if "license_category" in data:
        driver.license_category = data["license_category"].strip()

    if "license_expiry_date" in data:
        license_expiry_date, error = parse_datetime(data["license_expiry_date"], "license_expiry_date")
        if error:
            return error_response(error, 400)
        driver.license_expiry_date = license_expiry_date

    if "contact_number" in data:
        driver.contact_number = data["contact_number"]

    if "safety_score" in data:
        safety_score_error = validate_range(data["safety_score"], "safety_score", 0, 100)
        if safety_score_error:
            return error_response(safety_score_error, 400)
        driver.safety_score = data["safety_score"]

    if "status" in data:
        if data["status"] not in DRIVER_STATUSES:
            return error_response(f"Status must be one of {sorted(DRIVER_STATUSES)}", 400)
        driver.status = data["status"]

    db.session.commit()
    return success_response(driver.to_dict(), "Driver updated successfully")


@driver_bp.route("/<int:driver_id>", methods=["DELETE"])
@jwt_required()
def delete_driver(driver_id):
    driver = Driver.query.get(driver_id)
    if not driver:
        return error_response("Driver not found", 404)

    db.session.delete(driver)
    db.session.commit()
    return success_response(message="Driver deleted successfully")
