import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/slices/user-slice";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:6969/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Registration successful! Please check your email to confirm your account.");
        navigate("/login");
      } else {
        toast.error(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Signup Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-[420px]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-30"></div>
        <form 
          className="relative flex w-full flex-col gap-6 rounded-2xl bg-white/10 backdrop-blur-lg p-8 shadow-xl border border-white/20"
          onSubmit={registerUser}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">Join our community of learners</p>
          </motion.div>

          <div className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-start justify-center"
            >
              <label className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2" htmlFor="name">
                <FaUser className="text-blue-400" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-start justify-center"
            >
              <label className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2" htmlFor="email">
                <FaEnvelope className="text-blue-400" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col items-start justify-center"
            >
              <label className="text-sm font-medium text-gray-200 mb-2 flex items-center gap-2" htmlFor="password">
                <FaLock className="text-blue-400" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full rounded-xl border border-white/20 bg-white/10 p-3 text-white placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="group relative rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-[2px] transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
            type="submit"
            disabled={isLoading}
          >
            <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 font-medium text-white transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-700 disabled:opacity-50">
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <FaUserPlus className="text-lg" />
                  Create Account
                </>
              )}
            </div>
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center text-sm text-gray-300"
          >
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in here
            </a>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
