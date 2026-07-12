from flask import jsonify


def success_response(data=None, message=None, status_code=200):
    payload = {}
    if message is not None:
        payload["message"] = message
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status_code


def error_response(message, status_code=400):
    return jsonify({"error": message}), status_code


def serialize_list(items):
    return [item.to_dict() for item in items]
