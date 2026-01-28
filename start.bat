@echo off
echo ================================================
echo    Task Logger - Startup Check
echo ================================================
echo.

REM Check Node.js
echo 1. Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo    [OK] Node.js installed
) else (
    echo    [ERROR] Node.js NOT installed!
    echo    Please install from: https://nodejs.org
    pause
    exit /b 1
)

REM Check npm
echo.
echo 2. Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo    [OK] npm installed
) else (
    echo    [ERROR] npm NOT installed!
    pause
    exit /b 1
)

REM Check file structure
echo.
echo 3. Checking file structure...

if exist "server.js" (
    echo    [OK] server.js found
) else (
    echo    [ERROR] server.js NOT found!
    pause
    exit /b 1
)

if exist "package.json" (
    echo    [OK] package.json found
) else (
    echo    [ERROR] package.json NOT found!
    pause
    exit /b 1
)

if exist "schema.sql" (
    echo    [OK] schema.sql found
) else (
    echo    [ERROR] schema.sql NOT found!
    pause
    exit /b 1
)

if exist "public" (
    echo    [OK] public folder found
    
    if exist "public\index.html" (
        echo    [OK] public\index.html found
    ) else (
        echo    [ERROR] public\index.html NOT found!
        echo.
        echo    Fix: Create public folder and move index.html
        echo       mkdir public
        echo       move index.html public\
        pause
        exit /b 1
    )
) else (
    echo    [ERROR] public folder NOT found!
    echo.
    echo    Fix: Create public folder
    echo       mkdir public
    pause
    exit /b 1
)

REM Check node_modules
echo.
echo 4. Checking dependencies...
if exist "node_modules" (
    echo    [OK] node_modules installed
) else (
    echo    [WARNING] node_modules NOT found
    echo    Running: npm install...
    call npm install
    if %errorlevel% equ 0 (
        echo    [OK] Dependencies installed successfully
    ) else (
        echo    [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

REM All checks passed
echo.
echo ================================================
echo    All checks passed!
echo ================================================
echo.
echo Starting server...
echo.

npm start

pause
