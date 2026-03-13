import React, { useState } from "react";
import "../../styles/Login.css";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/forgot-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          new_password: newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully");
        window.location.href = "/";
      } else {
        alert(data.error || "Failed to reset password");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="text-center text-white">

        <h1 className="fw-bold mb-4">
          Reset Password
        </h1>

        <div className="login-card mx-auto text-start">

          <form onSubmit={handleReset}>

            <div className="mb-3">
              <label className="text-secondary small mb-1">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-secondary small mb-1">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-signin w-100 text-uppercase mb-3"
            >
              Reset Password
            </button>

            <p className="text-center text-secondary small">
              Remember password?{" "}
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

export default ForgotPassword;