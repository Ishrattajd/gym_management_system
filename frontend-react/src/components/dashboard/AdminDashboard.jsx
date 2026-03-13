import React, { useEffect, useState } from 'react';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("access_token");

  const [members, setMembers] = useState(0);
  const [trainers, setTrainers] = useState(0);
  const [classes, setClasses] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {

    try {

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const membersRes = await fetch("http://127.0.0.1:8000/api/members/", { headers });
      const membersData = await membersRes.json();
      setMembers(membersData.length);

      const trainersRes = await fetch("http://127.0.0.1:8000/api/trainers/", { headers });
      const trainersData = await trainersRes.json();
      setTrainers(trainersData.length);

      const classesRes = await fetch("http://127.0.0.1:8000/api/classes/", { headers });
      const classesData = await classesRes.json();
      setClasses(classesData.length);

      const plansRes = await fetch("http://127.0.0.1:8000/api/plans/", { headers });
      const plansData = await plansRes.json();

      setPlans(plansData.slice(0,3));

      let totalRevenue = 0;
      plansData.forEach(plan => {
        totalRevenue += plan.price || 0;
      });

      setRevenue(totalRevenue);

    } catch (error) {
      console.error("Dashboard API error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-wrapper">

      {/* Sidebar */}
      <div className="sidebar">

        <div className="mb-5">
            <h4 className="fw-bold mb-0 text-white">THE FIT TRIBE</h4>
            <small className="text-success">Admin Panel</small>
        </div>

        <nav className="flex-grow-1">
          <a href="#" className="nav-item-custom active">Dashboard</a>
          <a href="/admin/plans" className="nav-item-custom">Manage Plans</a>
          <a href="/admin/classes" className="nav-item-custom">Schedules</a>
          <a href="/admin/members" className="nav-item-custom">Members</a>
        </nav>

        <div className="mt-auto border-top border-secondary pt-3">

          <div className="d-flex align-items-center mb-3">

            <div
              className="bg-success rounded-circle me-2"
              style={{width:35,height:35,display:'grid',placeItems:'center'}}
            >
              {username ? username.substring(0,2).toUpperCase() : "AU"}
            </div>

            <div>
              <p className="mb-0 small fw-bold">{username}</p>
              <p className="mb-0 smaller text-secondary" style={{fontSize:'11px'}}>
                {email}
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="text-danger text-decoration-none small"
            style={{background:'none',border:'none'}}
          >
            Sign Out
          </button>

        </div>

      </div>

      {/* Main Content */}
      <div className="main-content">

        <h2 className="fw-bold mb-1">ADMIN DASHBOARD</h2>
        <p className="text-secondary mb-5">Complete gym overview</p>

        {/* Stats Grid */}
        <div className="row g-4 mb-5">

          <div className="col-md-3">
            <div className="stat-card active-border">
              <p className="text-secondary small mb-1">Total Members</p>
              <h2 className="fw-bold mb-0">{members}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card">
              <p className="text-secondary small mb-1">Trainers</p>
              <h2 className="fw-bold mb-0">{trainers}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card">
              <p className="text-secondary small mb-1">Active Classes</p>
              <h2 className="fw-bold mb-0">{classes}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card">
              <p className="text-secondary small mb-1">Revenue</p>
              <h2 className="fw-bold mb-0">₹{revenue}</h2>
            </div>
          </div>

        </div>

        <div className="row g-4">

          {/* Recent Plans */}
          <div className="col-lg-7">
            <div className="stat-card h-100">
              <h5 className="fw-bold mb-4 text-uppercase">Recent Membership Plans</h5>

              {plans.map((plan,index)=>(
                <BookingItem
                  key={index}
                  name={plan.name}
                  class={`${plan.duration} days`}
                  date={`₹${plan.price}`}
                  status={"active"}
                />
              ))}

            </div>
          </div>

          {/* Plan Distribution */}
          <div className="col-lg-5">
            <div className="stat-card h-100">
              <h5 className="fw-bold mb-4 text-uppercase">Plan Distribution</h5>

              <PlanProgress label="Basic" count={17} percent={30}/>
              <PlanProgress label="Pro" count={55} percent={85}/>
              <PlanProgress label="Elite" count={34} percent={60}/>
              <PlanProgress label="Annual" count={16} percent={25}/>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};


const BookingItem = ({ name, class: className, date, status }) => (
  <div className="booking-item">
    <div>
      <h6 className="mb-1 fw-bold">{name}</h6>
      <p className="mb-0 smaller text-secondary">{className} • {date}</p>
    </div>
    <span className={`status-badge status-${status}`}>{status}</span>
  </div>
);


const PlanProgress = ({ label, count, percent }) => (
  <div className="mb-4">
    <div className="d-flex justify-content-between small">
      <span className="fw-bold">{label}</span>
      <span className="text-secondary">{count} members</span>
    </div>
    <div className="custom-progress">
      <div className="progress-fill" style={{width:`${percent}%`}}></div>
    </div>
  </div>
);

export default AdminDashboard;