"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function CreateRecipient() {
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
    childrenCount: { age0to5: 0, age6to18: 0 },
    adultsCount: { age18to64: 0 },
    ethnicity: "",
    foodPreference: "",
    servicesRequired: {
      foodPackage: "",
      backpacks: "",
      diapers: "",
      counseling: "",
      anyOther: "",
    },
    tookFood: false,
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prevData,
          [parent]: { ...prevData[parent], [child]: value },
        };
      }
      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/recipients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        alert("Failed to create recipient");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while creating the recipient.");
    }
  };

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
