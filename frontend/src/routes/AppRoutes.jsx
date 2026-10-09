import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Unauthorized from '../pages/auth/Unauthorized';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageDoctors from '../pages/admin/ManageDoctors';
import ManagePatients from '../pages/admin/ManagePatients';
import ManageDepartments from '../pages/admin/ManageDepartments';
import ViewAppointments from '../pages/admin/ViewAppointments';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../pages/doctor/DoctorAppointments';

// Receptionist Pages
import ReceptionistDashboard from '../pages/receptionist/ReceptionistDashboard';
import RegisterPatient from '../pages/receptionist/RegisterPatient';
import SearchPatients from '../pages/receptionist/SearchPatients';
import BookAppointment from '../pages/receptionist/BookAppointment';
import ManageBilling from '../pages/receptionist/ManageBilling';

// Patient Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import BookAppointmentPatient from '../pages/patient/BookAppointmentPatient';
import MyAppointments from '../pages/patient/MyAppointments';
import MyMedicalRecords from '../pages/patient/MyMedicalRecords';
import MyPrescriptions from '../pages/patient/MyPrescriptions';
import MyBills from '../pages/patient/MyBills';
import PatientProfile from '../pages/patient/PatientProfile';

const AppRoutes = () => {
  const { isAuthenticated, getDashboardPath } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? getDashboardPath() : '/login'} replace />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<DashboardLayout title="Hospital Administration" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="patients" element={<ManagePatients />} />
          <Route path="departments" element={<ManageDepartments />} />
          <Route path="appointments" element={<ViewAppointments />} />
        </Route>
      </Route>

      {/* Doctor Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />}>
        <Route path="/doctor" element={<DashboardLayout title="Physician Clinical Station" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
        </Route>
      </Route>

      {/* Receptionist Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMIN']} />}>
        <Route path="/receptionist" element={<DashboardLayout title="Front Desk & Registration Counter" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ReceptionistDashboard />} />
          <Route path="register-patient" element={<RegisterPatient />} />
          <Route path="search-patients" element={<SearchPatients />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="billing" element={<ManageBilling />} />
        </Route>
      </Route>

      {/* Patient Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']} />}>
        <Route path="/patient" element={<DashboardLayout title="Patient Health Portal" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="book-appointment" element={<BookAppointmentPatient />} />
          <Route path="my-appointments" element={<MyAppointments />} />
          <Route path="my-records" element={<MyMedicalRecords />} />
          <Route path="my-prescriptions" element={<MyPrescriptions />} />
          <Route path="my-bills" element={<MyBills />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
