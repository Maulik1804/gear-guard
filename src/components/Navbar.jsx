// src/components/Navbar.jsx
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  const tabs = [
    "Maintenance",
    "Dashboard",
    "Maintenance Calendar",
    "Equipment",
    "Reporting",
    "Teams",
  ];

  // Get logged-in user info (email)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserEmail(user.signInDetails?.loginId || "");
      } catch (error) {
        console.log("User not logged in");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(); // 🔐 Cognito logout
      navigate("/"); // ⏩ back to login
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex items-center gap-6 border-b bg-white px-6 py-3">
      {/* New Button */}
      <button className="px-4 py-1 border rounded-md text-sm">New</button>

      {/* Tabs */}
      {tabs.map((tab) => (
        <span
          key={tab}
          className={`text-sm cursor-pointer ${
            tab === "Dashboard"
              ? "text-blue-600 font-semibold"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          {tab}
        </span>
      ))}

      {/* Right Side */}
      <div className="ml-auto flex items-center gap-4">
        <input
          placeholder="Search..."
          className="border px-3 py-1 rounded-md text-sm"
        />

        {/* User Email */}
        {userEmail && (
          <span className="text-sm text-gray-600">{userEmail}</span>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
