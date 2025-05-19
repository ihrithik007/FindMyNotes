import React from "react";
import { motion } from "framer-motion";
import { FaFileAlt, FaSearch, FaLock, FaUsers, FaMobileAlt, FaCloudUploadAlt } from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: <FaFileAlt className="w-6 h-6" />,
      title: "Multi-Format Support",
      description: "Upload and share various file types including PDFs, Word documents, PowerPoint presentations, text files, and images. Our platform supports all common academic file formats."
    },
    {
      icon: <FaSearch className="w-6 h-6" />,
      title: "Smart Search",
      description: "Find exactly what you need with our advanced search functionality. Filter by file type, date, and more to quickly locate your study materials."
    },
    {
      icon: <FaLock className="w-6 h-6" />,
      title: "Secure Storage",
      description: "Your files are protected with enterprise-grade security. We use advanced encryption and secure cloud storage to ensure your data remains private and safe."
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Community Driven",
      description: "Join a thriving community of students. Share resources, collaborate on projects, and learn from peers across different institutions."
    },
    {
      icon: <FaMobileAlt className="w-6 h-6" />,
      title: "Responsive Design",
      description: "Access your files anytime, anywhere. Our platform is fully responsive, working seamlessly across all devices from desktops to smartphones."
    },
    {
      icon: <FaCloudUploadAlt className="w-6 h-6" />,
      title: "Easy Organization",
      description: "Keep your study materials organized with our intuitive categorization system. Sort files by type, subject, or date for quick access."
    }
  ];

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
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 sm:mb-20"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-12 shadow-xl border border-white/20">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                  About FindMyNotes
                  <span className="block mt-2 text-blue-400 text-2xl sm:text-3xl md:text-4xl">Your Academic Resource Hub</span>
                </h1>
                <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed">
                  FindMyNotes is revolutionizing how students share and access educational resources. 
                  We've created a platform that combines powerful features with intuitive design, 
                  making it easier than ever to manage your academic materials.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-16 sm:mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 hover:border-white/30 transition-all duration-300">
                  <div className="text-blue-400 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mission Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mb-16 sm:mb-20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-12 shadow-xl border border-white/20">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-lg leading-relaxed text-gray-300">
                  We're committed to breaking down barriers in education by providing a platform 
                  where knowledge flows freely and securely. Our goal is to empower students 
                  worldwide with easy access to quality study materials, fostering a collaborative 
                  learning environment that transcends geographical boundaries.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
              <img
                src="./aboutUs.svg"
                alt="About Us Illustration"
                className="w-[280px] sm:w-[350px] md:w-[400px] lg:w-[500px] xl:w-[600px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
