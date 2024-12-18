"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";

export default function UpdateRecipient({ params }) {
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    ID: "",
    emailAddress: "",
    contactPhone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfArrivalUSA: "",
    monthlyIncome: "",
    foodStamp: false,
    cashAidAmount: "",
    childrenCount: { age0to5: "", age6to18: "" },
    adultsCount: { age18to64: "" },
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update formData with new value
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        router.push("/admin"); // Redirect back to the admin page or recipient list
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
        <h1 className="text-2xl font-semibold mb-6">Update Recipient</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="p-2 bg-gray-800 text-white rounded w-full"
            />
          </div>
          <div>
            <label className="block">ID</label>
            <input
              type="text"
              name="ID"
              value={formData.ID}
              onChange={handleInputChange}
              className="p-2 bg-gray-800 text-white rounded w-full"
            />
          </div>
          <div>
            <label className="block">Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleInputChange}
              className="p-2 bg-gray-800 text-white rounded w-full"
            />
          </div>
          <div>
            <label className="block">Phone</label>
            <input
              type="text"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              className="p-2 bg-gray-800 text-white rounded w-full"
            />
          </div>
          {/* Add more fields as needed */}
          <div>
            <label className="block">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="p-2 bg-gray-800 text-white rounded w-full"
            />
          </div>

          {/* Continue adding other fields in the same way */}

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
