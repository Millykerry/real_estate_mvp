import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

const AddPropertyPage = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    units: "",
    rent_per_unit: "",
  });
  const [properties, setProperties] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProperties = async () => {
    try {
      const res = await fetch(`${API_BASE}/properties`);
      const data = await res.json();
      setProperties(data);
    } catch {
      // ignore in MVP
    }
  };

  useEffect(() => {
    loadProperties();
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
      const res = await fetch(`${API_BASE}/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          units: Number(form.units),
          rent_per_unit: Number(form.rent_per_unit),
        }),
      });
      if (!res.ok) throw new Error("Failed to add property");
      await res.json();
      setMessage("Property added successfully.");
      setForm({ name: "", address: "", units: "", rent_per_unit: "" });
      loadProperties();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Add Property</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Property Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Number of Units
          <input
            type="number"
            name="units"
            value={form.units}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Rent per Unit
          <input
            type="number"
            step="0.01"
            name="rent_per_unit"
            value={form.rent_per_unit}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Save Property</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <h3>Existing Properties</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Units</th>
            <th>Rent / Unit</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.address}</td>
              <td>{p.units}</td>
              <td>${p.rent_per_unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AddPropertyPage;