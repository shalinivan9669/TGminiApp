// src/app/components/Filters/Filters.tsx
'use client';

import React from 'react';

interface FiltersProps {
  options: string[];
  selectedOption: string;
  onFilterChange: (option: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ options, selectedOption, onFilterChange }) => {
  return (
    <div className="flex space-x-4 mb-4">
      {options.map((option) => (
        <button
          key={option}
          className={`py-1 px-3 rounded-full text-sm ${
            selectedOption === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => onFilterChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Filters;
