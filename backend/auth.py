from flask import Blueprint, request
from utils.decorators import firebase_auth_required as jwt_required
from extensions import db
from models import User
from utils.helpers import success_response

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    # Firebase decoded token is attached to request.user
    user_info = request.user
    
    # Try to sync/find user in SQLite based on firebase email
    email = user_info.get("email")
    user = User.query.filter_by(email=email).first()
    
    if not user and email:
        # Auto-create user if they don't exist in local DB but are valid in Firebase
        user = User(
            name=user_info.get("name", email.split('@')[0]),
            email=email,
            role="admin",  # Default role for new signups
            password_hash="firebase_managed"
        )
        db.session.add(user)
        db.session.commit()

    return success_response({
        "firebase_uid": user_info.get("uid"),
        "email": email,
        "name": user.name if user else user_info.get("name"),
        "role": user.role if user else "admin"
    })
