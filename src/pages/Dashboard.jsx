// src/pages/Dashboard.jsx
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="p-6">
        {/* Dashboard Title */}
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Critical Equipment */}
          <div className="border rounded-lg p-4 bg-red-50 border-red-200">
            <h4 className="text-red-600 font-semibold">Critical Equipment</h4>
            <p className="text-2xl font-bold mt-2">5 Units</p>
            <p className="text-sm text-gray-600 mt-1">Health &lt; 30%</p>
          </div>

          {/* Technician Load */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <h4 className="text-blue-600 font-semibold">Technician Load</h4>
            <p className="text-2xl font-bold mt-2">85% Utilized</p>
            <p className="text-sm text-gray-600 mt-1">Assign Carefully</p>
          </div>

          {/* Open Requests */}
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <h4 className="text-green-600 font-semibold">Open Requests</h4>
            <p className="text-2xl font-bold mt-2">12 Pending</p>
            <p className="text-sm text-gray-600 mt-1">3 Overdue</p>
          </div>
        </div>

        {/* Description (from your wireframe) */}
        <div className="mt-6 text-sm text-gray-600">
          <ul className="list-disc ml-5 space-y-1">
            <li>
              Red cards highlight at-risk equipment needing urgent attention.
            </li>
            <li>Blue card shows workforce utilization to avoid overload.</li>
            <li>Green card tracks request progress and overdue maintenance.</li>
          </ul>
        </div>

        {/* Requests Table */}
        <DataTable />
      </div>
    </div>
  );
}
