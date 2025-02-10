import React from "react";
import Dashboard from "./Dashboard";

const MyApplications = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-5">My Applications</h1>

      {/* ✅ Dashboard (Bar Chart) */}
      <Dashboard />

      {/* ✅ Embedded Google Sheet */}
      <div className="mt-10">
        <iframe
          src="https://docs.google.com/spreadsheets/d/1a0qVLeqxh-iwzvHR2BpnBQAgp3oXbHVbEDWZZfIz0vw/edit?usp=sharing"
          width="100%"
          height="600px"
          className="border rounded-lg shadow-lg"
          title="Internship Tracker"
        ></iframe>
      </div>
    </div>
  );
};

export default MyApplications;
