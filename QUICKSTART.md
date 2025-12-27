# Quick Start Guide

## Windows Setup

### 1. Create Virtual Environment and Install Dependencies

```bash
setup_env.bat
```

This will:
- Create a virtual environment (`venv`)
- Install all required packages
- Set up the environment

### 2. Configure Database

Edit the `.env` file (copy from `.env.example` if needed) and set your PostgreSQL credentials:

```env
DB_NAME=gear_guard
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### 3. Set Up Database

```bash
# Connect to PostgreSQL and create database
psql -U postgres
CREATE DATABASE gear_guard;
\q

# Run the schema
psql -U postgres -d gear_guard -f database_schema.sql
```

### 4. Run the Application

```bash
# Activate virtual environment
venv\Scripts\activate

# Run with Python
python main.py

# OR run directly with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Linux/Mac Setup

### 1. Create Virtual Environment and Install Dependencies

```bash
chmod +x setup_env.sh
./setup_env.sh
```

### 2. Configure Database

Edit the `.env` file and set your PostgreSQL credentials.

### 3. Set Up Database

```bash
# Connect to PostgreSQL and create database
psql -U postgres
CREATE DATABASE gear_guard;
\q

# Run the schema
psql -U postgres -d gear_guard -f database_schema.sql
```

### 4. Run the Application

```bash
# Activate virtual environment
source venv/bin/activate

# Run with Python
python main.py

# OR run directly with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Access the API

Once running, access:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## First API Call

Test the API by creating a company:

```bash
curl -X POST "http://localhost:8000/api/companies" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Company"}'
```

Or use the Swagger UI at `/docs` for interactive testing.

