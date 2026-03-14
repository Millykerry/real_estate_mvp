## Real Estate Management MVP

Minimal full‑stack Real Estate Management System built with **Flask + SQLite** (backend) and **React** (frontend).

### Structure

- **backend**: Flask API + SQLite database
- **frontend**: React SPA with basic routing and forms

### Backend (Flask)

1. Open a terminal and go to the backend folder:
   - `cd real_estate_mvp/backend`
2. Create and activate a virtual environment (recommended):
   - Windows (PowerShell):
     - `python -m venv venv`
     - `.\venv\Scripts\activate`
3. Install dependencies:
   - `pip install -r requirements.txt`
4. Run the API server (this will create/initialize `database.db` if needed):
   - `python app.py`
5. The backend will be available at:
   - `http://localhost:5000`

### Frontend (React)

This is a minimal React setup (not a full generated create‑react‑app project, but structured similarly).

1. Open another terminal and go to the frontend folder:
   - `cd real_estate_mvp/frontend`
2. Initialize npm (if you want a lock file and node_modules):
   - `npm install`
     - This will install dependencies defined in `package.json` (React, React DOM, React Router).
3. You will need a simple bundler/dev server (for example, Vite or a basic webpack config).  
   For a quick start closest to **create‑react‑app** behavior:
   - Run:
     - `npm create vite@latest . -- --template react`
   - Then adapt or move the provided `src` and `public` files into the Vite structure, keeping the pages and components created here.

> If you prefer **true create‑react‑app**, run it first in an empty `frontend` folder, then replace its `src` and `public` contents with the pages/components from this MVP.

### Main Features

- **Dashboard**
  - Route: `/`
  - Shows total properties, tenants, and sum of all payments.
- **Add Property**
  - Route: `/properties`
  - Add new property (name, address, units, rent per unit) and list existing properties.
- **Add Tenant**
  - Route: `/tenants`
  - Add tenant linked to a property (tenant name, property, unit number, monthly rent) and list tenants.
- **Payments**
  - Route: `/payments`
  - Record a payment for a tenant and view simple payment history.

### API Endpoints (JSON)

- `GET /api/dashboard` – dashboard summary.
- `GET /api/properties`, `POST /api/properties`
- `GET /api/tenants`, `POST /api/tenants`
- `GET /api/payments`, `POST /api/payments`

All endpoints return and accept JSON and are CORS‑enabled for the frontend at `http://localhost:3000` (or similar).

