import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getEmployees } from '../api/employees';
import { ApiError, formatErrorDetail } from '../api/client';
import StatePanel from '../components/StatePanel';
import Badge from '../components/Badge';
import { formatSalary, formatDate } from '../utils/format';

const PAGE_SIZE = 10;

const COLUMNS = [
  { key: 'employee_code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
  { key: 'designation', label: 'Designation' },
  { key: 'salary', label: 'Salary' },
  { key: 'joining_date', label: 'Joined' },
  { key: 'status', label: 'Status' },
];

function sortValue(employee, key) {
  if (key === 'name') return `${employee.first_name} ${employee.last_name}`.toLowerCase();
  if (key === 'salary') return employee.salary;
  if (key === 'joining_date') return employee.joining_date;
  return String(employee[key] ?? '').toLowerCase();
}

export default function EmployeeDirectory() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState({ key: 'employee_code', dir: 'asc' });
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setError(null);
    setIsRefreshing(true);
    return getEmployees()
      .then((data) => setEmployees(data))
      .catch((err) => {
        setError(
          err instanceof ApiError
            ? formatErrorDetail(err.detail) || err.message
            : 'Could not reach the OpsFlow backend.'
        );
      })
      .finally(() => setIsRefreshing(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const departments = useMemo(() => {
    if (!employees) return [];
    return [...new Set(employees.map((e) => e.department))].sort();
  }, [employees]);

  const statuses = useMemo(() => {
    if (!employees) return [];
    return [...new Set(employees.map((e) => e.status))].sort();
  }, [employees]);

  const filtered = useMemo(() => {
    if (!employees) return [];
    const term = search.trim().toLowerCase();

    return employees.filter((e) => {
      if (department !== 'all' && e.department !== department) return false;
      if (status !== 'all' && e.status !== status) return false;
      if (!term) return true;
      const haystack = `${e.employee_code} ${e.first_name} ${e.last_name} ${e.email}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [employees, search, department, status]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = sortValue(a, sort.key);
      const bv = sortValue(b, sort.key);
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateFilter(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  function toggleSort(key) {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    );
  }

  if (error) {
    return (
      <StatePanel variant="error" title="Backend unreachable">
        <p>{String(error)}</p>
        <p>Check that the FastAPI server is running and reachable.</p>
      </StatePanel>
    );
  }

  if (employees === null) {
    return (
      <StatePanel>
        <p>Loading employees…</p>
      </StatePanel>
    );
  }

  return (
    <div className="directory">
      <div className="directory__toolbar">
        <input
          type="search"
          className="directory__search"
          placeholder="Search by name, email, or code"
          value={search}
          onChange={(e) => updateFilter(setSearch)(e.target.value)}
          aria-label="Search employees"
        />

        <select
          className="directory__select"
          value={department}
          onChange={(e) => updateFilter(setDepartment)(e.target.value)}
          aria-label="Filter by department"
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          className="directory__select"
          value={status}
          onChange={(e) => updateFilter(setStatus)(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button type="button" className="directory__refresh" onClick={load} disabled={isRefreshing}>
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </button>

        <Link to="/employees/new" className="directory__add">
          Add employee
        </Link>
      </div>

      <div className="directory__meta">
        {sorted.length} of {employees.length} employees
      </div>

      {sorted.length === 0 ? (
        <StatePanel title="No matching employees">
          <p>Try clearing the search or filters.</p>
        </StatePanel>
      ) : (
        <>
          <div className="directory__table-wrap scroll-x">
            <table className="directory__table">
              <thead>
                <tr>
                  {COLUMNS.map((col) => (
                    <th key={col.key}>
                      <button
                        type="button"
                        className="directory__sort-btn"
                        onClick={() => toggleSort(col.key)}
                      >
                        {col.label}
                        {sort.key === col.key && (
                          <span aria-hidden="true">{sort.dir === 'asc' ? ' ▲' : ' ▼'}</span>
                        )}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((e) => (
                  <tr
                    key={e.employee_code}
                    className="directory__row"
                    onClick={() => navigate(`/employees/${e.employee_code}`)}
                  >
                    <td>{e.employee_code}</td>
                    <td>
                      {e.first_name} {e.last_name}
                    </td>
                    <td>{e.email}</td>
                    <td>{e.department}</td>
                    <td>{e.designation}</td>
                    <td>{formatSalary(e.salary)}</td>
                    <td>{formatDate(e.joining_date)}</td>
                    <td>
                      <Badge>{e.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="directory__pagination">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      <style>{`
        .directory {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .directory__toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }
        .directory__search {
          flex: 1;
          min-width: 200px;
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-sm);
          font-size: var(--fs-body);
          font-family: inherit;
          background: var(--bg-surface);
        }
        .directory__select {
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-sm);
          font-size: var(--fs-body);
          font-family: inherit;
          background: var(--bg-surface);
        }
        .directory__refresh {
          padding: var(--space-2) var(--space-4);
          border: 1px solid var(--accent-strong);
          background: var(--accent);
          color: #fff;
          border-radius: var(--radius-sm);
          font-size: var(--fs-body);
          font-weight: 500;
        }
        .directory__refresh:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .directory__add {
          padding: var(--space-2) var(--space-4);
          border: 1px solid var(--border-strong);
          background: var(--bg-surface);
          color: var(--text-primary);
          border-radius: var(--radius-sm);
          font-size: var(--fs-body);
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .directory__add:hover {
          background: var(--accent-soft);
        }
        .directory__meta {
          font-size: var(--fs-small);
          color: var(--text-muted);
        }
        .directory__table-wrap {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
        }
        .directory__table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--fs-small);
          min-width: 760px;
        }
        .directory__table th {
          text-align: left;
          border-bottom: 1px solid var(--border);
          padding: var(--space-3) var(--space-3);
          background: var(--bg-app);
        }
        .directory__sort-btn {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          color: var(--text-muted);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }
        .directory__table td {
          padding: var(--space-3) var(--space-3);
          border-bottom: 1px solid var(--border);
        }
        .directory__row {
          cursor: pointer;
        }
        .directory__row:hover {
          background: var(--accent-soft);
        }
        .directory__pagination {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--fs-small);
        }
        .directory__pagination button {
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--border-strong);
          background: var(--bg-surface);
          border-radius: var(--radius-sm);
        }
        .directory__pagination button:disabled {
          opacity: 0.5;
          cursor: default;
        }
      `}</style>
    </div>
  );
}
