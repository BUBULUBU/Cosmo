// auth
import useAuth from './useAuth';
// jwt-decode
import jwtDecode from "jwt-decode";

// Can view every required auth page
const masterFlags = [
    "FLAG_ADMIN"
]

const usePermissions = (flags) => {
    const {auth} = useAuth();

    // Default flag
    if (!flags) flags = ["FLAG_USER"];

    const flagsWithMaster = [...flags, ...masterFlags];

    const decoded = auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined

    const decodedFlags = decoded?.permission_flags || [];

    return decodedFlags.find(flag => flagsWithMaster?.includes(flag))
}

export default usePermissions;