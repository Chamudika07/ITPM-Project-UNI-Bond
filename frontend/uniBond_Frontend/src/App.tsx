import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Register from "@/views/Register";
import Login from "@/views/Login";
import Home from "@/views/Home";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";

function AuthLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const page = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">UniBond Platform</h1>

      <div className="flex gap-4 mb-6">
        <Link to="/login">
          <button
            className={`px-4 py-2 rounded ${page === "login" ? "bg-green-500 text-white" : "bg-gray-300"
              }`}
          >
            Login
          </button>
        </Link>

        <Link to="/register">
          <button
            className={`px-4 py-2 rounded ${page === "register" ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
          >
            Register
          </button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded p-6 w-full max-w-xl">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<ProtectedRoute><Home /></ProtectedRoute>}
      />
      <Route
        path="/login"
        element={<PublicRoute><AuthLayout><Login /></AuthLayout></PublicRoute>}
      />
      <Route
        path="/register"
        element={<PublicRoute><AuthLayout><Register /></AuthLayout></PublicRoute>}
      />
      <Route path="" element={<Navigate to="/" />} />
    </Routes>
  );
}