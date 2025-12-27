// src/components/DataTable.jsx
export default function DataTable() {
  return (
    <div className="bg-white border rounded-lg mt-6 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-gray-600">
            <th className="p-3">Subject</th>
            <th className="p-3">Employee</th>
            <th className="p-3">Technician</th>
            <th className="p-3">Category</th>
            <th className="p-3">Stage</th>
            <th className="p-3">Company</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <td className="p-3">Test Activity</td>
            <td className="p-3">Mitchell Admin</td>
            <td className="p-3">Alex Foster</td>
            <td className="p-3">Computer</td>
            <td className="p-3 text-blue-600">New Request</td>
            <td className="p-3">My Company</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
