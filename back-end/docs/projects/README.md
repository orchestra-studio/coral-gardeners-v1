# Projects API Documentation

API reference for project management.

## Base URL

```
http://localhost:3001/api/projects
```

## Permissions

- `projects.view` - View projects
- `projects.create` - Create projects
- `projects.edit` - Update projects
- `projects.delete` - Delete projects
- `projects.restore` - Restore deleted projects

## Key Endpoints

### 1. Get All Projects

```
GET /api/projects
```

Returns paginated list with filters.

**Query Parameters:** `page`, `page_count`, `name`, `status`, `environment`

---

### 2. Get Project Statistics

```
GET /api/projects/statistic
```

Returns total, deleted, by status counts.

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 10,
    "deleted": 2,
    "inProgress": 5,
    "ready": 3,
    "blocked": 0
  },
  "message": ""
}
```

---

### 3. Get Deleted Projects

```
GET /api/projects/deleted
```

Returns paginated list of soft-deleted projects.

**Query Parameters:** `page`, `page_count`, `name`

---

### 4. Get Recent Projects

```
GET /api/projects/recent
```

Returns recent projects for dashboard display.

**Query Parameters:** `limit` (default: 5)

---

### 5. Get Project by ID

```
GET /api/projects/:id
```

Returns a single project by ID.

---

### 6. Create Project

```
POST /api/projects
```

**Request Body:**

```json
{
  "translations": {
    "en": {
      "name": "My Project",
      "description": "Project description",
      "environment": "production"
    },
    "ar": {
      "name": "مشروعي",
      "description": "وصف المشروع",
      "environment": "إنتاج"
    }
  },
  "status": "in-progress",
  "version": "1.0.0",
  "image": "https://...",
  "icon_name": "IconCode"
}
```

---

### 7. Update Project

```
PATCH /api/projects/:id
```

**Request Body:** (all optional)

```json
{
  "translations": {
    "en": {
      "name": "Updated Project Name",
      "description": "Updated description",
      "environment": "staging"
    }
  },
  "status": "ready",
  "version": "1.1.0",
  "image": "https://...",
  "icon_name": "IconRocket"
}
```

---

### 8. Delete Project

```
DELETE /api/projects/:id
```

Soft deletes a project.

---

### 9. Restore Project

```
POST /api/projects/deleted/:id/restore
```

Restores a soft-deleted project.

---

## Project Status Values

- `in-progress` - Active development
- `ready` - Completed and ready
- `blocked` - Blocked/paused

## Project Structure

Projects support multilingual content through a `translations` object containing English (`en`) and Arabic (`ar`) versions. Each translation includes:

- `name`: Project name
- `description`: Project description
- `environment`: Environment name (e.g., "production", "staging", "development")

---

[Back to API Documentation](../README.md)
