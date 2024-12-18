"use client";

import { fetchRecipients } from "@/utils/fetchHelpers";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

export default function Admin() {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [searchParams, setSearchParams] = useState({
    name: "",
    id: "",
    gender: "",
    registrationDate: "",
  }); 

  const [searchQuery, setSearchQuery] = useState(""); // State for the query URL

  useEffect(() => {
    
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/recipients${searchQuery}`);
        const data = await response.json();
        setUsers(data.recipients || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery]); 

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let query = "?";

    
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        query += `${key}=${searchParams[key]}&`;
      }
    });

    
    setSearchQuery(query.slice(0, -1));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const toggleTookFood = async (userId, currentStatus) => {
    try {
      const response = await fetch(`/api/recipients/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tookFood: !currentStatus }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, tookFood: !currentStatus } : user
          )
        );
      } else {
        console.error("Failed to update tookFood status");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const returnNotFound = (field) => {
    return field ?? "N/A";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const areufingserious = (tookFood) => {
    return tookFood ? "Yes" : "No";
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">User List</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <input
            type="text"
            name="name"
            placeholder="Search by name"
            value={searchParams.name}
            onChange={handleSearchChange}
            className="p-2 mr-2 bg-gray-800 text-white rounded"
          />
          <input
            type="text"
            name="id"
            placeholder="Search by ID"
            value={searchParams.id}
            onChange={handleSearchChange}
            className="p-2 mr-2 bg-gray-800 text-white rounded"
          />
          <input
            type="text"
            name="gender"
            placeholder="Search by gender"
            value={searchParams.gender}
            onChange={handleSearchChange}
            className="p-2 mr-2 bg-gray-800 text-white rounded"
          />
          <input
            type="date"
            name="registrationDate"
            value={searchParams.registrationDate}
            onChange={handleSearchChange}
            className="p-2 mr-2 bg-gray-800 text-white rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        {/* Displaying Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-gray-800 p-4 rounded-lg flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-medium">{returnNotFound(user.fullName)}</h2>
                <p className="text-gray-400">ID: {returnNotFound(user.ID)}</p>
                <p className="text-gray-400">Gender: {returnNotFound(user.gender)}</p>
                <p className="text-gray-400">Email Address: {returnNotFound(user.emailAddress)}</p>
                <p className="text-gray-400">Date of Birth: {formatDate(user.dateOfBirth)}</p>
                <p className="text-gray-400">Registration Date: {formatDate(user.registrationDate)}</p>
                <p className="text-gray-400">Did the recipient take the food? {areufingserious(user.tookFood)}</p>
              </div>
              <div className="mt-4 flex justify-around">
                <button
                  onClick={() => toggleTookFood(user._id, false)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  ✔ Took Food
                </button>
                <button
                  onClick={() => toggleTookFood(user._id, true)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  ✖ Did Not Take Food
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
