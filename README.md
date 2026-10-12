# HAGORA - Premium Makeup Store 💄

A modern e-commerce web application for beauty and cosmetic products, built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**, powered by a high-performance **FastAPI (Python)** backend with **SQLite/SQLAlchemy** for authentication, user profiles, shipping rates, and order processing.

---

## 🌟 Tech Stack

### Frontend
- **React 19** + **TypeScript (TSX)**
- **Vite** (Next-generation frontend tooling)
- **Tailwind CSS v4** + Modern responsive design
- **React Router Dom v7** (Client-side routing)
- **Axios / Fetch API**
- **FontAwesome Icons** & **Swiper**

### Backend
- **FastAPI** (Python 3.10+)
- **SQLAlchemy** + **SQLite** (Relational ORM & Database)
- **Pydantic v2** (Validation & serialization)
- **JWT Authentication** + **Argon2** Password Hashing
- **FastAPI-Mail** (Transactional emails & password reset)
- **Uvicorn** (ASGI web server)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ and `npm`
- **Python**: v3.10+ and `pip`

---

### 2. Backend Setup & Run

The backend server runs on `http://127.0.0.1:8000`.

#### Option A: Running from the Project Root
```bash
# 1. (Optional) Create virtual environment if not created
python -m venv backend/.venv

# 2. Activate virtual environment
# Windows (PowerShell):
.\backend\.venv\Scripts\Activate.ps1
# Windows (CMD):
.\backend\.venv\Scripts\activate.bat
# Linux/macOS:
source backend/.venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
copy backend\.env.example backend\.env  # (Or cp on Linux/macOS)

# 5. Start the backend server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

#### Option B: Running from `backend/` directory
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Interactive API documentation will be available at:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

### 3. Frontend Setup & Run

The frontend development server runs on `http://localhost:5173`.

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | User registration with JWT token generation |
| `POST` | `/login` | User login and authentication |
| `GET` | `/me` | Get currently authenticated user details |
| `GET` | `/me/profile` | Get full user profile |
| `PUT` | `/me/profile` | Update profile information |
| `POST` | `/forgot-password` | Send password reset token/email |
| `POST` | `/reset-password` | Reset password using token |
| `GET` | `/governorates` | List Egyptian governorates & shipping rates |
| `GET` | `/orders` | Get user order history |
| `POST` | `/orders` | Place a new order with validation |
| `GET` | `/products` | Products catalog endpoint |

---

## 🧪 Testing

To run backend automated test suites:
```bash
cd backend
python -m pytest
```

---

## 📁 Project Structure

```
├── backend/                  # FastAPI Application
│   ├── database.py           # Database engine & session setup
│   ├── dependencies.py       # Auth & DB dependency injection
│   ├── email_service.py      # Mail delivery service
│   ├── main.py               # API route definitions
│   ├── models.py             # SQLAlchemy models (User, Order, etc.)
│   ├── schemas.py            # Pydantic schemas
│   ├── security.py           # Password hashing & JWT logic
│   ├── shipping.py           # Shipping rates & governorates
│   ├── requirements.txt      # Python dependencies
│   └── test_api.py           # Automated test suite
├── src/                      # React 19 + TypeScript Frontend
│   ├── api/                  # API client services (auth, users, orders)
│   ├── assets/               # Images and static media
│   ├── Components/           # Reusable UI components
│   ├── Context/              # React Context state management
│   ├── Pages/                # Application pages & views
│   ├── types/                # TypeScript type definitions
│   ├── App.tsx               # Root component & routing
│   ├── main.tsx              # Application entry point
│   └── index.css             # Tailwind CSS styles
├── main.py                   # Root runner for FastAPI backend
├── package.json              # Frontend npm dependencies & scripts
├── requirements.txt          # Root Python dependencies
└── vite.config.ts            # Vite configuration
```

---

## 📄 License
MIT License
