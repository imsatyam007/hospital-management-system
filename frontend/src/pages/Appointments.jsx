import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";
import {
  getAppointments,
  deleteAppointment,
  addAppointment,
} from "../services/appointmentService";
import {
  exportAppointmentsPDF,
  exportAppointmentsExcel,
} from "../utils/exportUtils";
import { createAppointmentOrder } from "../services/paymentService";

const getStyles = (dark) => `
  * { box-sizing: border-box; }

  .apt-page {
    background: ${dark ? "#111827" : "#f0f4f8"};
    min-height: 100vh;
    padding: 1.75rem 2rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    transition: background 0.3s;
  }

  /* ── TOP BAR ── */
  .apt-topbar {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
    flex-wrap: wrap; gap: 12px;
  }
  .apt-topbar-left { display: flex; align-items: center; gap: 12px; }

  .apt-icon-wrap {
    width: 42px; height: 42px; border-radius: 12px;
    background: ${dark ? "#1a1640" : "#EEEDFE"};
    border: 1px solid ${dark ? "#2d2870" : "#AFA9EC"};
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }

  .apt-page-title {
    font-size: 20px; font-weight: 700;
    color: ${dark ? "#ede9fe" : "#26215C"};
    margin: 0; letter-spacing: -0.3px;
  }
  .apt-page-sub {
    font-size: 12px; font-weight: 500;
    color: ${dark ? "#7F77DD" : "#534AB7"};
    margin: 2px 0 0;
  }

  .apt-count-badge {
    background: ${dark ? "#1a1640" : "#EEEDFE"};
    color: ${dark ? "#AFA9EC" : "#3C3489"};
    font-size: 12px; font-weight: 700;
    padding: 6px 14px; border-radius: 20px;
    border: 1px solid ${dark ? "#2d2870" : "#AFA9EC"};
    letter-spacing: 0.02em;
  }

  /* ── CARDS ── */
  .apt-card {
    background: ${dark ? "#1f2937" : "#ffffff"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    transition: background 0.3s, border-color 0.3s;
  }

  .apt-card-header {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 700;
    color: ${dark ? "#ede9fe" : "#26215C"};
    margin: 0 0 1.25rem;
    padding-bottom: 0.875rem;
    border-bottom: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.06)"};
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .apt-card-header-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #534AB7; flex-shrink: 0;
  }

  /* ── FORM FIELDS ── */
  .apt-card input,
  .apt-card select,
  .apt-card textarea {
    background: ${dark ? "#111827" : "#f5f8fa"} !important;
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.12)"} !important;
    border-radius: 10px !important;
    color: ${dark ? "#ede9fe" : "#111"} !important;
    padding: 10px 14px !important;
    font-size: 13px !important;
    outline: none !important;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .apt-card input::placeholder,
  .apt-card textarea::placeholder {
    color: ${dark ? "#4a5568" : "#aab8c2"} !important;
  }
  .apt-card input:focus,
  .apt-card select:focus,
  .apt-card textarea:focus {
    border-color: #534AB7 !important;
    box-shadow: 0 0 0 3px rgba(83,74,183,0.15) !important;
    background: ${dark ? "#1f2937" : "#ffffff"} !important;
  }
  .apt-card label {
    font-size: 11px !important; font-weight: 700 !important;
    color: ${dark ? "#7F77DD" : "#534AB7"} !important;
    text-transform: uppercase !important;
    letter-spacing: 0.07em !important;
    margin-bottom: 5px !important; display: block !important;
  }
  .apt-card button[type="submit"],
  .apt-card button[type="button"] {
    background: #534AB7 !important;
    color: #fff !important; border: none !important;
    border-radius: 10px !important; padding: 10px 22px !important;
    font-size: 13px !important; font-weight: 700 !important;
    cursor: pointer !important;
    transition: opacity 0.2s, transform 0.15s !important;
    letter-spacing: 0.03em !important;
  }
  .apt-card button[type="submit"]:hover,
  .apt-card button[type="button"]:hover {
    opacity: 0.88 !important; transform: translateY(-1px) !important;
  }

  /* ── TOOLBAR ── */
  .apt-toolbar {
    background: ${dark ? "#1f2937" : "#ffffff"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    border-radius: 16px;
    padding: 1rem 1.25rem; margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    transition: background 0.3s;
  }

  /* ── STATUS FILTER PILLS ── */
  .apt-filter-label {
    font-size: 12px; font-weight: 700;
    color: ${dark ? "#9ca3af" : "#666"};
    text-transform: uppercase; letter-spacing: 0.06em;
    white-space: nowrap;
  }

  .apt-pill {
    height: 34px; border-radius: 20px;
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.12)"};
    background: ${dark ? "#111827" : "#f5f8fa"};
    color: ${dark ? "#9ca3af" : "#555"};
    font-size: 12px; font-weight: 600;
    padding: 0 16px; cursor: pointer;
    transition: all 0.15s; white-space: nowrap;
  }
  .apt-pill:hover {
    background: ${dark ? "#1a1640" : "#EEEDFE"};
    color: ${dark ? "#AFA9EC" : "#3C3489"};
    border-color: ${dark ? "#2d2870" : "#AFA9EC"};
  }
  .apt-pill-all.active {
    background: ${dark ? "#1a1640" : "#534AB7"};
    color: ${dark ? "#AFA9EC" : "#fff"};
    border-color: ${dark ? "#2d2870" : "#534AB7"};
  }
  .apt-pill-scheduled.active {
    background: ${dark ? "#0c2340" : "#185FA5"};
    color: ${dark ? "#85B7EB" : "#fff"};
    border-color: ${dark ? "#1a3a5c" : "#185FA5"};
  }
  .apt-pill-completed.active {
    background: ${dark ? "#0d3d2e" : "#1D9E75"};
    color: ${dark ? "#5dcaa5" : "#fff"};
    border-color: ${dark ? "#1a5c43" : "#1D9E75"};
  }
  .apt-pill-cancelled.active {
    background: ${dark ? "rgba(162,45,45,0.2)" : "#A32D2D"};
    color: ${dark ? "#f09595" : "#fff"};
    border-color: ${dark ? "rgba(162,45,45,0.5)" : "#A32D2D"};
  }

  .apt-divider {
    width: 1px; height: 26px;
    background: ${dark ? "#374151" : "rgba(0,0,0,0.08)"}; flex-shrink: 0;
  }

  .apt-btn-pdf {
    height: 38px; border-radius: 10px;
    border: 1px solid ${dark ? "rgba(240,149,149,0.3)" : "rgba(162,45,45,0.3)"};
    color: ${dark ? "#f09595" : "#A32D2D"};
    background: ${dark ? "rgba(162,45,45,0.08)" : "#fff"};
    font-size: 12px; font-weight: 600; padding: 0 16px;
    display: inline-flex; align-items: center; gap: 6px;
    cursor: pointer; transition: background 0.15s; white-space: nowrap;
  }
  .apt-btn-pdf:hover { background: ${dark ? "rgba(162,45,45,0.18)" : "#FCEBEB"}; }

  .apt-btn-excel {
    height: 38px; border-radius: 10px;
    border: 1px solid ${dark ? "rgba(151,196,89,0.3)" : "rgba(39,80,10,0.3)"};
    color: ${dark ? "#97C459" : "#27500A"};
    background: ${dark ? "rgba(39,80,10,0.1)" : "#fff"};
    font-size: 12px; font-weight: 600; padding: 0 16px;
    display: inline-flex; align-items: center; gap: 6px;
    cursor: pointer; transition: background 0.15s; white-space: nowrap;
  }
  .apt-btn-excel:hover { background: ${dark ? "rgba(39,80,10,0.2)" : "#EAF3DE"}; }

  /* ── LIST CARD ── */
  .apt-list-card {
    background: ${dark ? "#1f2937" : "#ffffff"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    border-radius: 16px; overflow: hidden;
    transition: background 0.3s;
  }

  /* ── MUI DataGrid overrides ── */
  .apt-list-card .MuiDataGrid-root {
    border: none !important;
    color: ${dark ? "#c8c0f0" : "#111"} !important;
    background: transparent !important;
  }
  .apt-list-card .MuiDataGrid-columnHeaders {
    background: ${dark ? "#111827" : "#f5f8fa"} !important;
    border-bottom: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"} !important;
  }
  .apt-list-card .MuiDataGrid-columnHeaderTitle {
    color: ${dark ? "#7F77DD" : "#534AB7"} !important;
    font-weight: 700 !important; font-size: 11px !important;
    text-transform: uppercase !important; letter-spacing: 0.07em !important;
  }
  .apt-list-card .MuiDataGrid-cell {
    border-bottom: 1px solid ${dark ? "#1f2937" : "rgba(0,0,0,0.05)"} !important;
    color: ${dark ? "#c8c0f0" : "#111"} !important;
  }
  .apt-list-card .MuiDataGrid-row:hover {
    background: ${dark ? "#1a1a35" : "#f5f3ff"} !important;
  }
  .apt-list-card .MuiDataGrid-footerContainer {
    background: ${dark ? "#111827" : "#f5f8fa"} !important;
    border-top: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"} !important;
  }
  .apt-list-card .MuiTablePagination-root,
  .apt-list-card .MuiTablePagination-displayedRows,
  .apt-list-card .MuiTablePagination-selectLabel {
    color: ${dark ? "#7F77DD" : "#534AB7"} !important;
  }
  .apt-list-card .MuiIconButton-root { color: ${dark ? "#7F77DD" : "#534AB7"} !important; }
  .apt-list-card .MuiSelect-icon { color: ${dark ? "#7F77DD" : "#534AB7"} !important; }
  .apt-list-card .MuiDataGrid-selectedRowCount { color: ${dark ? "#7F77DD" : "#534AB7"} !important; }

  /* ── Action buttons in list ── */
  .apt-list-card .MuiButton-containedPrimary,
  .apt-list-card button.MuiButton-root:not(.MuiButton-containedError) {
    background: ${dark ? "#1a1640" : "#f5f3ff"} !important;
    color: ${dark ? "#AFA9EC" : "#534AB7"} !important;
    border: 1px solid ${dark ? "#2d2870" : "rgba(83,74,183,0.4)"} !important;
    border-radius: 8px !important; box-shadow: none !important;
    font-size: 11px !important; font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    padding: 4px 14px !important; min-width: unset !important;
    transition: background 0.15s !important;
  }
  .apt-list-card .MuiButton-containedPrimary:hover,
  .apt-list-card button.MuiButton-root:not(.MuiButton-containedError):hover {
    background: ${dark ? "#2d2870" : "#EEEDFE"} !important;
    box-shadow: none !important;
  }

  .apt-list-card .MuiButton-containedError {
    background: ${dark ? "rgba(162,45,45,0.1)" : "#fff"} !important;
    color: ${dark ? "#f09595" : "#A32D2D"} !important;
    border: 1px solid rgba(162,45,45,0.4) !important;
    border-radius: 8px !important; box-shadow: none !important;
    font-size: 11px !important; font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    padding: 4px 14px !important; min-width: unset !important;
    transition: background 0.15s !important;
  }
  .apt-list-card .MuiButton-containedError:hover {
    background: ${dark ? "rgba(162,45,45,0.2)" : "#FCEBEB"} !important;
    box-shadow: none !important;
  }
  .apt-list-card .MuiTouchRipple-root { display: none !important; }

  /* ── SCROLLBAR ── */
  .apt-page ::-webkit-scrollbar { width: 6px; height: 6px; }
  .apt-page ::-webkit-scrollbar-track { background: transparent; }
  .apt-page ::-webkit-scrollbar-thumb {
    background: ${dark ? "#2d2870" : "#AFA9EC"};
    border-radius: 10px;
  }
`;

const STATUS_PILLS = [
  { label: "All",       value: "",           cls: "apt-pill-all"       },
  { label: "Scheduled", value: "SCHEDULED",  cls: "apt-pill-scheduled" },
  { label: "Completed", value: "COMPLETED",  cls: "apt-pill-completed" },
  { label: "Cancelled", value: "CANCELLED",  cls: "apt-pill-cancelled" },
];

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const fetchAppointments = () => {
    getAppointments()
      .then((response) => {
        console.log("FULL RESPONSE:", response);
        console.log("RESPONSE DATA:", response.data);
        console.log("IS ARRAY:", Array.isArray(response.data));
        setAppointments(response.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => { fetchAppointments(); }, []);

  const addAppointmentWithPayment = async (appointmentData) => {
    try {
      const { data: order } = await createAppointmentOrder();
      new window.Razorpay({
        key: "rzp_test_SwHbDd6HGT7QbE",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Hospital Management System",
        description: "Appointment Fee",
        handler: async () => {
          try {
            const { data } = await addAppointment(appointmentData);
            console.log("Appointment Created:", data);
            alert("Appointment Confirmed Successfully");
            fetchAppointments();
          } catch (error) {
            console.error(error);
            alert("Failed to save appointment");
          }
        },
      }).open();
    } catch (error) {
      console.error(error);
      alert("Failed to create payment order");
    }
  };

  const handleDeleteAppointment = (id) => {
    deleteAppointment(id)
      .then(() => fetchAppointments())
      .catch((error) => console.error(error));
  };

  const filteredAppointments =
    statusFilter === ""
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  return (
    <MainLayout>
      <style>{getStyles(dark)}</style>
      <div className="apt-page">

        {/* Top bar */}
        <div className="apt-topbar">
          <div className="apt-topbar-left">
            <div className="apt-icon-wrap">📅</div>
            <div>
              <p className="apt-page-title">Appointments</p>
              <p className="apt-page-sub">Manage all hospital appointments</p>
            </div>
          </div>
          <span className="apt-count-badge">
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Appointment Form */}
        <div className="apt-card">
          <div className="apt-card-header">
            <span className="apt-card-header-dot" />
            Add New Appointment
          </div>
          <AppointmentForm onAddAppointment={addAppointmentWithPayment} />
        </div>

        {/* Toolbar: filter + exports */}
        <div className="apt-toolbar">
          <span className="apt-filter-label">Filter:</span>

          {STATUS_PILLS.map(({ label, value, cls }) => (
            <button
              key={value}
              className={`apt-pill ${cls} ${statusFilter === value ? "active" : ""}`}
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </button>
          ))}

          <div className="apt-divider" />

          <button
            className="apt-btn-pdf"
            onClick={() => exportAppointmentsPDF(filteredAppointments)}
          >
            📄 Export PDF
          </button>
          <button
            className="apt-btn-excel"
            onClick={() => exportAppointmentsExcel(filteredAppointments)}
          >
            📊 Export Excel
          </button>
        </div>

        {/* Appointment List */}
        <div className="apt-list-card">
          <AppointmentList
            appointments={filteredAppointments}
            onDeleteAppointment={handleDeleteAppointment}
          />
        </div>

      </div>
    </MainLayout>
  );
}

export default Appointments;