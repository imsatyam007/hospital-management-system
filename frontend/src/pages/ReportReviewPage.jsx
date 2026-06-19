import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import MainLayout from "../layouts/MainLayout";

function ReportReviewPage() {
  const [reports, setReports] = useState([]);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await axiosInstance.get("/api/files");
      setReports(data);
    } catch (error) {
      console.error(error);
    }
  };


  const handleRemarkChange = (fileId, value) =>
    setRemarks(prev => ({
      ...prev,
      [fileId]: value,
    }));

    const handleReview = async (fileId) => {
  try {
    await axiosInstance.post(
      "/api/files/review",
      {
        fileId,
        doctorRemarks: remarks[fileId],
      }
    );

    alert("Report Reviewed Successfully");
    fetchReports();

  } catch (error) {
    console.error(error);
    alert("Failed to review report");
  }
};

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">
        📋 Report Review Center
      </h1>

      <div className="space-y-4">
        {reports.map(
          ({
            fileId,
            fileName,
            patient,
            appointment,
          }) => (
            <div
              key={fileId}
              className="border p-4 rounded-lg shadow"
            >
              <p><strong>File:</strong> {fileName}</p>
              <p><strong>Patient:</strong> {patient?.fullName}</p>

              {appointment && (
                <p>
                  <strong>Appointment ID:</strong>{" "}
                  {appointment.appointmentId}
                </p>
              )}

              <div className="mt-3">
                <a
                  href={`https://hospital-management-system-y2sv.onrender.com/uploads/${fileName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  View Report
                </a>
              </div>

              <textarea
                placeholder="Doctor remarks..."
                value={remarks[fileId] || ""}
                onChange={(e) =>
                  handleRemarkChange(
                    fileId,
                    e.target.value
                  )
                }
                className="border p-3 w-full rounded mt-4"
              />

              <button
                onClick={() =>
                  handleReview(fileId)
                }
                className="bg-green-600 text-white px-4 py-2 rounded mt-3"
              >
                Mark Reviewed
              </button>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}

export default ReportReviewPage;
