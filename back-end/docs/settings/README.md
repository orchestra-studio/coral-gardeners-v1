# Settings API Documentation

API reference for application settings management.

## Base URL

```
http://localhost:3001/api/settings
```

## Permissions

- `settings.view` - View settings
- `settings.edit` - Update and delete settings

## Key Endpoints

### 1. Get All Settings

```
GET /api/settings
```

Returns paginated list of application settings with optional filters.

**Query Parameters:** `page`, `page_count`, `search`, `category`

**Response:**

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "key": "site_name",
        "value": "Admin Dashboard",
        "display_name": { "en": "Site Name", "ar": "اسم الموقع" },
        "description": { "en": "The name of the site", "ar": "اسم الموقع" },
        "type": "text",
        "category": "general",
        "admin_id": null,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "message": "Settings retrieved successfully"
}
```

---

### 2. Get Setting by Key

```
GET /api/settings/:key
```

Returns a single setting by its key.

**Example:**

```
GET /api/settings/site_name
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "site_name",
    "value": "Admin Dashboard",
    "display_name": { "en": "Site Name", "ar": "اسم الموقع" },
    "description": { "en": "The name of the site", "ar": "اسم الموقع" },
    "type": "text",
    "category": "general",
    "admin_id": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Setting retrieved successfully"
}
```

---

### 3. Update Setting

```
PATCH /api/settings/:key
```

**Request Body:**

```json
{
  "value": "New Value"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "site_name",
    "value": "New Value",
    "display_name": { "en": "Site Name", "ar": "اسم الموقع" },
    "description": { "en": "The name of the site", "ar": "اسم الموقع" },
    "type": "text",
    "category": "general",
    "admin_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  },
  "message": "Setting updated successfully"
}
```

---

### 4. Delete Setting

```
DELETE /api/settings/:key
```

Deletes a setting by its key.

**Response:**

```json
{
  "success": true,
  "data": null,
  "message": "Setting deleted successfully"
}
```

---

## Setting Categories

Settings can be categorized for better organization. Common categories include:

- `general` - General application settings
- `system` - System configuration
- `email` - Email settings
- `security` - Security settings
- `appearance` - UI/Theme settings

## Setting Types

- `text` - Text/string value
- `number` - Numeric value
- `boolean` - True/false value
- `json` - JSON object value

## Multilingual Support

Settings support multilingual display names and descriptions:

```json
{
  "display_name": {
    "en": "Site Name",
    "ar": "اسم الموقع"
  },
  "description": {
    "en": "The name of the site",
    "ar": "اسم الموقع"
  }
}
```

---

[Back to API Documentation](../README.md)
