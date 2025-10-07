import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./pages/SideBar";
import NavBar from "./pages/NavBar";
import AddnewEmployee from "./pages/AddnewEmployee";
import EmployeeList from "./pages/EmployeeList";
import ViewEmployeeDetails from "./pages/ViewEmployeeDetails";

const App = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_4fr] min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main content */}
      <div className="flex flex-col lg:col-span-1 col-span-1">
        {/* Navbar */}
        <NavBar />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 bg-gray-100 overflow-auto">
          <Routes>
            <Route path="/" element={<EmployeeList />} />
            <Route path="/add_new_employee" element={<AddnewEmployee />} />
            <Route path="/employee_list" element={<EmployeeList />} />
            <Route path="/add_new_employee/:id" element={<AddnewEmployee />} />
            <Route path="/view_employee_details/:id" element={<ViewEmployeeDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
