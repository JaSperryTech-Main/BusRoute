import express from "express";
const router = express.Router();

function calculateDistance(coord1, coord2) {
  const R = 6371; // Radius of the Earth in km
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLon = toRadians(coord2.lon - coord1.lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Function to optimize routes
function optimizeRoutes(buses, stops, school) {
  buses.sort((a, b) => b.seats - a.seats);

  stops.forEach((stop) => {
    stop.distanceToSchool = calculateDistance(
      stop.coordinates,
      school.coordinates
    );
  });

  stops.sort(
    (a, b) => a.distanceToSchool - b.distanceToSchool || b.students - a.students
  );

  const routes = buses.map((bus) => ({
    busId: bus.id,
    capacity: bus.seats,
    route: [],
    studentsAssigned: 0,
  }));

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

  routes.forEach((route) => {
    if (route.route.length > 0) {
      route.route.push({
        stopId: null,
        location: school.location,
        address: school.address,
        coordinates: school.coordinates,
        students: 0,
      });
    }
  });

  return routes;
}

router.get("/", (req, res) => {
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
    const optimizedRoutes = optimizeRoutes(buses, stops, schoolLocation);
    res.json(optimizedRoutes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/", (req, res) => {
  const { buses, stops, schoolLocation } = req.body;

  try {
    const optimizedRoutes = optimizeRoutes(buses, stops, schoolLocation);
    res.json(optimizedRoutes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
