import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/TrainerDashboard.css";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Dumbbell,
  LogOut,
  Activity,
  ClipboardList,
  CreditCard
} from "lucide-react";

const MemberPlans = () => {

  const username = localStorage.getItem("username") || "Member";
  const email = localStorage.getItem("email") || "member@email.com";
  const token = localStorage.getItem("access_token");

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/api/plans/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPlans(Array.isArray(res.data) ? res.data : []);

    } catch (error) {
      console.error("Error loading plans:", error);
    } finally {
      setLoading(false);
    }

  };

  const buyPlan = async (planId) => {

    try {

      const memberRes = await axios.get(
        "http://127.0.0.1:8000/api/members/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const member = memberRes.data.find(
        (m) => m.username === username
      );

      if (!member) {
        alert("Member profile not found");
        return;
      }

      await axios.patch(
        `http://127.0.0.1:8000/api/members/${member.id}/`,
        { membership_plan: planId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Plan purchased successfully 💪");

    } catch (error) {
      console.error("Error buying plan:", error);
      alert("Failed to buy plan");
    }

  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const initials = username.substring(0, 2).toUpperCase();

  return (

    <div className="container-fluid p-0 bg-dark-custom min-vh-100 d-flex">

      {/* Sidebar */}

      <aside className="sidebar d-flex flex-column justify-content-between p-4 bg-dark-custom">

        <div>

          <div className="d-flex align-items-center gap-2 mb-5">

            <Dumbbell className="text-success" size={32} />

            <div>
              <h4 className="text-white fw-bold m-0">
                THE FITNESS TRIBE
              </h4>

              <small
                className="text-success fw-bold text-uppercase"
                style={{ fontSize: "10px" }}
              >
                Member Panel
              </small>
            </div>

          </div>

          <nav className="nav flex-column gap-2">

            <a href="/member-dashboard" className="nav-link-custom">
              <LayoutDashboard size={20}/> Dashboard
            </a>

            <a href="/member/classes" className="nav-link-custom">
              <CalendarDays size={20}/> Classes
            </a>

            <a href="/member/bookings" className="nav-link-custom">
              <BookOpen size={20}/> My Bookings
            </a>

            <a href="/member/workouts" className="nav-link-custom">
              <Activity size={20}/> AI Workout and diet
            </a>

            <a href="/member/profile" className="nav-link-custom">
              <ClipboardList size={20}/> Profile
            </a>

            <a href="/member/plans" className="nav-link-custom active">
              <CreditCard size={20}/> Plans
            </a>

          </nav>

        </div>

        <div className="pt-4 border-top border-secondary">

          <div className="d-flex align-items-center gap-3 mb-4">

            <div className="avatar-circle">
              {initials}
            </div>

            <div>
              <p className="text-white fw-bold m-0 small">
                {username}
              </p>

              <p
                className="text-muted m-0"
                style={{ fontSize: "11px" }}
              >
                {email}
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="btn btn-link p-0 text-danger text-decoration-none d-flex align-items-center gap-2 fw-bold small"
          >
            <LogOut size={18}/> Sign Out
          </button>

        </div>

      </aside>

      {/* Main Content */}

      <main className="main-content">

        <header className="mb-5">

          <h1 className="display-4 fw-black text-white text-uppercase">
            Membership Plans
          </h1>

          <p className="text-muted fs-5">
            Choose the best plan for your fitness journey
          </p>

        </header>

        <div className="row g-4">

          {loading ? (

            <p className="text-light">Loading plans...</p>

          ) : plans.length === 0 ? (

            <p className="text-light">No plans available</p>

          ) : (

            plans.map((plan) => (

              <div key={plan.id} className="col-md-4">

                <div className="card p-4 bg-card-custom border-gray-custom h-100">

                  <div className="d-flex align-items-center gap-2 mb-3">

                    <CreditCard className="text-success" />

                    <h4 className="text-white fw-bold m-0">
                      {plan.name}
                    </h4>

                  </div>

                  <h2 className="text-success fw-bold my-3">
                    ₹{plan.price}
                  </h2>

                  <p className="text-muted">
                    {plan.duration} days
                  </p>

                  <p className="text-light small mb-4">
                    {plan.features}
                  </p>

                  <button
                    onClick={() => buyPlan(plan.id)}
                    className="btn btn-success fw-bold w-100"
                  >
                    Buy Plan
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </main>

    </div>

  );

};

export default MemberPlans;