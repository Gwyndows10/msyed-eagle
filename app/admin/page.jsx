"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Lock from "@/components/lock";
import SearchForm from "@/components/SearchForm";

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
  const [resetMessage, setResetMessage] = useState(""); 
  const [isResetting, setIsResetting] = useState(false); 
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
  
  const toggleTookFood = async (userId, currentStatus) => {
    try {
      const response = await fetch(`/api/recipients/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tookFood: !currentStatus }), // Toggle tookFood status
      });
  
      if (response.ok) {
        // Update the user list with the new tookFood status
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, tookFood: !currentStatus } : user
          )
        );
      } else {
        console.error("Failed to update tookFood status in toggle took food");
      }
    } catch (err) {
      console.error("Error in toggleTookFood:", err);
    }
  };
  const handleResetTookFood = async () => {
    setIsResetting(true);
    setResetMessage("");

    try {
      const response = await fetch("/api/recipients/reset-took-food", {
        method: "PUT",
      });

      const result = await response.json();

      if (response.ok) {
        setResetMessage(result.message);
        router.refresh();
      } else {
        setResetMessage(result.error || "Failed to reset TookFood status.");
      }
    } catch (error) {
      console.error("Error in resetTookFood:", error);
      setResetMessage("An error occurred while resetting TookFood status.");
    } finally {
      setIsResetting(false);
    }
  };
  const [selectedUser, setSelectedUser] = useState(null); 

  const handleRowClick = (user) => {
    setSelectedUser(user); 
  };
  
  const handleCloseDetails = () => {
    setSelectedUser(null); 
  };
  
  const ui = (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar handleResetTookFood={handleResetTookFood}/>

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">Recipient List</h1>

        <SearchForm
          searchParams={searchParams}
          handleSearchChange={handleSearchChange}
          handleSearchSubmit={handleSearchSubmit}
        />

        {/* User Table */}
        {loading ? (
  <div>Loading...</div>
) : error ? (
  <div>Error: {error}</div>
) : (
  <table className="min-w-full bg-gray-800 rounded-lg">
    <thead>
      <tr>
        <th className="px-4 py-2 text-left">Full Name</th>
        <th className="px-4 py-2 text-left">Email</th>
        <th className="px-4 py-2 text-left">Phone</th>
        <th className="px-4 py-2 text-left">Took Food</th>
        <th className="px-4 py-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr
          key={user._id}
          className="hover:bg-gray-700 cursor-pointer"
          onClick={() => handleRowClick(user)}  
        >
          <td className="px-4 py-2">{user.fullName ?? "N/A"}</td>
          <td className="px-4 py-2">{user.emailAddress ?? "N/A"}</td>
          <td className="px-4 py-2">{user.contactPhone ?? "N/A"}</td>
          <td className="px-4 py-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                toggleTookFood(user._id, user.tookFood);
              }}
              className={`px-4 py-2 text-sm rounded-full ${user.tookFood ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-600"}`}
            >
              {user.tookFood ? "Undo Took Food" : "Mark as Took Food"}
            </button>
          </td>
          <td className="px-4 py-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateUser(user._id)
              }}
              className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600"
            >
              Update
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(user._id)}
            }
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 ml-2"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}

{/* User Details Modal or Section */}
{selectedUser && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
  <div className="bg-gray-800 p-6 rounded-lg w-2/3 max-w-lg relative flex flex-col items-center"> 
    <h2 className="text-2xl font-semibold mb-4 text-center">{selectedUser.fullName}</h2> 
      <button
        onClick={handleCloseDetails}
        className="absolute top-2 right-2 text-white text-xl p-1 rounded-full hover:bg-gray-700"
      >
        &times;
      </button>

      <p><strong>Email:</strong> {selectedUser.emailAddress ?? "N/A"}</p>
<p><strong>Phone:</strong> {selectedUser.contactPhone ?? "N/A"}</p>
<p><strong>Address:</strong> {selectedUser.address ?? "N/A"}</p>
<p><strong>City:</strong> {selectedUser.city ?? "N/A"}</p>
<p><strong>State:</strong> {selectedUser.state ?? "N/A"}</p>
<p><strong>Zip Code:</strong> {selectedUser.zipCode ?? "N/A"}</p>
<p><strong>Food Preference:</strong> {selectedUser.foodPreference ?? "N/A"}</p>
<p><strong>Food Stamp:</strong> {selectedUser.foodStamp ? "Yes" : "No"}</p>
<p><strong>Date of Birth:</strong> {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : "N/A"}</p>
<p><strong>Photo ID Number:</strong> {selectedUser.photoIDNumber ?? "N/A"}</p>
<p><strong>Photo ID Type:</strong> {selectedUser.photoIDType ?? "N/A"}</p>
<p><strong>Date of Arrival to USA:</strong> {selectedUser.dateOfArrivalUSA ? new Date(selectedUser.dateOfArrivalUSA).toLocaleDateString() : "N/A"}</p>
<p><strong>Monthly Income:</strong> {selectedUser.monthlyIncome ? `$${selectedUser.monthlyIncome.toLocaleString()}` : "N/A"}</p>
<p><strong>Cash Aid Amount:</strong> {selectedUser.cashAidAmount ? `$${selectedUser.cashAidAmount.toLocaleString()}` : "N/A"}</p>
<p><strong>Children Count (Ages 0-5):</strong> {selectedUser.childrenCount?.age0to5 ?? "N/A"}</p>
<p><strong>Children Count (Ages 6-18):</strong> {selectedUser.childrenCount?.age6to18 ?? "N/A"}</p>
<p><strong>Adults Count (Ages 18-64):</strong> {selectedUser.adultsCount?.age18to64 ?? "N/A"}</p>
<p><strong>Ethnicity:</strong> {selectedUser.ethnicity ?? "N/A"}</p>
<p><strong>Services Required:</strong></p>
<ul>
  <li><strong>Food Package:</strong> {selectedUser.servicesRequired?.foodPackage ?? "N/A"}</li>
  <li><strong>Backpacks:</strong> {selectedUser.servicesRequired?.backpacks ?? "N/A"}</li>
  <li><strong>Diapers:</strong> {selectedUser.servicesRequired?.diapers ?? "N/A"}</li>
  <li><strong>Counseling:</strong> {selectedUser.servicesRequired?.counseling ?? "N/A"}</li>
  <li><strong>Other:</strong> {selectedUser.servicesRequired?.anyOther ?? "N/A"}</li>
</ul>
<p><strong>Took Food:</strong> {selectedUser.tookFood ? "Yes" : "No"}</p>
<p><strong>Food History:</strong></p>
<ul>
  {selectedUser.tookFoodHistory?.map((entry, index) => (
    <li key={index}>
      <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()} - <strong>Status:</strong> {entry.status = "Took Food" }
    </li>
  ))}
</ul>

    </div>
  </div>
)}

      </main>
    </div>
  );

  return (
    <Lock showUI={ui} />
  );
}
