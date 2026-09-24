// Centralized API client for the OpsFlow backend.
// Base URL comes from the environment so the same build can point at
// different backends (local, staging, Render) without code changes.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

async function parseErrorDetail(response) {
  try {
    const body = await response.json();
    return body?.detail ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

async function request(path, { method = 'GET', body, headers, isFormData = false } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: isFormData
      ? headers
      : { 'Content-Type': 'application/json', ...headers },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const detail = await parseErrorDetail(response);
    throw new ApiError(
      `Request to ${path} failed with ${response.status}`,
      response.status,
      detail
    );
  }

  if (response.status === 204) return null;
  return response.json();
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  postForm: (path, formData) =>
    request(path, { method: 'POST', body: formData, isFormData: true }),
};

// FastAPI's `detail` is a plain string for most errors (400/404/409) but
// an array of {loc, msg, type} objects for 422 validation errors. This
// normalizes either shape into a single readable string for the UI.
export function formatErrorDetail(detail) {
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = Array.isArray(item.loc) ? item.loc.at(-1) : item.loc;
        return field ? `${field}: ${item.msg}` : item.msg;
      })
      .join('; ');
  }
  return detail;
}

export { ApiError, BASE_URL };
