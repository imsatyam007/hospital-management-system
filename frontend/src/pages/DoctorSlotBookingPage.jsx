import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import MainLayout from "../layouts/MainLayout";

function DoctorSlotBookingPage() {

  const [doctorId, setDoctorId] =
    useState("");

  const [date, setDate] =
    useState("");

  const [slots, setSlots] =
    useState([]);

  const fetchSlots = async () => {

    try {

      const response =
        await axiosInstance.get(

          `/api/timeslots/doctor/${doctorId}?date=${date}`

        );

      setSlots(
        response.data
      );

    } catch (error) {

      console.error(error);

    }
  };

  const bookSlot = async (
    slotId
  ) => {

    try {

      await axiosInstance.put(

        `/api/timeslots/book/${slotId}`

      );

      fetchSlots();

      alert(
        "Slot booked successfully!"
      );

    } catch (error) {

      console.error(error);

    }
  };

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">

        🕒 Doctor Time Slot Booking

      </h1>

      <div className="flex gap-4 mb-6">

        <input
          type="number"
          placeholder="Doctor ID"
          value={doctorId}
          onChange={(e) =>
            setDoctorId(
              e.target.value
            )
          }
          className="border p-3 rounded-lg"
        />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(
              e.target.value
            )
          }
          className="border p-3 rounded-lg"
        />

        <button
          onClick={fetchSlots}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Search Slots
        </button>

      </div>

      <div className="grid grid-cols-3 gap-4">

        {slots.map((slot) => (

          <div
            key={slot.slotId}
            className="border p-4 rounded-lg shadow"
          >

            <p>

              <strong>
                Time:
              </strong>{" "}

              {slot.slotTime}

            </p>

            <p>

              <strong>
                Status:
              </strong>{" "}

              {slot.available
                ? "Available"
                : "Booked"}

            </p>

            {slot.available && (

              <button

                onClick={() =>
                  bookSlot(
                    slot.slotId
                  )
                }

                className="bg-green-600 text-white px-3 py-2 rounded mt-3"
              >

                Book Slot

              </button>

            )}

          </div>

        ))}

      </div>

    </MainLayout>
  );
}

export default DoctorSlotBookingPage;