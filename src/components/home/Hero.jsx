import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import imagesWebsite from "../../assets/images/imagesWebsite.png";
import { FaClock } from 'react-icons/fa';
import { FaShieldAlt } from 'react-icons/fa';

import { FaRegFolder } from 'react-icons/fa';
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
      
      <section>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center py-20">
         
          <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold leading-tight mb-6 text-gray-900"
            >
              Automation of Accounting Invoice Management with OCR
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-500 mb-8"
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
                className="no-underline px-6 py-3 text-white bg-[#75529e] hover:bg-[#5d3b85] rounded-lg shadow-md transition"
              >
                Start now
              </Link>
            </motion.div>
          </div>

         
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

     
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h1 className="text-3xl font-bold text-[#75529e] mb-8 text-center">
            Why Choose Invoice Management?
            </h1>

            <p className="text-lg text-gray-700 mb-10 text-center max-w-3xl mx-auto">
            Invoice Management is an all-in-one, robust solution crafted to automate 
            and simplify accounting tasks for both accounting firms and independent accountants. 
            This application integrates all necessary tools, allowing you to manage clients,
             invoices, and financial data efficiently and effortlessly.            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 mt-12">
       <motion.div
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
  className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition duration-300">

  <div className="flex items-center justify-center mb-6">
    <div className="w-12 h-12 bg-[#75529e]/10 rounded-full flex items-center justify-center mr-4">
      <FaClock className="text-[#75529e] text-2xl" /> {/* Icône React Icons */}
    </div>
    <h2 className="text-xl font-semibold text-[#75529e]">Save Time</h2>
  </div>
  <p className="text-gray-600">Use OCR to automatically extract invoice data, 
    eliminating manual entry for fast and accurate invoicing with minimal effort.</p>
</motion.div>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  viewport={{ once: true }}
  className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition duration-300"
>
  <div className="flex items-center justify-center mb-6">
    <div className="w-12 h-12 bg-[#75529e]/10 rounded-full flex items-center justify-center mr-4">
      <FaRegFolder className="text-[#75529e] text-2xl" /> 
    </div>
    <h2 className="text-xl font-semibold text-[#75529e]">Seamless File Organization</h2>
  </div>
  <p className="text-gray-600">Organize and manage files easily with a user-friendly interface and real-time access.</p>
</motion.div>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  viewport={{ once: true }}
  className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition duration-300"
>
  <div className="flex items-center mb-6">
    <FaShieldAlt className="w-10 h-10 text-[#75529e] mr-4" /> 
    <h2 className="text-xl font-semibold text-[#75529e]">Data Protection</h2>
  </div>
  <p className="text-gray-600">Safeguard your data with secure NoSQL storage (MongoDB), ensuring fast access and strong protection for sensitive financial information.</p>
</motion.div>


          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
