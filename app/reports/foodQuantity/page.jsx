"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FoodQuantityReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/recipients/food-history");
        if (!res.ok) throw new Error("Failed to fetch data");
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-8">
      <h1 className="text-3xl font-bold">Food Quantity Report</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl">
        Analyze the quantity of food distributed over time. Use this report to track trends and optimize inventory management.
      </p>
      <div className="w-full max-w-2xl mt-8">
        <div className="rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 shadow flex items-center justify-center min-h-[300px]">
          {loading && <span className="text-neutral-400">Loading...</span>}
          {error && <span className="text-red-500">{error}</span>}
          {!loading && !error && data && data.labels && data.labels.length > 0 && (
            <Bar data={data} options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'Food Distributed Per Day' },
              },
              scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'People Served' }, beginAtZero: true },
              },
            }} />
          )}
          {!loading && !error && (!data || !data.labels || data.labels.length === 0) && (
            <span className="text-neutral-400">No data available.</span>
          )}
        </div>
      </div>
    </section>
  );
} 