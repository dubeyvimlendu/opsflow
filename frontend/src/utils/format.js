export function formatSalary(value) {
  return new Intl.NumberFormat().format(value);
}

export function formatDate(value, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, options);
}
