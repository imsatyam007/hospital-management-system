import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

function DoctorRevenueChart({
  doctorRevenue
}) {

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4 text-black">
        🏆 Revenue by Doctor
      </h2>

      <ResponsiveContainer
        width="100%"
        height={400}
      >

        <BarChart
          data={doctorRevenue}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="doctorName"
          />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="revenue"
            name="Revenue (₹)"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default DoctorRevenueChart;