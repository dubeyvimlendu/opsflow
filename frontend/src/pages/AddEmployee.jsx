import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEmployee } from '../api/employees';
import { ApiError, formatErrorDetail } from '../api/client';

const EMPTY_FORM = {
  employee_code: '',
  first_name: '',
  last_name: '',
  email: '',
  department: '',
  designation: '',
  salary: '',
  joining_date: '',
  status: '',
};

const EMPLOYEE_CODE_PATTERN = /^EMP\d{4}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the constraints visible in app/schemas/employee.py. Client-side
// validation here is a fast first pass — the backend is still the source
// of truth, and its response is what ultimately decides success.
function validate(form) {
  const errors = {};

  if (!EMPLOYEE_CODE_PATTERN.test(form.employee_code)) {
    errors.employee_code = 'Must match EMP followed by 4 digits, e.g. EMP0001';
  }
  if (!form.first_name.trim()) errors.first_name = 'Required';
  if (!form.last_name.trim()) errors.last_name = 'Required';
  if (!EMAIL_PATTERN.test(form.email)) errors.email = 'Enter a valid email address';
  if (!form.department.trim()) errors.department = 'Required';
  if (!form.designation.trim()) errors.designation = 'Required';
  if (!form.salary || Number(form.salary) <= 0) errors.salary = 'Must be greater than zero';
  if (!form.joining_date) errors.joining_date = 'Required';
  if (!form.status.trim()) errors.status = 'Required';

  return errors;
}

export default function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await createEmployee({
        ...form,
        salary: Number(form.salary),
      });
      navigate('/employees');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setFieldErrors((prev) => ({ ...prev, employee_code: 'This employee code already exists' }));
          setServerError('An employee with this code already exists.');
        } else if (err.status === 422) {
          setServerError(formatErrorDetail(err.detail) || 'The backend rejected this data.');
        } else {
          setServerError(formatErrorDetail(err.detail) || `Server error (${err.status}).`);
        }
      } else {
        setServerError('Could not reach the OpsFlow backend.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="add-employee">
      <Link to="/employees" className="add-employee__back">
        ← Back to directory
      </Link>

      <form className="add-employee__card" onSubmit={handleSubmit} noValidate>
        <h2>Add employee</h2>

        {serverError && <div className="add-employee__banner">{serverError}</div>}

        <div className="add-employee__grid">
          <Field
            label="Employee code"
            value={form.employee_code}
            onChange={(v) => updateField('employee_code', v)}
            error={fieldErrors.employee_code}
            placeholder="EMP0001"
          />
          <Field
            label="Status"
            value={form.status}
            onChange={(v) => updateField('status', v)}
            error={fieldErrors.status}
            placeholder="e.g. Active"
          />
          <Field
            label="First name"
            value={form.first_name}
            onChange={(v) => updateField('first_name', v)}
            error={fieldErrors.first_name}
          />
          <Field
            label="Last name"
            value={form.last_name}
            onChange={(v) => updateField('last_name', v)}
            error={fieldErrors.last_name}
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => updateField('email', v)}
            error={fieldErrors.email}
          />
          <Field
            label="Department"
            value={form.department}
            onChange={(v) => updateField('department', v)}
            error={fieldErrors.department}
          />
          <Field
            label="Designation"
            value={form.designation}
            onChange={(v) => updateField('designation', v)}
            error={fieldErrors.designation}
          />
          <Field
            label="Salary"
            type="number"
            value={form.salary}
            onChange={(v) => updateField('salary', v)}
            error={fieldErrors.salary}
            min="0.01"
            step="0.01"
          />
          <Field
            label="Joining date"
            type="date"
            value={form.joining_date}
            onChange={(v) => updateField('joining_date', v)}
            error={fieldErrors.joining_date}
          />
        </div>

        <div className="add-employee__actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save employee'}
          </button>
        </div>
      </form>

      <style>{`
        .add-employee {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          max-width: 640px;
        }
        .add-employee__back {
          font-size: var(--fs-small);
          color: var(--accent-strong);
          text-decoration: none;
          width: fit-content;
        }
        .add-employee__back:hover {
          text-decoration: underline;
        }
        .add-employee__card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .add-employee__card h2 {
          font-size: var(--fs-h2);
        }
        .add-employee__banner {
          background: var(--danger-soft);
          color: var(--danger);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
          font-size: var(--fs-small);
        }
        .add-employee__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-4);
        }
        .add-employee__actions {
          display: flex;
          justify-content: flex-end;
        }
        .add-employee__actions button {
          padding: var(--space-3) var(--space-5);
          background: var(--accent);
          color: #fff;
          border: 1px solid var(--accent-strong);
          border-radius: var(--radius-sm);
          font-size: var(--fs-body);
          font-weight: 500;
        }
        .add-employee__actions button:disabled {
          opacity: 0.6;
          cursor: default;
        }
      `}</style>
    </div>
  );
}

function Field({ label, value, onChange, error, type = 'text', ...rest }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className={'field__input' + (error ? ' field__input--error' : '')}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {error && <span className="field__error">{error}</span>}

      <style>{`
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          font-size: var(--fs-small);
        }
        .field__label {
          color: var(--text-muted);
        }
        .field__input {
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-sm);
          font-size: var(--fs-body);
          font-family: inherit;
          background: var(--bg-surface);
        }
        .field__input--error {
          border-color: var(--danger);
        }
        .field__error {
          color: var(--danger);
          font-size: var(--fs-micro);
        }
      `}</style>
    </label>
  );
}
