"use client"; 
import styles from './BarChart.module.css'
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, options }) => {
  return (
    <div className="barChartContainer">
        <div className="chartWrapper"><Bar data={data} options={options} /></div>
      
    </div>
  );
};

export default BarChart;
