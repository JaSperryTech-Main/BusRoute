import React from 'react';
import { MapPin, School } from 'lucide-react';

interface StopIconProps {
  isSchool: boolean;
}

export const StopIcon: React.FC<StopIconProps> = ({ isSchool }) => (
  <div className="absolute left-0 p-1 rounded-full bg-white">
    {isSchool ? (
      <School className="w-5 h-5 text-green-600" />
    ) : (
      <MapPin className="w-5 h-5 text-blue-600" />
    )}
  </div>
);