"""
app.py — Main Flask application
Employee Management System REST API

Endpoints:
  GET    /api/health
  GET    /api/employees
  GET    /api/employees/<id>
  POST   /api/employees
  PUT    /api/employees/<id>
  DELETE /api/employees/<id>
"""

import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from datetime import date

# ─── Logging ──────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── App Setup ────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)  # Allow React (different port) to call this API

# ─── Database Configuration ───────────────────────────────────
# All values come from environment variables — never hardcoded
DB_HOST = os.environ.get("DB_HOST", "db")        # "db" = docker service name
DB_PORT = os.environ.get("DB_PORT", "3306")
DB_NAME = os.environ.get("DB_NAME", "employee_db")
DB_USER = os.environ.get("DB_USER", "emp_user")
DB_PASS = os.environ.get("DB_PASSWORD", "")

# SQLAlchemy connection string for MySQL using PyMySQL driver
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "fallback-dev-key")

db = SQLAlchemy(app)

# ─── Employee Model ───────────────────────────────────────────
class Employee(db.Model):
    """Maps to the 'employees' table created by init.sql"""
    __tablename__ = "employees"

    id           = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name    = db.Column(db.String(100), nullable=False)
    email        = db.Column(db.String(150), nullable=False, unique=True)
    phone        = db.Column(db.String(20))
    department   = db.Column(db.String(100))
    designation  = db.Column(db.String(100))
    salary       = db.Column(db.Numeric(12, 2))
    joining_date = db.Column(db.Date)
    created_at   = db.Column(db.DateTime, server_default=db.func.now())
    updated_at   = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def to_dict(self):
        """Convert a row to a JSON-serializable dictionary."""
        return {
            "id":           self.id,
            "full_name":    self.full_name,
            "email":        self.email,
            "phone":        self.phone,
            "department":   self.department,
            "designation":  self.designation,
            "salary":       float(self.salary) if self.salary is not None else None,
            "joining_date": self.joining_date.isoformat() if self.joining_date else None,
            "created_at":   self.created_at.isoformat() if self.created_at else None,
            "updated_at":   self.updated_at.isoformat() if self.updated_at else None,
        }


# ─── Helper ───────────────────────────────────────────────────
def validate_employee_data(data, required=True):
    """Return list of validation errors. Empty list = valid."""
    errors = []
    if required:
        if not data.get("full_name", "").strip():
            errors.append("full_name is required")
        if not data.get("email", "").strip():
            errors.append("email is required")
    if data.get("email") and "@" not in data["email"]:
        errors.append("email is invalid")
    if data.get("salary") is not None:
        try:
            float(data["salary"])
        except (ValueError, TypeError):
            errors.append("salary must be a number")
    return errors


# ─── Routes ───────────────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    """Health check — also tests MySQL connectivity."""
    db_status = "unhealthy"
    db_message = ""
    try:
        db.session.execute(text("SELECT 1"))
        db_status = "healthy"
        db_message = "MySQL connection successful"
    except Exception as e:
        db_message = "MySQL connection failed"
        logger.error("Health check DB error: %s", str(e))

    status_code = 200 if db_status == "healthy" else 503
    return jsonify({
        "status":    "ok" if db_status == "healthy" else "degraded",
        "flask":     "healthy",
        "database":  db_status,
        "db_message": db_message,
    }), status_code


@app.route("/api/employees", methods=["GET"])
def get_employees():
    """GET all employees with optional search."""
    search = request.args.get("search", "").strip()
    try:
        query = Employee.query
        if search:
            like = f"%{search}%"
            query = query.filter(
                db.or_(
                    Employee.full_name.ilike(like),
                    Employee.email.ilike(like),
                    Employee.department.ilike(like),
                    Employee.designation.ilike(like),
                )
            )
        employees = query.order_by(Employee.id).all()
        return jsonify({
            "success": True,
            "count":   len(employees),
            "data":    [e.to_dict() for e in employees],
        }), 200
    except Exception as e:
        logger.error("GET /api/employees error: %s", str(e))
        return jsonify({"success": False, "message": "Failed to fetch employees"}), 500


@app.route("/api/employees/<int:emp_id>", methods=["GET"])
def get_employee(emp_id):
    """GET a single employee by ID."""
    try:
        emp = db.session.get(Employee, emp_id)
        if not emp:
            return jsonify({"success": False, "message": f"Employee {emp_id} not found"}), 404
        return jsonify({"success": True, "data": emp.to_dict()}), 200
    except Exception as e:
        logger.error("GET /api/employees/%s error: %s", emp_id, str(e))
        return jsonify({"success": False, "message": "Failed to fetch employee"}), 500


@app.route("/api/employees", methods=["POST"])
def create_employee():
    """POST — Add a new employee."""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "No JSON body provided"}), 400

    errors = validate_employee_data(data, required=True)
    if errors:
        return jsonify({"success": False, "message": "Validation failed", "errors": errors}), 422

    try:
        emp = Employee(
            full_name    = data["full_name"].strip(),
            email        = data["email"].strip().lower(),
            phone        = data.get("phone", "").strip() or None,
            department   = data.get("department", "").strip() or None,
            designation  = data.get("designation", "").strip() or None,
            salary       = float(data["salary"]) if data.get("salary") is not None else None,
            joining_date = data.get("joining_date") or None,
        )
        db.session.add(emp)
        db.session.commit()
        logger.info("Created employee id=%s name=%s", emp.id, emp.full_name)
        return jsonify({"success": True, "message": "Employee created", "data": emp.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        logger.error("POST /api/employees error: %s", str(e))
        if "Duplicate entry" in str(e):
            return jsonify({"success": False, "message": "Email already exists"}), 409
        return jsonify({"success": False, "message": "Failed to create employee"}), 500


@app.route("/api/employees/<int:emp_id>", methods=["PUT"])
def update_employee(emp_id):
    """PUT — Update an existing employee."""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "No JSON body provided"}), 400

    errors = validate_employee_data(data, required=False)
    if errors:
        return jsonify({"success": False, "message": "Validation failed", "errors": errors}), 422

    try:
        emp = db.session.get(Employee, emp_id)
        if not emp:
            return jsonify({"success": False, "message": f"Employee {emp_id} not found"}), 404

        if "full_name"    in data: emp.full_name    = data["full_name"].strip()
        if "email"        in data: emp.email        = data["email"].strip().lower()
        if "phone"        in data: emp.phone        = data["phone"]
        if "department"   in data: emp.department   = data["department"]
        if "designation"  in data: emp.designation  = data["designation"]
        if "salary"       in data: emp.salary       = float(data["salary"]) if data["salary"] is not None else None
        if "joining_date" in data: emp.joining_date = data["joining_date"] or None

        db.session.commit()
        logger.info("Updated employee id=%s", emp_id)
        return jsonify({"success": True, "message": "Employee updated", "data": emp.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        logger.error("PUT /api/employees/%s error: %s", emp_id, str(e))
        if "Duplicate entry" in str(e):
            return jsonify({"success": False, "message": "Email already exists"}), 409
        return jsonify({"success": False, "message": "Failed to update employee"}), 500


@app.route("/api/employees/<int:emp_id>", methods=["DELETE"])
def delete_employee(emp_id):
    """DELETE — Remove an employee."""
    try:
        emp = db.session.get(Employee, emp_id)
        if not emp:
            return jsonify({"success": False, "message": f"Employee {emp_id} not found"}), 404
        db.session.delete(emp)
        db.session.commit()
        logger.info("Deleted employee id=%s", emp_id)
        return jsonify({"success": True, "message": f"Employee {emp_id} deleted"}), 200
    except Exception as e:
        db.session.rollback()
        logger.error("DELETE /api/employees/%s error: %s", emp_id, str(e))
        return jsonify({"success": False, "message": "Failed to delete employee"}), 500


# ─── Entry Point ──────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("FLASK_PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=(os.environ.get("FLASK_ENV") == "development"))
