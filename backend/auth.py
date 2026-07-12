from flask import Blueprint, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from extensions import db
from models import User
from utils.helpers import error_response, success_response
from utils.validators import is_valid_email, validate_required_fields

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

ALLOWED_ROLES = {"admin", "manager", "driver"}


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(data, ["name", "email", "password"])
    if errors:
        return error_response(errors[0], 400)

    name = data["name"].strip()
    email = data["email"].strip().lower()
    password = data["password"]
    role = data.get("role", "admin")

    if not is_valid_email(email):
        return error_response("Invalid email format", 400)

    if len(password) < 6:
        return error_response("Password must be at least 6 characters long", 400)

    if role not in ALLOWED_ROLES:
        return error_response(f"Role must be one of {sorted(ALLOWED_ROLES)}", 400)

    if User.query.filter_by(email=email).first():
        return error_response("An account with this email already exists", 409)

    user = User(name=name, email=email, role=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return success_response(user.to_dict(), "User registered successfully", 201)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    errors = validate_required_fields(data, ["email", "password"])
    if errors:
        return error_response(errors[0], 400)

    email = data["email"].strip().lower()
    password = data["password"]

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return error_response("Invalid email or password", 401)

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "email": user.email},
    )

    return success_response(
        {"access_token": access_token, "user": user.to_dict()},
        "Login successful",
    )


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return error_response("User not found", 404)
    return success_response(user.to_dict())
