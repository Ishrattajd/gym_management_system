
import React, { useEffect, useState } from "react";
import "../../styles/TrainerDashboard.css";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardCheck,
  Dumbbell,
  LogOut
} from "lucide-react";

const TrainerAttendance = () => {

  const username = localStorage.getItem("username") || "Trainer";
  const email = localStorage.getItem("email") || "trainer@email.com";
  const token = localStorage.getItem("access_token");

  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    fetchMembers();
    fetchClasses();
  }, []);

  const fetchMembers = async () => {

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
      setMembers(data);

    } catch (error) {
      console.error("Members error:", error);
    }

  };

  const fetchClasses = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/classes/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setClasses(data);

    } catch (error) {
      console.error("Classes error:", error);
    }

  };

  const markAttendance = (memberUserId, status) => {

    setAttendance({
      ...attendance,
      [memberUserId]: status
    });

  };

  const saveAttendance = async () => {

    const today = new Date().toISOString().split("T")[0];

    try {

      for (const userId in attendance) {

        await fetch(
          "http://127.0.0.1:8000/api/attendance/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              user: userId,
              date: today,
              status: attendance[userId]
            })
          }
        );

      }

      alert("Attendance saved successfully");

    } catch (error) {
      console.error("Attendance error:", error);
    }

  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const initials = username.substring(0, 2).toUpperCase();

  return (
    <div className="container-fluid p-0 bg-dark-custom min-vh-100 d-flex">

      <aside className="sidebar d-flex flex-column justify-content-between p-4 bg-dark-custom">

        <div>

          <div className="d-flex align-items-center gap-2 mb-5">

            <Dumbbell className="text-success" size={32} />

            <div>
              <h4 className="text-white fw-bold m-0">THE FITNESS TRIBE</h4>
              <small className="text-success fw-bold text-uppercase" style={{fontSize:"10px"}}>
                Trainer Panel
              </small>
            </div>

          </div>

          <nav className="nav flex-column gap-2">

            <a href="/trainer-dashboard" className="nav-link-custom">
              <LayoutDashboard size={20}/> Dashboard
            </a>

            <a href="/trainer/classes" className="nav-link-custom">
              <CalendarDays size={20}/> Classes
            </a>

            <a href="/trainer/members" className="nav-link-custom">
              <Users size={20}/> Members
            </a>

            <a href="/trainer/attendance" className="nav-link-custom active">
              <ClipboardCheck size={20}/> Attendance
            </a>

          </nav>

        </div>

        <div className="pt-4 border-top border-secondary">

          <div className="d-flex align-items-center gap-3 mb-4">

            <div className="avatar-circle">{initials}</div>

            <div>
              <p className="text-white fw-bold m-0 small">{username}</p>
              <p className="text-muted m-0" style={{fontSize:"11px"}}>
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


      <main className="main-content">

        <header className="mb-5">

          <h1 className="display-4 fw-black text-white text-uppercase">
            Attendance
          </h1>

          <p className="text-muted fs-5">
            Mark member attendance
          </p>

        </header>


        <div className="card p-4 bg-card-custom border-gray-custom">

          <h5 className="text-white fw-bold mb-4">
            Members
          </h5>

          <div className="table-responsive">

            <table className="table table-dark table-hover">

              <thead>

                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Attendance</th>
                </tr>

              </thead>

              <tbody>

                {members.map((member) => (

                  <tr key={member.id}>

                    <td>{member.username}</td>
                    <td>{member.email}</td>

                    <td>

                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => markAttendance(member.user, "Present")}
                      >
                        Present
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => markAttendance(member.user, "Absent")}
                      >
                        Absent
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <button
            onClick={saveAttendance}
            className="btn btn-success mt-3"
          >
            Save Attendance
          </button>

        </div>

      </main>

    </div>
  );
};

export default TrainerAttendance;

