// src/components/Navbar.jsx
export default function Navbar() {
  const tabs = [
    "Maintenance",
    "Dashboard",
    "Maintenance Calendar",
    "Equipment",
    "Reporting",
    "Teams",
  ];

  return (
    <div className="flex items-center gap-6 border-b bg-white px-6 py-3">
      <button className="px-4 py-1 border rounded-md text-sm">New</button>

      {tabs.map((tab) => (
        <span
          key={tab}
          className={`text-sm cursor-pointer ${
            tab === "Dashboard"
              ? "text-blue-600 font-semibold"
              : "text-gray-600"
          }`}
        >
          {tab}
        </span>
      ))}

      <div className="ml-auto">
        <input
          placeholder="Search..."
          className="border px-3 py-1 rounded-md text-sm"
        />
      </div>
    </div>
  );
}
