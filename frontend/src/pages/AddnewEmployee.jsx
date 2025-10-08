import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaCamera, FaArrowLeft } from "react-icons/fa";

const SelectInput = ({ label, register, name, options, errors }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <select
      {...register(name, { required: `${label} is required` })}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
    >
      <option value="">Select {label}</option>
      {options.map((opt, index) => (
        <option key={index} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
    )}
  </div>
);

const TextInput = ({ label, register, name, placeholder, errors }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <input
      type="text"
      {...register(name, { required: `${label} is required` })}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
    />
    {errors[name] && (
      <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
    )}
  </div>
);

const AddNewEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [preview, setPreview] = useState(null);
  const [existingPic, setExistingPic] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const profilePic = watch("profilePic");

  const departments = ["HR", "IT", "Development", "Marketing"];
  const designations = [
    "Software Engineer",
    "Team Lead",
    "Manager",
    "Intern",
  ];
  const types = ["Full-Time", "Part-Time", "Contract"];
  const statuses = ["Active", "Inactive", "On Leave"];

  useEffect(() => {
    if (!id) return;
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/employees/${id}`
        );
        reset({
          name: data.name || "",
          employeeId: data.employeeId || "",
          department: data.department || "",
          designation: data.designation || "",
          project: data.project || "",
          type: data.type || "",
          status: data.status || "",
        });
        if (data.profilePic) {
          setExistingPic(data.profilePic);
          setPreview(`http://localhost:5000/uploads/${data.profilePic}`);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, reset]);

  useEffect(() => {
    if (profilePic && profilePic.length > 0) {
      setExistingPic(null);
      setPreview(URL.createObjectURL(profilePic[0]));
    }
  }, [profilePic]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "profilePic") {
          if (value && value.length > 0) formData.append(key, value[0]);
          else if (id && existingPic) formData.append(key, existingPic);
        } else if (value) formData.append(key, value);
      });

      if (id) {
        await axios.put(
          `http://localhost:5000/api/employees/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Employee updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/employees",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Employee added successfully!");
      }
      navigate("/employee_list");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-8 sm:p-10 border border-gray-200 flex flex-col"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          {id ? "Edit Employee" : "Add New Employee"}
        </h2>

        <button
          onClick={() => navigate(-1)}
          type="button"
          className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full transition mb-6 self-start"
          title="Go Back"
        >
          <FaArrowLeft size={18} />
        </button>

       
        <div className="mb-8 flex flex-col items-center">
          <label htmlFor="profilePic" className="cursor-pointer relative group">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center border-4 border-dashed border-gray-400 shadow-md transition-all group-hover:border-blue-400 group-hover:bg-blue-50">
                <FaCamera className="text-gray-500 text-4xl group-hover:text-blue-600 transition-colors" />
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <FaCamera className="text-white text-2xl" />
            </div>
          </label>
          <input
            id="profilePic"
            type="file"
            {...register("profilePic")}
            accept="image/*"
            className="hidden"
          />
          <p className="text-sm text-gray-600 mt-2">
            {preview ? "Click to change photo" : "Upload profile photo"}
          </p>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TextInput
            label="Employee Name"
            name="name"
            register={register}
            placeholder="Enter your Name"
            errors={errors}
          />
          <TextInput
            label="Employee ID"
            name="employeeId"
            register={register}
            placeholder="Enter your ID"
            errors={errors}
          />
          <SelectInput
            label="Department"
            name="department"
            register={register}
            options={departments}
            errors={errors}
          />
          <SelectInput
            label="Designation"
            name="designation"
            register={register}
            options={designations}
            errors={errors}
          />
          <TextInput
            label="Project"
            name="project"
            register={register}
            placeholder="Project Name"
            errors={errors}
          />
          <SelectInput
            label="Type"
            name="type"
            register={register}
            options={types}
            errors={errors}
          />
          <SelectInput
            label="Status"
            name="status"
            register={register}
            options={statuses}
            errors={errors}
          />
        </div>

       
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/employee_list")}
            className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 hover:text-gray-900 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-[1.02]"
            }`}
          >
            {loading ? "Saving..." : id ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewEmployee;
