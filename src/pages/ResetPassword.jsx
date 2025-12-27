// src/pages/ResetPassword.jsx
import { useState } from "react";
import { resetPassword } from "../services/authAPI";
import { validatePassword } from "../utils/validators";
import { useLocation } from "react-router-dom";

export default function ResetPassword() {
  const { state } = useLocation();
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    if (!validatePassword(password)) {
      alert("Password does not meet criteria");
      return;
    }

    await resetPassword({ email: state.email, password });
    alert("Password changed successfully");
  };

  return (
    <>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Change Password</button>
    </>
  );
}
