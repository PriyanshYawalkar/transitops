from functools import wraps

from flask_jwt_extended import get_jwt, verify_jwt_in_request

from models import DISPATCHER, FINANCIAL_ANALYST, FLEET_MANAGER, SAFETY_OFFICER
from utils.helpers import error_response


def role_required(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") not in allowed_roles:
                return error_response("Insufficient permissions for this action", 403)
            return fn(*args, **kwargs)

        return wrapper

    return decorator


fleet_manager_required = role_required(FLEET_MANAGER)
dispatcher_required = role_required(DISPATCHER)
safety_officer_required = role_required(SAFETY_OFFICER)
financial_analyst_required = role_required(FINANCIAL_ANALYST)
