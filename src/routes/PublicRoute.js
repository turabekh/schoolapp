import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {AuthContext} from "src/authentication/AuthProvider";

const PublicRoute = () => {
  const {checkAuthStatus} = useContext(AuthContext);
  return checkAuthStatus() ? (
    <Navigate to="/" />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
