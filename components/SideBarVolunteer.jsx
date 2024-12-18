import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabaseClient";// Adjust path accordingly

export default function SidebarVolunteer() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu open/close state
  const [role, setRole] = useState(""); // Track user role (admin/volunteer)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setRole(data.user.role || "volunteer"); 
      } else {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const getInitial = (email) => (email ? email.charAt(0).toUpperCase() : "U");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      setUser(null); // Clear user data on logout
    }
  };

  return (
    <aside className="w-64 bg-gray-800 p-5">
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {/* Clickable Initial Circle */}
          <button
            onClick={toggleMenu}
            className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-white"
          >
            {user ? getInitial(user.email) : "U"}
          </button>
          <div className="ml-4">
            <p className="text-gray-400 text-sm">{user?.email || "Loading..."}</p>
          </div>
        </div>
      </div>

      {/* User Role Dropdown */}
      {isMenuOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-gray-700 text-white rounded-lg shadow-md">
          <div className="px-4 py-2 text-sm">
            <p className="font-semibold">Role: {role === "admin" ? "Admin" : "Volunteer"}</p>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="space-y-4 mt-6">
      <a
          href="/volunteer"
          className="block p-3 text-base font-medium rounded-lg bg-gray-800 hover:bg-blue-500 transition duration-200 ease-in-out"
        >
          Volunteer
        </a>
      
      </nav>
    </aside>
  );
}
