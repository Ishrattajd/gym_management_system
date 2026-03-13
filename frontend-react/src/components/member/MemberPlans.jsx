import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/TrainerDashboard.css";
import { CreditCard } from "lucide-react";

const MemberPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/plans/");
      setPlans(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const buyPlan = async (planId) => {
    try {
      const memberRes = await axios.get("http://127.0.0.1:8000/api/members/");
      const member = memberRes.data.find((m) => m.username === username);

      if (!member) {
        alert("Member profile not found");
        return;
      }

      await axios.patch(`http://127.0.0.1:8000/api/members/${member.id}/`, {
        membership_plan: planId,
      });

      alert("Plan purchased successfully 💪");
    } catch (error) {
      console.error("Error buying plan:", error);
      alert("Failed to buy plan");
    }
  };

  return (
    <div className="container-fluid p-0 bg-dark-custom min-vh-100">

      <div className="main-content p-5">

        {/* PAGE HEADER */}
        <header className="mb-5">
          <h1 className="display-4 fw-black text-white text-uppercase">
            Membership Plans
          </h1>

          <p className="text-muted fs-5">
            Choose the best plan for your fitness journey
          </p>
        </header>

        {/* PLANS GRID */}
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
                      {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
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

      </div>

    </div>
  );
};

export default MemberPlans;