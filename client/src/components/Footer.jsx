import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* About Us Section */}
          <div className="space-y-4">
            <h2 className="relative text-xl sm:text-2xl font-bold text-white">
              About Us
              <span className="absolute -bottom-2 left-0 h-0.5 w-12 bg-blue-500"></span>
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Because your planning is not always perfect, you need to be able to
              study whenever, wherever. Just read your notes one last time on your
              tablet or phone while you're on the go.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h2 className="relative text-xl sm:text-2xl font-bold text-white">
              Quick Links
              <span className="absolute -bottom-2 left-0 h-0.5 w-12 bg-blue-500"></span>
            </h2>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h2 className="relative text-xl sm:text-2xl font-bold text-white">
              Connect With Us
              <span className="absolute -bottom-2 left-0 h-0.5 w-12 bg-blue-500"></span>
            </h2>
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="mailto:findmynotes2024@gmail.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-gray-300 hover:text-blue-400 hover:bg-white/20 transition-all duration-300"
                title="Email Us"
              >
                <FaEnvelope className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-gray-300 hover:text-blue-400 hover:bg-white/20 transition-all duration-300"
                title="Follow us on Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-gray-300 hover:text-blue-400 hover:bg-white/20 transition-all duration-300"
                title="Follow us on Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-gray-300 hover:text-blue-400 hover:bg-white/20 transition-all duration-300"
                title="Follow us on LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-300">
            © {new Date().getFullYear()} FindMyNotes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
