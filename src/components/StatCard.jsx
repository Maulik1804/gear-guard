// src/components/StatCard.jsx
export default function StatCard({ title, value, sub, color }) {
  return (
    <div className={`border rounded-lg p-4 bg-${color}-50 border-${color}-200`}>
      <h4 className={`text-${color}-600 font-semibold`}>{title}</h4>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{sub}</p>
    </div>
  );
}
