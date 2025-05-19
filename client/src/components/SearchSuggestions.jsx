import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchSuggestions = ({ 
  searchQuery, 
  onSuggestionClick, 
  suggestions, 
  isLoading 
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setFilteredSuggestions([]);
    }
    setSelectedIndex(-1); // Reset selection when query changes
  }, [searchQuery, suggestions]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (filteredSuggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredSuggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            onSuggestionClick(filteredSuggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          setFilteredSuggestions([]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredSuggestions, selectedIndex, onSuggestionClick]);

  if (!searchQuery || filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute z-50 w-full mt-1 bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        {isLoading ? (
          <div className="p-4 text-gray-400 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : (
          <ul className="max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-4 py-2 cursor-pointer text-white flex items-center space-x-2
                  ${index === selectedIndex ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                onClick={() => onSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="flex-1">{suggestion}</span>
                {index === selectedIndex && (
                  <span className="text-sm text-gray-400">Press Enter</span>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchSuggestions; 