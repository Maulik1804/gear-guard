import { useState } from "react";
import { resetPassword } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { AuthCard, Input, Error } from "../components/AuthUI";


export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    await resetPassword({ username: email });
    navigate("/reset-password");
  };

  return (
    <AuthCard title="Forgot Password">
      <form onSubmit={handleReset} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
        />
        <button className="btn-primary">Send Code</button>
      </form>
    </AuthCard>
  );
}
