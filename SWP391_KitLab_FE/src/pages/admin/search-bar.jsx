import React from "react";
import PropTypes from "prop-types";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Tìm kiếm..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="py-2 px-3 rounded-lg mr-[30px] w-[600px] h-[35px] border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
    />
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default SearchBar;
