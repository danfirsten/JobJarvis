import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/get_application_stats")
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching application stats:", error);
      });
  }, []);

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Applications per Day",
        data: Object.values(data),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-5">Dashboard</h1>
      <h2 className="text-lg font-semibold">
        Total Applications: {Object.values(data).reduce((a, b) => a + b, 0)}
      </h2>
      <Bar data={chartData} />
    </div>
  );
};

export default Dashboard;
