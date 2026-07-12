from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db


def utc_now():
    return datetime.now(timezone.utc)


FLEET_MANAGER = "fleet_manager"
DISPATCHER = "dispatcher"
SAFETY_OFFICER = "safety_officer"
FINANCIAL_ANALYST = "financial_analyst"

ROLES = {FLEET_MANAGER, DISPATCHER, SAFETY_OFFICER, FINANCIAL_ANALYST}


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(30), nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


VEHICLE_STATUSES = {"Available", "On Trip", "In Shop", "Retired"}


class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = db.Column(db.Integer, primary_key=True)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    vehicle_name = db.Column(db.String(100), nullable=False)
    vehicle_model = db.Column(db.String(100))
    vehicle_type = db.Column(db.String(50), nullable=False)
    maximum_load_capacity = db.Column(db.Float, nullable=False)
    odometer = db.Column(db.Float, nullable=False, default=0)
    acquisition_cost = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Available")
    created_at = db.Column(db.DateTime, default=utc_now)

    trips = db.relationship("Trip", backref="vehicle", lazy=True)
    maintenance_records = db.relationship("Maintenance", backref="vehicle", lazy=True)
    fuel_logs = db.relationship("FuelLog", backref="vehicle", lazy=True)
    expenses = db.relationship("Expense", backref="vehicle", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "registration_number": self.registration_number,
            "vehicle_name": self.vehicle_name,
            "vehicle_model": self.vehicle_model,
            "vehicle_type": self.vehicle_type,
            "maximum_load_capacity": self.maximum_load_capacity,
            "odometer": self.odometer,
            "acquisition_cost": self.acquisition_cost,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


DRIVER_STATUSES = {"Available", "On Trip", "Off Duty", "Suspended"}


class Driver(db.Model):
    __tablename__ = "drivers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    license_number = db.Column(db.String(50), unique=True, nullable=False)
    license_category = db.Column(db.String(20), nullable=False)
    license_expiry_date = db.Column(db.DateTime, nullable=False)
    contact_number = db.Column(db.String(20))
    safety_score = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="Available")
    created_at = db.Column(db.DateTime, default=utc_now)

    trips = db.relationship("Trip", backref="driver", lazy=True)
    fuel_logs = db.relationship("FuelLog", backref="driver", lazy=True)

    def is_license_expired(self, reference_time=None):
        reference_time = reference_time or utc_now()
        return self.license_expiry_date is not None and self.license_expiry_date < reference_time

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "license_number": self.license_number,
            "license_category": self.license_category,
            "license_expiry_date": self.license_expiry_date.isoformat() if self.license_expiry_date else None,
            "contact_number": self.contact_number,
            "safety_score": self.safety_score,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey("vehicles.id"), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey("drivers.id"), nullable=False)
    origin = db.Column(db.String(150), nullable=False)
    destination = db.Column(db.String(150), nullable=False)
    scheduled_start = db.Column(db.DateTime)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    distance_km = db.Column(db.Float)
    status = db.Column(db.String(20), nullable=False, default="scheduled")
    notes = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_id": self.vehicle_id,
            "driver_id": self.driver_id,
            "origin": self.origin,
            "destination": self.destination,
            "scheduled_start": self.scheduled_start.isoformat() if self.scheduled_start else None,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "distance_km": self.distance_km,
            "status": self.status,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Maintenance(db.Model):
    __tablename__ = "maintenance_records"

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey("vehicles.id"), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    cost = db.Column(db.Float, default=0)
    service_date = db.Column(db.DateTime, nullable=False)
    next_service_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), nullable=False, default="pending")
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_id": self.vehicle_id,
            "description": self.description,
            "cost": self.cost,
            "service_date": self.service_date.isoformat() if self.service_date else None,
            "next_service_date": self.next_service_date.isoformat() if self.next_service_date else None,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class FuelLog(db.Model):
    __tablename__ = "fuel_logs"

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey("vehicles.id"), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey("drivers.id"))
    liters = db.Column(db.Float, nullable=False)
    cost_per_liter = db.Column(db.Float, nullable=False)
    total_cost = db.Column(db.Float, nullable=False)
    odometer_reading = db.Column(db.Float)
    date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_id": self.vehicle_id,
            "driver_id": self.driver_id,
            "liters": self.liters,
            "cost_per_liter": self.cost_per_liter,
            "total_cost": self.total_cost,
            "odometer_reading": self.odometer_reading,
            "date": self.date.isoformat() if self.date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey("vehicles.id"))
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
    date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_id": self.vehicle_id,
            "category": self.category,
            "amount": self.amount,
            "description": self.description,
            "date": self.date.isoformat() if self.date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
