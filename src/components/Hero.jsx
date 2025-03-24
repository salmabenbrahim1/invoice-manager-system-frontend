import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from './Navbar';
import { motion } from "framer-motion";
import imagesWebsite from "../assets/images/imagesWebsite.png";

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="mt-7 pt-39 pb-39 md:pt-40 md:pb-52 relative">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          {/* Left Side */}
          <div className="w-full md:w-1/2 mb-6 md:mb-0 text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-gray-900 dark:text-white"
            >
              Automation of Accounting Invoice Management with OCR
              </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6"
            >

Simplify your accounting invoice management with our web application. Use OCR technology to
 automatically extract and organize your invoice data, saving you time and enhancing efficiency.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center md:justify-start"
            >
              <Link 
                to="/login" 
                className="px-6 py-3 text-white bg-[#75529e] hover:bg-[#5d3b85] rounded-lg shadow-md transition"
              >
Start now
              </Link>
            </motion.div>
          </div>

          {/* Right Side (Image) */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full max-w-md md:max-w-lg lg:max-w-xl"
              ref={heroRef}
            >
              <img 
                src={imagesWebsite} 
                alt="MyInvoice App Preview" 
                className="w-full h-auto object-contain"
              />
              <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-lg bg-[#75529e]/20 blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
