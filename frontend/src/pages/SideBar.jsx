import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaEnvelope,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const SideBar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    { name: "Employee", path: "/employee_list", icon: <FaUsers /> },
    { name: "Calendar", path: "/calendar", icon: <FaCalendarAlt /> },
    { name: "Messages", path: "/messages", icon: <FaEnvelope /> },
  ];

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bg-white border-r border-gray-200 h-screen transform transition-transform duration-300 z-40 lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-screen">
          {/* Logo */}
          <div className="p-6 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-2xl font-bold text-blue-500 uppercase tracking-wider">
              RS Tech
            </h1>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setActiveItem(item.path)}
                className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-sm
                  ${
                    activeItem === item.path
                      ? "bg-blue-100 text-blue-600 shadow-md"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                {item.icon}
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default SideBar;
