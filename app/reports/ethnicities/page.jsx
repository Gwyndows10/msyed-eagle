
"use client";

import React, { useEffect, useState } from "react";
import BarChart from "@/components/BarChart/page";

const Ethnicities = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchEthnicityData = async () => {
      try {
        const response = await fetch("/api/recipients/ethnicities"); // Update with the correct API endpoint
        const data = await response.json();

        const processedData = {
          labels: data.map((item) => item._id || "Unknown"), // Ethnicity names (or "Unknown" for missing values)
          datasets: [
            {
              label: "Ethnicity Distribution",
              data: data.map((item) => item.count), // Count of each ethnicity
              backgroundColor: [
                "rgba(75, 192, 192, 0.5)",
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(153, 102, 255, 0.5)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };

        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching ethnicity data:", error);
      }
    };

    fetchEthnicityData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ethnicity Distribution",
      },
    },
  };

  return (
    <div
      style={{
        
        textAlign: "center",
      }}
    >
      <h1 text-align>Ethnicities</h1>
      {chartData ? (
        <BarChart data={chartData} options={chartOptions} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default Ethnicities;
