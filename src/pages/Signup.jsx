// src/pages/Signup.jsx
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <AuthLayout title="Sign Up">
      <form className="space-y-4">
        <input
          placeholder="Name"
          className="w-full border px-4 py-2 rounded-lg"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email ID"
          className="w-full border px-4 py-2 rounded-lg"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded-lg"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="password"
          placeholder="Re-enter Password"
          className="w-full border px-4 py-2 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          Sign Up
        </button>
      </form>
    </AuthLayout>
  );
}
