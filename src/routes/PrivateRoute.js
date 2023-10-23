import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {AuthContext} from "src/authentication/AuthProvider";

const PrivateRoute = () => {
  const {checkAuthStatus} = useContext(AuthContext);

  return checkAuthStatus() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
