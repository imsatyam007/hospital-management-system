import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function AppointmentList({
  appointments,
  onDeleteAppointment,
}) {
  const navigate = useNavigate();

    console.log("appointments prop =", appointments);
    console.log("isArray =", Array.isArray(appointments));

  return (
    <TableContainer component={Paper} className="mt-6">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Doctor</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Array.isArray(appointments) &&
            appointments.map(
              ({
              appointmentId,
              patient,
              doctor,
              appointmentDate,
              reason,
            }) => (
              <TableRow key={appointmentId}>
                <TableCell>{appointmentId}</TableCell>
                <TableCell>{patient?.fullName}</TableCell>
                <TableCell>{doctor?.fullName}</TableCell>
                <TableCell>{appointmentDate}</TableCell>
                <TableCell>{reason}</TableCell>

                <TableCell>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      onDeleteAppointment(
                        appointmentId
                      )
                    }
                  >
                    Delete
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    sx={{ ml: 1 }}
                    onClick={() =>
                      navigate(
                        `/prescriptions?appointmentId=${appointmentId}`
                      )
                    }
                  >
                    Prescription
                  </Button>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AppointmentList;