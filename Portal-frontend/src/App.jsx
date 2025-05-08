import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import StudentDashboard from "./components/StudentDashboard";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ProjectDashboard from "./components/ProjectDashboard";
import AddSubmission from "./components/WeeklySubmission/AddSubmission"; 
import LoginController from "./components/LoginController";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} /> */}
      <Route path="/logincontroller" element={<LoginController />} />
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
