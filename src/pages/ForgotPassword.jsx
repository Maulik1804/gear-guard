// src/pages/ForgotPassword.jsx
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <AuthLayout title="Forgot Password">
      <input
        placeholder="Enter your email"
        className="w-full border px-4 py-2 rounded-lg mb-4"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
        Send OTP
      </button>
    </AuthLayout>
  );
}
