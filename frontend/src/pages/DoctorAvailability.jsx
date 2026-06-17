import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

function DoctorAvailability() {

  const [date, setDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const response =
      await axiosInstance.get("/api/doctors");

    setDoctors(response.data);
  };

  const handleBookAppointment = (
  doctor,
  slot
) => {

  navigate(
  `/appointments?doctorId=${doctor.doctorId}&slotId=${slot.slotId}&date=${date}`
);
};

const checkAvailability = async () => {

  if (!date) {
    alert("Please select a date");
    return;
  }

  const today = new Date();
  const selected = new Date(date);

  today.setHours(0, 0, 0, 0);
  selected.setHours(0, 0, 0, 0);

  const diffDays =
    (selected - today) /
    (1000 * 60 * 60 * 24);

  if (diffDays < 0 || diffDays > 6) {

    alert(
      "Slots are generated only for the next 7 days."
    );

    return;
  }

  try {

    const allSlots = {};

    for (const doctor of doctors) {

      const response =
        await axiosInstance.get(
          `/api/timeslots/doctor/${doctor.doctorId}?date=${date}`
        );

      allSlots[doctor.doctorId] =
        response.data.filter(
          (slot) => slot.available
        );
    }

    setSlots(allSlots);

  } catch (error) {

    console.error(error);

    alert(
      "Failed to fetch availability"
    );
  }
};

  const generateSlots = async () => {

  console.log("GENERATE BUTTON CLICKED");

  try {

    const response =
      await axiosInstance.post(
        "/api/timeslots/generate-all"
      );

    console.log("RESPONSE:", response);

    alert(response.data);

    if (date) {
      await checkAvailability();
    }

  } catch (error) {

    console.error("GENERATE ERROR:", error);

    alert("Failed to generate slots");

  }
};

  return (
    <div style={{ padding: 20 }}>

      <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>
        Doctor Availability
      </h2>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          padding: "3px 6px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          fontSize: "20px",
          marginTop: "3px",
        }}
      />

      <p
        style={{
          color: "gray",
          fontSize: "14px",
          marginTop: "5px",
          marginBottom: "5px"
        }}
      >
        Slots are generated only for the next 7 days.
      </p>

      <button
      onClick={checkAvailability}
      style={{
        marginLeft: "10px",
        padding: "10px 18px",
        backgroundColor: "#11813a",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Check Availability
    </button>

      <button
        onClick={generateSlots}
        style={{
            marginLeft: "10px",
            padding: "10px 18px",
            backgroundColor: "#183f93",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
        }}
        >
        Generate Slots
        </button>

      <br /><br />

      {doctors.map((doctor) => (

        <div
          key={doctor.doctorId}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
            borderRadius: 10
          }}
        >

          <h3>
            {doctor.fullName}
          </h3>

          <p>
            {doctor.specialization}
          </p>

          <p>
            Shift: {doctor.shift}
          </p>

          <div>

            {slots[doctor.doctorId]?.length > 0 ? (

              slots[doctor.doctorId].map((slot) => (

                <button
  key={slot.slotId}
  onClick={() =>
    handleBookAppointment(
      doctor,
      slot
    )
  }
  style={{
    margin: 5,
    padding: "8px 12px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#22c55e",
    color: "white",
    cursor: "pointer"
  }}
>
  {slot.slotTime.substring(0, 5)}
</button>

              ))

            ) : (

              <span>
                No Slots
              </span>

            )}

          </div>

        </div>

      ))}

    </div>
  );
}

export default DoctorAvailability;