import React, { useEffect, useState } from "react";
import "../../styles/TrainerDashboard.css";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Dumbbell,
  LogOut,
  Sparkles,
  Activity,
  ClipboardList,
  CreditCard
} from "lucide-react";

const MemberAIWorkout = () => {
  const username = localStorage.getItem("username") || "Member";
  const email = localStorage.getItem("email") || "member@email.com";
  const token = localStorage.getItem("access_token");

  const [profile, setProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [dietPlan, setDietPlan] = useState([]);
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/members/", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      const currentUser = localStorage.getItem("username");
      const member = data.find((m) => m.username === currentUser);

      if (member) {
        setProfile(member);

        if (member.height && member.weight) {
          const heightM = member.height / 100;
          const bmiValue = (member.weight / (heightM * heightM)).toFixed(1);
          setBmi(bmiValue);

          generateWorkoutAndDiet(member.goal, bmiValue);
        }
      }
    } catch (error) {
      console.error("Profile error:", error);
    }
  };

  const generateWorkoutAndDiet = (goal, bmiValue) => {
    let workoutSuggestions = [];
    let dietSuggestions = [];

    // Workout Suggestions
    if (goal === "Weight Loss" || bmiValue > 25) {
      workoutSuggestions = [
        "Running – 30 minutes",
        "HIIT Training – 20 minutes",
        "Cycling – 30 minutes",
        "Jump Rope – 15 minutes",
        "Core Workout – 15 minutes"
      ];

      dietSuggestions = [
        "High protein breakfast (eggs, oats)",
        "Vegetable-rich lunch with lean protein",
        "Fruits and nuts as snacks",
        "Avoid sugary drinks and fried foods",
        "Drink 2–3 liters of water daily"
      ];
    } else if (goal === "Muscle Gain") {
      workoutSuggestions = [
        "Bench Press – 4 sets",
        "Squats – 4 sets",
        "Deadlift – 4 sets",
        "Pullups – 3 sets",
        "Shoulder Press – 4 sets"
      ];

      dietSuggestions = [
        "Protein shakes post-workout",
        "High-protein meals (chicken, fish, legumes)",
        "Complex carbs for energy (brown rice, oats)",
        "Healthy fats (avocado, nuts, olive oil)",
        "Eat every 3–4 hours for muscle growth"
      ];
    } else {
      workoutSuggestions = [
        "Yoga – 30 minutes",
        "Stretching – 20 minutes",
        "Light Jogging – 20 minutes",
        "Bodyweight Exercises – 20 minutes"
      ];

      dietSuggestions = [
        "Balanced meals with vegetables and protein",
        "Include fruits in breakfast and snacks",
        "Stay hydrated",
        "Limit processed foods",
        "Moderate portion sizes"
      ];
    }

    setWorkouts(workoutSuggestions);
    setDietPlan(dietSuggestions);
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
              <h4 className="text-white fw-bold m-0">THE FITNESS TRIBE</h4>
              <small className="text-success fw-bold text-uppercase" style={{ fontSize: "10px" }}>
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
            <a href="/member/workouts" className="nav-link-custom active">
              <Activity size={20}/> AI Workout and diet
            </a>
            <a href="/member/profile" className="nav-link-custom">
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
              <p className="text-white fw-bold m-0 small">{username}</p>
              <p className="text-muted m-0" style={{ fontSize: "11px" }}>{email}</p>
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

      {/* Main */}
      <main className="main-content">
        <header className="mb-5">
          <h1 className="display-4 fw-black text-white text-uppercase">AI Workout & Diet Plan</h1>
          <p className="text-muted fs-5">Personalized plan based on your BMI and fitness goal</p>
        </header>

        {/* BMI */}
        {bmi && (
          <div className="card p-4 bg-card-custom border-gray-custom mb-4">
            <h5 className="text-white">Your BMI</h5>
            <h2 className="text-success fw-bold">{bmi}</h2>
          </div>
        )}

        {/* Workout Suggestions */}
        <div className="card p-4 bg-card-custom border-gray-custom mb-4">
          <h5 className="text-white fw-bold mb-4">Recommended Workouts</h5>
          <ul className="list-group">
            {workouts.map((w, index) => (
              <li key={index} className="list-group-item bg-item-custom text-white border-gray-custom">{w}</li>
            ))}
          </ul>
        </div>

        {/* Diet Plan */}
        <div className="card p-4 bg-card-custom border-gray-custom">
          <h5 className="text-white fw-bold mb-4">Diet Plan</h5>
          <ul className="list-group">
            {dietPlan.map((d, index) => (
              <li key={index} className="list-group-item bg-item-custom text-white border-gray-custom">{d}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default MemberAIWorkout;