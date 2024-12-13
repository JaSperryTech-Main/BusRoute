/**
 * Calculates the utilization percentage of a bus
 * @param studentsAssigned Number of students assigned to the bus
 * @param capacity Total capacity of the bus
 * @returns Utilization percentage
 */
export const calculateUtilization = (
  studentsAssigned: number,
  capacity: number
): number => {
  return (studentsAssigned / capacity) * 100;
};