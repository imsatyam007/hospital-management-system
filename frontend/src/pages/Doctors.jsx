import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import DoctorForm from "../components/DoctorForm";
import DoctorList from "../components/DoctorList";
import {
  getDoctors,
  addDoctor,
  deleteDoctor,
  updateDoctor,
} from "../services/doctorService";
import { exportDoctorsPDF, exportDoctorsExcel } from "../utils/exportUtils";

const getStyles = (dark) => `
  * { box-sizing: border-box; }

  .doc-page {
    background: ${dark ? "#111827" : "#f0f4f8"};
    min-height: 100vh;
    padding: 1.75rem 2rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    transition: background 0.3s;
  }

  /* ── TOP BAR ── */
  .doc-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
    flex-wrap: wrap;
    gap: 12px;
  }
  .doc-topbar-left { display: flex; align-items: center; gap: 12px; }

  .doc-icon-wrap {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: ${dark ? "#0d3d2e" : "#E1F5EE"};
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    border: 1px solid ${dark ? "#1a5c43" : "#9FE1CB"};
  }

  .doc-page-title {
    font-size: 20px; font-weight: 700;
    color: ${dark ? "#f0faf6" : "#0a2e22"};
    margin: 0; letter-spacing: -0.3px;
  }
  .doc-page-sub {
    font-size: 12px;
    color: ${dark ? "#5dcaa5" : "#1D9E75"};
    margin: 2px 0 0; font-weight: 500;
  }

  .doc-count-badge {
    background: ${dark ? "#0d3d2e" : "#E1F5EE"};
    color: ${dark ? "#5dcaa5" : "#0F6E56"};
    font-size: 12px; font-weight: 700;
    padding: 6px 14px; border-radius: 20px;
    border: 1px solid ${dark ? "#1a5c43" : "#9FE1CB"};
    letter-spacing: 0.02em;
  }

  /* ── CARDS ── */
  .doc-card {
    background: ${dark ? "#1f2937" : "#ffffff"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    transition: background 0.3s, border-color 0.3s;
  }

  .doc-card-header {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 700;
    color: ${dark ? "#f0faf6" : "#0a2e22"};
    margin: 0 0 1.25rem;
    padding-bottom: 0.875rem;
    border-bottom: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.06)"};
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .doc-card-header-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #1D9E75; flex-shrink: 0;
  }

  /* ── FORM FIELDS inside DoctorForm ── */
  .doc-card input,
  .doc-card select,
  .doc-card textarea {
    background: ${dark ? "#111827" : "#f5f8fa"} !important;
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.12)"} !important;
    border-radius: 10px !important;
    color: ${dark ? "#e8f5f0" : "#111"} !important;
    padding: 10px 14px !important;
    font-size: 13px !important;
    outline: none !important;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .doc-card input::placeholder,
  .doc-card textarea::placeholder {
    color: ${dark ? "#4a6a5a" : "#aab8c2"} !important;
  }
  .doc-card input:focus,
  .doc-card select:focus,
  .doc-card textarea:focus {
    border-color: #1D9E75 !important;
    box-shadow: 0 0 0 3px rgba(29,158,117,0.15) !important;
    background: ${dark ? "#1f2937" : "#ffffff"} !important;
  }
  .doc-card label {
    font-size: 11px !important;
    font-weight: 700 !important;
    color: ${dark ? "#5dcaa5" : "#1D9E75"} !important;
    text-transform: uppercase !important;
    letter-spacing: 0.07em !important;
    margin-bottom: 5px !important;
    display: block !important;
  }
  .doc-card button[type="submit"],
  .doc-card button[type="button"] {
    background: #1D9E75 !important;
    color: #fff !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 10px 22px !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    transition: opacity 0.2s, transform 0.15s !important;
    letter-spacing: 0.03em !important;
  }
  .doc-card button[type="submit"]:hover,
  .doc-card button[type="button"]:hover {
    opacity: 0.88 !important;
    transform: translateY(-1px) !important;
  }

  /* ── TOOLBAR ── */
  .doc-toolbar {
    background: ${dark ? "#1f2937" : "#ffffff"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    border-radius: 16px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    transition: background 0.3s;
  }

  .doc-search-wrap {
    flex: 1; min-width: 180px;
    position: relative; display: flex; align-items: center;
  }
  .doc-search-icon {
    position: absolute; left: 11px;
    font-size: 14px; color: ${dark ? "#4a6a5a" : "#aaa"}; pointer-events: none;
  }
  .doc-search {
    width: 100%; height: 38px;
    background: ${dark ? "#111827" : "#f5f8fa"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.1)"};
    border-radius: 10px;
    padding: 0 12px 0 34px;
    font-size: 13px;
    color: ${dark ? "#e8f5f0" : "#111"};
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .doc-search::placeholder { color: ${dark ? "#4a6a5a" : "#bbb"}; }
  .doc-search:focus {
    border-color: #1D9E75;
    box-shadow: 0 0 0 3px rgba(29,158,117,0.12);
    background: ${dark ? "#1f2937" : "#fff"};
  }

  .doc-select {
    height: 38px;
    background: ${dark ? "#111827" : "#f5f8fa"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.1)"};
    border-radius: 10px;
    padding: 0 12px;
    font-size: 13px;
    color: ${dark ? "#e8f5f0" : "#555"};
    outline: none; cursor: pointer;
    transition: border-color 0.2s;
  }
  .doc-select:focus { border-color: #1D9E75; }

  .doc-divider {
    width: 1px; height: 26px;
    background: ${dark ? "#374151" : "rgba(0,0,0,0.08)"}; flex-shrink: 0;
  }

  .doc-btn-pdf {
    height: 38px; border-radius: 10px;
    border: 1px solid ${dark ? "rgba(240,149,149,0.3)" : "rgba(162,45,45,0.3)"};
    color: ${dark ? "#f09595" : "#A32D2D"};
    background: ${dark ? "rgba(162,45,45,0.08)" : "#fff"};
    font-size: 12px; font-weight: 600;
    padding: 0 16px;
    display: inline-flex; align-items: center; gap: 6px;
    cursor: pointer; transition: background 0.15s; white-space: nowrap;
  }
  .doc-btn-pdf:hover {
    background: ${dark ? "rgba(162,45,45,0.18)" : "#FCEBEB"};
  }

  .doc-btn-excel {
    height: 38px; border-radius: 10px;
    border: 1px solid ${dark ? "rgba(151,196,89,0.3)" : "rgba(39,80,10,0.3)"};
    color: ${dark ? "#97C459" : "#27500A"};
    background: ${dark ? "rgba(39,80,10,0.1)" : "#fff"};
    font-size: 12px; font-weight: 600;
    padding: 0 16px;
    display: inline-flex; align-items: center; gap: 6px;
    cursor: pointer; transition: background 0.15s; white-space: nowrap;
  }
  .doc-btn-excel:hover {
    background: ${dark ? "rgba(39,80,10,0.2)" : "#EAF3DE"};
  }

  /* ── LIST CARD ── */
  .doc-list-card {
    background: ${dark ? "#1f2937" : "#ffffff"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    border-radius: 16px;
    overflow: hidden;
    transition: background 0.3s;
  }

  /* ── MUI DataGrid dark overrides ── */
  .doc-list-card .MuiDataGrid-root {
    border: none !important;
    color: ${dark ? "#c8e6d8" : "#111"} !important;
    background: transparent !important;
  }
  .doc-list-card .MuiDataGrid-columnHeaders {
    background: ${dark ? "#111827" : "#f5f8fa"} !important;
    border-bottom: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"} !important;
  }
  .doc-list-card .MuiDataGrid-columnHeaderTitle {
    color: ${dark ? "#5dcaa5" : "#0F6E56"} !important;
    font-weight: 700 !important; font-size: 11px !important;
    text-transform: uppercase !important; letter-spacing: 0.07em !important;
  }
  .doc-list-card .MuiDataGrid-cell {
    border-bottom: 1px solid ${dark ? "#1f2937" : "rgba(0,0,0,0.05)"} !important;
    color: ${dark ? "#c8e6d8" : "#111"} !important;
  }
  .doc-list-card .MuiDataGrid-row:hover {
    background: ${dark ? "#263340" : "#f0faf6"} !important;
  }
  .doc-list-card .MuiDataGrid-footerContainer {
    background: ${dark ? "#111827" : "#f5f8fa"} !important;
    border-top: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"} !important;
  }
  .doc-list-card .MuiTablePagination-root,
  .doc-list-card .MuiTablePagination-displayedRows,
  .doc-list-card .MuiTablePagination-selectLabel {
    color: ${dark ? "#5dcaa5" : "#0F6E56"} !important;
  }
  .doc-list-card .MuiIconButton-root {
    color: ${dark ? "#5dcaa5" : "#0F6E56"} !important;
  }
  .doc-list-card .MuiSelect-icon {
    color: ${dark ? "#5dcaa5" : "#0F6E56"} !important;
  }
  .doc-list-card .MuiDataGrid-selectedRowCount {
    color: ${dark ? "#5dcaa5" : "#0F6E56"} !important;
  }

  /* ── Shift pills ── */
  .doc-list-card [style*="rgb(76, 175, 80)"],
  .doc-list-card [style*="rgb(0, 128, 0)"],
  .doc-list-card [style*="background: green"],
  .doc-list-card [style*="background-color: green"],
  .doc-list-card [style*="background:#4CAF50"],
  .doc-list-card [style*="background: #4CAF50"] {
    background: ${dark ? "#0d3d2e" : "#E1F5EE"} !important;
    color: ${dark ? "#5dcaa5" : "#0F6E56"} !important;
  }
  .doc-list-card [style*="rgb(156, 39, 176)"],
  .doc-list-card [style*="rgb(103, 58, 183)"],
  .doc-list-card [style*="purple"],
  .doc-list-card [style*="#9C27B0"],
  .doc-list-card [style*="#673AB7"] {
    background: ${dark ? "#1a1640" : "#EEEDFE"} !important;
    color: ${dark ? "#AFA9EC" : "#3C3489"} !important;
  }
  .doc-list-card [style*="rgb(255, 152, 0)"],
  .doc-list-card [style*="rgb(255, 165, 0)"],
  .doc-list-card [style*="orange"],
  .doc-list-card [style*="#FF9800"],
  .doc-list-card [style*="#FFA500"] {
    background: ${dark ? "#2a1a05" : "#FAEEDA"} !important;
    color: ${dark ? "#FAC775" : "#633806"} !important;
  }
  .doc-list-card [style*="rgb(33, 33, 33)"],
  .doc-list-card [style*="rgb(55, 65, 81)"],
  .doc-list-card [style*="#212121"],
  .doc-list-card [style*="#333"] {
    background: ${dark ? "#1a1640" : "#F0EEF8"} !important;
    color: ${dark ? "#AFA9EC" : "#3C3489"} !important;
  }

  /* ── EDIT button ── */
  .doc-list-card .MuiButton-containedPrimary,
  .doc-list-card button.MuiButton-root:not(.MuiButton-containedError) {
    background: ${dark ? "#0d3d2e" : "#f0faf6"} !important;
    color: ${dark ? "#5dcaa5" : "#1D9E75"} !important;
    border: 1px solid ${dark ? "#1a5c43" : "rgba(29,158,117,0.4)"} !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    font-size: 11px !important; font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    padding: 4px 14px !important; min-width: unset !important;
    transition: background 0.15s !important;
  }
  .doc-list-card .MuiButton-containedPrimary:hover,
  .doc-list-card button.MuiButton-root:not(.MuiButton-containedError):hover {
    background: ${dark ? "#1a5c43" : "#E1F5EE"} !important;
    box-shadow: none !important;
  }

  /* ── DELETE button ── */
  .doc-list-card .MuiButton-containedError {
    background: ${dark ? "rgba(162,45,45,0.1)" : "#fff"} !important;
    color: ${dark ? "#f09595" : "#A32D2D"} !important;
    border: 1px solid ${dark ? "rgba(162,45,45,0.4)" : "rgba(162,45,45,0.4)"} !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    font-size: 11px !important; font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    padding: 4px 14px !important; min-width: unset !important;
    transition: background 0.15s !important;
  }
  .doc-list-card .MuiButton-containedError:hover {
    background: ${dark ? "rgba(162,45,45,0.2)" : "#FCEBEB"} !important;
    box-shadow: none !important;
  }

  .doc-list-card .MuiTouchRipple-root { display: none !important; }

  /* ── SCROLLBAR ── */
  .doc-page ::-webkit-scrollbar { width: 6px; height: 6px; }
  .doc-page ::-webkit-scrollbar-track { background: transparent; }
  .doc-page ::-webkit-scrollbar-thumb {
    background: ${dark ? "#1a5c43" : "#9FE1CB"};
    border-radius: 10px;
  }
`;

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");

  // Sync with the global theme set by MainLayout on <html>
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

  const fetchDoctors = () => {
    getDoctors()
      .then((response) => {
        console.log(response.data);
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = (doctor) => {
    addDoctor(doctor)
      .then(() => fetchDoctors())
      .catch((error) => console.error(error));
  };

  const handleDeleteDoctor = (id) => {
    deleteDoctor(id)
      .then(() => fetchDoctors())
      .catch((error) => console.error(error));
  };

  const handleUpdateDoctor = (id, doctor) => {
    updateDoctor(id, doctor)
      .then(() => {
        fetchDoctors();
        setEditingDoctor(null);
      })
      .catch((error) => console.error(error));
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      specializationFilter === "" ||
      doctor.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  const specializations = [
    ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
  ];

  return (
    <MainLayout>
      <style>{getStyles(dark)}</style>
      <div className="doc-page">

        {/* Top bar */}
        <div className="doc-topbar">
          <div className="doc-topbar-left">
            <div className="doc-icon-wrap">⚕️</div>
            <div>
              <p className="doc-page-title">Doctors</p>
              <p className="doc-page-sub">Manage all hospital doctors</p>
            </div>
          </div>
          <span className="doc-count-badge">{filteredDoctors.length} doctors</span>
        </div>

        {/* DoctorForm */}
        <div className="doc-card">
          <div className="doc-card-header">
            <span className="doc-card-header-dot" />
            {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
          </div>
          <DoctorForm
            onAddDoctor={handleAddDoctor}
            editingDoctor={editingDoctor}
            onUpdateDoctor={handleUpdateDoctor}
          />
        </div>

        {/* Toolbar */}
        <div className="doc-toolbar">
          <div className="doc-search-wrap">
            <span className="doc-search-icon">🔍</span>
            <input
              className="doc-search"
              type="text"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="doc-select"
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
          >
            <option value="">All Specializations</option>
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          <div className="doc-divider" />

          <button
            className="doc-btn-pdf"
            onClick={() => exportDoctorsPDF(filteredDoctors)}
          >
            📄 Export PDF
          </button>

          <button
            className="doc-btn-excel"
            onClick={() => exportDoctorsExcel(filteredDoctors)}
          >
            📊 Export Excel
          </button>
        </div>

        {/* DoctorList */}
        <div className="doc-list-card">
          <DoctorList
            doctors={filteredDoctors}
            onDeleteDoctor={handleDeleteDoctor}
            onEditDoctor={setEditingDoctor}
          />
        </div>

      </div>
    </MainLayout>
  );
}

export default Doctors;