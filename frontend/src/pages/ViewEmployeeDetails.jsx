import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const ViewEmployeeDetails = ({ employeeId, onClose }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/employees/${employeeId}`
        );
        setEmployee(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (!employeeId || loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-11/12 md:w-3/5 lg:w-2/5 rounded-xl shadow-2xl animate-slideUp overflow-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600">{employee.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="flex flex-col items-center md:items-start gap-4">
            {employee.profilePic ? (
              <img
                src={`http://localhost:5000/uploads/${employee.profilePic}`}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-gray-200 shadow-lg" />
            )}
            <p className="text-gray-500 font-medium mt-2">ID: {employee.employeeId}</p>
          </div>

          {/* Details */}
          <div className="col-span-2 flex flex-col gap-3 text-gray-700">
            <DetailRow label="Department" value={employee.department} />
            <DetailRow label="Designation" value={employee.designation} />
            <DetailRow label="Project" value={employee.project} />
            <DetailRow label="Type" value={employee.type} />
            <DetailRow label="Status" value={employee.status} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable row for neat layout
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="text-gray-800">{value || "N/A"}</span>
  </div>
);

export default ViewEmployeeDetails;
