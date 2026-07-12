from flask import Blueprint
from models import Driver
from datetime import datetime, timedelta
from utils.helpers import success_response
import logging

cron_bp = Blueprint("cron", __name__, url_prefix="/api/cron")
logging.basicConfig(level=logging.INFO)

@cron_bp.route("/reminders", methods=["GET"])
def run_reminders():
    # Find licenses expiring in less than 30 days
    threshold = datetime.utcnow() + timedelta(days=30)
    
    expiring_drivers = Driver.query.filter(
        Driver.license_expiry_date <= threshold,
        Driver.license_expiry_date >= datetime.utcnow()
    ).all()
    
    sent_emails = []
    
    for driver in expiring_drivers:
        # Simulate sending an email
        msg = f"[EMAIL SIMULATION] Alert: Driver {driver.name}'s license ({driver.license_number}) expires on {driver.license_expiry_date.strftime('%Y-%m-%d')}."
        logging.info(msg)
        sent_emails.append({
            "driver_name": driver.name,
            "license": driver.license_number,
            "expiry": driver.license_expiry_date.strftime('%Y-%m-%d')
        })
        
    expired_drivers = Driver.query.filter(
        Driver.license_expiry_date < datetime.utcnow()
    ).all()
    
    for driver in expired_drivers:
        msg = f"[EMAIL SIMULATION] URGENT: Driver {driver.name}'s license ({driver.license_number}) has ALREADY EXPIRED on {driver.license_expiry_date.strftime('%Y-%m-%d')}."
        logging.warning(msg)
        sent_emails.append({
            "driver_name": driver.name,
            "license": driver.license_number,
            "expiry": driver.license_expiry_date.strftime('%Y-%m-%d'),
            "status": "EXPIRED"
        })
        
    return success_response({
        "message": f"Processed {len(sent_emails)} reminders",
        "details": sent_emails
    })
