import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "/img/bgImg.jpg",
    "/img/bgImg2.jpg",
    "/img/bgImg3.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex h-full min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden">
      {/* Background Images with Parallax Effect */}
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: index === currentImage ? 1 : 0,
            scale: index === currentImage ? 1.1 : 1
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-[1000px] px-4 sm:px-6 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 mb-6">
            FindMyNotes
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed space-y-4">
            <span className="block">Your Ultimate Academic Resource Hub</span>
            <span className="block text-sm sm:text-base text-gray-300">
              Discover a revolutionary platform where students unite to share, organize, and access a diverse range of study materials. 
              From PDFs to presentations, documents to images – everything you need for academic excellence, all in one place.
            </span>
          </p>

          {/* Feature Highlights */}
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Multi-Format Support</h3>
              <p className="text-sm text-gray-300">Upload and share PDFs, documents, presentations, and images with ease</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Smart Organization</h3>
              <p className="text-sm text-gray-300">Categorize and filter your files by type for quick access</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6"
            >
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-300">Your files are protected with advanced security measures</p>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {isAuthenticated ? (
              <Link 
                to="/search" 
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-base sm:text-lg font-bold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Explore Resources
              </Link>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-base sm:text-lg font-bold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
                <Link 
                  to="/signup"
                  className="w-full sm:w-auto rounded-xl bg-white/10 backdrop-blur-sm px-8 py-3 text-base sm:text-lg font-bold text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentImage ? "bg-blue-500 scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
