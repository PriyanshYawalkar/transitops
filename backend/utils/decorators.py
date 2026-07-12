from functools import wraps
from flask import request
import firebase_admin
from firebase_admin import auth
from utils.helpers import error_response

# Initialize Firebase Admin if not already initialized
if not firebase_admin._apps:
    firebase_admin.initialize_app()

def firebase_auth_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return error_response("Missing or invalid Authorization header", 401)
            
            token = auth_header.split("Bearer ")[1]
            try:
                decoded_token = auth.verify_id_token(token)
                request.user = decoded_token  # Attach user data to request
            except auth.InvalidIdTokenError:
                return error_response("Invalid token", 422)
            except auth.ExpiredIdTokenError:
                return error_response("Token has expired", 401)
            except Exception as e:
                return error_response(f"Authentication error: {str(e)}", 401)
                
            return fn(*args, **kwargs)
        return decorator
    return wrapper
