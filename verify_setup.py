"""
Verify that the environment is set up correctly
"""

import sys
import os

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("[X] Python 3.8+ is required")
        return False
    print(f"[OK] Python {version.major}.{version.minor}.{version.micro}")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = {
        'fastapi': 'fastapi',
        'uvicorn': 'uvicorn',
        'psycopg2': 'psycopg2',
        'pydantic': 'pydantic',
        'bcrypt': 'bcrypt',
        'python-dotenv': 'dotenv'
    }
    
    missing = []
    for package_name, import_name in required_packages.items():
        try:
            __import__(import_name)
            print(f"[OK] {package_name}")
        except ImportError:
            print(f"[X] {package_name} - not installed")
            missing.append(package_name)
    
    return len(missing) == 0

def check_env_file():
    """Check if .env file exists"""
    if os.path.exists('.env'):
        print("[OK] .env file exists")
        return True
    else:
        print("[!] .env file not found - create it from .env.example")
        return False

def check_database_config():
    """Check database configuration"""
    from dotenv import load_dotenv
    load_dotenv()
    
    required_vars = ['DB_NAME', 'DB_USER', 'DB_HOST', 'DB_PORT']
    missing = []
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"[OK] {var} = {value}")
        else:
            print(f"[X] {var} - not set")
            missing.append(var)
    
    # Password can be empty for local dev
    password = os.getenv('DB_PASSWORD')
    if password:
        print(f"[OK] DB_PASSWORD = {'*' * len(password)}")
    else:
        print("[!] DB_PASSWORD - not set (may be empty for local dev)")
    
    return len(missing) == 0

def main():
    print("=" * 50)
    print("GearGuard Setup Verification")
    print("=" * 50)
    print()
    
    print("1. Checking Python version...")
    python_ok = check_python_version()
    print()
    
    print("2. Checking dependencies...")
    deps_ok = check_dependencies()
    print()
    
    print("3. Checking .env file...")
    env_ok = check_env_file()
    print()
    
    if env_ok:
        print("4. Checking database configuration...")
        db_ok = check_database_config()
        print()
    else:
        db_ok = False
        print("4. Skipping database config check (no .env file)")
        print()
    
    print("=" * 50)
    if python_ok and deps_ok and env_ok and db_ok:
        print("[OK] All checks passed! You're ready to run the application.")
        print()
        print("Run: python main.py")
        return 0
    else:
        print("[X] Some checks failed. Please fix the issues above.")
        print()
        if not python_ok:
            print("  - Install Python 3.8+")
        if not deps_ok:
            print("  - Run: pip install -r requirements.txt")
        if not env_ok:
            print("  - Create .env file from .env.example")
        if not db_ok:
            print("  - Configure database settings in .env")
        return 1

if __name__ == "__main__":
    sys.exit(main())

