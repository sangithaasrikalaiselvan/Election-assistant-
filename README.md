# Election Assistant

A production-ready, full-stack Election Assistant that explains election steps, timelines, and FAQs through an interactive chat experience. The app uses a modular React frontend and a secure Express backend with Google Dialogflow ES for intent recognition and Google Cloud Translate for multilingual responses.

## Features

- Interactive chat assistant with Dialogflow ES intent detection and fallback keywords
- Step-by-step election guide with progress indicator and icons
- Visual timeline with phase status (upcoming, active, completed)
- FAQ section with searchable accordion (10+ questions)
- Multilingual support (English, Hindi, Spanish, French) with persisted preference
- Caching for repeated queries, rate limiting, and security headers
- Unit and integration tests with coverage thresholds
- Dockerized frontend (nginx) and backend (Node.js)

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Google Services: Dialogflow ES, Cloud Translate API
- Testing: Jest, Supertest, Vitest, React Testing Library

## Prerequisites

- Node.js 20+
- Docker (optional)
- Google Cloud account with Dialogflow ES and Cloud Translate enabled

## Local Development

### Backend

1. Create a `.env` file using [backend/.env.example](backend/.env.example).
2. Install dependencies:

```
cd backend
npm install
```

3. Run the API:

```
npm run dev
```

### Frontend

1. Create a `.env` file using [frontend/.env.example](frontend/.env.example).
2. Install dependencies:

```
cd frontend
npm install
```

3. Run the UI:

```
npm run dev
```

The frontend runs on `http://localhost:5173` and connects to `http://localhost:8080` by default.

## Environment Variables

Backend:

- `PORT`
- `ALLOWED_ORIGINS`
- `CACHE_TTL_MS`
- `GOOGLE_TRANSLATE_API_KEY`
- `GOOGLE_TRANSLATE_ENDPOINT`
- `DIALOGFLOW_PROJECT_ID`
- `DIALOGFLOW_CLIENT_EMAIL`
- `DIALOGFLOW_PRIVATE_KEY`
- `DIALOGFLOW_LANGUAGE_CODE`
- `DIALOGFLOW_SESSION_ID`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `LOG_LEVEL`

Frontend:

- `VITE_API_URL`

## Google Services Setup

### Gemini API

1. Create an API key in Google AI Studio.
2. Set environment variables:

```
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
```

### Dialogflow ES

1. Create a Dialogflow ES agent in your Google Cloud project.
2. Create a service account and download the JSON credentials.
3. Set environment variables:

```
DIALOGFLOW_PROJECT_ID=your-project-id
DIALOGFLOW_CLIENT_EMAIL=service-account-email
DIALOGFLOW_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Cloud Translate API

1. Enable the Cloud Translate API in Google Cloud.
2. Create an API key and set `GOOGLE_TRANSLATE_API_KEY`.

If keys are missing, the backend uses safe fallback responses.

## Docker

1. Copy [.env.example](.env.example) to `.env` at the repo root.
2. Run:

```
docker-compose up --build
```

- Frontend: `http://localhost:8081`
- Backend: `http://localhost:8080`

## API Endpoints

- `POST /api/chat` - Chat assistant
- `GET /api/guide` - Election guide steps
- `GET /api/timeline` - Election timeline
- `GET /api/faq` - FAQ list
- `POST /api/translate` - Translate text

## API Response Format

All JSON endpoints follow the same response shape:

```
{
	"success": true,
	"data": {},
	"message": "Fetched successfully"
}
```

For errors:

```
{
	"success": false,
	"message": "Validation failed"
}
```

## Step-by-step Response Logic

1. Detect intent using Dialogflow ES (if configured).
2. Fallback to keyword intent matching when Dialogflow is unavailable.
3. Return structured answers for FAQs, timeline, and guide steps.
4. If intent is general, use the LLM response when available.
5. Always return the next-step prompt to keep the flow moving.

## Structured LLM Prompting

The system prompt requires a fixed response format with:

- Direct Answer
- Simple Explanation
- Step-by-Step Breakdown
- Next Step Guidance

This ensures consistent, teachable responses and keeps the assistant neutral.

## User Flow

1. User visits the homepage and selects a language.
2. The app loads guide steps and FAQs from the API.
3. The user asks a question in the chat panel.
4. The backend resolves intent, builds a structured answer, and responds.
5. The UI presents the response and suggests the next step in the flow.

## Testing

Backend:

```
cd backend
npm test
```

Frontend:

```
cd frontend
npm test
```

## Folder Structure

- backend/: Express API, services, data, and tests
- frontend/: React app, components, hooks, and tests
- docker-compose.yml: Container orchestration

## Notes

- All Google service calls are abstracted in service modules.
- Logging uses Winston (no console logs in production code).
