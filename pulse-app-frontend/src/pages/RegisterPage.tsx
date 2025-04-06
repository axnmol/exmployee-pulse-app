/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./AuthForm.module.css"; // Import CSS Module
import commonStyles from "../styles/common.module.css"; // Import common styles
// We don't typically need useAuth here unless we auto-login after register

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Removed error/success state, using toasts
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Registering...");

    try {
      await axios.post("/auth/register", { email, password });
      toast.success("Registration successful! Redirecting to login...", { id: toastId });
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Shorter delay
    } catch (err: any) {
      console.error("Registration error:", err);
      let errorMsg = "Registration failed: An unexpected error occurred.";
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 409) {
          errorMsg = "Email already registered.";
        } else if (err.response.data?.message) {
          const messages = Array.isArray(err.response.data.message)
            ? err.response.data.message.join(", ")
            : err.response.data.message;
          errorMsg = `Registration failed: ${messages}`;
        } else {
          errorMsg = `Registration failed: ${err.response.statusText || "Server error"}`;
        }
      }
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginLeft: "93px" }}>
          <label htmlFor="reg-email" style={{ marginLeft: "0px" }}>
            Email:
          </label>
          <input
            type="email"
            id="reg-email"
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
          <label htmlFor="reg-password" style={{ marginLeft: "62px" }}>
            Password:
          </label>
          <input
            type="password"
            id="reg-password"
            value={password}
            className={commonStyles.input}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
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
          <label htmlFor="confirmPassword" style={{ marginLeft: "0px", width: 215 }}>
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            className={commonStyles.input}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className={styles.toggleLink}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
