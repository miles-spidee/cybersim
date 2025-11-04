
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user details from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // if no user, go back to login
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0F1F] text-white">
      <div className="bg-[#121829] p-8 rounded-2xl shadow-lg w-96 text-center">
        <h1 className="text-3xl font-bold mb-4 text-purple-400">Profile</h1>

        {user ? (
          <>
            <p className="text-lg mb-2">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="text-lg mb-4">
              <strong>Email:</strong> {user.email}
            </p>
            <button
              onClick={handleLogout}
              className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-lg w-full"
            >
              Log Out
            </button>
          </>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
}
