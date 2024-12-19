import express from "express";
import OpenRouteService from "openrouteservice-js";

const router = express.Router();
const orsClient = new OpenRouteService.Directions({
  api_key: "5b3ce3597851110001cf6248d73b1b2b99574a09aa1cfc768fad09ac", // Replace with your API key
});

// Function to get travel information (distance and duration) between two points
async function getTravelInfo(origin, destination) {
  try {
    const response = await orsClient.calculate({
      coordinates: [
        [origin.lon, origin.lat],
        [destination.lon, destination.lat],
      ],
      profile: "driving-car", // Use the car driving profile
      format: "geojson",
    });

    const route = response.features[0].properties.segments[0];
    return {
      distance: route.distance / 1609.34, // Convert meters to miles
      duration: route.duration / 60,     // Convert seconds to minutes
    };
  } catch (error) {
    console.error("Error fetching travel info:", error.message);
    throw new Error("Failed to fetch travel info.");
  }
}

// Function to optimize routes for buses
async function optimizeRoutes(buses, stops, school) {
  buses.sort((a, b) => b.seats - a.seats); // Sort buses by capacity (descending)

  const routes = buses.map((bus) => ({
    busId: bus.id,
    capacity: bus.seats,
    route: [],
    studentsAssigned: 0,
    estimatedTimeMinutes: 0, // Initialize estimated time for each route
  }));

  // Assign stops to buses
  for (const stop of stops) {
    let studentsLeft = stop.students;

    for (const route of routes) {
      if (studentsLeft === 0) break;

      const availableSeats = route.capacity - route.studentsAssigned;
      const studentsToAssign = Math.min(availableSeats, studentsLeft);

      if (studentsToAssign > 0) {
        route.route.push({
          stopId: stop.id,
          location: stop.location,
          address: stop.address,
          coordinates: stop.coordinates,
          students: studentsToAssign,
        });
        route.studentsAssigned += studentsToAssign;
        studentsLeft -= studentsToAssign;
      }
    }

    if (studentsLeft > 0) {
      throw new Error(`Not enough bus capacity for stop ${stop.location}.`);
    }
  }

  // Add school as the final stop and calculate travel distances and times
  for (const route of routes) {
    if (route.route.length > 0) {
      route.route.push({
        stopId: null,
        location: school.location,
        address: school.address,
        coordinates: school.coordinates,
        students: 0,
      });
    } else {
      // If no stops were assigned to this bus, make school the only stop
      route.route.push({
        stopId: null,
        location: school.location,
        address: school.address,
        coordinates: school.coordinates,
        students: 0,
      });
    }

    // Calculate total distance and time for the route
    let totalDistance = 0;
    let totalTimeMinutes = 0;

    for (let i = 0; i < route.route.length - 1; i++) {
      const currentStop = route.route[i];
      const nextStop = route.route[i + 1];

      // Fetch travel information between stops
      const travelInfo = await getTravelInfo(currentStop.coordinates, nextStop.coordinates);
      totalDistance += travelInfo.distance;
      totalTimeMinutes += travelInfo.duration;
    }

    // Assign estimated time for the bus route
    route.estimatedTimeMinutes = Math.round(totalTimeMinutes);
  }

  return routes;
}

// GET route: Optimizes and returns routes for buses and stops
router.get("/", async (req, res) => {
  const buses = [
    { id: 1, seats: 50 },
    { id: 2, seats: 40 },
    { id: 3, seats: 60 },
  ];

  const stops = [
    {
      id: 1,
      location: "Stop 1",
      students: 30,
      coordinates: { lat: 35.6895, lon: 139.6917 },
      address: "123 Tokyo",
    },
    {
      id: 2,
      location: "Stop 2",
      students: 20,
      coordinates: { lat: 35.6762, lon: 139.6503 },
      address: "456 Tokyo",
    },
  ];

  const schoolLocation = {
    location: "School",
    coordinates: { lat: 35.6895, lon: 139.6917 },
    address: "789 School St",
  };

  try {
    const optimizedRoutes = await optimizeRoutes(buses, stops, schoolLocation);
    res.json(optimizedRoutes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST route: Accepts buses, stops, and schoolLocation in request body to optimize and return routes
router.post("/", async (req, res) => {
  const { buses, stops, schoolLocation } = req.body;

  try {
    const optimizedRoutes = await optimizeRoutes(buses, stops, schoolLocation);
    res.json(optimizedRoutes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
