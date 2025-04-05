import React, { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";

interface SearchFiltersProps {
  onSearchChange: (term: string) => void;
  onCityFilterChange: (city: string) => void;
  onHighlightToggle: () => void;
  highlightChecked: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onSearchChange,
  onCityFilterChange,
  onHighlightToggle,
  highlightChecked
}) => {
  const { cities } = useUserContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 1000); // 1 second debounce

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, onSearchChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onCityFilterChange(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-2 mb-6">
      {/* Name filter */}
      <div className="relative flex-grow">
        <label htmlFor="name-search" className="sr-only">Name</label>
        <input
          id="name-search"
          data-testid="search-input"
          type="text"
          placeholder="Name"
          className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* City dropdown */}
      <div className="relative w-full md:w-64">
        <label htmlFor="city-filter" className="sr-only">City</label>
        <select
          id="city-filter"
          data-testid="city-select"
          className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 appearance-none focus:outline-none focus:border-blue-500"
          onChange={handleCityChange}
          defaultValue=""
        >
          <option value="">Select city</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {/* Highlight checkbox */}
      <div className="flex items-center">
        <input
          id="highlight-oldest"
          data-testid="highlight-checkbox"
          type="checkbox"
          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          checked={highlightChecked}
          onChange={onHighlightToggle}
        />
        <label htmlFor="highlight-oldest" className="ml-2 text-sm text-gray-700">
          Highlight oldest per city
        </label>
      </div>
    </div>
  );
};

export default SearchFilters;