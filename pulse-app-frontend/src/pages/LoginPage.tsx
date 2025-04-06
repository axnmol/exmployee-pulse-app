/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthForm.module.css"; // Import CSS Module
import commonStyles from "../styles/common.module.css"; // Import common styles

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Get the updated login function from useAuth
  const { login } = useAuth();
  const navigate = useNavigate();

  // Redirect logic might need adjustment after context handles profile fetch
  // const from = location.state?.from?.pathname || '/'; // Start simple, redirect to home

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const response = await axios.post("/auth/login", { email, password });
      const { access_token } = response.data;

      if (access_token) {
        // Call the new login function which handles token storage AND profile fetch
        await login(access_token);
        toast.success("Login successful!", { id: toastId });

        // Redirect AFTER login context is updated
        // Navigate to root, let Home component handle role-based redirect
        navigate("/", { replace: true });
      } else {
        throw new Error("No access token received from server.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      let errorMsg = "Login failed: An unexpected error occurred.";
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          errorMsg = "Invalid email or password.";
        } else {
          // Use error message from profile fetch failure if available
          errorMsg = `Login failed: ${err.response.data?.message || err.message || "Server error"}`;
        }
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label htmlFor="email" style={{ marginLeft: "32px" }}>
            {" "}
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            className={commonStyles.input}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: "100%",
              padding: 5,
              borderRadius: "8px",
              backgroundColor: "white",
              border: "1px solid #ccc"
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: 15, alignItems: "center" }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            className={commonStyles.input}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: "100%",
              padding: 5,
              borderRadius: "8px",
              backgroundColor: "white",
              border: "1px solid #ccc"
            }}
          />
        </div>
        <button
          type="submit"
          className={commonStyles.button}
          disabled={isLoading}
          style={{ marginTop: "30px" }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className={styles.toggleLink}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;
