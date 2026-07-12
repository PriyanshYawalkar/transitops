from datetime import datetime, timezone

from flask import Blueprint
from utils.decorators import firebase_auth_required as jwt_required
from sqlalchemy import func

from extensions import db
from models import Driver, Expense, FuelLog, Maintenance, Trip, Vehicle
from utils.helpers import success_response

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")


@dashboard_bp.route("/summary", methods=["GET"])
@jwt_required()
def summary():
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    total_vehicles = Vehicle.query.count()
    active_vehicles = Vehicle.query.filter_by(status="Available").count()
    vehicles_in_maintenance = Vehicle.query.filter_by(status="In Shop").count()
    vehicles_on_trip = Vehicle.query.filter_by(status="On Trip").count()

    total_drivers = Driver.query.count()
    active_drivers = Driver.query.filter_by(status="active").count()

    ongoing_trips = Trip.query.filter_by(status="ongoing").count()
    trips_today = Trip.query.filter(Trip.created_at >= today_start).count()

    monthly_expenses = (
        db.session.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(Expense.date >= month_start)
        .scalar()
    )

    monthly_fuel_cost = (
        db.session.query(func.coalesce(func.sum(FuelLog.total_cost), 0))
        .filter(FuelLog.date >= month_start)
        .scalar()
    )

    pending_maintenance = Maintenance.query.filter_by(status="pending").count()

    return success_response(
        {
            "vehicles": {
                "total": total_vehicles,
                "active": active_vehicles,
                "in_maintenance": vehicles_in_maintenance,
                "on_trip": vehicles_on_trip,
            },
            "drivers": {
                "total": total_drivers,
                "active": active_drivers,
            },
            "trips": {
                "ongoing": ongoing_trips,
                "today": trips_today,
            },
            "maintenance": {
                "pending": pending_maintenance,
            },
            "finance_this_month": {
                "total_expenses": round(monthly_expenses, 2),
                "total_fuel_cost": round(monthly_fuel_cost, 2),
            },
        }
    )


@dashboard_bp.route("/vehicle-status", methods=["GET"])
@jwt_required()
def vehicle_status_breakdown():
    rows = (
        db.session.query(Vehicle.status, func.count(Vehicle.id))
        .group_by(Vehicle.status)
        .all()
    )
    return success_response({status: count for status, count in rows})


@dashboard_bp.route("/recent-trips", methods=["GET"])
@jwt_required()
def recent_trips():
    trips = Trip.query.order_by(Trip.created_at.desc()).limit(10).all()
    return success_response([trip.to_dict() for trip in trips])


@dashboard_bp.route("/expense-breakdown", methods=["GET"])
@jwt_required()
def expense_breakdown():
    rows = (
        db.session.query(Expense.category, func.coalesce(func.sum(Expense.amount), 0))
        .group_by(Expense.category)
        .all()
    )
    return success_response({category: round(total, 2) for category, total in rows})
