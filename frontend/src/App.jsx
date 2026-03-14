import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import AddPropertyPage from "./pages/AddPropertyPage.jsx";
import AddTenantPage from "./pages/AddTenantPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Real Estate Management</h1>
        <nav className="nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/properties">Add Property</NavLink>
          <NavLink to="/tenants">Add Tenant</NavLink>
          <NavLink to="/payments">Payments</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/properties" element={<AddPropertyPage />} />
          <Route path="/tenants" element={<AddTenantPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <small>MVP Real Estate Management System</small>
      </footer>
    </div>
  );
};

export default App;

