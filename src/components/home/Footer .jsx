import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#75529e] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Invoice Management</h2>
            <p className="text-white/80 mb-6">
            Simplify your invoicing process with our all-in-one solution <br /> that automates your workflow, saves time, and ensures accuracy.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="bg-white/10 p-2 rounded-full hover:bg-[#fea928] transition-all duration-300">
                <FaFacebookF size={16} />
              </Link>
              <Link to="#" className="bg-white/10 p-2 rounded-full hover:bg-[#fea928] transition-all duration-300">
                <FaTwitter size={16} />
              </Link>
              <Link to="#" className="bg-white/10 p-2 rounded-full hover:bg-[#fea928] transition-all duration-300">
                <FaLinkedinIn size={16} />
              </Link>
              <Link to="#" className="bg-white/10 p-2 rounded-full hover:bg-[#fea928] transition-all duration-300">
                <FaGithub size={16} />
              </Link>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Contact Us</h3>
            <p className="text-white/80">
              If you have any questions or need assistance <br /> feel free to reach out to us.
            </p>
            <ul className="space-y-3 mt-4">
              <li>
                <Link to="/contact-us" className="text-white/80 hover:text-[#fea928] transition-colors duration-300">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Invoice Management. All rights reserved.
          </p>
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;
