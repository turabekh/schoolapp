import { Routes, Route, BrowserRouter } from "react-router-dom";
import PrivateRoute from "src/routes/PrivateRoute";
import PublicRoute from "src/routes/PublicRoute";
import MainLayout from "src/layout/MainLayout";
import {
    Signup, 
    Login,
    Home,
} from "../pages"


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    <Route element={<PublicRoute />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Route>
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                </Routes>
            </MainLayout>
        </BrowserRouter>
    )
}

export default AppRoutes;