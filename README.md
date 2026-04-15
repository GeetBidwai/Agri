# Agri

Agri is a full-stack agricultural marketplace app with a React frontend and a Django REST backend. Users can browse crop listings, filter buy and sell offers, sign up, create listings, view seller contact details, and place bids on products.

## Stack

- Frontend: React 19, Vite 8, Tailwind CSS, Axios
- Backend: Django 6, Django REST Framework, token authentication, django-cors-headers
- Database: SQLite
- Media uploads: Pillow-backed image uploads for product photos

## Features

- Browse the latest agricultural listings
- Filter listings by `BUY` and `SELL`
- Search listings by product name
- Explore category pages
- User signup, login, and profile view
- Create authenticated listings with optional product image upload
- Save seller phone number to the user profile for contact sharing
- View listing contact details
- Place bids and view bids for a product
- Hindi and English UI toggle in the frontend

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

3. Move into the backend folder and apply migrations.

```powershell
cd backend
python manage.py migrate
```

4. Start the Django development server.

```powershell
python manage.py runserver
```

The backend runs at `http://127.0.0.1:8000/`.

## Frontend Setup

1. Open a new terminal and move into the frontend folder.

```powershell
cd frontend
```

2. Install Node dependencies.

```powershell
npm install
```

3. Start the Vite development server.

```powershell
npm run dev
```

The frontend usually runs at `http://127.0.0.1:5173/`.

## Development Notes

- The frontend API client is hardcoded to `http://127.0.0.1:8000/api`.
- Product images are served from Django media storage during development.
- CORS is currently open for all origins in development.
- Authentication uses DRF token auth and stores the token in browser local storage.
- The app uses hash-based navigation instead of React Router.

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
- `GET /api/auth/me/`

### Products

- `GET /api/products/`
- `POST /api/products/`
- `GET /api/products/<product_id>/contact/`
- `GET /api/products/<product_id>/bids/`
- `POST /api/products/<product_id>/bids/`

## Current State

- Frontend lint passes
- Frontend production build passes
- Django system check passes
- Automated backend tests have not been added yet
