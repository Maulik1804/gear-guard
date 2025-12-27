export const AuthCard = ({ title, children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
      {children}
    </div>
  </div>
);

export const Input = ({ type = "text", placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
    required
  />
);

export const Error = ({ text }) => (
  <p className="text-red-500 text-sm text-center mb-3">{text}</p>
);
