import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import MainLayout from "../layouts/MainLayout";

const styles = `
  .ph-page {
    background: #f5f7fa;
    min-height: 100vh;
    padding: 1.5rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    max-width: 860px;
  }

  /* ── Back button ── */
  .ph-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: #fff;
    color: #555;
    border: 0.5px solid rgba(0,0,0,0.12);
    border-radius: 8px;
    padding: 7px 14px;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    margin-bottom: 1.5rem;
    transition: background 0.15s;
  }
  .ph-back-btn:hover { background: #f0f0f0; }

  /* ── Section cards ── */
  .ph-card {
    background: #fff;
    border: 0.5px solid rgba(0,0,0,0.08);
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1rem;
  }
  .ph-card-header {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 0.875rem;
    padding-bottom: 0.75rem;
    border-bottom: 0.5px solid rgba(0,0,0,0.07);
  }
  .ph-card-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .ph-card-title {
    font-size: 14px; font-weight: 600; color: #111; margin: 0;
  }
  .ph-card-count {
    margin-left: auto;
    font-size: 11px; font-weight: 600;
    padding: 3px 8px; border-radius: 20px;
  }

  /* ── Patient info grid ── */
  .ph-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 24px;
  }
  .ph-info-item { display: flex; flex-direction: column; gap: 2px; }
  .ph-info-label {
    font-size: 10px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.07em; color: #aaa;
  }
  .ph-info-value { font-size: 13px; font-weight: 500; color: #111; }

  /* ── Patient avatar row ── */
  .ph-patient-hero {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 1.25rem;
  }
  .ph-avatar-lg {
    width: 52px; height: 52px; border-radius: 50%;
    background: #E6F1FB; color: #0C447C;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 700; flex-shrink: 0;
  }
  .ph-patient-name { font-size: 18px; font-weight: 600; color: #111; margin: 0; }
  .ph-patient-sub  { font-size: 12px; color: #888; margin: 0; }

  /* ── List items ── */
  .ph-item {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 11px 0;
    border-bottom: 0.5px solid rgba(0,0,0,0.05);
  }
  .ph-item:last-child { border-bottom: none; }
  .ph-item-title { font-size: 13px; font-weight: 600; color: #111; margin: 0 0 2px; }
  .ph-item-sub   { font-size: 11px; color: #888; margin: 0; }

  /* ── Status pills ── */
  .ph-status {
    font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 20px;
    white-space: nowrap;
  }
  .ph-status-completed { background: #E1F5EE; color: #0F6E56; }
  .ph-status-cancelled { background: #FCEBEB; color: #A32D2D; }
  .ph-status-pending   { background: #E6F1FB; color: #0C447C; }

  /* ── File open link ── */
  .ph-file-link {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f0f6fd; color: #185FA5;
    border: 0.5px solid rgba(55,138,221,0.35);
    border-radius: 8px;
    padding: 4px 12px;
    font-size: 11px; font-weight: 600;
    text-decoration: none;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .ph-file-link:hover { background: #E6F1FB; }

  /* ── Empty state ── */
  .ph-empty {
    font-size: 13px; color: #aaa;
    font-style: italic; padding: 8px 0;
  }

  /* ── Loading / error ── */
  .ph-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 200px; font-size: 14px; color: #888;
  }

  @media (max-width: 600px) {
    .ph-info-grid { grid-template-columns: 1fr; }
  }
`;

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

function getStatusClass(status) {
  if (status === "COMPLETED") return "ph-status ph-status-completed";
  if (status === "CANCELLED")  return "ph-status ph-status-cancelled";
  return "ph-status ph-status-pending";
}

function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient,       setPatient]       = useState(null);
  const [appointments,  setAppointments]  = useState([]);
  const [files,         setFiles]         = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const patientRes = await axiosInstance.get(`/api/patients/${id}`);
        setPatient(patientRes.data);

        const apptRes = await axiosInstance.get("/api/appointments");
        setAppointments(
          apptRes.data.filter((a) => a.patient?.patientId === parseInt(id))
        );

        const filesRes = await axiosInstance.get("/api/files");
        setFiles(
          filesRes.data.filter((f) => f.patient?.patientId === parseInt(id))
        );

        try {
          const prescRes = await axiosInstance.get(`/api/prescriptions/patient/${id}`);
          setPrescriptions(prescRes.data);
        } catch {
          setPrescriptions([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <style>{styles}</style>
        <div className="ph-loading">Loading patient history…</div>
      </MainLayout>
    );
  }

  if (!patient) {
    return (
      <MainLayout>
        <style>{styles}</style>
        <div className="ph-loading">Patient not found.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <style>{styles}</style>
      <div className="ph-page">

        {/* ── Back button ── */}
        <button className="ph-back-btn" onClick={() => navigate("/patients")}>
          ← Back to Patients
        </button>

        {/* ── Patient info card ── */}
        <div className="ph-card">
          <div className="ph-patient-hero">
            <div className="ph-avatar-lg">{getInitials(patient.fullName)}</div>
            <div>
              <p className="ph-patient-name">{patient.fullName}</p>
              <p className="ph-patient-sub">{patient.gender} · {patient.bloodGroup}</p>
            </div>
          </div>
          <div className="ph-info-grid">
            <div className="ph-info-item">
              <span className="ph-info-label">Phone</span>
              <span className="ph-info-value">{patient.phone}</span>
            </div>
            <div className="ph-info-item">
              <span className="ph-info-label">Blood Group</span>
              <span className="ph-info-value">{patient.bloodGroup}</span>
            </div>
            <div className="ph-info-item">
              <span className="ph-info-label">Address</span>
              <span className="ph-info-value">{patient.address}</span>
            </div>
            {patient.email && (
              <div className="ph-info-item">
                <span className="ph-info-label">Email</span>
                <span className="ph-info-value">{patient.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Appointment history ── */}
        <div className="ph-card">
          <div className="ph-card-header">
            <div className="ph-card-icon" style={{ background: "#E6F1FB" }}>📅</div>
            <p className="ph-card-title">Appointment History</p>
            <span className="ph-card-count" style={{ background: "#E6F1FB", color: "#0C447C" }}>
              {appointments.length}
            </span>
          </div>
          {appointments.length === 0 ? (
            <p className="ph-empty">No appointments found.</p>
          ) : (
            appointments.map((a) => (
              <div key={a.appointmentId} className="ph-item">
                <div>
                  <p className="ph-item-title">{a.reason}</p>
                  <p className="ph-item-sub">{a.appointmentDate} — Dr. {a.doctor?.fullName}</p>
                </div>
                <span className={getStatusClass(a.status)}>{a.status}</span>
              </div>
            ))
          )}
        </div>

        {/* ── Medical reports ── */}
        <div className="ph-card">
          <div className="ph-card-header">
            <div className="ph-card-icon" style={{ background: "#FAEEDA" }}>📁</div>
            <p className="ph-card-title">Medical Reports</p>
            <span className="ph-card-count" style={{ background: "#FAEEDA", color: "#633806" }}>
              {files.length}
            </span>
          </div>
          {files.length === 0 ? (
            <p className="ph-empty">No reports uploaded yet.</p>
          ) : (
            files.map((f) => (
              <div key={f.fileId} className="ph-item">
                <span style={{ fontSize: 13, color: "#333" }}>
                  {f.fileType?.startsWith("image") ? "🖼️" : "📄"} {f.fileName}
                </span>
                <a
                  href={`http://localhost:8080/uploads/${f.fileName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ph-file-link"
                >
                  Open File
                </a>
              </div>
            ))
          )}
        </div>

        {/* ── Prescriptions ── */}
        <div className="ph-card">
          <div className="ph-card-header">
            <div className="ph-card-icon" style={{ background: "#E1F5EE" }}>💊</div>
            <p className="ph-card-title">Prescriptions</p>
            <span className="ph-card-count" style={{ background: "#E1F5EE", color: "#0F6E56" }}>
              {prescriptions.length}
            </span>
          </div>
          {prescriptions.length === 0 ? (
            <p className="ph-empty">No prescriptions found.</p>
          ) : (
            prescriptions.map((p) => (
              <div key={p.prescriptionId} className="ph-item">
                <div>
                  <p className="ph-item-title">💊 {p.medicine} — {p.dosage}</p>
                  <p className="ph-item-sub">{p.instructions}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#aaa" }}>📅 {p.prescribedDate}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </MainLayout>
  );
}

export default PatientHistory;