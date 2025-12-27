import { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { AuthCard, Input, Error } from "../components/AuthUI";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn({ username: email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthCard title="Login">
      {error && <Error text={error} />}

      <form onSubmit={handleLogin} className="space-y-4">
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

        <button className="btn-primary">Login</button>
      </form>

      <div className="flex justify-between text-sm mt-4">
        <Link to="/forgot-password" className="text-blue-600">
          Forgot password?
        </Link>
        <Link to="/signup" className="text-blue-600">
          Sign up
        </Link>
      </div>
    </AuthCard>
  );
}
