import { useEffect, useState } from 'react';
import { getEmployees } from '../api/employees';
import { ApiError, formatErrorDetail } from '../api/client';
import StatePanel from '../components/StatePanel';
import MetricCard from '../components/MetricCard';
import BarBreakdown from '../components/BarBreakdown';

function groupCount(employees, key) {
  const counts = new Map();
  for (const emp of employees) {
    const value = emp[key] ?? 'Unspecified';
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));
}

export default function Dashboard() {
  const [employees, setEmployees] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getEmployees()
      .then((data) => {
        if (!cancelled) setEmployees(data);
      })
      .catch((err) => {
        if (!cancelled) {
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
  }, []);

  if (error) {
    return (
      <StatePanel variant="error" title="Backend unreachable">
        <p>{String(error)}</p>
        <p>
          Check that the FastAPI server is running and that
          VITE_API_BASE_URL points at it.
        </p>
      </StatePanel>
    );
  }

  if (employees === null) {
    return (
      <StatePanel>
        <p>Loading employee data…</p>
      </StatePanel>
    );
  }

  if (employees.length === 0) {
    return (
      <StatePanel title="No employees yet">
        <p>
          Once employees are added through the API, this dashboard will
          summarize them here.
        </p>
      </StatePanel>
    );
  }

  const byDepartment = groupCount(employees, 'department');
  const byStatus = groupCount(employees, 'status');

  return (
    <div className="dashboard">
      <div className="dashboard__metrics">
        <MetricCard label="Total employees" value={employees.length} />
        <MetricCard label="Departments" value={byDepartment.length} />
        <MetricCard label="Status categories" value={byStatus.length} />
      </div>

      <div className="dashboard__panels">
        <BarBreakdown title="By department" rows={byDepartment} />
        <BarBreakdown title="By status" rows={byStatus} />
      </div>

      <style>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .dashboard__metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: var(--space-4);
        }
        .dashboard__panels {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-4);
        }
      `}</style>
    </div>
  );
}
