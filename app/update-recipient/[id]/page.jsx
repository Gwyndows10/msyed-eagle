"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";

export default function UpdateRecipient({ params }) {
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    photoIDNumber: "",
    photoIDType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfArrivalUSA: "",
    contactPhone: "",
    emailAddress: "",
    monthlyIncome: "",
    foodStamp: false,
    cashAidAmount: "",
    childrenCount: { age0to5: "", age6to18: "" },
    adultsCount: { age18to64: "" },
    ethnicity: "",
    foodPreference: "",
    servicesRequired: {
      foodPackage: false,
      backpacks: false,
      diapers: false,
      counseling: false,
      anyOther: "",
    },
    tookFood: false,
  });

  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const response = await fetch(`/api/recipients/${id}`);
        const data = await response.json();

        if (data.recipient) {
          setRecipient(data.recipient);
          setFormData({ ...data.recipient });
        } else {
          setError("Recipient not found");
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching recipient data");
        setLoading(false);
      }
    };

    fetchRecipient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const [key, subKey] = name.split(".");

    if (subKey) {
      setFormData((prev) => ({
        ...prev,
        [key]: { ...prev[key], [subKey]: type === "checkbox" ? checked : value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/recipients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Recipient updated successfully");
        router.push("/admin"); 
      } else {
        alert("Failed to update recipient");
      }
    } catch (err) {
      alert("An error occurred while updating the recipient");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "fullName", placeholder: "Full Name" },
              { name: "dateOfBirth", placeholder: "Date of Birth" },
              { name: "photoIDNumber", placeholder: "Photo ID Number" },
              { name: "address", placeholder: "Address" },
              { name: "city", placeholder: "City" },
              { name: "state", placeholder: "State" },
              { name: "zipCode", placeholder: "Zip Code" },
              { name: "dateOfArrivalUSA", placeholder: "Date of Arrival (USA)" },
              { name: "contactPhone", placeholder: "Contact Phone" },
              { name: "emailAddress", placeholder: "Email Address" },
              { name: "monthlyIncome", placeholder: "Monthly Income" },
              { name: "ethnicity", placeholder: "Ethnicity" },
              { name: "foodPreference", placeholder: "Food Preference" },
            ].map(({ name, placeholder }) => (
              <div key={name} className="flex items-center space-x-4">
                <label className="w-1/4 text-right">{placeholder}:</label>
                <input
                  type="text"
                  name={name}
                  //placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded w-full"
                />
              </div>
            ))}
  
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-right">Photo ID Type:</label>
              <select
                name="photoIDType"
                value={formData.photoIDType}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              >
                <option value="">Select Photo ID Type</option>
                <option value="DL">DL</option>
                <option value="Passport">Passport</option>
                <option value="I-94">I-94</option>
                <option value="EAD">EAD</option>
                <option value="Other">Other</option>
              </select>
            </div>
  
            <div className="flex items-center space-x-4">
              <label className="w-1/4 text-right">Took Food:</label>
              <input
                type="checkbox"
                name="tookFood"
                checked={formData.tookFood}
                onChange={handleChange}
              />
            </div>
  
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              Create Recipient
            </button>
          </form>
        </main>
      </div>
    );
  }