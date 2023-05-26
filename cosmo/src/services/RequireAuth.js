import {useLocation, Navigate, Outlet} from 'react-router-dom';
// auth
import useAuth from "../hooks/useAuth";
// permissions
import usePermissions from "../hooks/usePermissions";

const RequireAuth = ({allowedFlags}) => {
    const {auth} = useAuth();
    const permissions = usePermissions(allowedFlags);
    const location = useLocation();

    return (
        permissions
            ? <Outlet/>
            : auth?.accessToken
                ? <Navigate to="/notfound" state={{from: location}} replace/>
                : <Navigate to="/login" state={{from: location}} replace/>
    );
}

export default RequireAuth;