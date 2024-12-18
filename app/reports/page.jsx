/*"use client";

import { useState, useEffect } from "react";
import PieChart from "@/components/PieChart";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registering the ArcElement
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Reports() {
  const [reportType, setReportType] = useState("tookFood");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reports?type=${reportType}`);
      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const handleReportChange = (e) => {
    setReportType(e.target.value);
  };

  const transformDataForChart = () => {
    return reportData.map((item) => ({
      label: item._id === true ? "Yes" : item._id === false ? "No" : item._id,
      value: item.count,
    }));
  };

  return (
    <div className="p-6 bg-gray-900 text-white h-screen">
      <h1 className="text-2xl font-semibold mb-4">Generate Reports</h1>

      <div className="mb-6">
        <label className="block mb-2">Select Report Type:</label>
        <select
          value={reportType}
          onChange={handleReportChange}
          className="p-2 bg-gray-800 text-white rounded"
        >
          <option value="tookFood">Food Taken Report</option>
          <option value="gender">Gender Breakdown</option>
        </select>
      </div>

      {loading && <div>Loading report...</div>}
      {error && <div>Error: {error}</div>}

      {!loading && !error && reportData.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mb-4">Report Visualization:</h2>
          <PieChart data={transformDataForChart()} />
        </div>
      )}

      {!loading && !error && (
        <div>
          <h2 className="text-xl font-medium mt-6 mb-4">Raw Report Data:</h2>
          <pre className="bg-gray-800 p-4 rounded">
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
*/