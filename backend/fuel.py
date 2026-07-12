from flask import Blueprint, request
from utils.decorators import firebase_auth_required as jwt_required

from extensions import db
from models import FuelLog, Vehicle
from utils.helpers import error_response, serialize_list, success_response
from utils.validators import parse_datetime, validate_required_fields

fuel_bp = Blueprint("fuel", __name__, url_prefix="/api/fuel")


@fuel_bp.route("", methods=["POST"])
@jwt_required()
def create_fuel_log():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(data, ["vehicle_id", "liters", "cost_per_liter", "date"])
    if errors:
        return error_response(errors[0], 400)

    vehicle = Vehicle.query.get(data["vehicle_id"])
    if not vehicle:
        return error_response("Vehicle not found", 404)

    date, error = parse_datetime(data["date"], "date")
    if error:
        return error_response(error, 400)

    liters = data["liters"]
    cost_per_liter = data["cost_per_liter"]

    log = FuelLog(
        vehicle_id=vehicle.id,
        driver_id=data.get("driver_id"),
        liters=liters,
        cost_per_liter=cost_per_liter,
        total_cost=round(liters * cost_per_liter, 2),
        odometer_reading=data.get("odometer_reading"),
        date=date,
    )

    db.session.add(log)
    db.session.commit()

    return success_response(log.to_dict(), "Fuel log created successfully", 201)


@fuel_bp.route("", methods=["GET"])
@jwt_required()
def list_fuel_logs():
    query = FuelLog.query

    vehicle_id = request.args.get("vehicle_id", type=int)
    if vehicle_id:
        query = query.filter_by(vehicle_id=vehicle_id)

    driver_id = request.args.get("driver_id", type=int)
    if driver_id:
        query = query.filter_by(driver_id=driver_id)

    logs = query.order_by(FuelLog.date.desc()).all()
    return success_response(serialize_list(logs))


@fuel_bp.route("/<int:log_id>", methods=["GET"])
@jwt_required()
def get_fuel_log(log_id):
    log = FuelLog.query.get(log_id)
    if not log:
        return error_response("Fuel log not found", 404)
    return success_response(log.to_dict())


@fuel_bp.route("/<int:log_id>", methods=["PUT"])
@jwt_required()
def update_fuel_log(log_id):
    log = FuelLog.query.get(log_id)
    if not log:
        return error_response("Fuel log not found", 404)

    data = request.get_json(silent=True) or {}

    if "liters" in data:
        log.liters = data["liters"]

    if "cost_per_liter" in data:
        log.cost_per_liter = data["cost_per_liter"]

    if "liters" in data or "cost_per_liter" in data:
        log.total_cost = round(log.liters * log.cost_per_liter, 2)

    if "odometer_reading" in data:
        log.odometer_reading = data["odometer_reading"]

    if "date" in data:
        date, error = parse_datetime(data["date"], "date")
        if error:
            return error_response(error, 400)
        log.date = date

    if "driver_id" in data:
        log.driver_id = data["driver_id"]

    db.session.commit()
    return success_response(log.to_dict(), "Fuel log updated successfully")


@fuel_bp.route("/<int:log_id>", methods=["DELETE"])
@jwt_required()
def delete_fuel_log(log_id):
    log = FuelLog.query.get(log_id)
    if not log:
        return error_response("Fuel log not found", 404)

    db.session.delete(log)
    db.session.commit()
    return success_response(message="Fuel log deleted successfully")


@fuel_bp.route("/vehicle/<int:vehicle_id>/stats", methods=["GET"])
@jwt_required()
def fuel_stats(vehicle_id):
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return error_response("Vehicle not found", 404)

    logs = (
        FuelLog.query.filter_by(vehicle_id=vehicle_id)
        .filter(FuelLog.odometer_reading.isnot(None))
        .order_by(FuelLog.date.asc())
        .all()
    )

    total_liters = sum(log.liters for log in logs)
    total_cost = sum(log.total_cost for log in logs)

    km_per_liter = None
    if len(logs) >= 2:
        distance_covered = logs[-1].odometer_reading - logs[0].odometer_reading
        liters_excluding_first_fill = sum(log.liters for log in logs[1:])
        if distance_covered > 0 and liters_excluding_first_fill > 0:
            km_per_liter = round(distance_covered / liters_excluding_first_fill, 2)

    return success_response(
        {
            "vehicle_id": vehicle_id,
            "total_fuel_logs": len(logs),
            "total_liters": round(total_liters, 2),
            "total_cost": round(total_cost, 2),
            "average_km_per_liter": km_per_liter,
        }
    )
