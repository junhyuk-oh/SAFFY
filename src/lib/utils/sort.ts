export function sortByField<T extends Record<string, any>>(
  items: T[],
  field: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return order === 'asc' ? 1 : -1;
    if (bVal == null) return order === 'asc' ? -1 : 1;
    
    // Handle different types
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc' 
        ? aVal.localeCompare(bVal, 'ko-KR')
        : bVal.localeCompare(aVal, 'ko-KR');
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    // Check if values are date strings or Date objects
    const aDate = aVal instanceof Date ? aVal : typeof aVal === 'string' && !isNaN(Date.parse(aVal)) ? new Date(aVal) : null;
    const bDate = bVal instanceof Date ? bVal : typeof bVal === 'string' && !isNaN(Date.parse(bVal)) ? new Date(bVal) : null;
    
    if (aDate && bDate) {
      return order === 'asc' 
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }
    
    // Convert to string for comparison
    const aStr = String(aVal);
    const bStr = String(bVal);
    return order === 'asc' 
      ? aStr.localeCompare(bStr, 'ko-KR')
      : bStr.localeCompare(aStr, 'ko-KR');
  });
}