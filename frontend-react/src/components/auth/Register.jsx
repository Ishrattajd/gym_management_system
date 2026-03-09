import React, { useState } from "react";
import "../../styles/Login.css";
import "../../styles/Register.css";

const Register = () => {
  const [role, setRole] = useState("MEMBER");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          role: role.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please login.");
        window.location.href = "/";
      } else {
        alert(data.error || "Registration failed");
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
          Create your account to get started
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

            <div className="mb-3">
              <label className="text-secondary small mb-1">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-secondary small mb-1">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-signin w-100 text-uppercase mb-3"
            >
              Register as {role}
            </button>

            <p className="text-center text-secondary small">
              Already have an account?{" "}
              <a href="/" className="text-success text-decoration-none">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;