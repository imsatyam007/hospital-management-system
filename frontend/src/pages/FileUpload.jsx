import { useEffect, useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import axiosInstance from "../services/axiosInstance";

import { MdUploadFile } from "react-icons/md";
import { BsFileEarmarkMedicalFill } from "react-icons/bs";
import { FaEye, FaDownload } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

const styles = {
  pageBg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e8f5f0 0%, #d4ede3 40%, #e8f5f0 100%)",
    padding: "28px 24px",
    position: "relative",
    overflow: "hidden",
  },
  bubble1: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: "50%",
    background: "rgba(29,158,117,0.15)",
    top: -40,
    left: -40,
    pointerEvents: "none",
  },
  bubble2: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: "50%",
    background: "rgba(29,158,117,0.15)",
    bottom: 60,
    right: -20,
    pointerEvents: "none",
  },
  bubble3: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: "50%",
    background: "rgba(29,158,117,0.12)",
    bottom: 20,
    left: "42%",
    pointerEvents: "none",
  },
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: "24px",
    boxShadow: "0 4px 32px rgba(15,110,86,0.08)",
    marginBottom: 20,
    position: "relative",
    zIndex: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1D9E75",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  inputWrap: {
    position: "relative",
    marginBottom: 14,
  },
  inputIcon: {
    position: "absolute",
    left: 13,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#1D9E75",
    fontSize: 16,
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "11px 14px 11px 38px",
    border: "1.5px solid #c8e8de",
    borderRadius: 10,
    background: "#f4faf7",
    fontSize: 14,
    color: "#0F6E56",
    outline: "none",
  },
  inputDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
  fileDrop: {
    border: "2px dashed #a8d9c5",
    borderRadius: 12,
    background: "#f4faf7",
    padding: "22px 16px",
    textAlign: "center",
    marginBottom: 16,
    position: "relative",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  fileDropIcon: {
    fontSize: 32,
    color: "#1D9E75",
    display: "block",
    marginBottom: 8,
  },
  fileDropText: {
    fontSize: 13,
    color: "#5DCAA5",
    fontWeight: 600,
    margin: 0,
  },
  fileDropSub: {
    fontSize: 11,
    color: "#9fd0be",
  },
  fileDropName: {
    fontSize: 12,
    color: "#0F6E56",
    fontWeight: 600,
    marginTop: 6,
  },
  hiddenInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
    width: "100%",
    height: "100%",
  },
  uploadBtn: {
    width: "100%",
    padding: "13px",
    background: "#1D9E75",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    letterSpacing: "0.03em",
  },
  msgSuccess: {
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#e1f5ee",
    color: "#0F6E56",
    border: "1px solid #9FE1CB",
    position: "relative",
    zIndex: 1,
  },
  msgError: {
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#FCEBEB",
    color: "#A32D2D",
    border: "1px solid #F7C1C1",
    position: "relative",
    zIndex: 1,
  },
  divider: {
    border: "none",
    borderTop: "1.5px solid #e0f0e9",
    margin: "0 0 18px",
    position: "relative",
    zIndex: 1,
  },
  reportsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    position: "relative",
    zIndex: 1,
  },
  reportsTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 15,
    fontWeight: 700,
    color: "#0F6E56",
  },
  countBadge: {
    background: "#e1f5ee",
    color: "#0F6E56",
    borderRadius: 20,
    padding: "2px 12px",
    fontSize: 12,
    fontWeight: 700,
  },
  fileCard: {
    background: "#fff",
    border: "1.5px solid #e0f0e9",
    borderRadius: 12,
    padding: "13px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    position: "relative",
    zIndex: 1,
  },
  fileCardLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  fileIconBox: {
    width: 38,
    height: 38,
    background: "#e1f5ee",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1D9E75",
    fontSize: 18,
    flexShrink: 0,
  },
  fileNameText: {
    fontSize: 14,
    fontWeight: 600,
    color: "#0F6E56",
    margin: 0,
  },
  filePatient: {
    fontSize: 12,
    color: "#5DCAA5",
    margin: 0,
  },
  fileActions: {
    display: "flex",
    gap: 6,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "1.5px solid #c8e8de",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1D9E75",
    fontSize: 14,
  },
  emptyState: {
    textAlign: "center",
    padding: "32px 0",
    color: "#9fd0be",
    fontStyle: "italic",
    fontSize: 13,
    position: "relative",
    zIndex: 1,
  },
  searchWrap: {
    position: "relative",
    marginBottom: 16,
  },
};

function FileCard({ f }) {
  return (
    <div style={styles.fileCard}>
      <div style={styles.fileCardLeft}>
        <div style={styles.fileIconBox}>
          <BsFileEarmarkMedicalFill />
        </div>
        <div>
          <p style={styles.fileNameText}>{f.fileName}</p>
          <p style={styles.filePatient}>Patient: {f.patient?.fullName}</p>
        </div>
      </div>
      <div style={styles.fileActions}>
        <a
          href={`http://localhost:8080/uploads/${f.fileName}`}
          target="_blank"
          rel="noreferrer"
          style={styles.actionBtn}
          title="View"
        >
          <FaEye />
        </a>
        <a
          href={`http://localhost:8080/uploads/${f.fileName}`}
          download
          style={styles.actionBtn}
          title="Download"
        >
          <FaDownload />
        </a>
      </div>
    </div>
  );
}

function FileUpload() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [fileLabel, setFileLabel] = useState("");

  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get("patientId") || "";
  const [manualPatientId, setManualPatientId] = useState(patientIdFromUrl);
  const [appointmentId, setAppointmentId] = useState("");

  const effectivePatientId = patientIdFromUrl || manualPatientId;

  const refetchFiles = async () => {
    try {
      const response = await axiosInstance.get("/api/files");
      setUploadedFiles(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refetchFiles();
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select at least one file.");
      setMessageType("error");
      return;
    }
    if (!effectivePatientId) {
      setMessage("Please enter a Patient ID.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("patientId", effectivePatientId);
    if (appointmentId) formData.append("appointmentId", appointmentId);

    const token = localStorage.getItem("token");

    try {
      await axiosInstance.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Files uploaded successfully!");
      setMessageType("success");
      setFiles([]);
      setFileLabel("");
      await refetchFiles();
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      const msg = error.response?.data || error.message || "Upload failed";
      setMessage(msg);
      setMessageType("error");
    }
  };

  const filteredFiles = uploadedFiles.filter(
    (f) =>
      f.fileName?.toLowerCase().includes(search.toLowerCase()) ||
      f.patient?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div style={styles.pageBg}>
        {/* Decorative bubbles matching login theme */}
        <div style={styles.bubble1} />
        <div style={styles.bubble2} />
        <div style={styles.bubble3} />

        {/* Upload Card */}
        <div style={styles.card}>
          <div style={styles.sectionLabel}>
            <MdUploadFile style={{ fontSize: 16 }} />
            Medical File Upload
          </div>

          {/* Patient ID */}
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>👤</span>
            <input
              type="text"
              placeholder="Enter Patient ID"
              value={effectivePatientId}
              onChange={(e) => setManualPatientId(e.target.value)}
              disabled={!!patientIdFromUrl}
              style={{
                ...styles.input,
                ...(patientIdFromUrl ? styles.inputDisabled : {}),
              }}
            />
          </div>

          {/* Appointment ID */}
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>📅</span>
            <input
              type="text"
              placeholder="Enter Appointment ID (optional)"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Search */}
          <div style={styles.searchWrap}>
            <span style={{ ...styles.inputIcon, color: "#9fd0be" }}>🔍</span>
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* File Drop Zone */}
          <div style={styles.fileDrop}>
            <input
              type="file"
              multiple
              style={styles.hiddenInput}
              onChange={(e) => {
                setFiles(e.target.files);
                if (e.target.files.length === 1) {
                  setFileLabel(e.target.files[0].name);
                } else if (e.target.files.length > 1) {
                  setFileLabel(`${e.target.files.length} files selected`);
                }
              }}
            />
            <MdUploadFile style={styles.fileDropIcon} />
            <p style={styles.fileDropText}>Click or drag files here</p>
            <span style={styles.fileDropSub}>PDF, images, and documents supported</span>
            {fileLabel && (
              <p style={styles.fileDropName}>✓ {fileLabel}</p>
            )}
          </div>

          {/* Upload Button */}
          <button onClick={handleUpload} style={styles.uploadBtn}>
            <MdUploadFile />
            Upload Medical Files →
          </button>
        </div>

        {/* Message */}
        {message && (
          <div style={messageType === "success" ? styles.msgSuccess : styles.msgError}>
            {messageType === "success" ? "✓" : "✕"} {message}
          </div>
        )}

        <hr style={styles.divider} />

        {/* Reports Header */}
        <div style={styles.reportsHeader}>
          <div style={styles.reportsTitle}>
            <BsFileEarmarkMedicalFill style={{ color: "#1D9E75", fontSize: 17 }} />
            Uploaded Reports
          </div>
          <span style={styles.countBadge}>{filteredFiles.length}</span>
        </div>

        {/* File List */}
        {filteredFiles.length === 0 ? (
          <p style={styles.emptyState}>No reports found.</p>
        ) : (
          filteredFiles.map((f) => <FileCard key={f.fileId} f={f} />)
        )}
      </div>
    </MainLayout>
  );
}

export default FileUpload;