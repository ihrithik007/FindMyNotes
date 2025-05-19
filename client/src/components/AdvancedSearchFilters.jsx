import React from 'react';
import { motion } from 'framer-motion';

const AdvancedSearchFilters = ({ 
  filters, 
  setFilters, 
  sortOptions, 
  setSortOptions,
  onApplyFilters 
}) => {
  const handleDateChange = (e) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [e.target.name]: e.target.value
      }
    }));
  };

  const handleFileTypeChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      fileTypes: checked 
        ? [...prev.fileTypes, value]
        : prev.fileTypes.filter(type => type !== value)
    }));
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFilters(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSortChange = (e) => {
    setSortOptions(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 mb-8"
    >
      <h2 className="text-xl font-semibold text-white mb-4">Advanced Filters</h2>
      
      {/* Date Range Filter */}
      <div className="mb-6">
        <h3 className="text-white mb-2">Date Range</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">From</label>
            <input
              type="date"
              name="from"
              value={filters.dateRange.from}
              onChange={handleDateChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">To</label>
            <input
              type="date"
              name="to"
              value={filters.dateRange.to}
              onChange={handleDateChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* File Type Filter */}
      <div className="mb-6">
        <h3 className="text-white mb-2">File Types</h3>
        <div className="flex flex-wrap gap-4">
          {['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX'].map(type => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={type}
                checked={filters.fileTypes.includes(type)}
                onChange={handleFileTypeChange}
                className="form-checkbox h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div className="mb-6">
        <h3 className="text-white mb-2">Tags</h3>
        <input
          type="text"
          value={filters.tags.join(', ')}
          onChange={handleTagChange}
          placeholder="Enter tags separated by commas"
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Sorting Options */}
      <div className="mb-6">
        <h3 className="text-white mb-2">Sort By</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Sort Field</label>
            <select
              name="field"
              value={sortOptions.field}
              onChange={handleSortChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="date">Date</option>
              <option value="popularity">Popularity</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Order</label>
            <select
              name="order"
              value={sortOptions.order}
              onChange={handleSortChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={onApplyFilters}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300"
      >
        Apply Filters
      </button>
    </motion.div>
  );
};

export default AdvancedSearchFilters; 