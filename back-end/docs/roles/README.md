# Roles & Permissions API Documentation

API reference for managing roles and permissions.

## Base URL

```
http://localhost:3001/api/roles
```

## Authentication

Requires JWT + appropriate permissions.

## Permissions

- `roles.view` - View roles and permissions
- `roles.create` - Create new roles
- `roles.edit` - Update roles
- `roles.delete` - Delete roles
- `roles.assign_permissions` - Assign/remove permissions

## Key Endpoints

### 1. Get All Roles

```
GET /api/roles
```

Returns list of all roles with optional pagination and filters.

**Query Parameters:** `page`, `page_count`, `name`, `guard_name`, `created_from`, `created_to`

---

### 2. Get Roles Statistics

```
GET /api/roles/statistics
```

Returns statistics about roles.

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 5,
    "withAdmins": 3,
    "withoutAdmins": 2,
    "recentlyAdded": 1,
    "recentlyUpdated": 0
  },
  "message": ""
}
```

---

### 3. Get Roles for Select

```
GET /api/roles/select
```

Returns roles formatted for dropdown selection.

**Response:**

```json
{
  "success": true,
  "data": [
    { "value": 1, "label": "Super Admin" },
    { "value": 2, "label": "Viewer" }
  ],
  "message": ""
}
```

---

### 4. Get All Permissions

```
GET /api/roles/permissions
```

Returns all available permissions grouped by module.

**Response:**

```json
{
  "success": true,
  "data": {
    "admins": [
      {
        "name": "admins.view",
        "display_name": { "en": "View Admins", "ar": "عرض المدراء" },
        "description": { "en": "View admins list and details", "ar": "عرض قائمة وتفاصيل المدراء" }
      }
    ],
    "roles": [
      {
        "name": "roles.create",
        "display_name": { "en": "Create Roles", "ar": "إنشاء الأدوار" },
        "description": { "en": "Create new roles", "ar": "إنشاء أدوار جديدة" }
      }
    ]
  }
}
```

---

### 5. Create Role

```
POST /api/roles
```

**Request Body:**

```json
{
  "name": "Content Manager"
}
```

---

### 6. Get Role by ID

```
GET /api/roles/:id
```

Returns a single role with its permissions and user count.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Super Admin",
    "guard_name": "web",
    "description": null,
    "admin_id": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "permissions": ["admins.view", "admins.create", "roles.manage"],
    "users_count": 2
  },
  "message": ""
}
```

---

### 7. Update Role

```
PUT /api/roles/:id
```

**Request Body:**

```json
{
  "name": "Updated Role Name"
}
```

---

### 8. Update Role Permissions

```
POST /api/roles/:id/permissions
```

**Request Body:**

```json
{
  "permissions": ["admins.view", "users.create", "roles.view"]
}
```

---

### 9. Delete Role

```
DELETE /api/roles/:id
```

Permanently deletes a role (cannot delete if assigned to admins).

---

## Permission Naming Convention

Permissions follow this pattern:

```
{module}.{action}

Examples:
- admins.view
- admins.create
- admins.edit
- admins.delete
- roles.view
- roles.create
- roles.edit
- roles.delete
- roles.assign_permissions
- projects.view
- projects.create
- projects.edit
- projects.delete
- projects.restore
```

## Notes

- Roles can have multiple permissions
- Admins can have multiple roles
- Permissions are checked using the `@Permissions()` decorator
- Roles cannot be deleted if they are assigned to any admins
- Permission updates trigger real-time notifications to affected admins

---

[Back to API Documentation](../README.md)
