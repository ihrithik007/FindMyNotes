import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaFileAlt, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const UploadNote = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileType, setFileType] = useState("");

  const user = useSelector((state) => state.user.userData);
  const userId = user?.id;

  const allowedFileTypes = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'text/plain': 'TXT',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/gif': 'GIF'
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file type
    if (!allowedFileTypes[selectedFile.type]) {
      toast.error("Invalid file type. Allowed types: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG, GIF");
      e.target.value = '';
      return;
    }

    // Check file size (20MB limit)
    if (selectedFile.size > 20 * 1024 * 1024) {
      toast.error("File size should be less than 20MB");
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
    setFileType(allowedFileTypes[selectedFile.type]);
  };

  const submitFile = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (!userId) {
        toast.error("Please login to upload notes");
        return;
      }

      if (!file) {
        toast.error("Please select a file to upload");
        return;
      }

      if (!title) {
        toast.error("Please enter a title for your note");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);
      formData.append("description", title);
      formData.append("fileType", fileType);

      const token = localStorage.getItem('supabaseToken');
      if (!token) {
        toast.error("Authentication token missing. Please login again.");
        return;
      }

      const result = await axios.post(
        "http://localhost:6969/notes/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        },
      );

      if (result.data.error) {
        toast.error(result.data.error);
        return;
      }

      toast.success("File Uploaded Successfully");
      // Clear form
      setTitle("");
      setFile(null);
      setFileType("");
      // Reset file input
      document.getElementById('dropzone-file').value = '';

    } catch (error) {
      console.error("Failed to submit file: ", error);
      const errorMessage = error.response?.data?.error || "Failed to upload file. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-[130px] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
          <form 
            className="relative flex w-full flex-col gap-6 rounded-2xl bg-white/10 backdrop-blur-lg p-8 shadow-xl border border-white/20"
            onSubmit={submitFile}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-white mb-2">Upload Your File</h1>
              <p className="text-gray-300">Share your study materials with the community</p>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
                  File Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter a descriptive title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="mb-4"
                    >
                      <FaCloudUploadAlt className="w-12 h-12 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    </motion.div>
                    <p className="mb-2 text-sm text-gray-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG, GIF (max 20MB)
                    </p>
                    {file && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-center gap-2 text-sm"
                      >
                        <FaFileAlt className="text-blue-400" />
                        <span className="text-blue-300">{file.name}</span>
                        <span className="text-gray-400">({fileType})</span>
                      </motion.div>
                    )}
                    <input
                      id="dropzone-file"
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex justify-center"
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-[2px] transition-all duration-300 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                  <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 font-medium text-white transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-700">
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin text-lg" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-lg" />
                        Upload File
                      </>
                    )}
                  </div>
                </button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UploadNote;
