export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Stop {
  stopId: number | null;
  location: string;
  address: string;
  coordinates: Coordinates;
  students: number;
}

export interface BusRoute {
  busId: number;
  capacity: number;
  route: Stop[];
  studentsAssigned: number;
}