import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/ToastContext';
import { AuthProvider } from './features/auth/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { ContactsPage } from './features/contacts/pages/ContactsPage';
import { LeadsPage } from './features/leads/pages/LeadsPage';
import { DealsPage } from './features/deals/pages/DealsPage';
import { ReportsPage } from './features/reports/pages/ReportsPage';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import RoleRoute from './components/common/RoleRoutes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>

            {/* Public */}
            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/signup"
              element={<SignupPage />}
            />

            {/* Authenticated */}
            <Route element={<ProtectedRoute />}>

              <Route
                element={<DashboardLayout />}
              >

                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/dashboard"
                      replace
                    />
                  }
                />

                <Route
                  path="/dashboard"
                  element={<DashboardPage />}
                />

                {/* ADMIN ONLY */}
                <Route element={
                  <RoleRoute
                    allowedRoles={["admin"]}
                  />
                }>
                  <Route
                    path="/contacts"
                    element={<ContactsPage />}
                  />

                  <Route
                    path="/reports"
                    element={<ReportsPage />}
                  />
                </Route>

                {/* ADMIN + AGENT */}
                <Route element={
                  <RoleRoute
                    allowedRoles={[
                      "admin",
                      "agent",
                    ]}
                  />
                }>
                  <Route
                    path="/leads"
                    element={<LeadsPage />}
                  />

                  <Route
                    path="/deals"
                    element={<DealsPage />}
                  />
                </Route>

                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/dashboard"
                      replace
                    />
                  }
                />

              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
