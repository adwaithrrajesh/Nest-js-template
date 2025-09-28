# 🚀 NestJS Template Project

A production-ready **NestJS template** with a clean and scalable architecture.  
It includes **authentication, Prisma ORM, global security layers, logging, and middleware**, making it an ideal starter project for building secure, enterprise-grade applications.

---

## 🌟 Features

- **Authentication**
  - JWT-based authentication with **access** and **refresh tokens**
  - Refresh tokens stored securely in **HTTP-only cookies**
- **Database**
  - Integrated **Prisma ORM** with a sample `User` schema
- **Security**
  - CORS configuration
  - CSRF protection
  - XSS protection
  - HTTP Parameter Pollution (HPP) prevention
  - Rate limiting to prevent brute force attacks
  - Secure headers with Helmet
- **Global Interceptors**
  - Logging of incoming requests and responses
  - Unified API response formatting
  - Automatic timeout handling for requests
- **Centralized Error Handling**
  - Global exception filter for consistent error responses
- **Scalable Modular Architecture**
  - Cleanly separated modules for maintainability and growth
- **Health Checks**
  - Endpoint to monitor service health and readiness

---

## 🗂 Folder Structure

```
src
├── common/                # Shared components and utilities
│   ├── decorators/        # Custom decorators (@Public, @GetUser, @TokenType)
│   ├── dto/               # Reusable DTOs
│   ├── filters/           # Global error handling
│   ├── guard/             # JWT guards for access & refresh tokens
│   ├── interceptors/      # Logging, response formatting, timeouts
│   └── utils/             # Utility functions
│
├── infrastructure/        # Core backend infrastructure
│   ├── configs/           # Environment configurations
│   ├── health/            # Health check endpoints
│   ├── logger/            # Centralized logging
│   ├── middleware/        # Middlewares (body parser, cookies, validation, etc.)
│   ├── prisma/            # Prisma module and service
│   ├── security/          # Security utilities (CORS, CSRF, XSS, Rate Limiting)
│   └── server/            # Server bootstrapping and configuration
│
└── modules/               # Application modules
│    └── user/              # Example user/auth module
│        ├── controllers/   # REST API endpoints
│        ├── services/      # Business logic
│        └── repositories/  # Prisma DB access layer
│
└──main.ts # main server 

```

---

## 🔐 Authentication Flow

1. **Register** (`POST /api/auth/register`)
   - Create a new user with hashed password
   - Generate:
     - Access token (short-lived)
     - Refresh token (long-lived, stored in HTTP-only cookie)

2. **Login** (`POST /api/auth/login`)
   - Validate user credentials
   - Generate a new pair of access and refresh tokens
   - Refresh token sent via secure cookie

3. **Refresh Token** (`GET /api/auth/refresh`)
   - Uses the refresh token from the cookie
   - Returns a new access token
   - Issues a new refresh token and updates the cookie


---

## 🏗 Server Infrastructure

The `ServerInfrastructure` class is the **entry point for setting up the application environment**.  
It centralizes configuration and ensures the app is secure and production-ready.

### Responsibilities
- **Security Layers**
  - `CORS` → Cross-Origin Resource Sharing
  - `Helmet` → Secure HTTP headers
  - `CSRF` → Cross-Site Request Forgery protection
  - `XSS` → Prevent Cross-Site Scripting attacks
  - `HPP` → Prevent HTTP Parameter Pollution
  - `Rate Limiter` → Protect against brute-force attacks

- **Global Middleware**
  - `Body Parser` → Parse incoming request bodies
  - `Cookie Parser` → Parse and sign cookies securely
  - `Compression` → Enable GZIP compression
  - `Validation` → Request validation middleware

- **Health Checks**
  - Monitor application and database readiness

- **Global Interceptors**
  - `ResponseInterceptor` → Shape and standardize API responses
  - `LoggingInterceptor` → Log incoming requests and outgoing responses
  - `TimeoutInterceptor` → Automatically handle slow requests

- **Global Filters**
  - `AllExceptionsFilter` → Centralized error handling

- **API Configuration**
  - Global API prefix `/api`

---

### Server Bootstrap Code
```typescript
const server = new ServerInfrastructure(app);
server.setup();
await server.start();
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=8000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/db_name"

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Cookie
COOKIE_SECRET=your_cookie_secret
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository_url>
cd nest-template
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Setup database
```bash
pnpm prisma migrate dev
```

### 4. Start the server
```bash
pnpm run start:dev
```

The API will be available at:  
`http://localhost:8000/api`

---

## 📡 API Endpoints

| Method | Endpoint            | Description              | Auth Required |
|--------|---------------------|--------------------------|---------------|
| POST   | `/auth/register`    | Register a new user      | ❌ No         |
| POST   | `/auth/login`       | Login and get tokens     | ❌ No         |
| GET    | `/auth/refresh`     | Refresh access token     | ✅ Yes (cookie) |
| POST   | `/auth/logout`      | Logout and clear cookie  | ✅ Yes        |

---

## 🔧 Technologies Used
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-gen ORM for database
- [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication
- [Helmet](https://helmetjs.github.io/) - Security headers
- [Rate Limiter](https://www.npmjs.com/package/express-rate-limit) - Protect against brute force attacks

---

## 🌱 Why This Architecture?

This architecture is designed for:
- **Scalability** → Clear separation of concerns for easy growth
- **Security** → Out-of-the-box best practices for production
- **Maintainability** → Modular and clean codebase
- **Performance** → Optimized middleware and interceptors

---

## 🚀 Future Improvements
- Role-based access control (RBAC)
- Swagger API documentation
- Automated testing (unit and integration)
- CI/CD pipelines
- Advanced monitoring and analytics

---

## 📜 License
This project **`nest-template`** is licensed under the **MIT License**.  
You are free to use, modify, and distribute this project in personal or commercial projects. See the full [LICENSE](./LICENSE) file for details.