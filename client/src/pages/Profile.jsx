import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaTrash, FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileAlt, FaFileImage } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const user = useSelector((state) => state.user.userData);
  const [userFiles, setUserFiles] = useState([]);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const userId = user?.id;

  // File type icons mapping
  const fileTypeIcons = {
    'PDF': <FaFilePdf className="w-5 h-5 text-red-500" />,
    'DOC': <FaFileWord className="w-5 h-5 text-blue-500" />,
    'DOCX': <FaFileWord className="w-5 h-5 text-blue-500" />,
    'PPT': <FaFilePowerpoint className="w-5 h-5 text-orange-500" />,
    'PPTX': <FaFilePowerpoint className="w-5 h-5 text-orange-500" />,
    'TXT': <FaFileAlt className="w-5 h-5 text-gray-500" />,
    'JPG': <FaFileImage className="w-5 h-5 text-green-500" />,
    'PNG': <FaFileImage className="w-5 h-5 text-green-500" />,
    'GIF': <FaFileImage className="w-5 h-5 text-green-500" />
  };

  // Get unique file types for categories
  const fileCategories = ["all", ...new Set(userFiles.map(file => file.file_type))];

  // Filter files based on selected category
  const filteredFiles = selectedCategory === "all" 
    ? userFiles 
    : userFiles.filter(file => file.file_type === selectedCategory);

  // Count files by type
  const fileCounts = userFiles.reduce((acc, file) => {
    acc[file.file_type] = (acc[file.file_type] || 0) + 1;
    return acc;
  }, {});

  const getUserFiles = async () => {
    try {
      const result = await axios.get(
        `http://localhost:6969/notes/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('supabaseToken')}`
          }
        }
      );
      console.log(result.data);
      setUserFiles(result.data.data);
    } catch (error) {
      console.error("Error fetching user files:", error);
      setError("Failed to load your documents. Please try again later.");
    }
  };

  useEffect(() => {
    if (userId) {
      getUserFiles();
    }
  }, [userId]);

  const handlePdfClick = async (fileUrl) => {
    try {
      window.open(fileUrl, "_blank", "noreferrer");
    } catch (error) {
      console.error('Error opening PDF:', error);
      alert('Failed to open PDF. The file might not exist or be inaccessible.');
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again later.');
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
        // Refresh the file list
        getUserFiles();
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
    <div className="min-h-screen pt-[80px] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1 mb-4"
                >
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-3xl font-bold text-white">
                    {user?.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
                  </div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-bold text-white"
                >
                  {user?.user_metadata?.full_name || "User"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-2 text-base sm:text-lg text-gray-300"
                >
                  {user?.email}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-6 flex flex-wrap gap-4 justify-center"
                >
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20">
                    <p className="text-sm text-gray-300 font-medium">Total Files</p>
                    <p className="text-2xl font-bold text-white">{userFiles.length}</p>
                  </div>
                  {Object.entries(fileCounts).map(([type, count], index) => (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20"
                    >
                      <p className="text-sm text-gray-300 font-medium">{type}</p>
                      <p className="text-2xl font-bold text-white">{count}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {fileCategories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {category === 'all' ? 'All Files' : category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Documents Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-xl sm:text-2xl font-bold text-white mb-6"
              >
                {selectedCategory === 'all' ? 'All Files' : `${selectedCategory} Files`}
              </motion.h3>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-center py-4 bg-red-500/10 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {filteredFiles.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 text-gray-400"
                  >
                    No files found in this category.
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {filteredFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
                      >
                        <div className="flex items-center gap-4 flex-grow min-w-0">
                          <div className="flex-shrink-0">
                            {fileTypeIcons[file.file_type] || <FaFileAlt className="w-5 h-5 text-gray-400" />}
                          </div>
                          <div className="min-w-0 flex-grow">
                            <h4 className="text-sm sm:text-base font-medium text-white truncate">
                              {file.file_name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-400">
                              Type: {file.file_type}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handlePdfClick(file.file_url)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="View file"
                          >
                            <FaExternalLinkAlt className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDownload(file.file_url, file.file_name)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Download file"
                          >
                            <FiDownload className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(file.id)}
                            disabled={isDeleting}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete file"
                          >
                            <FaTrash className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
