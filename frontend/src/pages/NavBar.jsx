import React from 'react';
  import { FaBell, FaCog, FaUser } from 'react-icons/fa';

const NavBar = () => {
  return (
    <div className="bg-white p-5 border-b border-gray-300 shadow-sm">
      <header className="flex items-center justify-end space-x-4">
        <button
          className="text-black bg-gray-300 hover:bg-gray-400 cursor-pointer p-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          aria-label="Settings"
        >
          <FaCog size={24} />
        </button>
        <button
          className="text-black bg-gray-300 hover:bg-gray-400 cursor-pointer p-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg relative"
          aria-label="Notifications"
        >
          <FaBell size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full"></span>
        </button>
        <button
          className="text-black bg-gray-300 hover:bg-gray-400 cursor-pointer p-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          aria-label="User  profile"
        >
          <FaUser Circle size={24} />
        </button>
      </header>
    </div>
  );
};

export default NavBar;
