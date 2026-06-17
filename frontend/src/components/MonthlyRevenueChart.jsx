import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function MonthlyRevenueChart({
  monthlyRevenue
}) {

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4 text-black">
        📅 Monthly Revenue Analytics
      </h2>

      <ResponsiveContainer
        width="100%"
        height={400}
      >

        <LineChart
          data={monthlyRevenue}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default MonthlyRevenueChart;