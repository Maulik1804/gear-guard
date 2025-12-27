// src/pages/VerifyOTP.jsx
import { useState } from "react";
import { verifyOtp } from "../services/authAPI";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleVerify = async () => {
    await verifyOtp({ email: state.email, otp });
    navigate("/reset-password", { state });
  };

  return (
    <>
      <h2>Verify OTP</h2>
      <input placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleVerify}>Verify</button>
    </>
  );
}
