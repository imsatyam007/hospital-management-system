import jsPDF
  from "jspdf";

import autoTable
  from "jspdf-autotable";

import * as XLSX
  from "xlsx";

import {

  saveAs

} from "file-saver";

export const exportPatientsPDF =
  (patients) => {

    const doc =
      new jsPDF();

    doc.text(

      "Patients Report",

      14,

      15
    );

    const tableData =

      patients.map(
        (patient) => [

          patient.patientId,

          patient.fullName,

          patient.gender,

          patient.phone,

          patient.address,

          patient.bloodGroup,
        ]
      );

    autoTable(doc, {

      head: [[

        "ID",

        "Name",

        "Gender",

        "Phone",

        "Address",

        "Blood Group",
      ]],

      body: tableData,
    });

    doc.save(
      "patients-report.pdf"
    );
};

export const exportPatientsExcel =
  (patients) => {

    const worksheet =

      XLSX.utils.json_to_sheet(
        patients
      );

    const workbook =

      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Patients"
    );

    const excelBuffer =

      XLSX.write(
        workbook,
        {

          bookType: "xlsx",

          type: "array",
        }
      );

    const data =
      new Blob(

        [excelBuffer],

        {

          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
      );

    saveAs(
      data,
      "patients-report.xlsx"
    );
};

export const exportDoctorsPDF =
  (doctors) => {

    const doc =
      new jsPDF();

    doc.text(

      "Doctors Report",

      14,

      15
    );

    const tableData =

      doctors.map(
        (doctor) => [

          doctor.doctorId,

          doctor.fullName,

          doctor.specialization,

          doctor.experience,

          doctor.phone,

          doctor.email,
        ]
      );

    autoTable(doc, {

      head: [[

        "ID",

        "Name",

        "Specialization",

        "Experience",

        "Phone",

        "Email",
      ]],

      body: tableData,
    });

    doc.save(
      "doctors-report.pdf"
    );
};

export const exportDoctorsExcel =
  (doctors) => {

    const worksheet =

      XLSX.utils.json_to_sheet(
        doctors
      );

    const workbook =

      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Doctors"
    );

    const excelBuffer =

      XLSX.write(
        workbook,
        {

          bookType: "xlsx",

          type: "array",
        }
      );

    const data =
      new Blob(

        [excelBuffer],

        {

          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
      );

    saveAs(
      data,
      "doctors-report.xlsx"
    );
};

export const exportAppointmentsPDF =
  (appointments) => {

    const doc =
      new jsPDF();

    doc.text(

      "Appointments Report",

      14,

      15
    );

    const tableData =

      appointments.map(
        (appointment) => [

          appointment.appointmentId,

          appointment.appointmentDate,

          appointment.reason,

          appointment.patientId,

          appointment.doctorId,
        ]
      );

    autoTable(doc, {

      head: [[

        "ID",

        "Date",

        "Reason",

        "Patient ID",

        "Doctor ID",
      ]],

      body: tableData,
    });

    doc.save(
      "appointments-report.pdf"
    );
};

export const exportAppointmentsExcel =
  (appointments) => {

    const worksheet =

      XLSX.utils.json_to_sheet(
        appointments
      );

    const workbook =

      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "Appointments"
    );

    const excelBuffer =

      XLSX.write(
        workbook,
        {

          bookType: "xlsx",

          type: "array",
        }
      );

    const data =
      new Blob(

        [excelBuffer],

        {

          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
      );

    saveAs(
      data,
      "appointments-report.xlsx"
    );
};