# Session Booking API

REST API where users can book sessions with teachers. Teachers have available sessions, users book them, and completed sessions show up in the user's history.

**Tech stack:** Node.js, TypeScript, Express.js, MongoDB, Mongoose (validation with Zod)

## Prerequisites

- Node.js 18 or higher
- A MongoDB database (local MongoDB or a free MongoDB Atlas cluster)

## Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file from the example and fill in your values:
   ```bash
   cp .env.example .env
   ```
3. Seed a few teachers (there is no Create Teacher API in the assignment, so teachers are inserted by this script, which prints their IDs):
   ```bash
   npm run seed
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
5. For production:
   ```bash
   npm run build
   npm start
   ```

## Environment variables

| Variable    | Description                          | Example                        |
|-------------|--------------------------------------|--------------------------------|
| PORT        | Port the server listens on           | 5000                           |
| MONGO_URI   | MongoDB connection string            | mongodb+srv://user:pass@host/db |
| NODE_ENV    | Environment name                     | development                    |

## API endpoints

| Method | Endpoint                          | Description                                              |
|--------|-----------------------------------|----------------------------------------------------------|
| POST   | /users                            | Create a user (email must be unique)                     |
| POST   | /sessions                         | Create a session for a teacher (status defaults to AVAILABLE) |
| GET    | /sessions/available?dateTimestamp | AVAILABLE sessions for the given date (aggregation)      |
| POST   | /sessions/:id/book                | Book a session. Body: `{ "userId": "..." }`              |
| PATCH  | /sessions/:id/complete            | Mark a BOOKED session as COMPLETED                       |
| GET    | /users/:id/sessions               | Upcoming and completed sessions of a user (aggregation)  |

## Design notes

- **Date handling:** `dateTimestamp` is a Unix timestamp in **milliseconds**. The day is calculated in **UTC** (00:00:00 to 23:59:59.999 UTC).
- **Booking and completing are atomic:** the status check and the update happen in a single `findOneAndUpdate`, so two users cannot book the same session at the same time.
- **Aggregation pipelines** are used for `GET /sessions/available` ($match, $sort, $lookup, $unwind, $project) and `GET /users/:id/sessions` ($match, $lookup, $unwind, $project, $facet).
- **Error handling:** services throw `AppError`; one central middleware converts AppError, Zod, Mongoose validation, cast and duplicate-key errors into a consistent JSON response.
- **Status codes:** 200, 201, 400 (validation), 404 (not found), 409 (conflict such as duplicate email or already booked), 500.

## Response format

```json
{ "success": true, "data": {} }
```

Errors:

```json
{ "success": false, "message": "Reason" }
```

## Testing

Import `session-booking.postman_collection.json` into Postman. Set the `teacherId` collection variable using an ID printed by `npm run seed`, then run the requests in order. IDs are saved automatically between requests.
