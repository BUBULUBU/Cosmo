import {Routes, Route, Navigate} from 'react-router-dom';
// services
import RequireAuth from "./services/RequireAuth";
import PersistLogin from "./services/PersistLogin";
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from "./layouts/simple";
import ListUsersPage from './pages/ListUsersPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import EditUserPage from './pages/EditUserPage';
import ProductsPage from "./pages/ProductsPage";
import BlogPage from './pages/BlogPage';
import TestPage from './pages/TestPage';

// ----------------------------------------------------------------------

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<SimpleLayout/>}>
                {/* public routes */}
                <Route path="login" element={<LoginPage/>}/>
                <Route path="404" element={<Page404/>}/>
                <Route path="products" element={<ProductsPage/>}/>
                <Route path="blog" element={<BlogPage/>}/>
                <Route path="test" element={<TestPage/>}/>

                {/* we want to protect these routes */}
                <Route element={<DashboardLayout/>}>
                    <Route element={<PersistLogin/>}>
                        <Route element={<RequireAuth/>}>
                            <Route path="" element={<DashboardAppPage/>}/>
                        </Route>

                        <Route element={<RequireAuth allowedFlags={["FLAG_VIEW"]}/>}>
                            <Route path="/users" element={<ListUsersPage/>}/>
                        </Route>

                        <Route element={<RequireAuth allowedFlags={["FLAG_EDIT"]}/>}>
                            <Route path="/users/:id" element={<EditUserPage/>}/>
                        </Route>
                    </Route>
                </Route>

                {/* catch all */}
                <Route path="*" element={<Navigate to="/404" replace/>}/>
            </Route>
        </Routes>
    )
        ;
}
