import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
// @mui
import {Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel, Alert} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
// axios
import axios from '../../../api/axios';
// auth
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

export default function LoginForm() {
    const {setAuth, persist, setPersist} = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    // eslint-disable-next-line
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist])

    const handleUsername = (event) => {
        const value = event.target.value;

        setUsername(value);
    }

    const handlePassword = (event) => {
        const value = event.target.value;

        setPassword(value);
    }

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    const handleLogin = async () => {
        try {
            const response = await axios.post('/auth',
                JSON.stringify({username, password}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            );

            const accessToken = response?.data?.accessToken;

            setAuth({username, accessToken});

            setUsername('');
            setPassword('');
            setSuccess(true);
            navigate('/', {replace: true});
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing username or password');
            } else if (err.response?.status === 401) {
                setErrMsg('Incorrect username or password');
            } else if (err.response?.status === 405) {
                setErrMsg('User is currently banned');
            } else {
                setErrMsg('Login failed');
            }
        }
    };

    return (
        <>
            <Stack spacing={3}>
                {errMsg && <Alert severity="error">{errMsg}</Alert>}
                <TextField name="username" label="Username" onChange={handleUsername}/>

                <TextField
                    name="password"
                    label="Password"
                    onChange={handlePassword}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}>
                <FormControlLabel control={<Checkbox/>} label="Remember me" onChange={togglePersist} checked={persist}/>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleLogin}>
                Login
            </LoadingButton>
        </>
    );
}
