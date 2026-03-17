# 🚀 TaskMaster - Pro Full Stack Spring Boot & React CRUD

A premium, modern task management application built with **Spring Boot 3.4**, **React (Vite)**, and **PostgreSQL**. Featuring **JWT Authentication**, **Role-Based Access Control (RBAC)**, and a visually stunning **Glassmorphism Dashboard**.

Developed by **zoubaa mohammed**

---

## 📦 Project Dependencies

### 🍃 Backend (Spring Boot)
*   **Spring Boot Starter Web**: For building RESTful APIs.
*   **Spring Boot Starter Data JPA**: For database interaction using Hibernate.
*   **Spring Boot Starter Security**: For handling authentication and authorization.
*   **JJWT (API, Impl, Jackson)**: For generating and validating JSON Web Tokens.
*   **PostgreSQL Driver**: For connecting to the PostgreSQL database.
*   **Dotenv-java**: For loading environment variables from a `.env` file.
*   **Spring Boot DevTools**: For faster development (auto-restart).

### ⚛️ Frontend (React)
*   **React & React-DOM**: The core library for the user interface.
*   **React Router DOM**: For handling client-side routing and navigation.
*   **Axios**: For making HTTP requests to the backend API.
*   **React Icons**: For high-quality, modern UI icons (Feather Icons).
*   **Vite**: The next-generation frontend build tool for speed.

---

## 🎨 Premium Features
- **Secure Authentication**: Stateless **JWT (JSON Web Tokens)** for login/signup flows.
- **Role-Based Access Control**:
    - **ADMIN**: Can view and manage *all* tasks from every user in the database.
    - **USER**: Can sign up, log in, and manage their *private* task dashboard.
- **Advanced Security**: 
    - **BCrypt** password hashing for secure storage.
    - **CORS** policy configured for safe frontend-backend integration.
    - **Spring Security Filter Chain** for protected API endpoints.
- **Modern UI/UX**: 
    - **Navigation Bar**: Sticky glassmorphism navbar with user identity.
    - **Live Stats**: Real-time dashboard showing task counts and completion progress.
    - **React Icons**: Beautifully integrated `react-icons/fi` (Feather Icons).
- **Automated Data Seeding**: Automatically creates a default **Admin** account (`admin` / `admin123`) on the first run.
- **Professional Backend**: Layered architecture (Controller, Service, Repository) with Global Exception Handling.

---

## 🛠️ Technology Stack
- **Backend**: Java 24, Spring Boot 3.4.0, Spring Security, Spring Data JPA, JJWT.
- **Frontend**: React (Vite), React-Router-DOM, React Icons, Axios.
- **Database**: PostgreSQL (v17+).

> [!NOTE]
> **Performance Note**: Optimized for Java 24. Standard Java Getters/Setters are used instead of Lombok to ensure maximum compiler stability and 100% build compatibility on the latest Java versions.

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Java 24** (or 17/21 LTS)
- **Node.js** & **npm**
- **PostgreSQL** running on port `5001` (or your preferred port)

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create/Update your `.env` file:
   ```env
   DB_URL=jdbc:postgresql://localhost:5001/to-do-spring-boot
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   SERVER_PORT=8080
   JWT_SECRET=your_long_64_character_secret_key
   JWT_EXPIRATION=86400000
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create/Update your `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🔐 Login Credentials
- **Admin**: `admin` / `admin123`
- **User**: Any newly created account via the **Sign Up** page.

---

## 📖 Key Architectural Principles
- **Layered Architecture**: Separation of concerns across database, business logic, and web layers.
- **Security First**: Passwords are never stored in plain text; tokens are validated via an intercepting filter.
- **Stateless design**: The server does not store session data, making it highly scalable.
- **Centralized Error Handling**: A `@ControllerAdvice` maps exceptions to clear, user-friendly JSON responses.

---

Developed with ❤️ by **zoubaa mohammed**
