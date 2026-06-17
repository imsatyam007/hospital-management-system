import {
  Routes,
  Route,
} from "react-router-dom";

import Dashboard
  from "../pages/Dashboard";

import Patients
  from "../pages/Patients";

import Doctors
  from "../pages/Doctors";

import Appointments
  from "../pages/Appointments";

import Login
  from "../pages/Login";

import ProtectedRoute
  from "../components/ProtectedRoute";

import RoleProtectedRoute
  from "../components/RoleProtectedRoute";

  import AppointmentCalendar
  from "../pages/AppointmentCalendar";

  import FileUpload from "../pages/FileUpload";

import PatientHistory from "../pages/PatientHistory";

import PrescriptionPage from "../pages/PrescriptionPage";

import BillingPage from "../pages/BillingPage";

import RevenueDashboard from "../pages/RevenueDashboard";

import PaymentHistory from "../pages/PaymentHistory";

import Payments from "../pages/Payments";

import DoctorAvailability from "../pages/DoctorAvailability";

import ReportReviewPage from "../pages/ReportReviewPage";


function AppRoutes() {

  return (

    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patients"
        element={
          <RoleProtectedRoute
            allowedRoles={[
              "ADMIN",
              "DOCTOR"
            ]}
          >
            <Patients />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/doctors"
        element={
          <RoleProtectedRoute
            allowedRoles={[
              "ADMIN"
            ]}
          >
            <Doctors />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <RoleProtectedRoute
            allowedRoles={[
              "ADMIN",
              "DOCTOR",
              "RECEPTIONIST"
            ]}
          >
            <Appointments />
          </RoleProtectedRoute>
        }
      />

            <Route path="/calendar" element={
        <RoleProtectedRoute allowedRoles={["ADMIN","DOCTOR","RECEPTIONIST"]}>
          <AppointmentCalendar />
        </RoleProtectedRoute>
      }/>
      <Route
        path="/patients/:id"
        element={<PatientHistory />}
      />

<Route
  path="/upload"
  element={<FileUpload />}
/>

<Route
  path="/prescriptions"
  element={<PrescriptionPage />}
/>

<Route
  path="/billing"
  element={<BillingPage />}
/>

<Route
  path="/revenue"
  element={<RevenueDashboard />}
/>

<Route
  path="/payment-history"
  element={<PaymentHistory />}
/>

      <Route
        path="/payments"
        element={<Payments />}
      />

      <Route
      path="/availability"
      element={<DoctorAvailability />}
    />

    <Route
      path="/report-review"
      element={<ReportReviewPage />}
    />

    </Routes>
  );
}

export default AppRoutes;