# FlowDesk — Personal Daily Planner

A full-stack implementation of the FlowDesk SRS: a daily to-do list + daily timetable planner with auth, date navigation, history, search, light/dark theme, and a glassmorphism "premium UI".

Stack (matches SRS section 7 exactly):
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Router, Zustand
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT + bcrypt

## Project structure

```
flowdesk/
  backend/        Express API (auth, tasks, timetable, profile)
  frontend/       React + Vite client
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI to your MongoDB connection string
#            set JWT_SECRET to a long random string
npm run dev      # starts on http://localhost:5000
```

You need a MongoDB instance — either:
- Local: install MongoDB Community Server and use `mongodb://localhost:27017/flowdesk`, or
- Cloud: create a free cluster on MongoDB Atlas and paste its connection string into `MONGO_URI`.

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev      # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so just open `http://localhost:5173`.

## 3. Using the app

1. Register a new account (Name, Email, Password).
2. You land on the Dashboard: greeting, date, progress ring, today's tasks, today's schedule.
3. Use the date picker / arrows to jump to any past or future date — tasks and timetable for that date load automatically and are stored permanently per date.
4. Add tasks with title, optional description, and priority (Low/Medium/High). Check them off, pin important ones, edit/delete.
5. Add timetable activities with start/end time, activity name, and a color.
6. Search tasks by title from the top bar.
7. Toggle Dark/Light mode from the navbar (dark by default).
8. Visit Profile to update your name, profile picture, or password. Use "Forgot password" on the login screen to reset via a generated token.

## 4. Telegram reminders (optional)

FlowDesk can send you Telegram messages:
- **10 minutes before** a scheduled timetable activity starts
- **Every hour** with a digest of today's tasks you haven't checked off yet

Setup (one-time, done by whoever runs the server):
1. Open Telegram, search for **@BotFather**, and send `/newbot`. Follow the prompts to name your bot and get a token like `123456:ABC-DEF...`.
2. Put that token in `backend/.env` as `TELEGRAM_BOT_TOKEN=...`, then restart the backend.
3. Each user then connects their own account:
   - Search for your bot by its username in Telegram and send it any message (e.g. "hi").
   - Visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in a browser and find their `chat.id`.
   - In FlowDesk, go to **Profile → Telegram Reminders**, paste that Chat ID, toggle the reminder types you want, and save.
   - Click **Send Test Message** to confirm it works.

If `TELEGRAM_BOT_TOKEN` isn't set, the scheduler simply stays disabled (logged once on server start) — everything else in the app works normally without it.



| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login (returns JWT + sets cookie) |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Current user |
| POST | /api/auth/forgot-password | Generate reset token |
| POST | /api/auth/reset-password | Reset password with token |
| GET/POST | /api/tasks?date=YYYY-MM-DD | List / create tasks for a date |
| PUT/DELETE | /api/tasks/:id | Update / delete a task |
| GET | /api/tasks/stats/weekly | Last-7-day completion % + streak (for the chart) |
| GET | /api/tasks/upcoming | Next 7 days' pending tasks |
| GET/POST | /api/timetable?date=YYYY-MM-DD | List / create timetable slots |
| PUT/DELETE | /api/timetable/:id | Update / delete a slot |
| GET | /api/timetable/upcoming | Next 7 days' scheduled activities |
| PUT | /api/profile | Update name / profile image / theme / Telegram settings |
| PUT | /api/profile/change-password | Change password |
| POST | /api/profile/test-telegram | Send a test Telegram message |

## Notes on SRS coverage

- **Authentication:** Register, Login, Logout, Forgot Password, Stay Logged In ✅ (cookie + localStorage JWT, "Stay logged in" controls cookie/session lifetime)
- **Dashboard:** Greeting, date, progress %, today's tasks, today's schedule ✅
- **Date Navigation:** date picker + prev/next, auto-loads that day's data ✅
- **Daily To-Do List:** add/edit/delete, complete/uncheck, pin, priority, description ✅
- **Daily Timetable:** add/edit/delete activity, color, subject/work field ✅
- **History:** all data stored per-date in MongoDB, browsable forever ✅
- **Search:** search tasks by title ✅
- **Theme:** dark (default) / light ✅
- **Profile:** update name, profile picture, change password ✅
- **Premium UI:** glassmorphism cards, gradient backgrounds, sticky header, animated checkboxes, circular progress, floating add button, color-coded timetable, smooth transitions ✅

Future Enhancements from SRS section 10 (browser notifications, daily notes, copy previous day's timetable, export as PDF, drag-and-drop reordering) are intentionally left as next steps, not implemented.
