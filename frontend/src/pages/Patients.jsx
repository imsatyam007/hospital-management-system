import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { exportPatientsPDF, exportPatientsExcel } from "../utils/exportUtils";
import MainLayout from "../layouts/MainLayout";
import PatientForm from "../components/PatientForm";
import PatientList from "../components/PatientList";
import { FaUserInjured } from "react-icons/fa";
import {
  getPatients,
  addPatient,
  deletePatient,
  updatePatient,
} from "../services/patientService";

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

const getStyles = (dark) => `
  * { box-sizing: border-box; }

  .pat-page {
    background: ${dark ? "#111827" : "#f0f4f8"};
    min-height: 100vh;
    padding: 1.75rem 2rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    transition: background 0.3s;
  }

  /* ── TOP BAR ── */
  .pat-topbar {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
    flex-wrap: wrap; gap: 12px;
  }
  .pat-topbar-left { display: flex; align-items: center; gap: 12px; }

  .pat-icon-wrap {
    width: 42px; height: 42px; border-radius: 12px;
    background: ${dark ? "#0c2340" : "#E6F1FB"};
    border: 1px solid ${dark ? "#1a3a5c" : "#B5D4F4"};
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }

  .pat-page-title {
    font-size: 20px; font-weight: 700;
    color: ${dark ? "#f0f8ff" : "#042C53"};
    margin: 0; letter-spacing: -0.3px;
  }
  .pat-page-sub {
    font-size: 12px; font-weight: 500;
    color: ${dark ? "#378ADD" : "#185FA5"};
    margin: 2px 0 0;
  }

  .pat-count-badge {
    background: ${dark ? "#0c2340" : "#E6F1FB"};
    color: ${dark ? "#85B7EB" : "#0C447C"};
    font-size: 12px; font-weight: 700;
    padding: 6px 14px; border-radius: 20px;
    border: 1px solid ${dark ? "#1a3a5c" : "#B5D4F4"};
    letter-spacing: 0.02em;
  }

  /* ── CARDS ── */
  .pat-card {
    background: ${dark ? "#1f2937" : "#ffffff"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    transition: background 0.3s, border-color 0.3s;
  }

  .pat-card-header {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 700;
    color: ${dark ? "#f0f8ff" : "#042C53"};
    margin: 0 0 1.25rem;
    padding-bottom: 0.875rem;
    border-bottom: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.06)"};
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .pat-card-header-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #185FA5; flex-shrink: 0;
  }

  /* ── FORM FIELDS ── */
  .pat-card input,
  .pat-card select,
  .pat-card textarea {
    background: ${dark ? "#111827" : "#f5f8fa"} !important;
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.12)"} !important;
    border-radius: 10px !important;
    color: ${dark ? "#e8f0fe" : "#111"} !important;
    padding: 10px 14px !important;
    font-size: 13px !important;
    outline: none !important;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .pat-card input::placeholder,
  .pat-card textarea::placeholder {
    color: ${dark ? "#4a5568" : "#aab8c2"} !important;
  }
  .pat-card input:focus,
  .pat-card select:focus,
  .pat-card textarea:focus {
    border-color: #185FA5 !important;
    box-shadow: 0 0 0 3px rgba(24,95,165,0.15) !important;
    background: ${dark ? "#1f2937" : "#ffffff"} !important;
  }
  .pat-card label {
    font-size: 11px !important; font-weight: 700 !important;
    color: ${dark ? "#378ADD" : "#185FA5"} !important;
    text-transform: uppercase !important;
    letter-spacing: 0.07em !important;
    margin-bottom: 5px !important; display: block !important;
  }
  .pat-card button[type="submit"],
  .pat-card button[type="button"] {
    background: #185FA5 !important;
    color: #fff !important; border: none !important;
    border-radius: 10px !important; padding: 10px 22px !important;
    font-size: 13px !important; font-weight: 700 !important;
    cursor: pointer !important;
    transition: opacity 0.2s, transform 0.15s !important;
    letter-spacing: 0.03em !important;
  }
  .pat-card button[type="submit"]:hover,
  .pat-card button[type="button"]:hover {
    opacity: 0.88 !important; transform: translateY(-1px) !important;
  }

  /* ── TOOLBAR ── */
  .pat-toolbar {
    background: ${dark ? "#1f2937" : "#ffffff"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    border-radius: 16px;
    padding: 1rem 1.25rem; margin-bottom: 1.25rem;
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    transition: background 0.3s;
  }

  .pat-search-wrap {
    flex: 1; min-width: 180px;
    position: relative; display: flex; align-items: center;
  }
  .pat-search-icon {
    position: absolute; left: 11px;
    font-size: 14px; color: ${dark ? "#4a5568" : "#aaa"}; pointer-events: none;
  }
  .pat-search {
    width: 100%; height: 38px;
    background: ${dark ? "#111827" : "#f5f8fa"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.1)"};
    border-radius: 10px; padding: 0 12px 0 34px;
    font-size: 13px; color: ${dark ? "#e8f0fe" : "#111"};
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .pat-search::placeholder { color: ${dark ? "#4a5568" : "#bbb"}; }
  .pat-search:focus {
    border-color: #185FA5;
    box-shadow: 0 0 0 3px rgba(24,95,165,0.12);
    background: ${dark ? "#1f2937" : "#fff"};
  }

  .pat-select {
    height: 38px;
    background: ${dark ? "#111827" : "#f5f8fa"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.1)"};
    border-radius: 10px; padding: 0 12px;
    font-size: 13px; color: ${dark ? "#e8f0fe" : "#555"};
    outline: none; cursor: pointer; transition: border-color 0.2s;
  }
  .pat-select:focus { border-color: #185FA5; }

  .pat-divider {
    width: 1px; height: 26px;
    background: ${dark ? "#374151" : "rgba(0,0,0,0.08)"}; flex-shrink: 0;
  }

  .pat-btn-pdf {
    height: 38px; border-radius: 10px;
    border: 1px solid ${dark ? "rgba(240,149,149,0.3)" : "rgba(162,45,45,0.3)"};
    color: ${dark ? "#f09595" : "#A32D2D"};
    background: ${dark ? "rgba(162,45,45,0.08)" : "#fff"};
    font-size: 12px; font-weight: 600; padding: 0 16px;
    display: inline-flex; align-items: center; gap: 6px;
    cursor: pointer; transition: background 0.15s; white-space: nowrap;
  }
  .pat-btn-pdf:hover { background: ${dark ? "rgba(162,45,45,0.18)" : "#FCEBEB"}; }

  .pat-btn-excel {
    height: 38px; border-radius: 10px;
    border: 1px solid ${dark ? "rgba(151,196,89,0.3)" : "rgba(39,80,10,0.3)"};
    color: ${dark ? "#97C459" : "#27500A"};
    background: ${dark ? "rgba(39,80,10,0.1)" : "#fff"};
    font-size: 12px; font-weight: 600; padding: 0 16px;
    display: inline-flex; align-items: center; gap: 6px;
    cursor: pointer; transition: background 0.15s; white-space: nowrap;
  }
  .pat-btn-excel:hover { background: ${dark ? "rgba(39,80,10,0.2)" : "#EAF3DE"}; }

  /* ── LIST CARD ── */
  .pat-list-card {
    background: ${dark ? "#1f2937" : "#ffffff"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    border-radius: 16px; overflow: hidden;
    margin-bottom: 1.25rem; transition: background 0.3s;
  }

  /* ── MUI DataGrid overrides ── */
  .pat-list-card .MuiDataGrid-root {
    border: none !important;
    color: ${dark ? "#c8d8f0" : "#111"} !important;
    background: transparent !important;
  }
  .pat-list-card .MuiDataGrid-columnHeaders {
    background: ${dark ? "#111827" : "#f5f8fa"} !important;
    border-bottom: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"} !important;
  }
  .pat-list-card .MuiDataGrid-columnHeaderTitle {
    color: ${dark ? "#378ADD" : "#185FA5"} !important;
    font-weight: 700 !important; font-size: 11px !important;
    text-transform: uppercase !important; letter-spacing: 0.07em !important;
  }
  .pat-list-card .MuiDataGrid-cell {
    border-bottom: 1px solid ${dark ? "#1f2937" : "rgba(0,0,0,0.05)"} !important;
    color: ${dark ? "#c8d8f0" : "#111"} !important;
  }
  .pat-list-card .MuiDataGrid-row:hover {
    background: ${dark ? "#1e2d40" : "#f0f6fd"} !important;
  }
  .pat-list-card .MuiDataGrid-footerContainer {
    background: ${dark ? "#111827" : "#f5f8fa"} !important;
    border-top: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"} !important;
  }
  .pat-list-card .MuiTablePagination-root,
  .pat-list-card .MuiTablePagination-displayedRows,
  .pat-list-card .MuiTablePagination-selectLabel {
    color: ${dark ? "#378ADD" : "#185FA5"} !important;
  }
  .pat-list-card .MuiIconButton-root { color: ${dark ? "#378ADD" : "#185FA5"} !important; }
  .pat-list-card .MuiSelect-icon { color: ${dark ? "#378ADD" : "#185FA5"} !important; }
  .pat-list-card .MuiDataGrid-selectedRowCount { color: ${dark ? "#378ADD" : "#185FA5"} !important; }

  /* ── EDIT button ── */
  .pat-list-card .MuiButton-containedPrimary,
  .pat-list-card button.MuiButton-root:not(.MuiButton-containedError) {
    background: ${dark ? "#0c2340" : "#f0f6fd"} !important;
    color: ${dark ? "#85B7EB" : "#185FA5"} !important;
    border: 1px solid ${dark ? "#1a3a5c" : "rgba(24,95,165,0.4)"} !important;
    border-radius: 8px !important; box-shadow: none !important;
    font-size: 11px !important; font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    padding: 4px 14px !important; min-width: unset !important;
    transition: background 0.15s !important;
  }
  .pat-list-card .MuiButton-containedPrimary:hover,
  .pat-list-card button.MuiButton-root:not(.MuiButton-containedError):hover {
    background: ${dark ? "#1a3a5c" : "#E6F1FB"} !important;
    box-shadow: none !important;
  }

  /* ── DELETE button ── */
  .pat-list-card .MuiButton-containedError {
    background: ${dark ? "rgba(162,45,45,0.1)" : "#fff"} !important;
    color: ${dark ? "#f09595" : "#A32D2D"} !important;
    border: 1px solid rgba(162,45,45,0.4) !important;
    border-radius: 8px !important; box-shadow: none !important;
    font-size: 11px !important; font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    padding: 4px 14px !important; min-width: unset !important;
    transition: background 0.15s !important;
  }
  .pat-list-card .MuiButton-containedError:hover {
    background: ${dark ? "rgba(162,45,45,0.2)" : "#FCEBEB"} !important;
    box-shadow: none !important;
  }
  .pat-list-card .MuiTouchRipple-root { display: none !important; }

  /* ── HISTORY CARD ── */
  .pat-history-card {
    background: ${dark ? "#1f2937" : "#ffffff"};
    border: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    border-radius: 16px; overflow: hidden;
    transition: background 0.3s;
  }
  .pat-history-header {
    padding: 10px 16px;
    background: ${dark ? "#111827" : "#f5f8fa"};
    border-bottom: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.07)"};
    font-size: 11px; font-weight: 700;
    color: ${dark ? "#378ADD" : "#185FA5"};
    text-transform: uppercase; letter-spacing: 0.07em;
    display: flex; justify-content: space-between;
  }
  .pat-history-row {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 11px 16px;
    border-bottom: 1px solid ${dark ? "#374151" : "rgba(0,0,0,0.05)"};
    transition: background 0.15s;
  }
  .pat-history-row:hover {
    background: ${dark ? "#1e2d40" : "#f0f6fd"};
  }
  .pat-history-row:last-child { border-bottom: none; }
  .pat-history-name {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 500;
    color: ${dark ? "#e8f0fe" : "#111"};
  }
  .pat-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: ${dark ? "#0c2340" : "#E6F1FB"};
    color: ${dark ? "#85B7EB" : "#0C447C"};
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; flex-shrink: 0;
    border: 1px solid ${dark ? "#1a3a5c" : "#B5D4F4"};
  }
  .pat-history-link {
    display: inline-flex; align-items: center; gap: 5px;
    background: ${dark ? "#0c2340" : "#f0f6fd"};
    color: ${dark ? "#85B7EB" : "#185FA5"};
    border: 1px solid ${dark ? "#1a3a5c" : "rgba(55,138,221,0.35)"};
    border-radius: 8px; padding: 4px 12px;
    font-size: 11px; font-weight: 600; text-decoration: none;
    transition: background 0.15s;
  }
  .pat-history-link:hover {
    background: ${dark ? "#1a3a5c" : "#dbeafe"};
  }

  /* ── SCROLLBAR ── */
  .pat-page ::-webkit-scrollbar { width: 6px; height: 6px; }
  .pat-page ::-webkit-scrollbar-track { background: transparent; }
  .pat-page ::-webkit-scrollbar-thumb {
    background: ${dark ? "#1a3a5c" : "#B5D4F4"};
    border-radius: 10px;
  }
`;

function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [editingPatient, setEditingPatient] = useState(null);

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

  const fetchPatients = () => {
    getPatients()
      .then((response) => setPatients(response.data))
      .catch(console.error);
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleAddPatient    = (p)     => addPatient(p).then(() => fetchPatients()).catch(console.error);
  const handleDeletePatient = (id)    => deletePatient(id).then(() => fetchPatients()).catch(console.error);
  const handleUpdatePatient = (id, p) => updatePatient(id, p).then(() => { fetchPatients(); setEditingPatient(null); }).catch(console.error);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch     = p.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender     = genderFilter === "" || p.gender === genderFilter;
    const matchesBloodGroup = bloodGroupFilter === "" || p.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesGender && matchesBloodGroup;
  });

  return (
    <MainLayout>
      <style>{getStyles(dark)}</style>
      <div className="pat-page">

        {/* Top bar */}
        <div className="pat-topbar">
          <div className="pat-topbar-left">
            <div className="pat-icon-wrap">
              <FaUserInjured style={{ color: dark ? "#378ADD" : "#185FA5", fontSize: 18 }} />
            </div>
            <div>
              <p className="pat-page-title">Patients</p>
              <p className="pat-page-sub">Manage all hospital patients</p>
            </div>
          </div>
          <span className="pat-count-badge">{filteredPatients.length} patients</span>
        </div>

        {/* Form card */}
        <div className="pat-card">
          <div className="pat-card-header">
            <span className="pat-card-header-dot" />
            {editingPatient ? "Edit Patient" : "Add New Patient"}
          </div>
          <PatientForm
            onAddPatient={handleAddPatient}
            editingPatient={editingPatient}
            onUpdatePatient={handleUpdatePatient}
          />
        </div>

        {/* Toolbar */}
        <div className="pat-toolbar">
          <div className="pat-search-wrap">
            <span className="pat-search-icon">🔍</span>
            <input
              className="pat-search"
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="pat-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select className="pat-select" value={bloodGroupFilter} onChange={(e) => setBloodGroupFilter(e.target.value)}>
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>
          </select>

          <div className="pat-divider" />

          <button className="pat-btn-pdf" onClick={() => exportPatientsPDF(filteredPatients)}>
            📄 Export PDF
          </button>
          <button className="pat-btn-excel" onClick={() => exportPatientsExcel(filteredPatients)}>
            📊 Export Excel
          </button>
        </div>

        {/* Patient List */}
        <div className="pat-list-card">
          <PatientList
            patients={filteredPatients}
            onDeletePatient={handleDeletePatient}
            onEditPatient={setEditingPatient}
          />
        </div>

        {/* View History */}
        <div className="pat-history-card">
          <div className="pat-history-header">
            <span>Patient</span><span>History</span>
          </div>
          {filteredPatients.map((patient) => (
            <div key={patient.patientId} className="pat-history-row">
              <div className="pat-history-name">
                <div className="pat-avatar">{getInitials(patient.fullName)}</div>
                {patient.fullName}
              </div>
              <Link to={`/patients/${patient.patientId}`} className="pat-history-link">
                📋 View History
              </Link>
            </div>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}

export default Patients;