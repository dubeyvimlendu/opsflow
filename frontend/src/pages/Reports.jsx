import {
  getWorkforceOverview,
  getDepartmentAnalysis,
  getSalaryAnalysis,
  getJoiningTrends,
  getStatusAnalysis,
  getDataQuality,
} from '../api/reports';
import { useFetch } from '../hooks/useFetch';
import ReportSection from '../components/ReportSection';
import MetricCard from '../components/MetricCard';
import BarBreakdown from '../components/BarBreakdown';
import { formatSalary } from '../utils/format';

export default function Reports() {
  const overview = useFetch(getWorkforceOverview);
  const departments = useFetch(getDepartmentAnalysis);
  const salary = useFetch(getSalaryAnalysis);
  const joiningTrends = useFetch(getJoiningTrends);
  const status = useFetch(getStatusAnalysis);
  const dataQuality = useFetch(getDataQuality);

  return (
    <div className="reports">
      {/* A. Workforce overview */}
      <ReportSection
        title="Workforce overview"
        loading={overview.loading}
        error={overview.error}
        isEmpty={!overview.data}
      >
        {overview.data && (
          <div className="reports__cards">
            <MetricCard label="Total employees" value={overview.data.total_employees} />
            <MetricCard label="Departments" value={overview.data.total_departments} />
            {overview.data.status_breakdown.map((row) => (
              <MetricCard key={row.status} label={row.status} value={row.count} />
            ))}
          </div>
        )}
      </ReportSection>

      {/* B. Department analysis */}
      <ReportSection
        title="Department analysis"
        loading={departments.loading}
        error={departments.error}
        isEmpty={!departments.data || departments.data.length === 0}
      >
        {departments.data && (
          <div className="reports__table-wrap scroll-x">
            <table className="reports__table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Avg. salary</th>
                  <th>Min. salary</th>
                  <th>Max. salary</th>
                </tr>
              </thead>
              <tbody>
                {departments.data.map((row) => (
                  <tr key={row.department}>
                    <td>{row.department}</td>
                    <td>{row.employee_count}</td>
                    <td>{formatSalary(row.average_salary)}</td>
                    <td>{formatSalary(row.minimum_salary)}</td>
                    <td>{formatSalary(row.maximum_salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReportSection>

      {/* C. Salary analysis */}
      <ReportSection
        title="Salary analysis"
        loading={salary.loading}
        error={salary.error}
        isEmpty={!salary.data}
      >
        {salary.data && (
          <div className="reports__salary">
            <div className="reports__cards">
              <MetricCard label="Average salary" value={formatSalary(salary.data.average_salary)} />
              <MetricCard label="Minimum salary" value={formatSalary(salary.data.minimum_salary)} />
              <MetricCard label="Maximum salary" value={formatSalary(salary.data.maximum_salary)} />
            </div>
            <BarBreakdown
              title="Distribution"
              rows={salary.data.distribution.map((b) => ({ label: b.range, count: b.count }))}
            />
          </div>
        )}
      </ReportSection>

      {/* D. Joining trends */}
      <ReportSection
        title="Joining trends"
        loading={joiningTrends.loading}
        error={joiningTrends.error}
        isEmpty={!joiningTrends.data || joiningTrends.data.length === 0}
      >
        {joiningTrends.data && (
          <BarBreakdown
            title="Employees joined by year"
            rows={[...joiningTrends.data]
              .sort((a, b) => a.year - b.year)
              .map((row) => ({ label: String(row.year), count: row.count }))}
          />
        )}
      </ReportSection>

      {/* E. Status distribution */}
      <ReportSection
        title="Status distribution"
        loading={status.loading}
        error={status.error}
        isEmpty={!status.data || status.data.length === 0}
      >
        {status.data && (
          <BarBreakdown
            title="Employees by status"
            rows={status.data.map((row) => ({ label: row.status, count: row.count }))}
          />
        )}
      </ReportSection>

      {/* F. Data quality */}
      <ReportSection
        title="Data quality"
        loading={dataQuality.loading}
        error={dataQuality.error}
        isEmpty={!dataQuality.data}
      >
        {dataQuality.data && (
          <div className="reports__quality">
            <div className="reports__cards">
              <MetricCard label="Total employees" value={dataQuality.data.total_employees} />
              <MetricCard label="Duplicate emails" value={dataQuality.data.duplicate_emails} />
            </div>

            {dataQuality.data.notes?.length > 0 && (
              <ul className="reports__notes">
                {dataQuality.data.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </ReportSection>

      <style>{`
        .reports {
          display: flex;
          flex-direction: column;
          gap: var(--space-7);
        }
        .reports__cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: var(--space-4);
        }
        .reports__salary {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .reports__table-wrap {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
        }
        .reports__table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--fs-small);
          min-width: 560px;
        }
        .reports__table th {
          text-align: left;
          border-bottom: 1px solid var(--border);
          padding: var(--space-3);
          background: var(--bg-app);
          color: var(--text-muted);
          font-weight: 600;
        }
        .reports__table td {
          padding: var(--space-3);
          border-bottom: 1px solid var(--border);
        }
        .reports__quality {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .reports__notes {
          margin: 0;
          padding-left: var(--space-5);
          font-size: var(--fs-small);
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
      `}</style>
    </div>
  );
}
