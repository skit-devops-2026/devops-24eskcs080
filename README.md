# Personal Expense Tracker

## Author

| Roll No. | Name | GitHub username |
|---|---|---|
| 24ESKCS080 | Bhanu Pratap Singh | bhanu123-abc |

## About

Personal Expense Tracker (Spendly) is a web application that helps users record and track their daily expenses. It has a public marketing site and a React dashboard with an Express and MongoDB backend.

## Tech stack

- Frontend: HTML, CSS, JavaScript (validation, fetch/AJAX, jQuery) for the public site; React, Redux Toolkit, React Router and Tailwind CSS for the dashboard
- Backend: Node.js and Express REST API
- Database: MongoDB with Mongoose
- DevOps: Docker, Docker Compose, nginx, GitHub Actions, Jenkins, Kubernetes manifests, Prometheus, Grafana, Render

## Architecture

Browser, then nginx (port 8080), which serves:

- `/` the static pages (index, login, signup, help, ...)
- `/app/` the React dashboard (built with Vite)
- `/api/` proxied to the Express API, which stores data in MongoDB

## Running locally

Full stack with Docker:

```bash
docker compose up --build -d
```

- Site: http://localhost:8080
- Dashboard: http://localhost:8080/app/
- API health: http://localhost:8080/api/health

Dashboard development (hot reload):

```bash
cd backend && npm install && npm run dev      # API on :4000 (needs MongoDB)
cd dashboard && npm install && npm run dev    # http://localhost:5173/app/
```

## API

| Method | Path | Description |
|---|---|---|
| GET | /api/health | Service and database status |
| GET | /api/expenses | List expenses (optional `?category=`) |
| GET | /api/expenses/:id | One expense |
| POST | /api/expenses | Create an expense |
| DELETE | /api/expenses/:id | Delete an expense |

## CI

GitHub Actions runs repository hygiene, build and test, dashboard lint and build, and a backend check on every push. Pushes to `main` build and publish the image to GHCR.

## Live URL

https://personal-expense-tracker-latest.onrender.com

The app runs on Render's free tier, so the first load after a period of inactivity can take about a minute. The Render deployment serves the public site; the API and database run in the Docker Compose setup.

## Docker image

`bhanu123abc/personal-expense-tracker:latest` on Docker Hub.

## Monitoring

Run `docker compose up -d` to start the site (http://localhost:8080), Prometheus (http://localhost:9090) and Grafana (http://localhost:3000). Blackbox Exporter probes the site, and the Grafana dashboard shows availability and response time. Configuration is in `monitoring/` and screenshots are in `docs/`.

## Health endpoint

`GET /api/health` returns the API status and database connection state. Site availability is also probed at `/` by Blackbox Exporter.

## Roadmap

- User accounts: sign-up and login with hashed passwords and JWT, with expenses stored per user
- Python analytics service: spending charts, forecasts and savings suggestions
- Deploy the API and a hosted MongoDB alongside the Render site