# 🔗 URL Shortener API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

This project is a simple and scalable API built with NestJS for shortening URLs.  
Main features include:

- ✅ JWT-based Authentication (Signup/Login)
- 🔗 URL shortening
- 🔁 Redirect to original URL
- 📈 Click count tracking
- 🔐 Protected routes with optional access control
- 🧾 Auto-generated Swagger API documentation
- 🐘 PostgreSQL with Prisma ORM

## ⚙️ How to Install and Run Locally

Make sure you have Node.js version **22.18.0** installed.

1. Clone the repository:

```bash
git clone https://github.com/FabioKopacz/shortener-url.git
cd shortener-url
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment file and configure it:

```bash
cp .env.example .env
```

4. Set up the database and generate Prisma Client:

```bash
npm run prisma migrate dev  # applies schema changes to DB
npm run prisma generate     # generates Prisma Client
```

5. Start the server:

```bash
npm run start:dev
```

The server will run by default on `http://localhost:3000`.

## 📁 Environment Variables (`.env.example`)

The `.env.example` file contains the necessary environment variables to configure the application.

Make sure to create a `.env` file based on this template and update the values according to your environment:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_jwt_secret_key"
BASE_URL="http://localhost:3000" # or your deployed domain
PORT='3000'
```

> ⚠️ Keep your `.env` file secret. Do not commit it to version control.

## 🚀 Start Server

To run the application locally after setting up the environment and database:

```bash
npm run start:dev
```

This will start the NestJS development server at:

```bash
http://localhost:3000
```

Make sure the database is running and migrations have been applied.

## ✅ Test Command

To run tests across the project, use the following command:

```bash
npm run test
```

## 📘 Swagger API Docs

Swagger documentation is available after starting the server.

Access it via:

```bash
http://localhost:3000/api
```

This interface provides a detailed overview of all available endpoints, request/response formats, and authentication requirements.

## 🚀 Live API (Hosted on Render)

The application is deployed and accessible at the following base URL:

```bash
https://shortener-url-0mh8.onrender.com
```

You can also access the Swagger documentation in production:

```bash
https://shortener-url-0mh8.onrender.com/api
```

## 📈 Improvements for Scaling (Horizontal Scaling Challenges)

This project works well as a basic URL shortener, but to support more users and higher traffic in the future, a few improvements would be helpful.

### Potential Improvements

- **Stateless Authentication**:
  - Using JWT tokens is already a good approach for scaling since they don’t depend on server memory. Still, if you need to support things like logging users out or managing sessions more safely, you could add features like refresh tokens or store invalidated tokens in Redis.

- **Database Optimization**:
  - Add indexes on frequently queried fields like `short_code`, `user_id`.

- **Caching**:
  - Use Redis to cache frequently accessed original URLs.
  - Cache authenticated user sessions or decoded JWT payloads to reduce database lookups.

- **Service Decomposition**:
  - Split auth, URL management, and redirection into separate services for independent scaling.

- **Monitoring and Observability**:
  - Integrate logging and monitoring tools like Sentry, Datadog, or Prometheus/Grafana for performance metrics and error tracking.

### Challenges

- **Database consistency** with incrementing click counts when using multiple instances.
- **Cache invalidation** strategy when URLs are updated or deleted.
- **Race conditions** in URL shortening with generated codes.
- **Cold starts** in serverless environments (if using them in the future).
