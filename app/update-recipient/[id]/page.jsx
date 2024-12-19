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

  // Fetch recipient data when the page loads
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
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <input
                type="text"
                name="dateOfBirth"
                placeholder="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <input
                type="text"
                name="photoIDNumber"
                placeholder="Photo ID Number"
                value={formData.photoIDNumber}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
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
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded w-1/3"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded w-1/3"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded w-1/3"
                />
              </div>
              <input
                type="text"
                name="dateOfArrivalUSA"
                value={formData.dateOfArrivalUSA}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <input
                type="text"
                name="contactPhone"
                placeholder="Contact Phone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <input
                type="email"
                name="emailAddress"
                placeholder="Email Address"
                value={formData.emailAddress}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <input
                type="text"
                name="monthlyIncome"
                placeholder="Monthly Income"
                value={formData.monthlyIncome}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <input
                type="Text"
                name="foodStamp"
                placeholder="Food stamp"
                value={formData.foodStamp}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <input
                type="Number"
                name="cashAidAmount"
                placeholder="Cash aid amount"
                value={formData.cashAidAmount}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              
              <input
                  type="text"
                  name="childrenCount.age0to5"
                  placeholder="Children 0-5"
                  value={formData.childrenCount.age0to5}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded w-full"
              />
                <input
                  type="text"
                  name="childrenCount.age6to18"
                  placeholder="Children 6-18"
                  value={formData.childrenCount.age6to18}
                  onChange={handleChange}
                  className="p-2 bg-gray-800 rounded w-1/2"
                />
              
              <input
                type="text"
                name="adultsCount.age18to64"
                placeholder="Adults 18-64"
                value={formData.adultsCount.age18to64}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <input
                type="text"
                name="ethnicity"
                placeholder="Ethnicity"
                value={formData.ethnicity}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <input
                type="text"
                name="foodPreference"
                placeholder="Food Preference"
                value={formData.foodPreference}
                onChange={handleChange}
                className="p-2 bg-gray-800 rounded w-full"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="tookFood"
                  checked={formData.tookFood}
                  onChange={handleChange}
                />
                <span>Took Food</span>
              </label>
          {/* Add more fields as needed */}

          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update Recipient
          </button>
        </form>
      </main>
    </div>
  );
}
