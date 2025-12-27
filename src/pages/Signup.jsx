import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import { useNavigate, Link } from "react-router-dom";
import { AuthCard, Input, Error } from "../components/AuthUI";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState("signup"); // signup | otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // 🟢 STEP 1: SIGN UP
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
        },
      });

      setStep("otp"); // move to OTP screen
    } catch (err) {
      setError(err.message);
    }
  };

  // 🟢 STEP 2: CONFIRM OTP
  const handleConfirmOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: otp,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthCard title={step === "signup" ? "Sign Up" : "Verify Email"}>
      {error && <Error text={error} />}

      {step === "signup" && (
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          <button className="btn-primary">Create Account</button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleConfirmOtp} className="space-y-4">
          <Input placeholder="Enter OTP" value={otp} onChange={setOtp} />

          <button className="btn-primary">Verify OTP</button>

          <p className="text-sm text-center text-gray-600">
            OTP sent to <b>{email}</b>
          </p>
        </form>
      )}
    </AuthCard>
  );
}
