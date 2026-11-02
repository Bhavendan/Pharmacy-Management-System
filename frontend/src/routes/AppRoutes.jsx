import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Users } from '../pages/Users';
import { Patients } from '../pages/Patients';
import { PatientDetail } from '../pages/PatientDetail';
import { Drugs } from '../pages/Drugs';
import { Inventory } from '../pages/Inventory';
import { Prescriptions } from '../pages/Prescriptions';
import { PrescriptionDetail } from '../pages/PrescriptionDetail';
import { Billing } from '../pages/Billing';
import { BillDetail } from '../pages/BillDetail';
import { Suppliers } from '../pages/Suppliers';
import { Reports } from '../pages/Reports';
import { Profile } from '../pages/Profile';
import { NotFound } from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes inside Main Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PHARMACIST']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="patients"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PHARMACIST']}>
              <Patients />
            </ProtectedRoute>
          }
        />

        <Route
          path="patients/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PHARMACIST']}>
              <PatientDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="drugs"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PHARMACIST']}>
              <Drugs />
            </ProtectedRoute>
          }
        />

        <Route
          path="inventory"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="prescriptions"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PHARMACIST']}>
              <Prescriptions />
            </ProtectedRoute>
          }
        />

        <Route
          path="prescriptions/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PHARMACIST']}>
              <PrescriptionDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="billing"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route
          path="billing/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PHARMACIST']}>
              <BillDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="suppliers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Suppliers />
            </ProtectedRoute>
          }
        />

        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PHARMACIST']}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PHARMACIST']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
