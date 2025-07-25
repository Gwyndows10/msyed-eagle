"use client";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EthnicitiesReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/recipients/ethnicities");
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

  let chartData = null;
  if (data && Array.isArray(data) && data.length > 0) {
    chartData = {
      labels: data.map((item) => item._id || "Unknown"),
      datasets: [
        {
          label: "Recipients",
          data: data.map((item) => item.count),
          backgroundColor: [
            "#2563eb",
            "#22c55e",
            "#f59e42",
            "#e11d48",
            "#a21caf",
            "#facc15",
            "#14b8a6",
            "#64748b"
          ],
        },
      ],
    };
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-8">
      <h1 className="text-3xl font-bold">Ethnicities Report</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl">
        Visualize the distribution of recipients by ethnicity. Use this report to understand community demographics and inform outreach efforts.
      </p>
      <div className="w-full max-w-2xl mt-8">
        <div className="rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 shadow flex items-center justify-center min-h-[300px]">
          {loading && <span className="text-neutral-400">Loading...</span>}
          {error && <span className="text-red-500">{error}</span>}
          {!loading && !error && chartData && (
            <Pie data={chartData} />
          )}
          {!loading && !error && !chartData && (
            <span className="text-neutral-400">No data available.</span>
          )}
        </div>
      </div>
    </section>
  );
} 