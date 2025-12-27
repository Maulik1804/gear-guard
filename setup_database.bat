@echo off
REM Database Setup Script for Windows
echo Setting up GearGuard database...

REM Load environment variables
if exist .env (
    echo Loading environment variables from .env...
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        if not "%%a"=="" if not "%%a"=="#" (
            set "%%a=%%b"
        )
    )
)

REM Check if database exists
echo Checking if database exists...
psql -U postgres -lqt | findstr /C:"gear_guard" >nul
if errorlevel 1 (
    echo Database does not exist. Creating database...
    psql -U postgres -c "CREATE DATABASE gear_guard;"
    if errorlevel 1 (
        echo ERROR: Failed to create database. Please check your PostgreSQL connection.
        pause
        exit /b 1
    )
    echo Database created successfully.
) else (
    echo Database already exists.
)

REM Run the schema (skip CREATE DATABASE line)
echo Running database schema...
psql -U postgres -d gear_guard -f database_schema.sql
if errorlevel 1 (
    echo ERROR: Failed to run schema. Trying alternative method...
    REM Try running without CREATE DATABASE
    powershell -Command "(Get-Content database_schema.sql) | Where-Object {$_ -notmatch '^CREATE DATABASE'} | Out-File -encoding utf8 temp_schema.sql"
    psql -U postgres -d gear_guard -f temp_schema.sql
    del temp_schema.sql
    if errorlevel 1 (
        echo ERROR: Failed to run schema.
        pause
        exit /b 1
    )
)

echo.
echo Database setup complete!
echo.
pause

