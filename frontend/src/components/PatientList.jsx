import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function PatientList({ patients, onDeletePatient, onEditPatient }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fullName");
  const navigate = useNavigate();

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedPatients = [...patients].sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    }
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper className="mt-6">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "patientId"}
                  direction={order}
                  onClick={() => handleRequestSort("patientId")}
                >
                  ID
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === "fullName"}
                  direction={order}
                  onClick={() => handleRequestSort("fullName")}
                >
                  Full Name
                </TableSortLabel>
              </TableCell>

              <TableCell>Gender</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedPatients
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((patient) => (
                <TableRow key={patient.patientId}>
                  <TableCell>{patient.patientId}</TableCell>
                  <TableCell>{patient.fullName}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>{patient.bloodGroup}</TableCell>

                  <TableCell>
                    {/* Fix: removed duplicate Edit and Delete buttons */}
                    <Button size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => onEditPatient(patient)}
                      style={{ marginRight: 7 }}
                    >
                      Edit
                    </Button>

                    <Button size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        navigate(
                          `/appointments?patientId=${patient.patientId}`
                        )
                      }
                      style={{ marginRight: 7 }}
                    >
                      Appointment
                    </Button>

                    <Button size="small"
                      variant="contained"
                      color="error"
                      onClick={() => onDeletePatient(patient.patientId)}
                      style={{ marginRight: 7 }}
                    >
                      Delete
                    </Button>

                    <Button size="small" variant="contained" color="success"
                      variant="contained"
                      color="success"
                      component={Link}
                      to={`/patients/${patient.patientId}`}
                    >
                      View History
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={patients.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}

export default PatientList;