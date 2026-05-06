# NullTicket

A ticketing platform for exclusive cultural events. Monorepo with a Next.js frontend, Express backend, and shared types package.

| Layer           | Technology                                          |
| --------------- | --------------------------------------------------- |
| Frontend        | Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 |
| Backend         | Express · TypeScript · TypeORM                      |
| Database        | SQLite (`better-sqlite3`) with TypeORM synchronize  |
| Auth            | JWT · bcryptjs                                      |
| AI / Concierge  | Google Gemini API (`gemini-3.1-flash-lite`)         |
| Package manager | pnpm workspaces                                     |
| Tooling         | ESLint · Prettier · Husky · Vitest                  |

---

## Repository Structure

```
nullticket/
├── back/                        # Express API + TypeORM
│   ├── seed/                    # Scripts and CSVs to seed the database
│   └── src/
│       ├── controllers/         # HTTP handlers per resource
│       ├── middleware/          # authMiddleware (JWT)
│       ├── models/              # TypeORM entities: User, Event, Ticket
│       ├── repositories/        # Data access layer
│       ├── services/            # Business logic
│       ├── dataSource.ts        # TypeORM + SQLite configuration
│       └── index.ts             # Entry point and Express routes
├── front/                       # Next.js app (App Router)
│   └── src/
│       ├── actions/             # Server Actions (auth)
│       ├── app/
│       │   ├── (auth)/          # login, register
│       │   ├── (dashboard)/     # discover, concierge, history
│       │   ├── (marketing)/     # public landing page
│       │   └── api/             # Route Handlers: /concierge, /events
│       ├── components/          # Reusable React components
│       ├── context/             # AuthContext
│       └── lib/                 # Helpers: events.ts, session.ts
└── packages/
    └── types/                   # Shared TypeScript types (front ↔ back)
```

---

## Installation

> **Note:** `better-sqlite3` requires compiling native bindings. Follow these steps in order.

```bash
pnpm install
pnpm approve-builds   # select better-sqlite3 and confirm
pnpm install          # run again to compile the native bindings
```

---

## Environment Variables

### Backend — `back/.env`

```env
PORT=3001
JWT_SECRET=your_secret_here
```

### Frontend — `front/.env.local`

```env
API_URL=http://localhost:3001
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Commands

### Development

```bash
pnpm dev:web      # Next.js frontend
pnpm dev:api      # Express backend with tsx watch
```

### Build & Production

```bash
pnpm build:web    # build the frontend
pnpm build:api    # compile shared types + API
pnpm start:web    # start the compiled frontend
pnpm start:api    # start the compiled API
```

### Database

```bash
cd back && pnpm seed   # seed the database with sample data
```

### Code Quality

```bash
pnpm lint           # run ESLint across all packages
pnpm lint:fix       # auto-fix ESLint errors
pnpm format         # format everything with Prettier
pnpm format:check   # check formatting without writing changes
```

---

## REST API

Base URL: `http://localhost:3001`

| Method | Route         | Auth | Description                                             |
| ------ | ------------- | ---- | ------------------------------------------------------- |
| `GET`  | `/`           | No   | Health check                                            |
| `POST` | `/register`   | No   | Register a user. Body: `{ name, email, password }`      |
| `POST` | `/login`      | No   | Login. Body: `{ email, password }`. Returns a JWT token |
| `GET`  | `/events`     | No   | List all events                                         |
| `GET`  | `/events/:id` | No   | Get a single event by ID                                |
| `GET`  | `/me/tickets` | Yes  | Get the authenticated user's tickets                    |

Protected routes require the following header:

```
Authorization: Bearer <jwt_token>
```

### Auth Responses

Successful login and register return:

```json
{ "token": "string", "user": { "id": 1, "name": "string", "email": "string" } }
```

Login errors include an `errorNumber`:

```
0 → Ok
1 → PasswordError (wrong password)
2 → UserNotFound (user does not exist)
```

---

## Data Models

### User

| Field      | Type     | Description                  |
| ---------- | -------- | ---------------------------- |
| `id`       | `number` | Auto-incremented primary key |
| `name`     | `string` | User's name                  |
| `email`    | `string` | Email (used for login)       |
| `password` | `string` | bcrypt hash                  |

`SafeUser` is `User` without the `password` field — used in API responses and the JWT payload.

### Event

| Field              | Type            | Description                                      |
| ------------------ | --------------- | ------------------------------------------------ |
| `id`               | `number`        | Auto-incremented primary key                     |
| `name`             | `string`        | Event name                                       |
| `location`         | `string`        | Venue                                            |
| `date`             | `string`        | ISO 8601 date/time                               |
| `image`            | `string?`       | Image URL                                        |
| `availableTickets` | `number`        | Remaining tickets                                |
| `sectors`          | `EventSector[]` | JSON array with sector name, capacity, and price |

Available sector names: `"vip"` · `"campo"` · `"platea"` · `"general"`

### Ticket

| Field         | Type                                | Description                  |
| ------------- | ----------------------------------- | ---------------------------- |
| `id`          | `number`                            | Auto-incremented primary key |
| `eventId`     | `number`                            | FK to event                  |
| `eventName`   | `string`                            | Event name (denormalized)    |
| `eventDate`   | `string`                            | Event date (denormalized)    |
| `sector`      | `EventSectorName`                   | Ticket sector                |
| `price`       | `number`                            | Price paid                   |
| `status`      | `"active" \| "used" \| "cancelled"` | Ticket status                |
| `userId`      | `number`                            | FK to user                   |
| `purchasedAt` | `string`                            | Purchase date ISO 8601       |

---

## Frontend — Pages

| Route        | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| `/`          | Public landing page                                                    |
| `/login`     | Login form                                                             |
| `/register`  | Registration form                                                      |
| `/discover`  | Events catalog (falls back to mock data if the backend is unavailable) |
| `/concierge` | AI assistant chat                                                      |
| `/history`   | Authenticated user's ticket history                                    |

### Client-side Authentication

- `loginAction` / `registerAction` — Server Actions that call the backend and store the JWT in an `httpOnly` cookie with a 7-day expiration.
- `logoutAction` — deletes the cookie and redirects to `/login`.
- `AuthContext` — exposes `user`, `isLoading`, `login`, `register`, and `logout` to all client components.
- `getUserFromCookie()` — decodes the JWT payload server-side to hydrate the initial auth state. Actual verification happens on the backend with every API call.

---

## AI Concierge

The Concierge is a conversational assistant powered by Google Gemini. It helps users discover events based on their interests and mood.

- Responds in a warm, editorial tone.
- Concise responses: 300 words maximum.
- Only recommends events from the available catalog — never invents events.
- The full conversation history is sent with each request (stateless architecture).
- Prices are only mentioned if the user explicitly asks.

---

## Tests

Backend unit tests use Vitest and live in `back/src/__tests__/`. To run them:

```bash
cd back && pnpm test
```

---

## CI / CD

GitHub Actions runs on every push (`.github/workflows/ci.yml`). Husky enforces lint and `format:check` before every commit via a pre-commit hook.
