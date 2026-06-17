import { useEffect, useState } from "react";
import { getPatients } from "../services/patientService";
import { getDoctors } from "../services/doctorService";
import axiosInstance from "../services/axiosInstance";
import { useSearchParams } from "react-router-dom";

function AppointmentForm({ onAddAppointment }) {

  // Fix: searchParams declared FIRST before any useState that uses them
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get("patientId") || "";
  const doctorIdFromUrl = searchParams.get("doctorId") || "";
  const slotIdFromUrl = searchParams.get("slotId") || "";
  const dateFromUrl =searchParams.get("date") || "";

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(
  slotIdFromUrl || ""
);

  const [appointment, setAppointment] = useState({
    appointmentDate: dateFromUrl,
    reason: "",
    patientId: patientIdFromUrl,
    doctorId: doctorIdFromUrl,
  });

  useEffect(() => {
    getPatients().then((response) => setPatients(response.data));
    getDoctors().then((response) => setDoctors(response.data));
  }, []);

  const fetchSlots = async () => {
    if (!appointment.doctorId || !appointment.appointmentDate) return;

    try {
      const response = await axiosInstance.get(
        `/api/timeslots/doctor/${appointment.doctorId}?date=${appointment.appointmentDate}`
      );

      const availableSlots = response.data.filter((slot) => slot.available);
      setSlots(availableSlots);

      // Auto-select slot from URL if present
      if (slotIdFromUrl) {
        const selected = availableSlots.find(
          (s) => String(s.slotId) === String(slotIdFromUrl)
        );
        if (selected) setSelectedSlot(selected.slotId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment.doctorId, appointment.appointmentDate]);

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    const appointmentData = {
      appointmentDate: appointment.appointmentDate,
      reason: appointment.reason,
      patient: { patientId: appointment.patientId },
      doctor: { doctorId: appointment.doctorId },
      slot: { slotId: selectedSlot },
      status: "SCHEDULED",
    };

    onAddAppointment(appointmentData);

    setAppointment({
      appointmentDate: dateFromUrl,
      reason: "",
      patientId: patientIdFromUrl,
      doctorId: doctorIdFromUrl,
    });
    setSelectedSlot("");
    setSlots([]);
  };

  const selectedDoctor = doctors.find(
  (doctor) =>
    String(doctor.doctorId) ===
    String(appointment.doctorId)
);

  return (
    <div style={{
      border: "1px solid #444",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      backgroundColor: "#1e1e1e",
    }}>
      <h2>Book Appointment</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="appointmentDate"
          value={appointment.appointmentDate}
          onChange={handleChange}
          disabled={!!dateFromUrl}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={appointment.reason}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <select
          name="patientId"
          value={appointment.patientId}
          onChange={handleChange}
          disabled={!!patientIdFromUrl}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.patientId} value={patient.patientId}>
              {patient.fullName}
            </option>
          ))}
        </select>

        <select
          name="doctorId"
          value={appointment.doctorId}
          onChange={handleChange}
          disabled={!!doctorIdFromUrl}
          style={{
           width: "100%",
           padding: "10px",
           marginBottom: "10px",
          }}
        >
          <option value="">Select Doctor</option>

          {doctors.map((doctor) => (
            <option
              key={doctor.doctorId}
              value={doctor.doctorId}
            >
              {doctor.fullName} ({doctor.specialization})
            </option>
          ))}
        </select>

{selectedDoctor && (
  <div
    style={{
      background: "#2a2a2a",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "10px",
      color: "white",
    }}
  >
    <strong>
      {selectedDoctor.fullName}
    </strong>

    <br />

    Specialization:{" "}
    {selectedDoctor.specialization}

    <br />

    Experience:{" "}
    {selectedDoctor.experience} Years

    <br />

    Shift:{" "}
    {selectedDoctor.shift}
  </div>
)}

        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          disabled={!!slotIdFromUrl}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          <option value="">Select Slot</option>
          {slots.map((slot) => (
            <option key={slot.slotId} value={slot.slotId}>
              {slot.slotTime?.substring(0, 5)}
            </option>
          ))}
        </select>

        <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "10px" }}>
          Slots Found: {slots.length}
        </p>

        {slots.length === 0 && appointment.doctorId && appointment.appointmentDate && (
          <p style={{ color: "#f87171", marginBottom: "10px", fontSize: "13px" }}>
            No available slots for this doctor on selected date.
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Appointment
        </button>
      </form>
    </div>
  );
}

export default AppointmentForm;