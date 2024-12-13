import React from 'react';
import { MapPin, Users, School } from 'lucide-react';
import type { Stop } from '../types';
import { StopIcon } from './StopIcon';

interface RouteStopProps {
  stop: Stop;
  isLast: boolean;
}

export const RouteStop: React.FC<RouteStopProps> = ({ stop, isLast }) => {
  const isSchool = stop.location === "School";
  
  return (
    <div className="relative pl-8">
      {!isLast && (
        <div className="absolute left-[0.9375rem] top-8 w-px h-full bg-gray-200" />
      )}
      <div className="flex items-start gap-4">
        <StopIcon isSchool={isSchool} />
        <div className="flex-1">
          <h3 className="font-medium">{stop.location}</h3>
          <p className="text-sm text-gray-600">{stop.address}</p>
          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{stop.students} students</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {stop.coordinates.lat.toFixed(4)}, {stop.coordinates.lon.toFixed(4)}
        </div>
      </div>
    </div>
  );
};