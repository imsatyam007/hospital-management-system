import { useEffect, useState } from "react";

function DoctorForm({
  onAddDoctor,
  editingDoctor,
  onUpdateDoctor,
}) {

  const [doctor, setDoctor]
    = useState({
      fullName: "",
      specialization: "",
      phone: "",
      email: "",
      experience: "",
    });

  useEffect(() => {

    if (editingDoctor) {

      setDoctor(editingDoctor);

    }

  }, [editingDoctor]);

  const handleChange = (e) => {

    setDoctor({
      ...doctor,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (editingDoctor) {

      onUpdateDoctor(
        editingDoctor.doctorId,
        doctor
      );

    } else {

      onAddDoctor(doctor);
    }

    setDoctor({
      fullName: "",
      specialization: "",
      phone: "",
      email: "",
      experience: "",
    });
  };

  return (

    <form onSubmit={handleSubmit}>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={doctor.fullName}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="text"
        name="specialization"
        placeholder="Specialization"
        value={doctor.specialization}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={doctor.phone}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={doctor.email}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="number"
        name="experience"
        placeholder="Experience"
        value={doctor.experience}
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit">

        {editingDoctor
          ? "Update Doctor"
          : "Add Doctor"}

      </button>

    </form>
  );
}

export default DoctorForm;