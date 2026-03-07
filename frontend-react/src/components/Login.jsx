import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
  const [role, setRole] = useState('MEMBER');

  return (
    <div className="login-container">
      <div className="text-center text-white">
        <div className="mb-3">
            {/* Replace with your actual icon/logo */}
            <span style={{ fontSize: '2rem', color: '#00d26a' }}>🏋️</span>
        </div>
        <h1 className="fw-bold mb-1" style={{ letterSpacing: '2px' }}>THE FITNESS TRIBE</h1>
        <p className="text-secondary mb-4">Your ultimate gym management platform</p>

        <div className="login-card mx-auto text-start">
          <div className="role-selector">
            {['MEMBER', 'TRAINER', 'ADMIN'].map((r) => (
              <div 
                key={r}
                className={`role-btn ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
              >
                <small className="d-block fw-bold">{r}</small>
              </div>
            ))}
          </div>

          <form>
            <div className="mb-3">
              <label className="text-secondary small mb-1">Email</label>
              <input type="email" className="form-control " placeholder="you@example.com" />
            </div>
            <div className="mb-4">
              <label className="text-secondary small mb-1">Password</label>
              <input type="password" className="form-control text-light" placeholder="••••••••" />
            </div>
            <button className="btn btn-signin w-100 text-uppercase mb-3">
              Sign in as {role}
            </button>
            <p className="text-center text-secondary small">
              Don't have an account? <a href="#" className="text-success text-decoration-none">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;