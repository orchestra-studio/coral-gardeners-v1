# AI Chat API Documentation

API reference for AI assistant streaming chat functionality.

## Base URL

```
http://localhost:3001/api/ai-chat
```

## Authentication

All endpoints require JWT authentication.

## Permissions

- `ai_chat.use` - Use AI chat streaming
- `ai_chat.view_models` - View available AI models

## Key Endpoints

### 1. Get Available AI Models

```
GET /api/ai-chat/models
```

Returns list of available AI models.

**Response:**

```json
{
  "success": true,
  "data": {
    "models": [
      {
        "id": "gemini-3-flash-preview",
        "name": "Gemini 3 Flash",
        "provider": "google",
        "contextWindow": 1000000,
        "maxTokens": 8192,
        "description": "Gemini 3 Flash - Best for agentic use cases, tool calling, and function execution with thinking capabilities - ideal for MCP integration"
      },
      {
        "id": "deepseek-chat",
        "name": "DeepSeek Chat",
        "provider": "deepseek",
        "contextWindow": 64000,
        "maxTokens": 4096,
        "description": "DeepSeek conversational model"
      }
    ]
  }
}
```

---

### 2. Stream Chat Message

```
POST /api/ai-chat/stream
```

Streams AI chat responses using Server-Sent Events (SSE).

**Request Body:**

```json
{
  "model": "gemini-3-flash-preview",
  "provider": "google",
  "messages": [
    {
      "role": "user",
      "content": "What is TypeScript?",
      "blocks": []
    }
  ],
  "history": [],
  "sessionId": 123
}
```

**Response:** Server-Sent Events stream with response chunks.

**SSE Event Format:**

```
data: {"content": "TypeScript is a..."}

data: {"tool_call": {...}}

data: {"tool_result": {...}}

data: {"reasoning": "..."}
```

---

## Supported AI Providers

### Google (Gemini)

- Model: `gemini-3-flash-preview`
- Config: `GOOGLE_API_KEY` in `.env`

### DeepSeek

- Model: `deepseek-chat`
- Config: `DEEPSEEK_API_KEY` in `.env`

---

## Features

- **Streaming Responses**: Real-time AI responses via SSE
- **Tool Integration**: MCP (Model Context Protocol) tool calling
- **Multi-Provider Support**: Google Gemini and DeepSeek
- **Context Awareness**: System prompts with tool documentation
- **Reasoning Support**: Streaming reasoning deltas

---

## Notes

- Chat sessions and message history are managed through the separate `/api/chat-sessions` endpoints
- The AI chat service integrates with MCP tools for enhanced functionality
- Responses include text content, tool calls, tool results, and reasoning steps

---

[Back to API Documentation](../README.md)
