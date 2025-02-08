import React, { useState, useEffect } from "react";
import axios from "axios";

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState(""); // ✅ Search state
  const [location, setLocation] = useState(""); // ✅ Location filter state
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(() => {
    return JSON.parse(localStorage.getItem("appliedJobs")) || {};
  });

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

  const handleApply = (jobTitle) => {
    const updatedJobs = { ...appliedJobs, [jobTitle]: true };
    setAppliedJobs(updatedJobs);
    localStorage.setItem("appliedJobs", JSON.stringify(updatedJobs));
  };

  // ✅ Filter internships based on search and location input
  const filteredInternships = internships.filter(job =>
    job.Title.toLowerCase().includes(search.toLowerCase()) &&
    job.Location.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-5">Internships</h1>

      {/* ✅ Search and Location Filter */}
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
          {filteredInternships.length === 0 ? (
            <p className="text-center text-red-500">No internships found.</p>
          ) : (
            filteredInternships.map((job, index) => (
              <li key={index} className="p-4 border rounded shadow">
                <h2 className="text-xl font-semibold">
                    {job.Title}
                </h2>
                <p className="text-gray-700">{job.Company} - {job.Location}</p>
                <a href={job.Link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Apply Here
                </a>
                <button
                  className={`ml-4 px-4 py-2 rounded ${appliedJobs[job.Title] ? "bg-green-500" : "bg-gray-500"}`}
                  onClick={() => handleApply(job.Title)}
                >
                  {appliedJobs[job.Title] ? "Applied ✅" : "Mark as Applied"}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default InternshipList;
