"use client";

import { fetchRecipients } from "@/utils/fetchHelpers";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function Admin() {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch all users from the backend
    const fetchUsers = async () => {
      try {
        const recipients = await fetchRecipients();
        setUsers(recipients);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getGender = (gender) => {
    if (gender === 0) return "Male";
    if (gender === 1) return "Female";
    return "N/A"; 
  };

  const returnNotFound = (field) => {
    return field ?? "N/A"; 
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">User List</h1>
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user._id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-medium">{returnNotFound(user.fullName)}</h2>
                <p className="text-gray-400">ID: {returnNotFound(user.ID)}</p>
                <p className="text-gray-400">Gender: {getGender(user.gender)}</p>
                <p className="text-gray-400">Email Address: {returnNotFound(user.emailAddress)}</p>
                <p className="text-gray-400">Date of Birth: {returnNotFound(user.dateOfBirth)}</p>
                <p className="text-gray-400">Registration Date: {returnNotFound(user.registrationDate)}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

