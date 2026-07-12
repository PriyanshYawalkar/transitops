# TransitOps Backend

Flask REST API for the TransitOps Smart Transport Operations Platform MVP.

## Stack

- Python 3.13 + Flask
- Flask-SQLAlchemy (SQLite)
- Flask-JWT-Extended (auth)
- Flask-CORS
- python-dotenv

## Setup

The virtual environment already exists at `backend/.venv` with all dependencies installed.

To run the server:

```bash
# Windows
backend\.venv\Scripts\python.exe backend\app.py
```

The API will be available at `http://localhost:5000`.

A SQLite database file (`database.db`) and its tables are created automatically on first run.

## Environment Variables (`.env`)

- `SECRET_KEY` - Flask secret key
- `JWT_SECRET_KEY` - JWT signing secret
- `DATABASE_URL` - SQLAlchemy database URI (defaults to `sqlite:///database.db`)
- `JWT_ACCESS_TOKEN_EXPIRES_HOURS` - access token lifetime in hours (default 24)

## Authentication

All endpoints except `/api/auth/register`, `/api/auth/login`, and `/api/health` require a JWT sent as:

```
Authorization: Bearer <access_token>
```

## API Overview

### Auth (`/api/auth`)
- `POST /register` - create a user (`name`, `email`, `password`, optional `role`: admin/manager/driver)
- `POST /login` - returns `access_token`
- `GET /me` - current authenticated user

### Vehicles (`/api/vehicles`)
- `POST /`, `GET /`, `GET /<id>`, `PUT /<id>`, `DELETE /<id>`
- `GET /?status=active&type=bus` - filter

### Drivers (`/api/drivers`)
- `POST /`, `GET /`, `GET /<id>`, `PUT /<id>`, `DELETE /<id>`
- `GET /?status=active` - filter

### Trips (`/api/trips`)
- `POST /`, `GET /`, `GET /<id>`, `PUT /<id>`, `DELETE /<id>`
- `GET /?status=&vehicle_id=&driver_id=` - filter
- `POST /<id>/start` - moves trip to `ongoing` (blocks if vehicle/driver already on an active trip)
- `POST /<id>/complete` - moves trip to `completed`, accepts optional `distance_km`
- `POST /<id>/cancel` - moves trip to `cancelled`

### Maintenance (`/api/maintenance`)
- `POST /`, `GET /`, `GET /<id>`, `PUT /<id>`, `DELETE /<id>`
- Creating a record automatically sets the vehicle status to `maintenance`
- `POST /<id>/complete` - marks record completed and restores vehicle status to `active`

### Fuel Logs (`/api/fuel`)
- `POST /`, `GET /`, `GET /<id>`, `PUT /<id>`, `DELETE /<id>`
- `GET /vehicle/<vehicle_id>/stats` - total liters/cost and average km/liter efficiency

### Expenses (`/api/expenses`)
- `POST /`, `GET /`, `GET /<id>`, `PUT /<id>`, `DELETE /<id>`
- `GET /?category=&vehicle_id=` - filter

### Dashboard (`/api/dashboard`)
- `GET /summary` - fleet, driver, trip, maintenance, and monthly finance counters
- `GET /vehicle-status` - vehicle counts grouped by status
- `GET /recent-trips` - last 10 trips
- `GET /expense-breakdown` - total expenses grouped by category
