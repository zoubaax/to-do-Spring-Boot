# 🚀 Task Nexus - Full Stack Spring Boot & React CRUD

A premium, modern task management application built with **Spring Boot 3**, **React (Vite)**, and **PostgreSQL**. This project demonstrates industry best practices for full-stack development, including layered architecture, environment variable management, and professional UI/UX design.

---

## 🎨 Features
- **Modern UI**: Dark-mode glassmorphism design with smooth animations.
- **RESTful API**: Clean backend architecture (Controller, Service, Repository layers).
- **Environment Management**: Secured configuration using `.env` files for both Frontend and Backend.
- **Global Error Handling**: Centralized exception management for professional API responses.
- **Database**: Automatic table management via Hibernate (DDL Auto Update).

---

## 🛠️ Technology Stack
- **Backend**: Java 17, Spring Boot, Spring Data JPA, Lombok, Maven.
- **Frontend**: React (Vite), Axios, Vanilla CSS (Premium styles).
- **Database**: PostgreSQL.

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Java 17 or higher
- Node.js & npm
- PostgreSQL running on port `5001` (or update in `.env`)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create/Update your `.env` file:
   ```env
   DB_URL=jdbc:postgresql://localhost:5001/to-do-spring-boot
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   SERVER_PORT=8080
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
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

## 📖 Best Practices Implemented
- **Layered Architecture**: Separation of concerns between database logic and business logic.
- **Axios Configuration**: Centralized API client for clean, maintainable frontend code.
- **Service Pattern**: Decoupling API calls from React components.
- **Security**: Sensitive credentials kept out of source control using `.gitignore` and `.env`.

---

## 🤝 Contributing
Feel free to fork this project and add features like User Authentication, Task Categories, or Due Dates!

Developed with ❤️ by **zoubaa mohammed**
