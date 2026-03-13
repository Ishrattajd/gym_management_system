import React, { useState } from "react";
import "../../styles/Login.css";

const Login = () => {
  const [role, setRole] = useState("MEMBER");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login success:", data);

        // save tokens
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("role", data.role);

        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);
        console.log(data);

        // alert("Login successful!");

        // redirect based on role
        if (data.role === "admin") {
          window.location.href = "/admin-dashboard";
        } else if (data.role === "trainer") {
          window.location.href = "/trainer-dashboard";
        } else {
          window.location.href = "/member-dashboard";
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="text-center text-white">
        <div className="mb-3">
          <span style={{ fontSize: "2rem", color: "#00d26a" }}>🏋️</span>
        </div>

        <h1 className="fw-bold mb-1" style={{ letterSpacing: "2px" }}>
          THE FITNESS TRIBE
        </h1>

        <p className="text-secondary mb-4">
          Your ultimate gym management platform
        </p>

        <div className="login-card mx-auto text-start">
          <div className="role-selector">
            {["MEMBER", "TRAINER", "ADMIN"].map((r) => (
              <div
                key={r}
                className={`role-btn ${role === r ? "active" : ""}`}
                onClick={() => setRole(r)}
              >
                <small className="d-block fw-bold">{r}</small>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-secondary small mb-1">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-secondary small mb-1">Password</label>
              <input
                type="password"
                className="form-control text-light"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <p className="text-end small mb-3">
              <a href="/forgot-password" className="text-success text-decoration-none">
                 Forgot Password?
              </a>
            </p>

            <button
              type="submit"
              className="btn btn-signin w-100 text-uppercase mb-3"
            >
              Sign in as {role}
            </button>

            <p className="text-center text-secondary small">
              Don't have an account?{" "}
              <a href="/register" className="text-success text-decoration-none">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;