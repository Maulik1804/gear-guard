// src/services/authApi.js
import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const loginUser = (data) => axios.post(`${API}/login`, data);

export const signupUser = (data) => axios.post(`${API}/signup`, data);

export const sendOtp = (email) => axios.post(`${API}/send-otp`, { email });

export const verifyOtp = (data) => axios.post(`${API}/verify-otp`, data);

export const resetPassword = (data) =>
  axios.post(`${API}/reset-password`, data);
