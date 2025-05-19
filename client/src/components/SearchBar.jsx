import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import AdvancedSearchFilters from "./AdvancedSearchFilters";
import SearchSuggestions from "./SearchSuggestions";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  const user = useSelector((state) => state.user.userData);

  // Advanced search filters state
  const [filters, setFilters] = useState({
    dateRange: {
      from: "",
      to: ""
    },
    fileTypes: [],
    tags: []
  });

  const [sortOptions, setSortOptions] = useState({
    field: "relevance",
    order: "desc"
  });

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const response = await axios.get("http://localhost:6969/notes/suggestions", {
          params: { query: searchQuery },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('supabaseToken')}`
          }
        });
        setSuggestions(response.data.suggestions || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!user) {
      setError("Please login to search your notes");
      setIsLoading(false);
      return;
    }

    try {
      const notes = await axios.get("http://localhost:6969/notes/search", {
        params: {
          title: searchQuery,
          ...filters,
          sortField: sortOptions.field,
          sortOrder: sortOptions.order
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('supabaseToken')}`
        }
      });

      if (notes.data.data && notes.data.data.length > 0) {
        setSearchResults(notes.data.data);
        setSearchStatus("Found");
      } else {
        setSearchResults([]);
        setSearchStatus("Not-Found");
      }
    } catch (error) {
      console.log("Error Fetching Notes: ", error);
      if (error.response?.status === 401) {
        setError("Please login to search your notes");
      } else {
        setError("Failed to fetch notes. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    // Trigger search with the selected suggestion
    handleSearch({ preventDefault: () => {} });
  };

  const handleApplyFilters = () => {
    handleSearch({ preventDefault: () => {} });
  };

  const showPDF = async (fileUrl) => {
    try {
      window.open(fileUrl, "_blank", "noreferrer");
    } catch (error) {
      console.error('Error opening PDF:', error);
      alert('Failed to open PDF. The file might not exist or be inaccessible.');
    }
  };

  const handleDelete = async (fileId) => {
    if (isDeleting) return; // Prevent multiple delete requests
    
    if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('supabaseToken');
      if (!token) {
        toast.error("Authentication token missing. Please login again.");
        return;
      }

      console.log("Attempting to delete file:", fileId);
      const response = await axios.delete(
        `http://localhost:6969/notes/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Delete response:", response.data);
      if (response.data.success) {
        toast.success("File deleted successfully");
        // Remove the deleted file from search results
        setSearchResults(prevResults => prevResults.filter(file => file.id !== fileId));
      } else {
        throw new Error(response.data.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.error || "Failed to delete file. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Find My Notes</h1>
          <p className="text-sm sm:text-base text-gray-400">Search through your personal notes collection</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mx-auto mb-8 sm:mb-12 relative"
          onSubmit={handleSearch}
        >
          <div className="relative flex items-center">
            <input
              type="search"
              placeholder="Search your notes..."
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white bg-gray-800 rounded-full border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-14 sm:right-16 px-2 sm:px-4 py-2 text-gray-400 hover:text-white focus:outline-none"
            >
              <FaFilter className="text-base sm:text-lg" />
            </button>
            <button
              type="submit"
              className="absolute right-2 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300"
            >
              <FaSearch className="text-base sm:text-lg" />
            </button>
          </div>

          {/* Search Suggestions */}
          <SearchSuggestions
            searchQuery={searchQuery}
            onSuggestionClick={handleSuggestionClick}
            suggestions={suggestions}
            isLoading={isLoadingSuggestions}
          />
        </motion.form>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mb-8">
            <AdvancedSearchFilters
              filters={filters}
              setFilters={setFilters}
              sortOptions={sortOptions}
              setSortOptions={setSortOptions}
              onApplyFilters={handleApplyFilters}
            />
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500 mb-6 sm:mb-8 text-sm sm:text-base"
          >
            {error}
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4 sm:p-6 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {searchStatus === "Found" && searchResults.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-4 sm:p-6 hover:bg-gray-700 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white pr-2">{note.file_name}</h3>
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={isDeleting}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-900/20 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete file"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 line-clamp-2">{note.file_description}</p>
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {note.tags && (
                    (Array.isArray(note.tags) ? note.tags : note.tags.split(','))
                      .filter(tag => tag.trim())
                      .map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs sm:text-sm">
                          {tag.trim()}
                        </span>
                      ))
                  )}
                </div>
                <button 
                  onClick={() => showPDF(note.file_url)}
                  className="w-full py-2 px-4 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300"
                >
                  View File
                </button>
              </motion.div>
            ))}

            {searchStatus === "Not-Found" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-gray-400 py-8 sm:py-12"
              >
                <p className="text-xl sm:text-2xl">No notes found</p>
                <p className="mt-2 text-sm sm:text-base">Try different search terms or upload new notes</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
