# Authentication Backend Challenge

A secure authentication system built with Express.js that handles user registration, login, and protected routes.

## Setup Instructions

1. **Install dependencies:**

```bash
   npm install
```

2. **Create .env file:**

```bash
   cp .env.example .env
```

Then edit `.env` and add your JWT secret.

3. **Start the server:**

```bash
   npm start
```

Or for development with auto-reload:

```bash
   npm run dev
```

## API Endpoints

### 1. Register User

**POST** `/api/register`

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### 2. Login

**POST** `/api/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### 3. Get Profile (Protected)

**GET** `/api/profile`

**Headers:**

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200):**

```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### 4. Public Route

**GET** `/api/public`

**Response (200):**

```json
{
  "message": "This is a public route"
}
```

## Testing with cURL

### Register a new user:

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"securepassword123"}'
```

### Login:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securepassword123"}'
```

### Access protected profile (replace TOKEN with actual token):

```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Access public route:

```bash
curl -X GET http://localhost:3000/api/public
```

## Testing with Postman/Thunder Client

1. **Register:** POST to `http://localhost:3000/api/register` with JSON body
2. **Login:** POST to `http://localhost:3000/api/login` with JSON body
3. **Copy the token** from login response
4. **Profile:** GET to `http://localhost:3000/api/profile` with header `Authorization: Bearer <token>`
5. **Public:** GET to `http://localhost:3000/api/public` (no auth needed)

## Security Features

✅ Passwords hashed with bcrypt (10 salt rounds)  
✅ JWT tokens with 24-hour expiration  
✅ Protected routes with token validation  
✅ Proper HTTP status codes  
✅ Error handling throughout  
✅ No plain text password storage

## Technologies Used

- **Express.js** - Web framework
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT token generation
- **dotenv** - Environment variables
