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
          [parent]: { ...prevData[parent], [child]: type === "number" ? Number(value) : value },
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
            { name: "dateOfBirth", placeholder: "Date of Birth", type: "date" },
            { name: "photoIDNumber", placeholder: "Photo ID Number" },
            { name: "photoIDType", placeholder: "Photo ID Type", type: "select", options: ["DL", "Passport", "I-94", "EAD", "Other"] },
            { name: "address", placeholder: "Address" },
            { name: "city", placeholder: "City" },
            { name: "state", placeholder: "State" },
            { name: "zipCode", placeholder: "Zip Code" },
            { name: "dateOfArrivalUSA", placeholder: "Date of Arrival (USA)", type: "date" },
            { name: "contactPhone", placeholder: "Contact Phone" },
            { name: "emailAddress", placeholder: "Email Address" },
            { name: "monthlyIncome", placeholder: "Monthly Income", type: "number" },
            { name: "foodStamp", placeholder: "Food Stamp", type: "checkbox" },
            { name: "cashAidAmount", placeholder: "Cash Aid Amount", type: "number" },
            { name: "ethnicity", placeholder: "Ethnicity" },
            { name: "foodPreference", placeholder: "Food Preference", type: "select", options: ["Halal", "Vegetarian", "Other"] },
            { name: "childrenCount.age0to5", placeholder: "Children (Age 0-5)", type: "number" },
            { name: "childrenCount.age6to18", placeholder: "Children (Age 6-18)", type: "number" },
            { name: "adultsCount.age18to64", placeholder: "Adults (Age 18-64)", type: "number" },
            { name: "servicesRequired.foodPackage", placeholder: "Food Package" },
            { name: "servicesRequired.backpacks", placeholder: "Backpacks" },
            { name: "servicesRequired.diapers", placeholder: "Diapers" },
            { name: "servicesRequired.counseling", placeholder: "Counseling" },
            { name: "servicesRequired.anyOther", placeholder: "Other Services" },
            { name: "tookFood", placeholder: "Took Food", type: "checkbox" },
          ].map(({ name, placeholder, type, options }) => (
            <div key={name} className="flex items-center space-x-4">
              <label className="w-1/4 text-right">{placeholder}:</label>
              {type === "select" ? (
                <select
                  name={name}
                  value={formData[name.split(".")[0]]?.[name.split(".")[1]] || formData[name]}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded w-full"
                >
                  <option value="">Select {placeholder}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type || "text"}
                  name={name}
                  value={formData[name.split(".")[0]]?.[name.split(".")[1]] || formData[name]}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded w-full"
                  step={type === "number" ? "any" : undefined}
                />
              )}
            </div>
          ))}
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
