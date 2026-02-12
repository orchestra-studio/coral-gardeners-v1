# Users API Documentation

Complete API reference for user management endpoints.

## Base URL

```
http://localhost:3001/api/users
```

## Authentication

All endpoints require JWT authentication:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Permissions

- `users.view` - View users
- `users.create` - Create users
- `users.update` - Update users
- `users.delete` - Delete users
- `users.restore` - Restore deleted users
- `users.verify` - Verify/unverify user emails

## Endpoints

### 1. Get All Users

Get paginated list of users with optional filters.

**Endpoint:** `GET /api/users`

**Permission:** `users.view`

**Query Parameters:**

| Parameter  | Type   | Default | Description                     |
| ---------- | ------ | ------- | ------------------------------- |
| page       | number | 1       | Page number                     |
| page_count | number | 15      | Items per page                  |
| order      | string | desc    | Sort order (asc/desc)           |
| search     | string | -       | Search in name, email, username |
| email      | string | -       | Filter by email                 |
| phone      | string | -       | Filter by phone                 |
| country_id | number | -       | Filter by country               |
| username   | string | -       | Filter by username              |
| first_name | string | -       | Filter by first name            |
| last_name  | string | -       | Filter by last name             |
| from_date  | string | -       | Filter from date (YYYY-MM-DD)   |
| to_date    | string | -       | Filter to date (YYYY-MM-DD)     |

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users?page=1&page_count=10&search=john"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "username": "john_doe",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "profile_picture": null,
        "country_id": 1,
        "email_verified_at": "2024-01-01T00:00:00.000Z",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "country": {
          "id": 1,
          "name": "United States",
          "code": "US"
        }
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "message": ""
}
```

---

### 2. Get Deleted Users

Get paginated list of soft-deleted users.

**Endpoint:** `GET /api/users/deleted`

**Permission:** `users.view`

**Query Parameters:** Same as Get All Users

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users/deleted?page=1"
```

---

### 3. Get Users Statistics

Get user statistics (total, verified, etc.).

**Endpoint:** `GET /api/users/statistic`

**Permission:** `users.view`

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users/statistic"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 100,
    "verified": 85,
    "unverified": 15,
    "deleted": 5
  },
  "message": ""
}
```

---

### 4. Get User by Username

Get detailed information about a specific user.

**Endpoint:** `GET /api/users/:username`

**Permission:** `users.view`

**URL Parameters:**

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| username  | string | User's username |

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users/john_doe"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profile_picture": "https://...",
    "country_id": 1,
    "email_verified_at": "2024-01-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "country": {
      "id": 1,
      "name": "United States",
      "code": "US"
    }
  },
  "message": ""
}
```

---

### 5. Create User

Create a new user.

**Endpoint:** `POST /api/users`

**Permission:** `users.create`

**Request Body:**

| Field           | Type   | Required | Description                    |
| --------------- | ------ | -------- | ------------------------------ |
| username        | string | No       | Auto-generated if not provided |
| first_name      | string | Yes      | First name                     |
| last_name       | string | Yes      | Last name                      |
| email           | string | Yes      | Email address (unique)         |
| password        | string | Yes      | Password (min 6 characters)    |
| phone           | string | No       | Phone number                   |
| profile_picture | string | No       | Profile picture URL            |
| country_id      | number | No       | Country ID                     |

**Example Request:**

```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "country_id": 1
  }' \
  "http://localhost:3001/api/users"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "username": "john_doe_abc123",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "country_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

---

### 6. Update User

Update an existing user.

**Endpoint:** `PATCH /api/users/:username`

**Permission:** `users.update`

**URL Parameters:**

| Parameter | Type   | Description     |
| --------- | ------ | --------------- |
| username  | string | User's username |

**Request Body:** (All fields optional)

| Field           | Type   | Description         |
| --------------- | ------ | ------------------- |
| first_name      | string | First name          |
| last_name       | string | Last name           |
| email           | string | Email address       |
| phone           | string | Phone number        |
| profile_picture | string | Profile picture URL |
| country_id      | number | Country ID          |

**Example Request:**

```bash
curl -X PATCH -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "phone": "+0987654321"
  }' \
  "http://localhost:3001/api/users/john_doe"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+0987654321",
    "updated_at": "2024-01-02T00:00:00.000Z"
  },
  "message": "User updated successfully"
}
```

---

### 7. Change User Password

Change a user's password.

**Endpoint:** `PATCH /api/users/:username/change-password`

**Permission:** `users.update`

**Request Body:**

| Field        | Type   | Required | Description                     |
| ------------ | ------ | -------- | ------------------------------- |
| new_password | string | Yes      | New password (min 6 characters) |

**Example Request:**

```bash
curl -X PATCH -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "new_password": "newpassword123"
  }' \
  "http://localhost:3001/api/users/john_doe/change-password"
```

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Password changed successfully"
}
```

---

### 8. Mark Email as Verified

Mark a user's email as verified.

**Endpoint:** `POST /api/users/:username/make-verified`

**Permission:** `users.verify`

**Example Request:**

```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users/john_doe/make-verified"
```

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Email verified successfully"
}
```

---

### 9. Mark Email as Unverified

Mark a user's email as unverified.

**Endpoint:** `POST /api/users/:username/make-unverified`

**Permission:** `users.verify`

**Example Request:**

```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users/john_doe/make-unverified"
```

---

### 10. Delete User

Soft delete a user.

**Endpoint:** `DELETE /api/users/:username`

**Permission:** `users.delete`

**Example Request:**

```bash
curl -X DELETE -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users/john_doe"
```

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "User deleted successfully"
}
```

---

### 11. Restore Deleted User

Restore a soft-deleted user.

**Endpoint:** `POST /api/users/deleted/:username/restore`

**Permission:** `users.restore`

**Example Request:**

```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users/deleted/john_doe/restore"
```

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "User restored successfully"
}
```

---

### 12. Get Deleted User

Get details of a deleted user.

**Endpoint:** `GET /api/users/deleted/:username`

**Permission:** `users.view`

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users/deleted/john_doe"
```

---

### 13. Resend Verification Email

Resend email verification (placeholder - actual email sending not implemented).

**Endpoint:** `POST /api/users/:username/resend-verification-email`

**Permission:** `users.update`

**Example Request:**

```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/users/john_doe/resend-verification-email"
```

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation failed",
  "error": ["email must be a valid email"]
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Invalid or missing authentication token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Forbidden",
  "error": "You need one of these permissions: users.create"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "User not found",
  "error": "User with username 'john_doe' not found"
}
```

### 409 Conflict

```json
{
  "success": false,
  "message": "Email already exists",
  "error": "A user with this email already exists"
}
```

---

## Notes

- All dates are in ISO 8601 format
- Passwords are hashed using bcrypt
- Username is auto-generated from first name, last name, and random string if not provided
- Soft deletes are used - deleted users can be restored
- The `admin_id` field tracks which admin created the user

---

[Back to API Documentation](../README.md)
