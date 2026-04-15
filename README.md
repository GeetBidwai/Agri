# Agri - Agricultural Marketplace

Agri is a modern web application designed for agricultural products listing and management. It provides a platform for users to browse, create, and manage agricultural product listings with ease.

## Project Structure

The project is divided into two main parts:
- **Backend**: Built with Django and Django REST Framework.
- **Frontend**: Built with React, Vite, and Tailwind CSS.

## Features

- **Product Listings**: Browse through various agricultural products and categories.
- **User Authentication**: Secure login and registration for users.
- **Product Management**: Authenticated users can create and manage their own listings.
- **Verified Products**: Visual indicators for verified listings.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

### Backend
- **Framework**: Django 6.0+
- **API**: Django REST Framework (DRF)
- **Database**: SQLite (Development)
- **Middleware**: Django CORS Headers

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- **Backend API**: The API is accessible at `http://127.0.0.1:8000/api/`
- **Frontend App**: The application is accessible at `http://localhost:5173/` (by default)

## License

This project is licensed under the MIT License.
