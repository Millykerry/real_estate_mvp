from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    units = db.Column(db.Integer, nullable=False)
    rent_per_unit = db.Column(db.Float, nullable=False)

    tenants = db.relationship("Tenant", backref="property", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "units": self.units,
            "rent_per_unit": self.rent_per_unit,
        }


class Tenant(db.Model):
    __tablename__ = "tenants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)
    unit_number = db.Column(db.String(50), nullable=False)
    monthly_rent = db.Column(db.Float, nullable=False)

    payments = db.relationship("Payment", backref="tenant", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "property_id": self.property_id,
            "property_name": self.property.name if self.property else None,
            "unit_number": self.unit_number,
            "monthly_rent": self.monthly_rent,
        }


class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenants.id"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    notes = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "tenant_name": self.tenant.name if self.tenant else None,
            "amount": self.amount,
            "payment_date": self.payment_date.isoformat(),
            "notes": self.notes,
        }

