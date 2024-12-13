import { Bus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BusCard } from './components/BusCard';
import { fetchOptimizedRoutes } from './data/useAPI';
import { BusRoute } from './types';

function App() {
  const [routes, setRoutes] = useState<BusRoute[]>([]); // Set up state to store routes
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to track any error

  useEffect(() => {
    // Fetch the optimized routes and update state
    const fetchRoutes = async () => {
      try {
        const data = await fetchOptimizedRoutes(); // Fetch data from the API
        setRoutes(data); // Update state with the fetched data
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError("Error fetching optimized routes."); // Set error message
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchRoutes(); // Call the function to fetch routes when the component mounts
  }, []); // Empty dependency array means it runs only once, after the component mounts

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Bus className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Bus Route Optimization</h1>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <p>Loading routes...</p> // Show loading message
          ) : error ? (
            <p>{error}</p> // Show error message if there's an error
          ) : (
            routes.map((route) => (
              <BusCard key={route.busId} busRoute={route} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
