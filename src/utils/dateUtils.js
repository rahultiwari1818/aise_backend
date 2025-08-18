export function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');        // getDate() gives day of month
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}