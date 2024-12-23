"use client";

import React, { useEffect, useState } from "react";
import BarChart from "@/components/BarChart/page"; 
//import styles from './BarChart.module.css'; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "@/components/Sidebar";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExamplePage = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/recipients/food-history");
      const data = await response.json();
      setChartData(data);
    };

    fetchData();
  }, []);

  if (!chartData) return <div>Loading...</div>;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Food Taken History",
      },
    },
  };

  return (
    <div >
      <div> 
        <BarChart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ExamplePage;
