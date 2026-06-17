import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

function AppointmentCalendar() {

  const [events, setEvents] = useState([]);

  // ✅ Fix — define fetchAppointments inside useEffect
  // so ESLint knows it's scoped correctly
  useEffect(() => {

    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:8080/api/appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedEvents = response.data.map((appointment) => ({
          // ✅ Fix — use backtick template on one line, no line breaks inside
          title: `${appointment.patient?.fullName} - ${appointment.doctor?.fullName}`,
          date:  appointment.appointmentDate,
          // ✅ Add color based on status
          color: appointment.status === "COMPLETED" ? "#10b981"
               : appointment.status === "CANCELLED" ? "#ef4444"
               : "#3b82f6",
        }));

        setEvents(formattedEvents);

      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();

  }, []); // runs once on mount

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: 700 }}>
        Appointment Calendar
      </h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="80vh"
        headerToolbar={{
          left:   "prev,next today",
          center: "title",
          right:  "dayGridMonth,dayGridWeek"
        }}
      />
    </div>
  );
}

export default AppointmentCalendar;