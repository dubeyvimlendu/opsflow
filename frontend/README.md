# OpsFlow — Frontend (Stage 1 + 2 + 3)

React + Vite frontend for the OpsFlow employee operations API.

**Stage 1:** app shell, centralized API client, Dashboard.
**Stage 2:** Employee Directory, Employee Detail, Add Employee, Import Center.
**Stage 3:** Reports page — workforce overview, department analysis,
salary analysis, joining trends, status distribution, and a
data-quality section — backed by the new `/api/reports/*` endpoints
(see the backend-additions package). Each section fetches and fails
independently, so one broken report doesn't take down the page.

No mock data anywhere — every page shows live API data or an explicit
loading/empty/error state.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` if your backend isn't at `http://localhost:8000`.

## Run locally

```bash
npm run dev
```

Start the FastAPI backend first (with the Stage 3 reports router
mounted — see backend-additions/main.py.diff), or the Reports page's
sections will each show "Couldn't load this report".

## Build for production

```bash
npm run build
```

## Project structure

```
src/
  api/
    client.js          fetch wrapper + FastAPI error formatting
    employees.js        /api/employees endpoints
    reports.js           /api/reports endpoints (Stage 3)
  components/
    layout/               Sidebar, Header, AppShell
    StatePanel.jsx          shared loading/empty/error presentation
    Badge.jsx                neutral pill for status/department values
    MetricCard.jsx            single-number summary card
    BarBreakdown.jsx           horizontal bar list (dept/status/salary/joining charts)
    ReportSection.jsx           wraps a Reports section's loading/error/empty states
  hooks/
    useFetch.js            generic "fetch on mount" hook, used by Reports
  pages/
    Dashboard.jsx
    EmployeeDirectory.jsx
    EmployeeDetail.jsx
    AddEmployee.jsx
    ImportCenter.jsx
    Reports.jsx
  utils/
    format.js              shared salary/date formatting
  styles/                   design tokens + global styles
```

## Routes

| Path | Page |
|---|---|
| `/` | Dashboard |
| `/employees` | Employee Directory |
| `/employees/new` | Add Employee |
| `/employees/:employeeCode` | Employee Detail |
| `/import` | Import Center |
| `/reports` | Reports |

## Scope

Not yet implemented (by design): Insights/AI features. Sidebar link
visible but marked "Soon".
