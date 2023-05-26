// axios
import axios from '../api/axios';
// auth
import useAuth from './useAuth';
// jwt-decode
import jwtDecode from "jwt-decode";

const useRefreshToken = () => {
    const {setAuth} = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });

        const decoded = jwtDecode(response.data.accessToken);

        setAuth(prev => {
            return {
                ...prev,
                username: decoded.username,
                accessToken: response.data.accessToken
            }
        });

        return response.data.accessToken;
    }

    return refresh;
};

export default useRefreshToken;