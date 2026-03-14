import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

const AddTenantPage = () => {
  const [form, setForm] = useState({
    name: "",
    property_id: "",
    unit_number: "",
    monthly_rent: "",
  });
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProperties = async () => {
    try {
      const res = await fetch(`${API_BASE}/properties`);
      const data = await res.json();
      setProperties(data);
    } catch {
      // ignore
    }
  };

  const loadTenants = async () => {
    try {
      const res = await fetch(`${API_BASE}/tenants`);
      const data = await res.json();
      setTenants(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadProperties();
    loadTenants();
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
      const res = await fetch(`${API_BASE}/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          property_id: Number(form.property_id),
          monthly_rent: Number(form.monthly_rent),
        }),
      });
      if (!res.ok) throw new Error("Failed to add tenant");
      await res.json();
      setMessage("Tenant added successfully.");
      setForm({
        name: "",
        property_id: "",
        unit_number: "",
        monthly_rent: "",
      });
      loadTenants();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Add Tenant</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Tenant Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Property
          <select
            name="property_id"
            value={form.property_id}
            onChange={handleChange}
            required
          >
            <option value="">Select property</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Unit Number
          <input
            name="unit_number"
            value={form.unit_number}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Monthly Rent
          <input
            type="number"
            step="0.01"
            name="monthly_rent"
            value={form.monthly_rent}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Save Tenant</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <h3>Existing Tenants</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Property</th>
            <th>Unit</th>
            <th>Rent</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.property_name}</td>
              <td>{t.unit_number}</td>
              <td>${t.monthly_rent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AddTenantPage;