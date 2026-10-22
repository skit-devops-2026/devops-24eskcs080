# Personal Expense Tracker

## Author

| Roll No. | Name | GitHub username |
|---|---|---|
| 24ESKCS080 | Bhanu Pratap Singh | bhanu123-abc |

## About

Personal Expense Tracker is a web-based application designed to help users manage and track their daily expenses. It allows users to add expenses, organize their financial information, and monitor their spending and savings goals through an interactive interface.

## Tech stack

- Frontend: HTML, CSS, JavaScript
- Backend: Not implemented yet
- Database: Not implemented yet
- DevOps: Docker, GitHub Actions, Jenkins, Prometheus, Grafana, Render

## Running locally

```bash
make install
make run
```

## Live URL

https://personal-expense-tracker-latest.onrender.com

The app runs on Render's free tier, so the first load after a period of inactivity can take about a minute.

## Docker image

`bhanu123abc/personal-expense-tracker:latest` on Docker Hub.

## Monitoring

Run `docker compose up -d` to start the site (http://localhost:8080), Prometheus (http://localhost:9090) and Grafana (http://localhost:3000). Blackbox Exporter probes the site, and the Grafana dashboard shows availability and response time. Configuration is in `monitoring/` and screenshots are in `docs/`.

## Health endpoint

The app is a static site served by nginx, so it has no separate `/health` route. Availability is checked by probing `/` with Blackbox Exporter (see Monitoring above).
