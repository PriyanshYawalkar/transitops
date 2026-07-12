import re
from datetime import datetime

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def validate_required_fields(data, required_fields):
    if not isinstance(data, dict):
        return ["Request body must be a JSON object"]

    missing = [field for field in required_fields if not data.get(field) and data.get(field) != 0]
    if missing:
        return [f"Missing required field: {field}" for field in missing]
    return []


def is_valid_email(email):
    return bool(email) and bool(EMAIL_REGEX.match(email))


def validate_non_negative(value, field_name):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return f"{field_name} must be a valid non-negative number"
    if number < 0:
        return f"{field_name} must be greater than or equal to 0"
    return None


def validate_range(value, field_name, min_value, max_value):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return f"{field_name} must be a valid number"
    if number < min_value or number > max_value:
        return f"{field_name} must be between {min_value} and {max_value}"
    return None


def parse_datetime(value, field_name="date"):
    if value is None:
        return None, None
    try:
        return datetime.fromisoformat(value), None
    except (TypeError, ValueError):
        return None, f"Invalid {field_name} format, expected ISO 8601 (e.g. 2026-07-12T09:00:00)"
