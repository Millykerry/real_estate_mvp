from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, Property, Tenant, Payment
import os


def create_app():
    app = Flask(__name__)

    base_dir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(base_dir, "database.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    CORS(app)

    with app.app_context():
        db.create_all()

    @app.route("/api/dashboard", methods=["GET"])
    def dashboard_summary():
        total_properties = Property.query.count()
        total_tenants = Tenant.query.count()
        total_payments = db.session.query(db.func.coalesce(db.func.sum(Payment.amount), 0)).scalar()

        return jsonify(
            {
                "total_properties": total_properties,
                "total_tenants": total_tenants,
                "total_payments": float(total_payments or 0),
            }
        )

    # Properties
    @app.route("/api/properties", methods=["GET"])
    def get_properties():
        properties = Property.query.all()
        return jsonify([p.to_dict() for p in properties])

    @app.route("/api/properties", methods=["POST"])
    def add_property():
        data = request.get_json() or {}
        try:
            prop = Property(
                name=data["name"],
                address=data["address"],
                units=int(data["units"]),
                rent_per_unit=float(data["rent_per_unit"]),
            )
            db.session.add(prop)
            db.session.commit()
            return jsonify(prop.to_dict()), 201
        except (KeyError, ValueError):
            db.session.rollback()
            return jsonify({"error": "Invalid property data"}), 400

    # Tenants
    @app.route("/api/tenants", methods=["GET"])
    def get_tenants():
        tenants = Tenant.query.all()
        return jsonify([t.to_dict() for t in tenants])

    @app.route("/api/tenants", methods=["POST"])
    def add_tenant():
        data = request.get_json() or {}
        try:
            tenant = Tenant(
                name=data["name"],
                property_id=int(data["property_id"]),
                unit_number=str(data["unit_number"]),
                monthly_rent=float(data["monthly_rent"]),
            )
            db.session.add(tenant)
            db.session.commit()
            return jsonify(tenant.to_dict()), 201
        except (KeyError, ValueError):
            db.session.rollback()
            return jsonify({"error": "Invalid tenant data"}), 400

    # Payments
    @app.route("/api/payments", methods=["GET"])
    def get_payments():
        payments = Payment.query.order_by(Payment.payment_date.desc()).all()
        return jsonify([p.to_dict() for p in payments])

    @app.route("/api/payments", methods=["POST"])
    def add_payment():
        data = request.get_json() or {}
        try:
            payment = Payment(
                tenant_id=int(data["tenant_id"]),
                amount=float(data["amount"]),
                notes=data.get("notes"),
            )
            db.session.add(payment)
            db.session.commit()
            return jsonify(payment.to_dict()), 201
        except (KeyError, ValueError):
            db.session.rollback()
            return jsonify({"error": "Invalid payment data"}), 400

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

