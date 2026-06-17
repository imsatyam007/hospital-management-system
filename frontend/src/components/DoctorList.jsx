import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TablePagination, TableSortLabel,
} from "@mui/material";

function DoctorList({ doctors, onDeleteDoctor, onEditDoctor }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fullName");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedDoctors = [...doctors].sort((a, b) => {
    if (order === "asc") return a[orderBy] > b[orderBy] ? 1 : -1;
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  const handleChangePage = (event, newPage) => setPage(newPage);

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
                  active={orderBy === "doctorId"}
                  direction={order}
                  onClick={() => handleRequestSort("doctorId")}
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

              <TableCell>
                <TableSortLabel
                  active={orderBy === "specialization"}
                  direction={order}
                  onClick={() => handleRequestSort("specialization")}
                >
                  Specialization
                </TableSortLabel>
              </TableCell>

              <TableCell>Experience</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Shift</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedDoctors
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((doctor) => (
                <TableRow key={doctor.doctorId}>
                  <TableCell>{doctor.doctorId}</TableCell>
                  <TableCell>{doctor.fullName}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.experience}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell>{doctor.email}</TableCell>

                  <TableCell>
                    <span
                      style={{
                        padding: "8px 12px",
                        borderRadius: "15px",
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor:
                          doctor.shift === "MORNING"
                            ? "#22c56e"
                            : doctor.shift === "AFTERNOON"
                            ? "#f59e0b"
                            : doctor.shift === "EVENING"
                            ? "#8b5cf6"
                            : "#374151",
                      }}
                    >
                      {doctor.shift}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onEditDoctor(doctor)}
                      style={{ marginRight: 10 }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onDeleteDoctor(doctor.doctorId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={doctors.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}

export default DoctorList;