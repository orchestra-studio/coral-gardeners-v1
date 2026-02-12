# Authentication API Documentation

Complete API reference for authentication endpoints.

## Base URL

```
http://localhost:3001/api/auth
```

## Endpoints

### 1. Login

Authenticate an admin user and receive a JWT token.

**Endpoint:** `POST /api/auth/login`

**Authentication:** None required

**Request Body:**

| Field    | Type   | Required | Description         |
| -------- | ------ | -------- | ------------------- |
| email    | string | Yes      | Admin email address |
| password | string | Yes      | Admin password      |

**Example Request:**

```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }' \
  "http://localhost:3001/api/auth/login"
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": "7d",
    "admin": {
      "id": 1,
      "email": "admin@example.com",
      "username": "admin",
      "first_name": "Super",
      "last_name": "Admin",
      "full_name": "Super Admin",
      "profile_picture": null,
      "roles": [
        {
          "id": 1,
          "name": "Super Admin",
          "guard_name": "web"
        }
      ],
      "permissions": [
        "users.view",
        "users.create",
        "users.update",
        "users.delete",
        "users.restore",
        "users.verify",
        "admin.manage",
        "roles.manage",
        "settings.manage"
      ]
    }
  },
  "message": "Signed in successfully."
}
```

**Error Responses:**

**401 Unauthorized - Invalid Credentials:**

```json
{
  "success": false,
  "data": null,
  "message": "The password you entered is incorrect. Try again or use the Forgot password link.",
  "errors": null
}
```

**404 Not Found - Admin Not Found:**

```json
{
  "success": false,
  "data": null,
  "message": "We couldn't find an account with that email address. Check for typos or contact your administrator.",
  "errors": null
}
```

**400 Bad Request - Validation Error:**

```json
{
  "success": false,
  "data": null,
  "message": "We found a few issues with the information you entered. Please fix them and try again.",
  "errors": {
    "email": ["Email address is required."],
    "password": ["Password is required."]
  }
}
```

---

### 2. Get Current Admin

Get information about the currently authenticated admin.

**Endpoint:** `GET /api/auth/me`

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/auth/me"
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "username": "admin",
    "first_name": "Super",
    "last_name": "Admin",
    "full_name": "Super Admin",
    "profile_picture": null,
    "phone": null,
    "country_id": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "roles": [
      {
        "id": 1,
        "name": "Super Admin",
        "guard_name": "web"
      }
    ],
    "permissions": [
      "users.view",
      "users.create",
      "users.update",
      "users.delete",
      "admin.manage",
      "roles.manage",
      "settings.manage"
    ]
  },
  "message": ""
}
```

**Error Responses:**

**401 Unauthorized - Missing or Invalid Token:**

```json
{
  "success": false,
  "data": null,
  "message": "Your session has expired or the token is invalid. Please sign in again.",
  "errors": null
}
```

**404 Not Found - Admin No Longer Exists:**

```json
{
  "success": false,
  "data": null,
  "message": "We couldn't find an account with that email address. Check for typos or contact your administrator.",
  "errors": null
}
```

---

## Authentication Flow

### 1. Login Process

1. Client sends email and password to `/auth/login`
2. Server validates credentials
3. Server generates JWT token (expires in 7 days by default)
4. Server returns token + admin data with roles and permissions
5. Client stores token (localStorage, cookies, etc.)

### 2. Making Authenticated Requests

For all protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Token Validation

- The JWT token is validated on every request to protected endpoints
- If the token is invalid or expired, the server returns 401 Unauthorized
- Tokens are stateless - no server-side session storage

### 4. Logout

Logout is handled client-side by deleting the stored JWT token. There's no server-side logout endpoint since JWTs are stateless.

---

## Security Features

### Password Hashing

- Passwords are hashed using **bcrypt** with 10 salt rounds
- Plain text passwords are never stored in the database

### JWT Token

- Default expiration: **7 days** (configured in `.env` as `JWT_EXPIRATION`)
- Secret key configured in `.env` as `JWT_SECRET`
- Change the secret key in production!

### Rate Limiting

While not implemented in the current version, consider adding rate limiting to prevent brute force attacks:

- Limit login attempts per IP
- Add account lockout after failed attempts

---

## Example Usage

### Complete Login Flow (JavaScript/TypeScript)

```typescript
// 1. Login
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123',
  }),
});

const loginData = await loginResponse.json();

if (loginData.success) {
  // 2. Store token
  localStorage.setItem('token', loginData.data.access_token);
  localStorage.setItem('admin', JSON.stringify(loginData.data.admin));

  // 3. Make authenticated request
  const meResponse = await fetch('http://localhost:3001/api/auth/me', {
    headers: {
      Authorization: `Bearer ${loginData.data.access_token}`,
    },
  });

  const meData = await meResponse.json();
  console.log('Current admin:', meData.data);
}
```

### Logout (Client-Side)

```typescript
// Clear stored authentication data
localStorage.removeItem('token');
localStorage.removeItem('admin');

// Redirect to login page
window.location.href = '/login';
```

---

## Default Admin Credentials

After running the seeder (`yarn seed`), you can login with:

- **Email:** `admin@example.com`
- **Password:** `Admin@123`

**⚠️ Important:** Change these credentials in production!

---

## JWT Token Structure

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload

```json
{
  "sub": 1, // Admin ID
  "email": "admin@example.com",
  "iat": 1640000000, // Issued at
  "exp": 1640604800 // Expires at
}
```

### Signature

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```

---

## Troubleshooting

### "Invalid credentials" Error

- Verify email and password are correct
- Check if admin exists in database
- Ensure password was not changed manually in database (must be bcrypt hashed)

### "Unauthorized" Error

- Check if token is included in Authorization header
- Verify token format: `Bearer {token}`
- Check if token has expired
- Ensure JWT_SECRET matches between token generation and validation

### "Admin not found" Error

- Admin may have been deleted from database
- Token might be for a non-existent admin
- Re-login to get a new token

---

[Back to API Documentation](../README.md)
