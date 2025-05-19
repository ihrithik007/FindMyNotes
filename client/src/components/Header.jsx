import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RiLogoutBoxLine, RiCloseLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { removeUserData } from "../Redux/slices/user-slice";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = useSelector((state) => state.user?.isAuthenticated ?? false);
  const user = useSelector((state) => state.user?.userData ?? null);

  const handleLogout = () => {
    dispatch(removeUserData());
    localStorage.removeItem('token');
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link 
          to="/" 
          className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          onClick={closeMobileMenu}
        >
          Home
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Link 
          to="/about" 
          className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
          onClick={closeMobileMenu}
        >
          About
        </Link>
      </motion.div>

      {isAuthenticated ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Link 
              to="/search" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              onClick={closeMobileMenu}
            >
              <FaSearch className="text-xl" />
              <span className="md:hidden">Search</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Link 
              to="/upload" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              onClick={closeMobileMenu}
            >
              <MdOutlineFileUpload className="text-[24px]" />
              <span className="md:hidden">Upload</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Link 
              to="/profile" 
              className="group relative flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              onClick={closeMobileMenu}
            >
              <IoPersonCircleOutline className="text-[28px]" />
              <span className="md:hidden">Profile</span>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 hidden md:block">
                Profile
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <button 
              onClick={handleLogout}
              className="group relative flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <RiLogoutBoxLine className="text-[28px]" />
              <span className="md:hidden">Logout</span>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 hidden md:block">
                Logout
              </span>
            </button>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Link 
              to="/login" 
              onClick={closeMobileMenu}
              className="inline-block rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              Login
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Link 
              to="/signup" 
              onClick={closeMobileMenu}
              className="inline-block rounded-xl bg-white/10 backdrop-blur-sm px-5 py-2 font-semibold text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              Signup
            </Link>
          </motion.div>
        </>
      )}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 backdrop-blur-lg border-b border-white/10">
      <div className="mx-auto max-w-[1550px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[80px] items-center justify-between">
          {/* Logo section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex h-[60px] w-[120px] items-center justify-center overflow-hidden"
          >
            <Link to="/" onClick={closeMobileMenu} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <img src="/logo.png" alt="Logo" className="relative h-full w-full object-contain" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            <NavLinks />
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMobileMenu}
            className="p-2 text-gray-300 hover:text-white md:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <RiCloseLine className="text-2xl" />
            ) : (
              <GiHamburgerMenu className="text-2xl" />
            )}
          </motion.button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[80px] left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-white/10 md:hidden"
              >
                <nav className="flex flex-col items-center gap-4 p-4">
                  <NavLinks />
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
