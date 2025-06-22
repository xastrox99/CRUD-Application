#!/bin/bash

# CRUD Application Setup Script
# This script will set up the entire application including database, backend, and frontend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if PostgreSQL is running
check_postgres() {
    if command_exists pg_isready; then
        if pg_isready -q; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

# Function to setup database
setup_database() {
    print_status "Setting up PostgreSQL database..."
    
    # Check if PostgreSQL is installed
    if ! command_exists psql; then
        print_error "PostgreSQL is not installed. Please install it first:"
        print_error "  brew install postgresql@15"
        exit 1
    fi
    
    # Check if PostgreSQL is running
    if ! check_postgres; then
        print_warning "PostgreSQL is not running. Starting it..."
        brew services start postgresql@15
        sleep 3
    fi
    
    # Add PostgreSQL to PATH if not already there
    export PATH="/usr/local/opt/postgresql@15/bin:$PATH"
    
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw crud_app; then
        print_warning "Database 'crud_app' already exists. Dropping it..."
        dropdb crud_app
    fi
    
    # Create database
    print_status "Creating database 'crud_app'..."
    createdb crud_app
    print_success "Database created successfully!"
}

# Function to setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    # Check if Java is installed
    if ! command_exists java; then
        print_error "Java is not installed. Please install Java 17 or higher."
        exit 1
    fi
    
    # Check Java version
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -lt 17 ]; then
        print_error "Java 17 or higher is required. Current version: $JAVA_VERSION"
        exit 1
    fi
    
    # Check if Maven is installed
    if ! command_exists mvn; then
        print_error "Maven is not installed. Please install it first:"
        print_error "  brew install maven"
        exit 1
    fi
    
    cd backend
    
    # Clean and compile
    print_status "Compiling backend..."
    mvn clean compile
    
    print_success "Backend setup completed!"
    cd ..
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    # Check if Node.js is installed
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install it first:"
        print_error "  brew install node"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 18 or higher is required. Current version: $NODE_VERSION"
        exit 1
    fi
    
    cd frontend
    
    # Install dependencies with --force to resolve conflicts
    print_status "Installing frontend dependencies..."
    npm install --force
    
    print_success "Frontend setup completed!"
    cd ..
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    cd backend
    
    # Start backend in background
    mvn spring-boot:run > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    
    # Wait for backend to start
    print_status "Waiting for backend to start..."
    sleep 10
    
    # Check if backend is running
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        print_success "Backend is running on http://localhost:8080"
    else
        print_warning "Backend might still be starting up..."
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend server..."
    cd frontend
    
    # Start frontend in background
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    
    # Wait for frontend to start
    print_status "Waiting for frontend to start..."
    sleep 5
    
    print_success "Frontend is running on http://localhost:3000"
    cd ..
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    
    # Stop backend
    if [ -f backend.pid ]; then
        BACKEND_PID=$(cat backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_success "Backend stopped"
        fi
        rm -f backend.pid
    fi
    
    # Stop frontend
    if [ -f frontend.pid ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            print_success "Frontend stopped"
        fi
        rm -f frontend.pid
    fi
}

# Function to show logs
show_logs() {
    case $1 in
        "backend")
            if [ -f backend.log ]; then
                tail -f backend.log
            else
                print_error "Backend log file not found"
            fi
            ;;
        "frontend")
            if [ -f frontend.log ]; then
                tail -f frontend.log
            else
                print_error "Frontend log file not found"
            fi
            ;;
        *)
            print_error "Usage: $0 logs [backend|frontend]"
            exit 1
            ;;
    esac
}

# Function to show status
show_status() {
    print_status "Application Status:"
    echo
    
    # Check backend
    if [ -f backend.pid ]; then
        BACKEND_PID=$(cat backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_success "Backend: Running (PID: $BACKEND_PID)"
        else
            print_error "Backend: Not running"
        fi
    else
        print_error "Backend: Not running"
    fi
    
    # Check frontend
    if [ -f frontend.pid ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            print_success "Frontend: Running (PID: $FRONTEND_PID)"
        else
            print_error "Frontend: Not running"
        fi
    else
        print_error "Frontend: Not running"
    fi
    
    # Check database
    if check_postgres; then
        print_success "PostgreSQL: Running"
    else
        print_error "PostgreSQL: Not running"
    fi
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up..."
    stop_services
    rm -f backend.log frontend.log backend.pid frontend.pid
    print_success "Cleanup completed!"
}

# Main script logic
case $1 in
    "setup")
        print_status "Setting up CRUD Application..."
        setup_database
        setup_backend
        setup_frontend
        print_success "Setup completed successfully!"
        ;;
    "start")
        print_status "Starting CRUD Application..."
        start_backend
        start_frontend
        print_success "Application started!"
        print_status "Backend: http://localhost:8080"
        print_status "Frontend: http://localhost:3000"
        print_status "API Documentation: http://localhost:8080/api"
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        sleep 2
        start_backend
        start_frontend
        print_success "Application restarted!"
        ;;
    "logs")
        show_logs $2
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "CRUD Application Management Script"
        echo
        echo "Usage: $0 {setup|start|stop|restart|logs|status|cleanup}"
        echo
        echo "Commands:"
        echo "  setup     - Set up database, install dependencies"
        echo "  start     - Start backend and frontend servers"
        echo "  stop      - Stop all running services"
        echo "  restart   - Restart all services"
        echo "  logs      - Show logs (backend|frontend)"
        echo "  status    - Show status of all services"
        echo "  cleanup   - Stop services and clean up log files"
        echo
        echo "Examples:"
        echo "  $0 setup"
        echo "  $0 start"
        echo "  $0 logs backend"
        echo "  $0 status"
        ;;
esac 