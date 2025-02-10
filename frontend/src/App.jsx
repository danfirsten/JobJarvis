import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from "react";
import FindInternships from "./components/FindInternships";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MyApplications from "./components/MyApplications";

function App() {
  return (
    <Router>
      <div className="max-w-6xl mx-auto p-5">
        {/* ✅ Updated Navigation Bar with "JobJarvis" Title */}
        <nav className="flex justify-between items-center mb-6">
          {/* ✅ Title on the Left */}
          <h1 className="text-2xl font-bold text-gray-800">
            JobJarvis
          </h1>

          {/* ✅ Links on the Right */}
          <div className="flex space-x-6">
            <Link to="/" className="text-blue-500 hover:underline">Find Internships</Link>
            <Link to="/my-applications" className="text-blue-500 hover:underline">My Applications</Link>
          </div>
        </nav>

        {/* ✅ Page Routing */}
        <Routes>
          <Route path="/" element={<FindInternships />} />
          <Route path="/my-applications" element={<MyApplications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




