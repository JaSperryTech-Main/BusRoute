import type { BusRoute } from '../types';

export const getOptimizedRoutes: BusRoute[] = [
  {
    busId: 1,
    capacity: 40,
    route: [
      {
        stopId: 1,
        location: "Stop A",
        address: "123 Main St",
        coordinates: {
          lat: 40.7128,
          lon: -74.006,
        },
        students: 30,
      },
      {
        stopId: null,
        location: "School",
        address: "1 Education Way",
        coordinates: {
          lat: 40.7168,
          lon: -74.01,
        },
        students: 0,
      },
    ],
    studentsAssigned: 30,
  },
  {
    busId: 2,
    capacity: 40,
    route: [],
    studentsAssigned: 0,
  },
];