# How to Run GearGuard

## Quick Start

1. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

2. **Run the application:**
   ```bash
   python main.py
   ```

## Alternative: Direct uvicorn command

```bash
# Development mode (with auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Command Line Options

When using `python main.py`, you can pass options:

```bash
# Custom port
python main.py --port 8080

# Custom host
python main.py --host 127.0.0.1

# Disable auto-reload
python main.py --no-reload

# Combine options
python main.py --port 8080 --host 127.0.0.1 --no-reload
```

## Environment Variables

You can also set these via environment variables:

```bash
# Windows
set PORT=8080
set HOST=127.0.0.1
set RELOAD=false
python main.py

# Linux/Mac
export PORT=8080
export HOST=127.0.0.1
export RELOAD=false
python main.py
```

## Access the API

Once running:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

