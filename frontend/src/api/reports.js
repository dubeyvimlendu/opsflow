// Wraps the Stage 3 /api/reports/* endpoints. These endpoints don't
// exist on the backend yet — see app/schemas/report.py for the exact
// response contract this is built against. Each function fails
// independently so one missing endpoint doesn't break the whole
// Reports page.
import { apiClient } from './client';

export function getWorkforceOverview() {
  return apiClient.get('/api/reports/overview');
}

export function getDepartmentAnalysis() {
  return apiClient.get('/api/reports/departments');
}

export function getSalaryAnalysis() {
  return apiClient.get('/api/reports/salary');
}

export function getJoiningTrends() {
  return apiClient.get('/api/reports/joining-trends');
}

export function getStatusAnalysis() {
  return apiClient.get('/api/reports/status');
}

export function getDataQuality() {
  return apiClient.get('/api/reports/data-quality');
}
