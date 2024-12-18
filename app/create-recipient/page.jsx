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
