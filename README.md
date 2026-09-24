<h1 align="center">OpsFlow — Employee Operations & Data Processing Platform</h1>

<p align="center">
  <i>Full-stack employee management, data validation, bulk processing, and workforce reporting platform — built end-to-end.</i>
</p>

<p align="center">
  <b>Stack:</b> React + Vite · FastAPI · MySQL · Pandas
</p>

---

### Overview

OpsFlow provides a structured platform for managing employee records and processing workforce datasets. It combines a React frontend with a FastAPI backend, MySQL database, and validation pipeline for bulk employee imports and API-driven workforce reporting.

---

### Key Features

- **Employee management** — create, view, search, filter, and paginate employee records
- **Bulk data import** — CSV, XLSX, and JSON processing with cleaning and validation
- **Duplicate detection** — prevents duplicate employee codes during imports
- **Workforce dashboard** — employee and department overview
- **Reporting** — department distribution, salary statistics, salary distribution, joining trends, and employee status
- **Data-quality checks** — identifies inconsistencies in the workforce dataset
- **REST API** — FastAPI backend serving structured JSON responses

---

### Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | FastAPI, Pydantic |
| Database | MySQL |
| Data Processing | Pandas |
| Testing | Pytest |
| API Server | Uvicorn |

---

### Architecture

```text
React + Vite Frontend
          ↓
FastAPI REST API
          ↓
Service Layer
          ↓
Repository Layer
          ↓
MySQL Database
```

---

### Run Locally

```bash
git clone <repository-url>
cd OpsFlow
```

```bash
cd backend
python -m venv .venv
```

```bash
# macOS/Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate
```

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

```bash
cd ../frontend
npm install
npm run dev
```

Configure environment variables for the MySQL connection and frontend API base URL. Do not commit real credentials.

---

### Author

Built by **Vimlendu Dubey**

[GitHub](https://github.com/dubeyvimlendu) · [Email](mailto:dubeyvimlendu@gmail.com)