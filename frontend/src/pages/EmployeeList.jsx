import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaEdit, FaTrashAlt, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import ViewEmployeeDetails from "./ViewEmployeeDetails";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees");
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee");
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition"
            title="Go Back"
          >
            <FaArrowLeft size={18} />
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600">Employee List</h2>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Add Employee */}
          <button
            onClick={() => navigate("/add_new_employee")}
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700 transition"
          >
            <FaPlus size={14} /> Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200 flex-1">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-medium">
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Employee ID</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Designation</th>
              <th className="p-3 text-left">Project</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 flex items-center gap-2">
                    {emp.profilePic ? (
                      <img
                        src={`http://localhost:5000/uploads/${emp.profilePic}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    )}
                    <span className="font-medium text-gray-800">{emp.name}</span>
                  </td>
                  <td className="p-3 text-gray-700">{emp.employeeId}</td>
                  <td className="p-3 text-gray-700">{emp.department}</td>
                  <td className="p-3 text-gray-700">{emp.designation}</td>
                  <td className="p-3 text-gray-700">{emp.project}</td>
                  <td className="p-3 text-gray-700">{emp.type}</td>
                  <td className="p-3 text-gray-700">{emp.status}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => navigate(`/add_new_employee/${emp.id}`)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                      title="Delete"
                    >
                      <FaTrashAlt size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedEmployeeId(emp.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                      title="View"
                    >
                      <FaEye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Employee Modal */}
      {selectedEmployeeId && (
        <ViewEmployeeDetails
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
        />
      )}
    </div>
  );
};

export default EmployeeList;
