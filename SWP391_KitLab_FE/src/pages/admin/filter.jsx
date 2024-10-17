import React, { useState } from "react";
import { Filter as FilterIcon, ChevronDown } from "lucide-react";
import PropTypes from "prop-types";

const FilterType = ({ options, onFilterChange }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (type) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];

    setSelectedTypes(newSelectedTypes);
    onFilterChange(newSelectedTypes);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={handleFilterClick}
        className="bg-black text-white px-4 py-2 rounded-md flex items-center"
      >
        <FilterIcon size={20} className="mr-2" />
        Lọc
        <ChevronDown size={20} className="ml-2" />
      </button>
      {isFilterOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((type) => (
              <button
                key={type}
                onClick={() => handleFilterSelect(type)}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  selectedTypes.includes(type)
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                role="menuitem"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

FilterType.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterType;
