from flask import Flask

from config import Config
from extensions import cors, db, jwt
from utils.helpers import error_response

from auth import auth_bp
from vehicle import vehicle_bp
from driver import driver_bp
from trip import trip_bp
from maintenance import maintenance_bp
from fuel import fuel_bp
from expense import expense_bp
from dashboard import dashboard_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(vehicle_bp)
    app.register_blueprint(driver_bp)
    app.register_blueprint(trip_bp)
    app.register_blueprint(maintenance_bp)
    app.register_blueprint(fuel_bp)
    app.register_blueprint(expense_bp)
    app.register_blueprint(dashboard_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return {"status": "ok"}

    @app.route("/health", methods=["GET"])
    def health():
        return {"status": "ok", "message": "TransitOps Backend Running"}

    @jwt.unauthorized_loader
    def handle_unauthorized(reason):
        return error_response(f"Authorization required: {reason}", 401)

    @jwt.invalid_token_loader
    def handle_invalid_token(reason):
        return error_response(f"Invalid token: {reason}", 422)

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        return error_response("Token has expired", 401)

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
