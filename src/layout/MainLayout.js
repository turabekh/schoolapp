import { useContext } from "react";
import {AuthContext} from "src/authentication/AuthProvider";
import PublicLayout from "src/layout/PublicLayout";
import PrivateLayout from "src/layout/PrivateLayout";
import "./Layout.css"

const MainLayout = ({children}) => {
  const {checkAuthStatus} = useContext(AuthContext);
  if (checkAuthStatus()) {
    return (
        <PrivateLayout>
          <div className="main">
            {children}
          </div>
        </PrivateLayout>
    )
  } else {
    return (
        <PublicLayout>
          <div className="main">
            {children}
          </div>
        </PublicLayout>
    )
  }
}

export default MainLayout;