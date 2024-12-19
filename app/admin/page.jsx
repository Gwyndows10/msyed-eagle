"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Lock from "@/components/lock";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    fullName: "",
    emailAddress: "",
    contactPhone: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let query = "?";
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) query += `${key}=${searchParams[key]}&`;
    });
    setSearchQuery(query.slice(0, -1));
  };

  const toggleTookFood = async (userId, currentStatus) => {
    try {
      const response = await fetch(`/api/recipients/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tookFood: !currentStatus }),
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, tookFood: !currentStatus } : user
          )
        );
      } else console.error("Failed to update tookFood status in toggle took food");
    } catch (err) {
      console.error(err);
    }
  };
  const handleResetTookFood = async (userId) => {
    try {
      const response = await fetch(`/api/recipients/reset-took-food`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) => ({ ...user, tookFood: false })) 
        );
      } else {
        console.error("Failed to reset tookFood status for all users");
      }
    } catch (err) {
      console.error("Error resetting tookFood:", err);
    }
  };
  
  const handleUpdateUser = (userId) => {
    router.push(`/update-recipient/${userId}`);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`/api/recipients/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setUsers((prev) => prev.filter((user) => user._id !== userId));
        } else {
          console.error("Failed to delete user");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const formatField = (field) => field ?? "N/A";
  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "N/A");
  const displayBoolean = (value) => (value ? "Yes" : "No");

  const ui = (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar handleResetTookFood={handleResetTookFood}/>
      
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">Recipient List</h1>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={searchParams.fullName}
            onChange={handleSearchChange}
            className="flex-1 min-w-[200px] p-2 bg-gray-800 text-white rounded"
          />
          <input
            type="email"
            name="emailAddress"
            placeholder="Email"
            value={searchParams.emailAddress}
            onChange={handleSearchChange}
            className="flex-1 min-w-[200px] p-2 bg-gray-800 text-white rounded"
          />
          <input
            type="text"
            name="contactPhone"
            placeholder="Phone"
            value={searchParams.contactPhone}
            onChange={handleSearchChange}
            className="flex-1 min-w-[200px] p-2 bg-gray-800 text-white rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        {/* Recipient List */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div key={user._id} className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">{formatField(user.fullName)}</h2>
                <p>Email: {formatField(user.emailAddress)}</p>
                <p>Phone: {formatField(user.contactPhone)}</p>
                <p>Date of Birth: {formatDate(user.dateOfBirth)}</p>
                <p>Photo ID Number: {formatField(user.photoIDNumber)}</p>
                <p>Photo ID Type: {formatField(user.photoIDType)}</p>
                <p>Address: {formatField(user.address)}</p>
                <p>City: {formatField(user.city)}</p>
                <p>State: {formatField(user.state)}</p>
                <p>Zip Code: {formatField(user.zipCode)}</p>
                <p>Date of Arrival in USA: {formatDate(user.dateOfArrivalUSA)}</p>
                <p>Monthly Income: {formatField(user.monthlyIncome)}</p>
                <p>Food Stamp: {displayBoolean(user.foodStamp)}</p>
                <p>Cash Aid Amount: {formatField(user.cashAidAmount)}</p>
                <p>Children (Age 0-5): {user.childrenCount?.age0to5 ?? 0}</p>
                <p>Children (Age 6-18): {user.childrenCount?.age6to18 ?? 0}</p>
                <p>Adults (Age 18-64): {user.adultsCount?.age18to64 ?? 0}</p>
                <p>Ethnicity: {formatField(user.ethnicity)}</p>
                <p>Food Preference: {formatField(user.foodPreference)}</p>
                <p>Services Required:</p>
                <ul>
                  <li>Food Package: {formatField(user.servicesRequired?.foodPackage ?? "N/A")}</li>
                  <li>Backpacks: {formatField(user.servicesRequired?.backpacks ?? "N/A")}</li>
                  <li>Diapers: {formatField(user.servicesRequired?.diapers ?? "N/A")}</li>
                  <li>Counseling: {formatField(user.servicesRequired?.counseling ?? "N/A")}</li>
                  <li>Other: {formatField(user.servicesRequired?.anyOther ?? "N/A")}</li>
                </ul>
                <p>Took Food: {displayBoolean(user.tookFood)}</p>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => toggleTookFood(user._id, user.tookFood)}
                    className={`px-4 py-2 rounded ${user.tookFood ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                  >
                    {user.tookFood ? "Undo Took Food" : "Mark as Took Food"}
                  </button>
                  <button
                    onClick={() => handleUpdateUser(user._id)}
                    className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );

  return (
    <Lock showUI={ui}/>
  );
}
