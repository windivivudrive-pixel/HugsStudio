/**
 * Utility functions for date parsing, display formatting, and inputs.
 */

/**
 * Formats a date string into a user-friendly Vietnamese format.
 * If input is in YYYY-MM-DD format (e.g. "2026-06-05"), it returns "5 Tháng 6, 2026".
 * Otherwise, it falls back to the original string.
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  // Check if it's in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    return `${d} Tháng ${m}, ${year}`;
  }
  return dateStr;
}

/**
 * Converts a display date string or arbitrary string to "YYYY-MM-DD" for calendar inputs.
 */
export function convertToInputDateFormat(dateStr: string): string {
  if (!dateStr) return "";
  
  // If already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Custom Vietnamese parsing, e.g. "24 Tháng 3, 2026" or "24 Tháng 03, 2026"
  const viMatch = dateStr.match(/(\d+)\s+Tháng\s+(\d+),\s+(\d+)/i);
  if (viMatch) {
    const day = viMatch[1].padStart(2, '0');
    const month = viMatch[2].padStart(2, '0');
    const year = viMatch[3];
    return `${year}-${month}-${day}`;
  }
  
  // Try using JS Date.parse
  try {
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      return new Date(parsed).toISOString().split('T')[0];
    }
  } catch (e) {}
  
  // Default fallback: today's date
  return new Date().toISOString().split('T')[0];
}

/**
 * Converts any date string to standard ISO format "YYYY-MM-DD" for schema markup.
 */
export function convertToISODate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  
  // Already in YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Custom Vietnamese parsing, e.g. "24 Tháng 3, 2026"
  const viMatch = dateStr.match(/(\d+)\s+Tháng\s+(\d+),\s+(\d+)/i);
  if (viMatch) {
    const day = viMatch[1].padStart(2, '0');
    const month = viMatch[2].padStart(2, '0');
    const year = viMatch[3];
    return `${year}-${month}-${day}`;
  }
  
  try {
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      return new Date(parsed).toISOString().split('T')[0];
    }
  } catch (e) {}
  
  return dateStr; // fallback to raw string
}
