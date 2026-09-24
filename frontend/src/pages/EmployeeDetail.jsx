import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEmployee } from '../api/employees';
import { ApiError, formatErrorDetail } from '../api/client';
import StatePanel from '../components/StatePanel';
import Badge from '../components/Badge';
import { formatDate } from '../utils/format';

const FIELDS = [
  { key: 'employee_code', label: 'Employee code' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
  { key: 'designation', label: 'Designation' },
  { key: 'salary', label: 'Salary' },
  { key: 'joining_date', label: 'Joining date', format: (v) => formatDate(v, { year: 'numeric', month: 'long', day: 'numeric' }) },
  { key: 'id', label: 'Record ID' },
];

export default function EmployeeDetail() {
  const { employeeCode } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setEmployee(null);
    setError(null);
    setNotFound(false);

    getEmployee(employeeCode)
      .then((data) => {
        if (!cancelled) setEmployee(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(
            err instanceof ApiError
              ? formatErrorDetail(err.detail) || err.message
              : 'Could not reach the OpsFlow backend.'
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [employeeCode]);

  const backLink = (
    <Link to="/employees" className="detail__back">
      ← Back to directory
    </Link>
  );

  if (notFound) {
    return (
      <div className="detail">
        {backLink}
        <StatePanel title="Employee not found">
          <p>No employee matches the code “{employeeCode}”.</p>
        </StatePanel>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail">
        {backLink}
        <StatePanel variant="error" title="Backend unreachable">
          <p>{String(error)}</p>
        </StatePanel>
      </div>
    );
  }

  if (employee === null) {
    return (
      <div className="detail">
        {backLink}
        <StatePanel>
          <p>Loading employee…</p>
        </StatePanel>
      </div>
    );
  }

  return (
    <div className="detail">
      {backLink}

      <div className="detail__card">
        <div className="detail__header">
          <div>
            <h2 className="detail__name">
              {employee.first_name} {employee.last_name}
            </h2>
            <p className="detail__designation">{employee.designation}</p>
          </div>
          <Badge>{employee.status}</Badge>
        </div>

        <dl className="detail__grid">
          {FIELDS.map(({ key, label, format }) => (
            <div key={key} className="detail__field">
              <dt>{label}</dt>
              <dd>{format ? format(employee[key]) : employee[key] ?? '—'}</dd>
            </div>
          ))}
        </dl>
      </div>

      <style>{`
        .detail {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          max-width: 640px;
        }
        .detail__back {
          font-size: var(--fs-small);
          color: var(--accent-strong);
          text-decoration: none;
          width: fit-content;
        }
        .detail__back:hover {
          text-decoration: underline;
        }
        .detail__card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .detail__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-3);
        }
        .detail__name {
          font-size: var(--fs-h1);
        }
        .detail__designation {
          color: var(--text-muted);
          font-size: var(--fs-body);
          margin-top: var(--space-1);
        }
        .detail__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: var(--space-4);
          margin: 0;
        }
        .detail__field dt {
          font-size: var(--fs-micro);
          color: var(--text-muted);
          margin-bottom: 2px;
        }
        .detail__field dd {
          margin: 0;
          font-size: var(--fs-body);
        }
      `}</style>
    </div>
  );
}
