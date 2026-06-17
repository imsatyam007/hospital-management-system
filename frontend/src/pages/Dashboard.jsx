import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, CartesianGrid,
} from "recharts";
import { getDoctors } from "../services/doctorService";
import {
  getDashboardStats,
  getMonthlyPatients,
  getMonthlyAppointments,
} from "../services/dashboardService";

const COLORS = ["#378ADD", "#1D9E75", "#EF9F27", "#d83830", "#7F77DD", "#d453b8"];

function KpiCard({ icon, iconBg, iconColor, label, value, trend, trendColor, barColor, isDark }) {
  return (
    <div style={{
      background: isDark ? "#1e2535" : "#fff",
      border: `0.5px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      borderRadius: "14px",
      padding: "1.25rem",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 9,
        background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, marginBottom: 12,
      }}>
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: isDark ? "#9ca3af" : "#888", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 30, fontWeight: 600, color: isDark ? "#f9fafb" : "#111", lineHeight: 1, margin: 0 }}>{value.toLocaleString()}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, fontWeight: 500, color: trendColor }}>
        <span>↑</span><span>{trend}</span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: barColor }} />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: isDark ? "#1e2535" : "#fff",
        border: `0.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 8, padding: "8px 12px", fontSize: 12,
      }}>
        <p style={{ margin: "0 0 2px", color: isDark ? "#9ca3af" : "#888" }}>{label}</p>
        <p style={{ margin: 0, fontWeight: 600, color: isDark ? "#f9fafb" : "#111" }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [patientCount,        setPatientCount]        = useState(0);
  const [doctorCount,         setDoctorCount]         = useState(0);
  const [appointmentCount,    setAppointmentCount]    = useState(0);
  const [specializationData,  setSpecializationData]  = useState([]);
  const [monthlyPatients,     setMonthlyPatients]     = useState([]);
  const [monthlyAppointments, setMonthlyAppointments] = useState([]);

  // Sync with MainLayout's theme stored in localStorage
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") !== "light");

  useEffect(() => {
    // Listen for theme changes from MainLayout
    const observer = new MutationObserver(() => {
      setIsDark(localStorage.getItem("theme") !== "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const stats = await getDashboardStats();
        setPatientCount(stats.data.patients);
        setDoctorCount(stats.data.doctors);
        setAppointmentCount(stats.data.appointments);

        const monthlyData = await getMonthlyPatients();
        setMonthlyPatients(monthlyData.data);

        const appointmentTrend = await getMonthlyAppointments();
        setMonthlyAppointments(appointmentTrend.data);

        const doctors = await getDoctors();
        const specMap = {};
        doctors.data.forEach((d) => {
          specMap[d.specialization] = (specMap[d.specialization] || 0) + 1;
        });
        setSpecializationData(
          Object.entries(specMap).map(([name, value]) => ({ name, value }))
        );
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const today = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const bg       = isDark ? "#111827" : "#f5f7fa";
  const cardBg   = isDark ? "#1e2535" : "#fff";
  const border   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textMain = isDark ? "#f9fafb" : "#111";
  const textSub  = isDark ? "#9ca3af" : "#888";
  const gridLine = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const axisTick = isDark ? "#6b7280" : "#aaa";

  return (
    <MainLayout>
      <div style={{ background: bg, minHeight: "100vh", padding: "1.5rem", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#0F6E56" }}>⚕</div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 600, color: textMain, margin: 0 }}>Analytics Dashboard</p>
              <p style={{ fontSize: 12, color: textSub, margin: 0 }}>Hospital Management System</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>● Live</span>
            <span style={{ fontSize: 12, color: textSub, background: cardBg, border: `0.5px solid ${border}`, borderRadius: 6, padding: "5px 10px" }}>📅 {today}</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: "1.25rem" }}>
          <KpiCard isDark={isDark} icon="👥" iconBg="#E1F5EE" iconColor="#0F6E56" label="Total Patients" value={patientCount} trend="+12% vs last month" trendColor="#0F6E56" barColor="#1D9E75" />
          <KpiCard isDark={isDark} icon="🩺" iconBg="#E6F1FB" iconColor="#185FA5" label="Total Doctors"  value={doctorCount}  trend="+3 new this month"  trendColor="#185FA5" barColor="#378ADD" />
          <KpiCard isDark={isDark} icon="📅" iconBg="#FAEEDA" iconColor="#854F0B" label="Appointments"   value={appointmentCount} trend="+8% vs last month" trendColor="#854F0B" barColor="#EF9F27" />
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.25rem" }}>

          {/* Pie */}
          <div style={{ background: cardBg, border: `0.5px solid ${border}`, borderRadius: 14, padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: textMain, margin: "0 0 2px" }}>Doctor Specializations</p>
                <p style={{ fontSize: 11, color: textSub, margin: 0 }}>Distribution by department</p>
              </div>
              <span style={{ fontSize: 10, background: isDark ? "#2d3748" : "#f5f5f5", border: `0.5px solid ${border}`, borderRadius: 20, padding: "3px 9px", color: textSub }}>{specializationData.length} types</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={specializationData} dataKey="value" nameKey="name" outerRadius={80} innerRadius={48} paddingAngle={3} label={false}>
                  {specializationData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 11, color: textSub }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line */}
          <div style={{ background: cardBg, border: `0.5px solid ${border}`, borderRadius: 14, padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: textMain, margin: "0 0 2px" }}>Monthly Patients</p>
                <p style={{ fontSize: 11, color: textSub, margin: 0 }}>Admissions trend</p>
              </div>
              <span style={{ fontSize: 10, background: isDark ? "#2d3748" : "#f5f5f5", border: `0.5px solid ${border}`, borderRadius: 20, padding: "3px 9px", color: textSub }}>6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyPatients} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={gridLine} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: axisTick }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: axisTick }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Line type="monotone" dataKey="patients" stroke="#1D9E75" strokeWidth={2.5} dot={{ r: 3, fill: "#1D9E75", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ background: cardBg, border: `0.5px solid ${border}`, borderRadius: 14, padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: textMain, margin: "0 0 2px" }}>Monthly Appointments</p>
              <p style={{ fontSize: 11, color: textSub, margin: 0 }}>Booking volume over time</p>
            </div>
            <span style={{ fontSize: 10, background: isDark ? "#2d3748" : "#f5f5f5", border: `0.5px solid ${border}`, borderRadius: 20, padding: "3px 9px", color: textSub }}>Bar view</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyAppointments} margin={{ top: 4, right: 8, bottom: 0, left: -20 }} barSize={28}>
              <CartesianGrid strokeDasharray="4 4" stroke={gridLine} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: axisTick }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: axisTick }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="appointments" fill="#378ADD" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;