// Wraps the confirmed /api/employees endpoints. No fields or endpoints
// are invented here beyond what app/api/employees.py exposes.
import { apiClient } from './client';

export function getEmployees() {
  return apiClient.get('/api/employees');
}

export function getEmployee(employeeCode) {
  return apiClient.get(`/api/employees/${employeeCode}`);
}

export function createEmployee(employee) {
  return apiClient.post('/api/employees', employee);
}

export function importEmployees(file) {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.postForm('/api/employees/import', formData);
}
