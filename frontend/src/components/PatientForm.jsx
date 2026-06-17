import { useEffect, useState } from "react";

function PatientForm({
  onAddPatient,
  editingPatient,
  onUpdatePatient,
}) {

  const [patient, setPatient]
    = useState({
      fullName: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      bloodGroup: "",
    });

  useEffect(() => {

    if (editingPatient) {

      setPatient(editingPatient);

    }

  }, [editingPatient]);

  const handleChange = (e) => {

    setPatient({
      ...patient,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (editingPatient) {

      onUpdatePatient(
        editingPatient.patientId,
        patient
      );

    } else {

      onAddPatient(patient);
    }

    setPatient({
      fullName: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      bloodGroup: "",
    });
  };

  return (

    <form onSubmit={handleSubmit}>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={patient.fullName}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="text"
        name="gender"
        placeholder="Gender"
        value={patient.gender}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={patient.phone}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="text"
        name="email"
        value={patient.email}
        onChange={handleChange}
        placeholder="Enter Email"
      />

      <br /><br />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={patient.address}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="text"
        name="bloodGroup"
        placeholder="Blood Group"
        value={patient.bloodGroup}
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit">

        {editingPatient
          ? "Update Patient"
          : "Add Patient"}

      </button>

    </form>
  );
}

export default PatientForm;