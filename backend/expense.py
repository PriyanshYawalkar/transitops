from flask import Blueprint, request
from flask_jwt_extended import jwt_required

from extensions import db
from models import Expense, Vehicle
from utils.helpers import error_response, serialize_list, success_response
from utils.validators import parse_datetime, validate_required_fields

expense_bp = Blueprint("expense", __name__, url_prefix="/api/expenses")

ALLOWED_CATEGORIES = {"fuel", "maintenance", "toll", "parking", "insurance", "salary", "other"}


@expense_bp.route("", methods=["POST"])
@jwt_required()
def create_expense():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(data, ["category", "amount", "date"])
    if errors:
        return error_response(errors[0], 400)

    category = data["category"].strip().lower()
    if category not in ALLOWED_CATEGORIES:
        return error_response(f"Category must be one of {sorted(ALLOWED_CATEGORIES)}", 400)

    vehicle_id = data.get("vehicle_id")
    if vehicle_id is not None and not Vehicle.query.get(vehicle_id):
        return error_response("Vehicle not found", 404)

    date, error = parse_datetime(data["date"], "date")
    if error:
        return error_response(error, 400)

    expense = Expense(
        vehicle_id=vehicle_id,
        category=category,
        amount=data["amount"],
        description=data.get("description"),
        date=date,
    )

    db.session.add(expense)
    db.session.commit()

    return success_response(expense.to_dict(), "Expense created successfully", 201)


@expense_bp.route("", methods=["GET"])
@jwt_required()
def list_expenses():
    query = Expense.query

    category = request.args.get("category")
    if category:
        query = query.filter_by(category=category)

    vehicle_id = request.args.get("vehicle_id", type=int)
    if vehicle_id:
        query = query.filter_by(vehicle_id=vehicle_id)

    expenses = query.order_by(Expense.date.desc()).all()
    return success_response(serialize_list(expenses))


@expense_bp.route("/<int:expense_id>", methods=["GET"])
@jwt_required()
def get_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return error_response("Expense not found", 404)
    return success_response(expense.to_dict())


@expense_bp.route("/<int:expense_id>", methods=["PUT"])
@jwt_required()
def update_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return error_response("Expense not found", 404)

    data = request.get_json(silent=True) or {}

    if "category" in data:
        category = data["category"].strip().lower()
        if category not in ALLOWED_CATEGORIES:
            return error_response(f"Category must be one of {sorted(ALLOWED_CATEGORIES)}", 400)
        expense.category = category

    if "amount" in data:
        expense.amount = data["amount"]

    if "description" in data:
        expense.description = data["description"]

    if "vehicle_id" in data:
        vehicle_id = data["vehicle_id"]
        if vehicle_id is not None and not Vehicle.query.get(vehicle_id):
            return error_response("Vehicle not found", 404)
        expense.vehicle_id = vehicle_id

    if "date" in data:
        date, error = parse_datetime(data["date"], "date")
        if error:
            return error_response(error, 400)
        expense.date = date

    db.session.commit()
    return success_response(expense.to_dict(), "Expense updated successfully")


@expense_bp.route("/<int:expense_id>", methods=["DELETE"])
@jwt_required()
def delete_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if not expense:
        return error_response("Expense not found", 404)

    db.session.delete(expense)
    db.session.commit()
    return success_response(message="Expense deleted successfully")
