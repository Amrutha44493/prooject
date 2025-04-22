import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ProjectDashboard from "./components/ProjectDashboard";
import AddSubmission from "./components/WeeklySubmission/AddSubmission"; // ✅ Corrected path

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/ProjectDashboard"
        element={
          <PrivateRoute>
            <ProjectDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/addsubmission"
        element={
          <PrivateRoute>
            <AddSubmission />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
