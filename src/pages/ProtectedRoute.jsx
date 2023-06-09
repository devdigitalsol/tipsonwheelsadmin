import { useContext } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { AppContext } from "../context";
export default function ProtectedRoute({ alloweRoles }) {
  const { user } = useContext(AppContext);
  let location = useLocation();
  return alloweRoles.find((role) => user?.role.includes(role)) ? (
    <Outlet />
  ) : user?.email ? (
    <Navigate to="/unauthorized" state={{ from: location }} />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
}
