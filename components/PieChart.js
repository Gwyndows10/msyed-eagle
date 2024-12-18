/*"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registering the ArcElement
//ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }) {
  // Transform JSON data into labels and values for the chart
  const chartData = {
    labels: data.map((item) => item.name), // Categories (e.g., Male, Female)
    datasets: [
      {
        label: "Distribution",
        data: data.map((item) => item.count), // Values
        backgroundColor: ["#4CAF50", "#FF5733"], // Colors for slices
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Demographics</h2>
      <Pie data={chartData} />
    </div>
  );
}
*/