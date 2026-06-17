import { Link } from "react-router-dom";

function Navbar() {

  return (
    <nav
      style={{
        padding: "15px",
        background: "#222",
      }}
    >

      <Link
        to="/"
        style={{ color: "white", marginRight: "15px" }}
      >
        Dashboard
      </Link>

      <Link
        to="/patients"
        style={{ color: "white", marginRight: "15px" }}
      >
        Patients
      </Link>

      <Link
        to="/doctors"
        style={{ color: "white", marginRight: "15px" }}
      >
        Doctors
      </Link>

      <Link
        to="/appointments"
        style={{ color: "white", marginRight: "15px" }}
      >
        Appointments
      </Link>

            <Link to="/upload">
            Upload
            </Link>

      <Link to="/calendar">
        Calendar
      </Link>

      <Link to="/upload">
      File Upload
      </Link>

    </nav>
  );
}

export default Navbar;