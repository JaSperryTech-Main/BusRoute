import React from 'react';
import { Bus, Users, Clock } from 'lucide-react';
import type { BusRoute } from '../types';
import { RouteStop } from './RouteStop';
import { calculateUtilization } from '../utils/busUtils';

interface BusCardProps {
  busRoute: BusRoute;
}

export const BusCard: React.FC<BusCardProps> = ({ busRoute }) => {
  const utilizationPercentage = calculateUtilization(
    busRoute.studentsAssigned,
    busRoute.capacity
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bus className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Bus {busRoute.busId}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600">
            {busRoute.studentsAssigned}/{busRoute.capacity} students
            ({Math.round(utilizationPercentage)}% utilized)
          </span>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-gray-600">
        <Clock className="w-5 h-5 text-gray-600" />
        <span className="text-sm">
          Estimated time: {busRoute.estimatedTimeMinutes} minutes
        </span>
      </div>

      <div className="space-y-4">
        {busRoute.route.length === 0 ? (
          <p className="text-gray-500 italic">No stops assigned</p>
        ) : (
          busRoute.route.map((stop, index) => (
            <RouteStop 
              key={index}
              stop={stop}
              isLast={index === busRoute.route.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
};
