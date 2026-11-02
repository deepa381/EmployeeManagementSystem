# Employee Management System 🏢

A full-stack Employee Management System built with **React.js**, **Python Flask**, **MySQL**, and **Docker**.

---

## 📋 Features

- ✅ Add new employees
- ✅ View all employees in a dashboard
- ✅ Search employees by name, department, or designation
- ✅ Edit employee details
- ✅ Delete employees with confirmation
- ✅ Persistent data storage with MySQL volumes

---

## 🏗️ Architecture

```
Browser (localhost:3000)
        │
        ▼
  React Frontend  ──── API calls ────►  Flask Backend  ──── SQL ────►  MySQL DB
  (port 3000)                           (port 5000)                   (internal)
```

All three services run in isolated Docker containers and communicate through a private Docker network.

---

## 📁 Project Structure

```
EmployeeManagementSystem/
├── frontend/               # React.js application
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page-level components
│       └── App.js
├── backend/                # Python Flask API
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app.py              # Main Flask application
│   └── init.sql            # Database initialization script
├── docker-compose.yml      # Orchestrates all services
├── .env.example            # Environment variable template
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git (optional, for cloning)

---

## 🚀 Getting Started

### 1. Clone the repository (or download the ZIP)

```bash
git clone <your-repo-url>
cd EmployeeManagementSystem
```

### 2. Set up environment variables

```bash
# Copy the template
cp .env.example .env

# Edit .env with your own values (do NOT use the defaults in production)
```

Open `.env` and set strong passwords:

```env
MYSQL_ROOT_PASSWORD=StrongRootPassword123
MYSQL_DATABASE=employee_db
MYSQL_USER=emp_user
MYSQL_PASSWORD=StrongUserPassword123

FLASK_ENV=development
FLASK_PORT=5000
SECRET_KEY=a-very-long-random-secret-key

DB_HOST=db
DB_PORT=3306
DB_NAME=employee_db
DB_USER=emp_user
DB_PASSWORD=StrongUserPassword123
```

### 3. Build and start all services

```bash
docker compose up --build
```

> First run may take 3–5 minutes to download images and install dependencies.

### 4. Open the application

| Service | URL |
|---------|-----|
| React Frontend | http://localhost:3000 |
| Flask API | http://localhost:5000/api/health |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get employee by ID |
| POST | `/api/employees` | Add new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

---

## 🛑 Stopping the Application

```bash
# Stop containers (keeps data)
docker compose down

# Stop and delete all data (fresh start)
docker compose down -v
```

---

## 🗃️ Database

- MySQL 8.0 runs inside Docker
- Data persists in a Docker volume (`mysql_data`) even after restarts
- Database port (3306) is **not** exposed publicly — only the backend can reach it

---

## 🔐 Security Notes

- Never commit the `.env` file to Git (it's in `.gitignore`)
- Use strong, unique passwords in production
- The database is only accessible within the Docker network

---

## 🐛 Troubleshooting

**Backend can't connect to database?**
```bash
# Check if db is healthy
docker compose ps
docker compose logs db
```

**Port already in use?**
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

**Start fresh:**
```bash
docker compose down -v
docker compose up --build
```

---

## 📝 License

MIT License — free to use and modify.
