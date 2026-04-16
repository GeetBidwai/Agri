# Agri

Agri is a full-stack agricultural marketplace app built with a React frontend and a Django REST backend. It supports listing discovery, buyer-seller role flow, bidding, contact reveal, seller verification surfaces, bilingual UI, and suspicious listing reporting.

## Stack

- Frontend: React 19, Vite 8, Tailwind CSS, Axios
- Backend: Django 6, Django REST Framework, DRF token authentication, django-cors-headers
- Database: SQLite for local development
- Media uploads: Pillow-backed image uploads for listings and seller verification files

## What The Project Currently Does

- Browse listings
- Filter listings by `BUY` and `SELL`
- Search by product name
- Filter by category, location, and max price
- View category pages
- Sign up, log in, log out, and fetch the current profile
- Store and use buyer/seller role in the frontend
- Restrict seller-only UI and seller-only routes
- Let sellers create listings
- Let authenticated users reveal seller contact details
- Let users place bids and view bids
- Let authenticated users report suspicious listings
- Support Hindi / English UI toggling

## What We Changed In This Project

- Added buyer/seller role-aware signup support and seller redirect flow
- Added seller-only frontend access control for create listing, seller dashboard, KYC, and verification views
- Added backend seller permission checks for listing creation and seller verification-related endpoints
- Added token-based logout endpoint and frontend logout call
- Protected contact reveal behind authentication
- Protected product bid posting behind authentication and switched bid modal to the authenticated bid endpoint
- Added listing reporting with duplicate-report protection
- Tightened development CORS settings and made `SECRET_KEY` / `DEBUG` environment-aware
- Fixed broken Hindi and icon rendering issues in the affected frontend components

## Project Structure

```text
Agri/
|-- backend/
|   |-- core/
|   |-- products/
|   `-- manage.py
|-- frontend/
|   |-- public/
|   |-- src/
|   `-- package.json
|-- requirements.txt
`-- README.md
```

## Prerequisites

- Python 3.12+
- Node.js 18+
- npm 9+

## Backend Setup

1. Create and activate a virtual environment.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install Python dependencies.

```powershell
pip install -r requirements.txt
```

3. Set local environment variables if desired.

```powershell
$env:DJANGO_SECRET_KEY="dev-insecure-key-change"
$env:DJANGO_DEBUG="1"
```

4. Apply migrations.

```powershell
cd backend
python manage.py migrate
```

5. Start the backend server.

```powershell
python manage.py runserver
```

The backend runs at `http://127.0.0.1:8000/`.

## Frontend Setup

1. Open a new terminal and move into the frontend folder.

```powershell
cd frontend
```

2. Install dependencies.

```powershell
npm install
```

3. Start the Vite development server.

```powershell
npm run dev
```

The frontend usually runs at `http://127.0.0.1:5173/`.

## Environment Notes

- The frontend API client points to `http://127.0.0.1:8000/api`
- Allowed frontend origins are currently:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- Authentication uses DRF token auth
- Tokens are currently stored in browser local storage
- The app uses hash-based navigation instead of React Router

## Useful Commands

### Frontend

```powershell
npm run dev
npm run build
npm run lint
```

### Backend

```powershell
python manage.py runserver
python manage.py check
python manage.py migrate
python manage.py test
```

## API Overview

### Auth

- `POST /api/auth/signup/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`

### Product APIs

- `GET /api/products/`
- `POST /api/products/`
- `GET /api/products/<product_id>/contact/`
- `POST /api/products/<product_id>/report/`
- `GET /api/products/<product_id>/bids/`
- `POST /api/products/<product_id>/bids/`

### Marketplace APIs

- `POST /api/listings/create/`
- `GET /api/listings/`
- `GET /api/listings/<listing_id>/`
- `POST /api/bids/place/`
- `POST /api/kyc/upload/`
- `GET /api/kyc/status/`
- `POST /api/verify-seller/`
- `GET /api/verification-status/`

## Python Dependencies

- Django
- djangorestframework
- django-cors-headers
- Pillow

## Status

- Django system check passes
- Frontend production build passes
- Listing report flow is connected
- Role-based seller flow is connected
- The previously broken category icons / Hindi text rendering has been corrected
