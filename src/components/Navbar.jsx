import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-[#031d14] text-white py-6 px-8 flex justify-between items-center z-50 sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        {/* Custom SVG icon reflecting the 'Sustainify' droplet footsteps */}
        <div className="flex gap-1 items-end relative bottom-0.5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[#4ade80] w-8 h-8">
             <g transform="translate(-2, 2)">
               <path d="M 8 12 C 5 15, 6 20, 8 20 C 10 20, 11 15, 8 12Z" />
               <circle cx="4.5" cy="11.5" r="1.5" />
               <circle cx="8" cy="9" r="1.5" />
               <circle cx="11.5" cy="11.5" r="1.5" />
             </g>
             <g transform="translate(6, -2)">
               <path d="M 8 12 C 5 15, 6 20, 8 20 C 10 20, 11 15, 8 12Z" />
               <circle cx="4.5" cy="11.5" r="1.5" />
               <circle cx="8" cy="9" r="1.5" />
               <circle cx="11.5" cy="11.5" r="1.5" />
             </g>
          </svg>
        </div>
        <h1 className="text-2xl font-black tracking-tight flex items-center">
          <span className="text-white">Sustaini</span>
          <span className="text-[#4ade80]">fy</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive 
              ? "text-white border-b-2 border-[#4ade80] pb-1" 
              : "text-gray-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent"
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/goals" 
          className={({ isActive }) => 
            isActive 
              ? "text-white border-b-2 border-[#4ade80] pb-1" 
              : "text-gray-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent"
          }
        >
          The 17 Goals
        </NavLink>
        <a 
          href="https://sdgs.un.org/goals" 
          target="_blank"
          rel="noreferrer"
          className="text-gray-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent"
        >
          Official UN Site
        </a>
      </div>
      
      {/* Mobile Menu Icon (Placeholder) */}
      <div className="md:hidden text-white cursor-pointer hover:text-[#4ade80]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </div>
    </nav>
  );
};

export default Navbar;
