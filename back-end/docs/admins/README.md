# Admin Management API Documentation

API reference for managing admin users and roles.

## Base URL

```
http://localhost:3001/api/admins
```

## Authentication

All endpoints require JWT authentication and appropriate permissions.

## Permissions

- `admins.view` - View admins
- `admins.create` - Create admins
- `admins.edit` - Update admins
- `admins.delete` - Delete admins
- `admins.assign_roles` - Assign/remove roles

## Key Endpoints

### 1. Get All Admins

```
GET /api/admins
```

Returns paginated list of admin users.

**Query Parameters:** `page`, `page_count`, `email`, `name`, `phone`

---

### 2. Get Admin Statistics

```
GET /api/admins/statistics
```

Returns total admins, active, deleted, etc.

---

### 3. Create Admin

```
POST /api/admins
```

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Admin",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+1234567890",
  "profile_picture": "https://...",
  "country_id": 1
}
```

---

### 4. Get Admin by ID

```
GET /api/admins/:id
```

Returns a single admin by ID or username.

---

### 5. Update Admin

```
PATCH /api/admins/:id
```

**Request Body:** (all optional)

```json
{
  "first_name": "Updated First Name",
  "last_name": "Updated Last Name",
  "email": "newemail@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123",
  "phone": "+0987654321",
  "profile_picture": "https://...",
  "country_id": 2
}
```

---

### 6. Update Admin Roles

```
PATCH /api/admins/:id/roles
```

**Request Body:**

```json
{
  "role_ids": [1, 2, 3]
}
```

---

### 7. Delete Admin

```
DELETE /api/admins/:id
```

Soft deletes an admin user.

---

### 8. Update Current Admin Profile

```
PATCH /api/admins/profile
```

**Request Body:** (all optional, same as update admin but without password)

```json
{
  "first_name": "Updated First Name",
  "last_name": "Updated Last Name",
  "email": "newemail@example.com",
  "phone": "+0987654321",
  "profile_picture": "https://...",
  "country_id": 2
}
```

---

### 9. Change Current Admin Password

```
PATCH /api/admins/profile/password
```

**Request Body:**

```json
{
  "current_password": "oldpassword123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

---

## Notes

- Admins can have multiple roles
- Permissions are inherited from all assigned roles
- Password changes can be done via update endpoint or dedicated password endpoint
- Soft delete is used for admin deletion

---

[Back to API Documentation](../README.md)
