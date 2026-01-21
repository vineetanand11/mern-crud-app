import { Navigate } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../utils/auth";

export default function ProtectedRoute({ children, adminOnly=false }) {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />
    }

    return children;
};