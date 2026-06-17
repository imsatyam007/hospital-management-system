import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { RiMedicineBottleFill } from "react-icons/ri";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

function PrescriptionPage() {
  const [formData, setFormData] = useState({
    medicine: "",
    dosage: "",
    instructions: "",
  });

  const [prescriptions, setPrescriptions] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

const [medicineFee, setMedicineFee] = useState("");
const [testFee, setTestFee] = useState("");

  const appointmentIdFromUrl = searchParams.get("appointmentId");

  const [selectedTests, setSelectedTests] = useState([]);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await axiosInstance.get("/api/prescriptions");
      setPrescriptions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    const loadAppointment = async () => {
      if (!appointmentIdFromUrl) return;

      try {
        const { data } = await axiosInstance.get(
          `/api/appointments/${appointmentIdFromUrl}`
        );
        setAppointment(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadAppointment();
  }, [appointmentIdFromUrl]);

  const handleChange = ({ target }) =>
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));

  // STEP 3 - Handle test selection
  const handleTestChange = (e) => {
    const value = e.target.value;

    if (e.target.checked) {
      setSelectedTests((prev) => [...prev, value]);
    } else {
      setSelectedTests(
        selectedTests.filter((test) => test !== value)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointment) {
      alert("Appointment data not loaded");
      return;
    }

    try {
     const prescription = {
  medicine: formData.medicine,

  dosage: formData.dosage,

  instructions: formData.instructions,

  requiredTests: selectedTests.join(", "),

  medicineFee: Number(medicineFee),

  testFee: Number(testFee),

  prescribedDate:
    new Date()
      .toISOString()
      .split("T")[0],

  patient: {
    patientId:
      appointment.patient.patientId,
  },

  doctor: {
    doctorId:
      appointment.doctor.doctorId,
  },

  appointment: {
    appointmentId:
      appointment.appointmentId,
  },
};

      await axiosInstance.post("/api/prescriptions", prescription);

      alert("Prescription added successfully");

      // STEP 5 - Show Upload button only when tests exist
      if (selectedTests.length > 0) {
        setShowUploadButton(true);
      }

      setFormData({
        medicine: "",
        dosage: "",
        instructions: "",
      });

      setSelectedTests([]);

      fetchPrescriptions();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data ||
          error.message ||
          "Failed to add prescription"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/prescriptions/${id}`);
      fetchPrescriptions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <RiMedicineBottleFill className="text-blue-500 text-4xl" />
        Prescription Management
      </h1>

      {appointment && (
        <div className="border p-4 rounded mb-4">
          <h3 className="font-bold text-lg mb-3">
            Appointment Details
          </h3>

          <p>
            <strong>Appointment:</strong>{" "}
            {appointment.appointmentId}
          </p>

          <p>
            <strong>Patient:</strong>{" "}
            {appointment.patient?.fullName}
          </p>

          <p>
            <strong>Reason:</strong>{" "}
            {appointment.reason}
          </p>

          <p>
            <strong>Doctor:</strong>{" "}
            {appointment.doctor?.fullName}
          </p>

          <p>
            <strong>Specialization:</strong>{" "}
            {appointment.doctor?.specialization}
          </p>

          <p>
            <strong>Date:</strong>{" "}
            {appointment.appointmentDate}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="medicine"
          placeholder="Medicine"
          value={formData.medicine}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          required
        />

        <input
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={formData.dosage}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          required
        />

        <textarea
          name="instructions"
          placeholder="Instructions"
          value={formData.instructions}
          onChange={handleChange}
          className="border p-3 w-full rounded"
          rows="4"
          required
        />

        <div className="mt-4">
          <label className="block mb-1 font-medium">
            Medicine Fee (₹)
          </label>

          <input
            type="number"
            value={medicineFee}
            onChange={(e) => setMedicineFee(e.target.value)}
            className="border p-3 w-full rounded"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-medium">
            Test Fee (₹)
        </label>

          <input
            type="number"
            value={testFee}
            onChange={(e) => setTestFee(e.target.value)}
            className="border p-3 w-full rounded"
          />
        </div>

        {/* STEP 2 - Medical Tests Section */}
        <h3 className="font-bold mt-4">
          Medical Tests Required
        </h3>

        <div className="space-y-2">
          <label className="block">
            <input
              type="checkbox"
              value="Blood Test"
              onChange={handleTestChange}
            />
            {" "}Blood Test
          </label>

          <label className="block">
            <input
              type="checkbox"
              value="X-Ray"
              onChange={handleTestChange}
            />
            {" "}X-Ray
          </label>

          <label className="block">
            <input
              type="checkbox"
              value="MRI"
              onChange={handleTestChange}
            />
            {" "}MRI
          </label>

          <label className="block">
            <input
              type="checkbox"
              value="CT Scan"
              onChange={handleTestChange}
            />
            {" "}CT Scan
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Add Prescription
          </button>

          {showUploadButton && (
            <button
              type="button"
              onClick={() =>
                navigate(`/upload?patientId=${appointment?.patient?.patientId}`)
              }
              className="bg-purple-600 text-white px-6 py-3 rounded ml-3"
            >
              Upload Reports
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">
        Prescription History
      </h2>

      <div className="space-y-4">
        {Array.isArray(prescriptions) &&
          prescriptions.map((p) => (
          <div
            key={p.prescriptionId}
            className="border p-4 rounded shadow"
          >
            <p>
              <strong>Appointment:</strong>{" "}
              {p.appointment?.appointmentId}
            </p>

            <p>
              <strong>Patient:</strong>{" "}
              {p.patient?.fullName}
            </p>

            <p>
              <strong>Doctor:</strong>{" "}
              {p.doctor?.fullName}
            </p>

            <p>
              <strong>Medicine:</strong>{" "}
              {p.medicine}
            </p>

            <p>
              <strong>Dosage:</strong>{" "}
              {p.dosage}
            </p>

            <p>
              <strong>Instructions:</strong>{" "}
              {p.instructions}
            </p>

            <p>
              <strong>Medicine Fee:</strong> ₹
              {p.medicineFee}
            </p>

            <p>
              <strong>Test Fee:</strong> ₹
              {p.testFee}
            </p>

            <p>
              <strong>Required Tests:</strong>{" "}
              {p.requiredTests}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {p.prescribedDate}
            </p>

            <button
              onClick={() =>
                handleDelete(p.prescriptionId)
              }
              className="bg-red-500 text-white px-4 py-2 rounded mt-3"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default PrescriptionPage;