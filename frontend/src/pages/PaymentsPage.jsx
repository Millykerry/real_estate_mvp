import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

const PaymentsPage = () => {
  const [form, setForm] = useState({
    tenant_id: "",
    amount: "",
    notes: "",
  });
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTenants = async () => {
    try {
      const res = await fetch(`${API_BASE}/tenants`);
      const data = await res.json();
      setTenants(data);
    } catch {
      // ignore
    }
  };

  const loadPayments = async () => {
    try {
      const res = await fetch(`${API_BASE}/payments`);
      const data = await res.json();
      setPayments(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadTenants();
    loadPayments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tenant_id: Number(form.tenant_id),
          amount: Number(form.amount),
        }),
      });
      if (!res.ok) throw new Error("Failed to record payment");
      await res.json();
      setMessage("Payment recorded successfully.");
      setForm({ tenant_id: "", amount: "", notes: "" });
      loadPayments();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Payments</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Tenant
          <select
            name="tenant_id"
            value={form.tenant_id}
            onChange={handleChange}
            required
          >
            <option value="">Select tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} - {t.property_name} ({t.unit_number})
              </option>
            ))}
          </select>
        </label>
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Notes
          <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional"
          />
        </label>
        <button type="submit">Record Payment</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <h3>Payment History</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Tenant</th>
            <th>Amount</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{new Date(p.payment_date).toLocaleDateString()}</td>
              <td>{p.tenant_name}</td>
              <td>${p.amount}</td>
              <td>{p.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PaymentsPage;