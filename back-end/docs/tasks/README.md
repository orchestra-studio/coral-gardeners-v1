# Tasks API Documentation

API reference for personal task/todo management.

## Base URL

```
http://localhost:3001/api/tasks
```

## Authentication

Requires JWT authentication. Tasks are personal to each authenticated admin.

## Key Endpoints

### 1. Get All Tasks

```
GET /api/tasks
```

Returns paginated list of tasks for the authenticated admin.

**Query Parameters:** `page` (default: 1), `page_count` (default: 10), `status` ('active', 'completed', or 'all' - default: 'all')

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "text": "Complete project documentation",
      "completed": false,
      "adminId": 1,
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3,
  "message": ""
}
```

---

### 2. Get Tasks History

```
GET /api/tasks/history
```

Returns all tasks (active and completed) grouped by status.

**Response:**

```json
{
  "success": true,
  "data": {
    "active": [
      {
        "id": 1,
        "text": "Complete project documentation",
        "completed": false,
        "adminId": 1,
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z"
      }
    ],
    "completed": [
      {
        "id": 2,
        "text": "Review pull request",
        "completed": true,
        "adminId": 1,
        "createdAt": "2024-01-01T09:00:00.000Z",
        "updatedAt": "2024-01-01T09:30:00.000Z"
      }
    ],
    "total": 2
  },
  "message": ""
}
```

---

### 3. Get Task Statistics

```
GET /api/tasks/stats
```

Returns task completion statistics.

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 7,
    "active": 3,
    "completionRate": 70
  },
  "message": ""
}
```

---

### 4. Get Task by ID

```
GET /api/tasks/:id
```

Returns a single task by ID (must belong to authenticated admin).

---

### 5. Create Task

```
POST /api/tasks
```

**Request Body:**

```json
{
  "text": "Complete project documentation",
  "completed": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "text": "Complete project documentation",
    "completed": false,
    "adminId": 1,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

---

### 6. Update Task

```
PATCH /api/tasks/:id
```

**Request Body:** (all optional)

```json
{
  "text": "Updated task description",
  "completed": true
}
```

---

### 7. Toggle Task Completion

```
PATCH /api/tasks/:id/toggle
```

Toggles the completion status of a task.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "text": "Complete project documentation",
    "completed": true,
    "adminId": 1,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:30:00.000Z"
  },
  "message": "Task status toggled successfully"
}
```

---

### 8. Delete Task

```
DELETE /api/tasks/:id
```

Deletes a task (must belong to authenticated admin).

---

## Task Structure

Tasks are simple todo items with the following fields:

- `id`: Unique identifier
- `text`: Task description (max 255 characters)
- `completed`: Boolean completion status
- `adminId`: ID of the admin who owns the task
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Notes

- Tasks are personal and isolated per admin user
- Each admin can only access their own tasks
- Tasks support basic CRUD operations plus completion toggling
- Statistics provide completion rates and counts

---

[Back to API Documentation](../README.md)
