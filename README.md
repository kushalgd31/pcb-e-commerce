# PCB E-commerce Project

This is a full-stack e-commerce project with Django backend, FastAPI cart microservice, Next.js customer store, React admin dashboard, and Django templates admin panel.

## Architecture

- **Backend**: Django (MongoDB via Djongo) for users, products, orders; FastAPI (MongoDB) for cart
- **Frontend**: Next.js for customers, React for admin dashboard, Django templates for classic admin
- **Database**: MongoDB for all data
- **Authentication**: JWT shared across services
- **Deployment**: Docker Compose for local, GitHub Actions for CI

## Setup Instructions

1. Clone the repo
2. Start MongoDB (locally or via Docker)
3. Backend: `cd backend/core && pip install -r requirements.txt && python manage.py runserver`
4. FastAPI: `cd backend/fastapi-cart && pip install -r requirements.txt && uvicorn main:app --reload`
5. Frontend: `cd frontend/nextjs-shop && npm install && npm run dev`
6. Admin: `cd frontend/react-admin && npm install && npm start`
7. Docker: `docker-compose up`

## User Roles

- **Customer**: Register, login, view products, manage cart, place orders, view order history
- **Admin/Staff**: All customer permissions + manage products, approve/reject orders, access admin panels

## API Overview

### Django APIs (Port 8000)
- POST /api/auth/login/ - Login
- POST /api/auth/register/ - Register (customers only)
- GET /api/products/ - Public product list
- POST/PUT/DELETE /api/products/ - Admin product CRUD
- POST /api/orders/ - Create order
- GET /api/orders/list/ - List orders (role-based)
- PUT /api/orders/{id}/update/ - Approve/reject orders (admin/staff)

### FastAPI Cart (Port 8001)
- POST /cart/add - Add to cart
- PUT /cart/update - Update cart
- DELETE /cart/remove - Remove from cart
- GET /cart - Get cart
- GET /docs - Swagger UI

### Django Templates Admin (Port 8000)
- /admin-panel/login/ - Login
- /admin-panel/dashboard/ - Dashboard
- /admin-panel/products/ - Product management
- /admin-panel/orders/ - Order management

## Deployment Notes

- **Local**: Use Docker Compose
- **Cloud**: Deploy Django/FastAPI to Railway/Render, Next.js/React to Vercel/Netlify, MongoDB to MongoDB Atlas
- **CI/CD**: GitHub Actions for linting and building
