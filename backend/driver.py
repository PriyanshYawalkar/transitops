from flask import Blueprint, request
from utils.decorators import firebase_auth_required as jwt_required

from extensions import db
from models import Driver
from utils.helpers import error_response, serialize_list, success_response
from utils.validators import validate_required_fields

driver_bp = Blueprint("driver", __name__, url_prefix="/api/drivers")

ALLOWED_STATUSES = {"active", "inactive"}


@driver_bp.route("", methods=["POST"])
@jwt_required()
def create_driver():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(data, ["name", "license_number"])
    if errors:
        return error_response(errors[0], 400)

    license_number = data["license_number"].strip()

    if Driver.query.filter_by(license_number=license_number).first():
        return error_response("A driver with this license number already exists", 409)

    status = data.get("status", "active")
    if status not in ALLOWED_STATUSES:
        return error_response(f"Status must be one of {sorted(ALLOWED_STATUSES)}", 400)

    driver = Driver(
        name=data["name"].strip(),
        license_number=license_number,
        phone=data.get("phone"),
        email=data.get("email"),
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
        existing = Driver.query.filter_by(license_number=license_number).first()
        if existing and existing.id != driver.id:
            return error_response("A driver with this license number already exists", 409)
        driver.license_number = license_number

    if "phone" in data:
        driver.phone = data["phone"]

    if "email" in data:
        driver.email = data["email"]

    if "status" in data:
        if data["status"] not in ALLOWED_STATUSES:
            return error_response(f"Status must be one of {sorted(ALLOWED_STATUSES)}", 400)
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
