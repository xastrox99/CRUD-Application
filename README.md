# CRUD Application

A full-stack CRUD (Create, Read, Update, Delete) application built with Spring Boot backend and Next.js frontend, featuring user authentication, product management, and a modern responsive UI.

## 🚀 Features

### Backend (Spring Boot)
- **RESTful API** with comprehensive CRUD operations
- **JWT Authentication** with secure token-based authentication
- **User Management** with registration and login functionality
- **Product Management** with full CRUD operations
- **Input Validation** with comprehensive error handling
- **Database Migrations** using Flyway
- **CORS Configuration** for cross-origin requests
- **Global Exception Handling** with standardized error responses

### Frontend (Next.js)
- **Modern UI** built with Next.js 14 and TypeScript
- **Responsive Design** using Tailwind CSS and shadcn/ui components
- **Protected Routes** with authentication guards
- **Real-time Form Validation** with React Hook Form
- **Toast Notifications** for user feedback
- **Dark/Light Theme** support
- **Mobile Responsive** design

### Database
- **PostgreSQL** database with proper schema design
- **Automatic Migrations** with sample data
- **Optimized Queries** with JPA/Hibernate

## 🛠️ Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Flyway** for database migrations
- **Maven** for dependency management
- **Validation API** for input validation

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Hook Form** for form management
- **Axios** for API communication
- **Lucide React** for icons

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17 or higher**
- **Node.js 18 or higher**
- **PostgreSQL 15 or higher**
- **Maven 3.6+**
- **npm or yarn**

### Installing Prerequisites (macOS)

```bash
# Install Java
brew install openjdk@17

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql@15

# Install Maven
brew install maven
```

## 🚀 Quick Start

### Option 1: Using the Setup Script (Recommended)

1. **Make the script executable:**
   ```bash
   chmod +x setup.sh
   ```

2. **Run the setup:**
   ```bash
   ./setup.sh setup
   ```

3. **Start the application:**
   ```bash
   ./setup.sh start
   ```

### Option 2: Manual Setup

1. **Start PostgreSQL:**
   ```bash
   brew services start postgresql@15
   ```

2. **Create the database:**
   ```bash
   createdb crud_app
   ```

3. **Setup Backend:**
   ```bash
   cd backend
   mvn clean compile
   mvn spring-boot:run
   ```

4. **Setup Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🌐 Access Points

Once the application is running, you can access:

- **Frontend Application:** http://localhost:3000 (Note: If this port is busy, Next.js may automatically use `http://localhost:3001`. Check the terminal output from the start command.)
- **Backend API:** http://localhost:8080
- **API Documentation:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/actuator/health

## 📱 Application Features

### Authentication
- **Register:** Create a new user account
- **Login:** Authenticate with email and password
- **Protected Routes:** Secure access to authenticated features
- **JWT Tokens:** Secure session management

### Product Management
- **View Products:** Browse all products with pagination
- **Add Product:** Create new products with validation
- **Edit Product:** Update existing product information
- **Delete Product:** Remove products with confirmation
- **Search & Filter:** Find products by name or category

### User Interface
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Modern UI:** Clean and intuitive interface
- **Real-time Feedback:** Toast notifications for all actions
- **Loading States:** Smooth user experience during operations
- **Error Handling:** User-friendly error messages

## 🔧 Management Commands

The setup script provides several management commands:

```bash
# Show all available commands
./setup.sh

# Setup database and install dependencies
./setup.sh setup

# Start both backend and frontend
./setup.sh start

# Stop all services (forcefully terminates on ports 3000 & 8080)
./setup.sh stop

# Restart all services
./setup.sh restart

# View logs
./setup.sh logs backend
./setup.sh logs frontend

# Check service status
./setup.sh status

# Clean up log files and stop services
./setup.sh cleanup
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## 🗄️ Database Schema

### Users Table
- `id` (BIGSERIAL, Primary Key)
- `username` (VARCHAR, Unique)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Encrypted)
- `role` (VARCHAR, Default: 'USER')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Products Table
- `id` (BIGSERIAL, Primary Key)
- `name` (VARCHAR, Not Null)
- `description` (TEXT)
- `price` (DECIMAL, Not Null)
- `category` (VARCHAR)
- `stock_quantity` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔒 Security Features

- **JWT Authentication** with secure token generation
- **Password Encryption** using BCrypt
- **CORS Configuration** for secure cross-origin requests
- **Input Validation** to prevent malicious data
- **Role-based Access Control** for admin features
- **Global Exception Handling** for secure error responses

## 🐛 Troubleshooting

### Common Issues

1. **"Missing required error components" in browser:**
   - This is a Next.js error. The project now includes `frontend/app/error.tsx` and `frontend/app/not-found.tsx` to handle this. If the error persists, try clearing the Next.js cache and restarting:
     ```bash
     ./setup.sh stop
     rm -rf frontend/.next
     ./setup.sh start
     ```

2. **PostgreSQL Connection Error:**
   - Ensure PostgreSQL is running: `brew services start postgresql@15`
   - The setup script now automatically handles terminating old database connections during setup, which should prevent most access errors.

3. **Port Already in Use (e.g., on 3000 or 8080):**
   - The `setup.sh` script now automatically kills any processes on ports 3000 and 8080 when you run `stop`, `start`, or `restart`, which should prevent most conflicts.
   - If for some reason port `3000` is still occupied by an unrelated process, Next.js will automatically start on the next available port (e.g., `3001`). The correct URL will be displayed in the terminal when you run `./setup.sh start`.

4. **Java Version Issues:**
   - Ensure Java 17+: `java -version`
   - Set `JAVA_HOME` if needed

5. **Node.js Version Issues:**
   - Ensure Node.js 18+: `node -v`
   - Use `nvm` to manage Node.js versions

### Logs and Debugging

- **Backend Logs:** `./setup.sh logs backend`
- **Frontend Logs:** `./setup.sh logs frontend`
- **Service Status:** `./setup.sh status`

## 📝 Development

### Project Structure
```
CRUD-Application/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml            # Maven dependencies
├── frontend/               # Next.js application
│   ├── app/               # Next.js app directory
│   │   ├── error.tsx       # Global error boundary
│   │   └── not-found.tsx   # Global 404 page
│   ├── components/        # React components
│   └── package.json       # Node.js dependencies
├── setup.sh              # Management script
└── README.md             # This file
```

### Adding New Features

1. **Backend Changes:**
   - Add new entities in `backend/src/main/java/com/example/crud/model/`
   - Create repositories in `backend/src/main/java/com/example/crud/repository/`
   - Implement services in `backend/src/main/java/com/example/crud/service/`
   - Add controllers in `backend/src/main/java/com/example/crud/controller/`

2. **Frontend Changes:**
   - Add new pages in `frontend/app/`
   - Create components in `frontend/components/`
   - Update API calls in `frontend/app/lib/api.ts`



## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the logs using `./setup.sh logs [backend|frontend]`
3. Check the service status with `./setup.sh status`
4. Create an issue in the repository

---

**Happy Coding! 🚀** 
