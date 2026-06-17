import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { isAdmin, isDoctor, isReceptionist } from "../utils/auth";
import {
  FaCalendarAlt, FaFolder, FaUsers, FaCreditCard,
  FaFileInvoiceDollar, FaPills, FaChartBar,
  FaSignOutAlt, FaClipboardCheck, FaSun, FaMoon
} from "react-icons/fa";

function MainLayout({ children }) {
  const navigate = useNavigate();

  // Load saved theme from localStorage, default to dark
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarBg = isDark ? "#1f2937" : "#1e40af";
  const mainBg = isDark ? "#111827" : "#f1f5f9";
  const textColor = isDark ? "#f9fafb" : "#ffffff";

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: mainBg }}>

      {/* Sidebar */}
      <div style={{
        width: "240px",
        backgroundColor: sidebarBg,
        color: textColor,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>HMS</h1>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark((prev) => !prev)}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              padding: "6px 8px",
              cursor: "pointer",
              color: textColor,
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
            }}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
          {[
            { to: "/", label: "Dashboard", show: true },
            { to: "/patients", label: "Patients", icon: <FaUsers />, show: isAdmin() || isDoctor() },
            { to: "/doctors", label: "Doctors", show: isAdmin() },
            { to: "/appointments", label: "Appointments", show: isAdmin() || isDoctor() || isReceptionist() },
            { to: "/availability", label: "Doctor Availability", show: true },
            { to: "/calendar", label: "Calendar", icon: <FaCalendarAlt />, show: isAdmin() || isDoctor() || isReceptionist() },
            { to: "/upload", label: "File Upload", icon: <FaFolder />, show: isAdmin() || isDoctor() },
            { to: "/payments", label: "Payments", icon: <FaCreditCard />, show: true },
            { to: "/billing", label: "Billing & Invoices", icon: <FaFileInvoiceDollar />, show: true },
            { to: "/prescriptions", label: "Prescriptions", icon: <FaPills />, show: true },
            { to: "/report-review", label: "Report Review", icon: <FaClipboardCheck />, show: true },
            { to: "/revenue", label: "Revenue", icon: <FaChartBar />, show: true },
          ]
            .filter((item) => item.show)
            .map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  color: textColor,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {icon} {label}
              </Link>
            ))}

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "24px",
              fontSize: "14px",
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "24px",
        color: isDark ? "#f9fafb" : "#111827",
        overflowY: "auto",
      }}>
        {children}
      </div>
    </div>
  );
}

export default MainLayout;