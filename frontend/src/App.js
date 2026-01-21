import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserList from "./pages/users/UserList";
import EditUser from "./pages/users/EditUser";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UsersLayout from "./layouts/UsersLayout";
import { isLoggedIn, isAdmin } from "./utils/auth";

// Component to redirect logged-in users away from auth pages
function AuthRoute({ children }) {
  if (isLoggedIn()) {
    return isAdmin() ? <Navigate to="/admin" replace /> : <Navigate to="/users" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isLoggedIn() 
              ? isAdmin()
                ? <Navigate to="/admin" replace />
                : <Navigate to="/users" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Public routes - redirect if already logged in */}
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } 
        />

        {/* USERS (anyone logged in) */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserList />} />
          <Route path=":id/edit" element={<EditUser />} />
        </Route>

        {/* Admin */}
        <Route 
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
