/**
 * Converts a Gregorian date to Ethiopian date
 * @param date Optional date to convert (defaults to current date)
 * @returns Object containing Ethiopian year, month, and day
 */
export const toEthiopian = (date: Date = new Date()) => {
  const gregDate = new Date(date);
  const gregYear = gregDate.getFullYear();
  const gregMonth = gregDate.getMonth();
  const gregDay = gregDate.getDate();

  // Calculate the offset for the Ethiopian calendar (8 years behind Gregorian from September to December, 7 years from January to August)
  const ethiopianYear = gregMonth < 8 ? gregYear - 8 : gregYear - 7;
  
  // Return the Ethiopian year (we only need the year for the ID)
  return {
    year: ethiopianYear,
    // The following are included for completeness but not used in ID generation
    month: 0, // Placeholder
    day: 0,   // Placeholder
  };
};

/**
 * Gets the current Ethiopian year
 * @returns Current Ethiopian year as a string (e.g., "2017")
 */
export const getCurrentEthiopianYear = (): string => {
  return toEthiopian().year.toString();
};
