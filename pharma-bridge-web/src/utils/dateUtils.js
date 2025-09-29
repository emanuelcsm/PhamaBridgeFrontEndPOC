/**
 * Formats a date string into a localized format
 * @param {string} dateString - The date string to format
 * @param {boolean} includeTime - Whether to include time in the formatted string
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }
  
  // Format options
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('pt-BR', options);
};