import React, { useState, useEffect } from "react";
import axios from "axios";

const FindInternships = () => {
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(() => JSON.parse(localStorage.getItem("appliedJobs")) || {});

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/internships")
      .then(response => {
        setInternships(response.data.internships);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching internships:", error);
        setLoading(false);
      });
  }, []);

  const handleApply = async (job) => {
    const jobTitle = job.Title;
    const isApplied = appliedJobs[jobTitle];
  
    // Toggle the applied status
    const updatedJobs = { ...appliedJobs, [jobTitle]: !isApplied };
    setAppliedJobs(updatedJobs);
    localStorage.setItem("appliedJobs", JSON.stringify(updatedJobs));
  
    if (!isApplied) {
      // If marking as applied, send application data to the backend
      try {
        const response = await fetch("http://127.0.0.1:8000/track_application", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Company: job.Company || "Unknown",
            Title: job.Title || "Unknown",
            Location: job.Location || "Unknown",
            Link: job.Link || "Unknown",
          }),
        });
  
        const result = await response.json();
        console.log("✅ Response from backend:", result);
  
        if (response.ok) {
          console.log("✅ Application saved:", job);
        } else {
          console.error("❌ Error saving application:", result);
        }
      } catch (error) {
        console.error("⚠️ Network error:", error);
      }
    } else {
      // If unmarking as applied, optionally handle the removal logic
      console.log("Application unmarked:", job);
      // You can add code here to notify the backend if necessary
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-5">Find Internships</h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="border p-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by location..."
          className="border p-2 w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading internships...</p>
      ) : (
        <ul className="space-y-4">
          {internships.filter(job => job.Title.toLowerCase().includes(search.toLowerCase()) && job.Location.toLowerCase().includes(location.toLowerCase()))
            .map((job, index) => (
              <li key={index} className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold">{job.Title}</h2>
                <p className="text-gray-700">{job.Company} - {job.Location}</p>
                <a href={job.Link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Apply Here
                </a>
                <button
                  className={`ml-4 px-4 py-2 rounded ${appliedJobs[job.Title] ? "bg-green-500" : "bg-gray-500"}`}
                  onClick={() => handleApply(job)}
                >
                  {appliedJobs[job.Title] ? "Applied ✅" : "Mark as Applied"}
                </button>
              </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FindInternships;
