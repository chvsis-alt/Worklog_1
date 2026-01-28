#!/bin/bash

echo "╔════════════════════════════════════════════╗"
echo "║   Task Logger - Startup Check             ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js installed: $NODE_VERSION"
else
    echo "   ❌ Node.js NOT installed!"
    echo "   Please install from: https://nodejs.org"
    exit 1
fi

# Check npm
echo ""
echo "2. Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✅ npm installed: $NPM_VERSION"
else
    echo "   ❌ npm NOT installed!"
    exit 1
fi

# Check file structure
echo ""
echo "3. Checking file structure..."

if [ -f "server.js" ]; then
    echo "   ✅ server.js found"
else
    echo "   ❌ server.js NOT found!"
    exit 1
fi

if [ -f "package.json" ]; then
    echo "   ✅ package.json found"
else
    echo "   ❌ package.json NOT found!"
    exit 1
fi

if [ -f "schema.sql" ]; then
    echo "   ✅ schema.sql found"
else
    echo "   ❌ schema.sql NOT found!"
    exit 1
fi

if [ -d "public" ]; then
    echo "   ✅ public/ folder found"
    
    if [ -f "public/index.html" ]; then
        echo "   ✅ public/index.html found"
    else
        echo "   ❌ public/index.html NOT found!"
        echo ""
        echo "   🔧 Fix: Create public folder and move index.html"
        echo "      mkdir -p public"
        echo "      mv index.html public/"
        exit 1
    fi
else
    echo "   ❌ public/ folder NOT found!"
    echo ""
    echo "   🔧 Fix: Create public folder"
    echo "      mkdir -p public"
    exit 1
fi

# Check node_modules
echo ""
echo "4. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules installed"
else
    echo "   ⚠️  node_modules NOT found"
    echo "   Running: npm install..."
    npm install
    if [ $? -eq 0 ]; then
        echo "   ✅ Dependencies installed successfully"
    else
        echo "   ❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check port availability
echo ""
echo "5. Checking port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "   ⚠️  Port 3000 is already in use"
    echo "   You can:"
    echo "   - Kill existing process: lsof -ti:3000 | xargs kill -9"
    echo "   - Use different port: PORT=3001 npm start"
else
    echo "   ✅ Port 3000 is available"
fi

# All checks passed
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   ✅ All checks passed!                    ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "🚀 Starting server..."
echo ""

npm start
