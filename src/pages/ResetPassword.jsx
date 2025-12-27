import { useState } from "react";
import { confirmResetPassword } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword: password,
    });
    navigate("/");
  };

  return (
    <AuthCard title="Reset Password">
      <form onSubmit={handleConfirm} className="space-y-4">
        <Input placeholder="Email" value={email} onChange={setEmail} />
        <Input
          placeholder="Verification Code"
          value={code}
          onChange={setCode}
        />
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={setPassword}
        />
        <button className="btn-primary">Reset</button>
      </form>
    </AuthCard>
  );
}
