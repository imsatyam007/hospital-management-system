import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function PaidPendingPieChart({ paidRevenue, pendingRevenue }) {
  const data = [
    { name: "Paid Revenue", value: paidRevenue },
    { name: "Pending Revenue", value: pendingRevenue },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  if (!paidRevenue && !pendingRevenue) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">No billing data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-black">
        💳  Paid vs Pending Revenue
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, value }) => `${name}: ₹${value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PaidPendingPieChart;