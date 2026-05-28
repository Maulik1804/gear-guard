import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Wrench, Mail, Lock, User, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.companyName,
      );
      if (result.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({ submit: "Signup failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-600/20" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary-500/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/30">
              <Wrench className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">GearGuard</h1>
              <p className="text-primary-200">
                The Ultimate Maintenance Tracker
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Join thousands of companies using GearGuard to optimize their
            maintenance operations, reduce downtime, and extend equipment life.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 bg-success-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-success-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Real-time equipment monitoring</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 bg-success-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-success-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Automated maintenance scheduling</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 bg-success-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-success-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Team collaboration tools</span>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="w-10 h-10 bg-success-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-success-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Detailed analytics & reporting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">GearGuard</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Create Account
              </h2>
              <p className="text-slate-500">
                Get started with your free account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.submit && (
                <div className="p-4 bg-danger-50 border border-danger-200 rounded-xl text-danger-700 text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="signup-name" className="label">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    name="name"
                    id="signup-name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "signup-name-error" : undefined
                    }
                    className={`input pl-12 ${
                      errors.name ? "input-error" : ""
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                    placeholder="Enter your full name…"
                  />
                </div>
                {errors.name && (
                  <p
                    id="signup-name-error"
                    className="mt-1.5 text-sm text-danger-600"
                    aria-live="polite"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="label">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    name="email"
                    id="signup-email"
                    autoComplete="email"
                    spellCheck={false}
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "signup-email-error" : undefined
                    }
                    className={`input pl-12 ${
                      errors.email ? "input-error" : ""
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                    placeholder="Enter your email…"
                  />
                </div>
                {errors.email && (
                  <p
                    id="signup-email-error"
                    className="mt-1.5 text-sm text-danger-600"
                    aria-live="polite"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="signup-company-name" className="label">
                  Company Name
                </label>
                <div className="relative">
                  <Building2
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    name="companyName"
                    id="signup-company-name"
                    autoComplete="organization"
                    value={formData.companyName}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.companyName)}
                    aria-describedby={
                      errors.companyName ? "signup-company-error" : undefined
                    }
                    className={`input pl-12 ${
                      errors.companyName ? "input-error" : ""
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                    placeholder="Enter your company name"
                  />
                </div>
                {errors.companyName && (
                  <p
                    id="signup-company-error"
                    className="mt-1.5 text-sm text-danger-600"
                    aria-live="polite"
                  >
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="label">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="signup-password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "signup-password-error" : undefined
                    }
                    className={`input pl-12 pr-12 ${
                      errors.password ? "input-error" : ""
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                    placeholder="Create a password…"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="signup-password-error"
                    className="mt-1.5 text-sm text-danger-600"
                    aria-live="polite"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="signup-confirm-password" className="label">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="signup-confirm-password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? "signup-confirm-password-error"
                        : undefined
                    }
                    className={`input pl-12 pr-12 ${
                      errors.confirmPassword ? "input-error" : ""
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
                    placeholder="Confirm your password…"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p
                    id="signup-confirm-password-error"
                    className="mt-1.5 text-sm text-danger-600"
                    aria-live="polite"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  required
                />
                <span className="text-sm text-slate-600">
                  I agree to the{" "}
                  <a href="#" className="text-primary-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
