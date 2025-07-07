# NestJS Phone Authentication

This project is a backend service built with NestJS that provides user authentication using phone numbers and OTP verification. It uses Prisma for database operations and JWT for secure token management.

## Features

- User registration and login via phone number
- OTP verification for phone numbers (fixed OTP '12345' for demonstration)
- JWT-based authentication with access and refresh tokens
- Role-based access control (Admin and User roles)

## Prerequisites

- Node.js (v22 or higher)
- SQLite database
- Prisma CLI

## Installation

1. Clone the repository:

```bash
git clone https://github.com/gnarayyan/nestjs-auth-app
cd nestjs-auth-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database with Prisma:

```bash
npx prisma migrate dev
```

4. Configure environment variables by creating a `.env` file:

```env
DATABASE_URL="file:./dev.db"

TOKEN_SECRET=your_token_secret
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

TOKEN_EXPIRATION=2m
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

PORT=3000
```

## Usage

Run the application in development mode:

```bash
npm run start:dev
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### POST /user/login

Initiates the login process by generating a validation token.

**Request:**

```bash
curl -X POST http://localhost:3000/user/login -H "Content-Type: application/json" -d '{"phoneNumber": "+9779861200219"}'
```

**Response:**

```json
{
  "validationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /user/verifyPhone

Verifies the phone number using the OTP and validation token, and returns access and refresh tokens.

**Request:**

```bash
curl -X POST http://localhost:3000/user/verifyPhone -H "Content-Type: application/json" -H "validationtoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -d '{"otp": "12345"}'
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /user/me

Retrieves the authenticated user's details.

**Request:**

```bash
curl -X GET http://localhost:3000/user/me -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:**

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "phoneNumber": "+9779861200219",
  "role": "User"
}
```

## Notes

- The OTP is fixed to '12345' for demonstration purposes. In a production environment, implement a proper OTP generation and delivery system.
- The validation token is single-use and expires in 2 minutes.
- Access tokens expire in 15 minutes, and refresh tokens expire in 7 days.
