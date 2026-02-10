import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              SafeTravel<span className="text-blue-500">.</span>
            </h2>
            <p className="text-sm leading-relaxed">
              Providing peace of mind for global explorers since 2010. Comprehensive coverage for medical, luggage, and trip cancellations.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-400 transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-700 transition-colors">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

     
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm mb-3">Subscribe for travel tips and exclusive discounts.</p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-md transition-all w-full">
                Subscribe
              </button>
            </form>
          </div>

       
          <div>
            <h3 className="text-white font-semibold mb-4">Insurance Plans</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Single Trip Cover</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Annual Multi-Trip</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Group Insurance</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Business Travel</a></li>
            </ul>
          </div>

    
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Claims Process</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

      
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-center md:text-left">© {new Date().getFullYear()} SafeTravel Insurance Ltd. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-center md:text-left">
            <p>123 Insurance St, London, UK</p>
            <p>+44 123 456 7890</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
