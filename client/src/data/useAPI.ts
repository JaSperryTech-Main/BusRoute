import axios from 'axios';
import type { BusRoute } from '../types';

// Define the async function to fetch the optimized routes
export async function fetchOptimizedRoutes(): Promise<BusRoute[]> {
  try {
    const response = await axios.get("http://localhost:3001/api/");
    console.log(response.data);  // Logs the fetched data to the console
    return response.data;  // Return the fetched data
  } catch (error) {
    console.error("Error fetching optimized routes:", error);
    throw error; // Optionally, you can rethrow the error if needed
  }
}
