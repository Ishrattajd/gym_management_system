
import React, { useEffect, useState } from "react";
import "../../styles/TrainerDashboard.css";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  User,
  Dumbbell,
  LogOut,
  Activity,
  ClipboardList,
  CreditCard
} from "lucide-react";

const MemberProfile = () => {

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("access_token");

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/members/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      const myProfile = data.find(
        (member) => member.username === username
      );

      setProfile(myProfile);

    } catch (error) {
      console.error("Profile fetch error:", error);
    }

  };

  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });

  };

  const updateProfile = async () => {

  try {

    const updatedData = {
      phone: profile.phone,
      age: profile.age,
      height: profile.height,
      weight: profile.weight,
      goal: profile.goal,
      status: profile.status
    };

    const res = await fetch(
      `http://127.0.0.1:8000/api/members/${profile.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      }
    );

    if (res.ok) {

      alert("Profile updated successfully");
      fetchProfile();

    } else {

      const err = await res.json();
      console.log("Update error:", err);

    }

  } catch (error) {
    console.error("Update error:", error);
  }

};
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!profile) {
    return <p style={{color:"white"}}>Loading profile...</p>;
  }

  const initials = profile.username.substring(0,2).toUpperCase();

  let bmi = null;
  let bmiCategory = "";

  if (profile.height && profile.weight) {

  const heightInMeters = profile.height / 100;

  bmi = (
    profile.weight /
    (heightInMeters * heightInMeters)
  ).toFixed(2);

  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi < 25) bmiCategory = "Normal";
  else if (bmi < 30) bmiCategory = "Overweight";
  else bmiCategory = "Obese";

 }

  return (

    <div className="container-fluid p-0 bg-dark-custom min-vh-100 d-flex">

      <aside className="sidebar d-flex flex-column justify-content-between p-4 bg-dark-custom">

        <div>

          <div className="d-flex align-items-center gap-2 mb-5">

            <Dumbbell className="text-success" size={32} />

            <div>
              <h4 className="text-white fw-bold m-0">THE FITNESS TRIBE</h4>
              <small
                className="text-success fw-bold text-uppercase"
                style={{fontSize:"10px"}}
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

            <a href="/member/profile" className="nav-link-custom active">
              <ClipboardList size={20}/> Profile
            </a>

            <a href="/member/plans" className="nav-link-custom">
              <CreditCard size={20}/> Plans
            </a>

          </nav>

        </div>

        <div className="pt-4 border-top border-secondary">

          <div className="d-flex align-items-center gap-3 mb-4">

            <div className="avatar-circle">{initials}</div>

            <div>
              <p className="text-white fw-bold m-0 small">
                {profile.username}
              </p>
              <p className="text-muted m-0" style={{fontSize:"11px"}}>
                {profile.email}
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


      <main className="main-content">

        <header className="mb-5">
          <h1 className="display-4 fw-black text-white text-uppercase">
            My Profile
          </h1>
          <p className="text-muted fs-5">
            Manage your fitness details
          </p>
        </header>

        <div className="card p-4 bg-card-custom border-gray-custom">

          <div className="row g-3">

            <div className="col-md-6">
              <label className="text-muted small">Username</label>
              <input
                type="text"
                value={profile.username}
                disabled
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="text-muted small">Email</label>
              <input
                type="text"
                value={profile.email}
                disabled
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="text-muted small">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="text-muted small">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="text-muted small">Height</label>
              <input
                type="number"
                name="height"
                value={profile.height || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="text-muted small">Weight</label>
              <input
                type="number"
                name="weight"
                value={profile.weight || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6">
                <label className="text-muted small">BMI</label>
                <input
                    type="text"
                    value={bmi ? `${bmi} (${bmiCategory})` : ""}
                    disabled
                    className="form-control"
                 />
            </div>

            <div className="col-md-6">
              <label className="text-muted small">Fitness Goal</label>
              <input
                type="text"
                name="goal"
                value={profile.goal || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="text-muted small">Membership Plan</label>
              <input
                type="text"
                name="membership_plan"
                value={profile.membership_plan || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label className="text-muted small">Status</label>
              <input
                type="text"
                name="status"
                value={profile.status}
                onChange={handleChange}
                className="form-control"
              />
            </div>

          </div>

          <button
            onClick={updateProfile}
            className="btn btn-success mt-4"
          >
            Update Profile
          </button>

        </div>

      </main>

    </div>
  );

};

export default MemberProfile;
