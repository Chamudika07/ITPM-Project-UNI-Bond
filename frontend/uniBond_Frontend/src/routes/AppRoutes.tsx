import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/views/Home";
import SearchResults from "@/views/SearchResults";
import Groups from "@/views/Groups";
import Notices from "@/views/Notices";
import Notifications from "@/views/Notifications";
import Profile from "@/views/Profile";
import ProfessionalCommunication from "@/views/ProfessionalCommunication";
import CompanyTasks from "@/views/CompanyTasks";
import KuppySessions from "@/views/KuppySessions";
import CreatePost from "@/views/CreatePost";
import Login from "@/views/Login";
import Register from "@/views/Register";
import { ROUTES } from "@/utils/constants";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes with Main Layout */}
      <Route
        path={ROUTES.HOME}
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SearchResults />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.GROUPS}
        element={
          <ProtectedRoute>
            <MainLayout>
              <Groups />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.NOTICES}
        element={
          <ProtectedRoute>
            <MainLayout>
              <Notices />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.NOTIFICATIONS}
        element={
          <ProtectedRoute>
            <MainLayout>
              <Notifications />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFESSIONAL_COMMUNICATION}
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProfessionalCommunication />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.COMPANY_TASKS}
        element={
          <ProtectedRoute>
            <MainLayout>
              <CompanyTasks />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.KUPPY_SESSIONS}
        element={
          <ProtectedRoute>
            <MainLayout>
              <KuppySessions />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CREATE_POST}
        element={
          <ProtectedRoute>
            <MainLayout>
              <CreatePost />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect unknown routes to home */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}