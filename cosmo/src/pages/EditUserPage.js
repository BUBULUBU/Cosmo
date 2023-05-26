import {Helmet} from 'react-helmet-async';
import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
// config
import config from '../config.json';
// @mui
import {
    Alert,
    Card,
    Container,
    FormControlLabel,
    Grid, Snackbar,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {alpha, styled} from '@mui/material/styles';
import {red} from '@mui/material/colors';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
// custom components
import Label from '../components/label';
import CheckboxesTags from '../components/checkboxestags/CheckboxesTags';
// axios
import useAxiosPrivate from '../hooks/useAxiosPrivate';
// utils
import {fFlag} from '../utils/formatFlag';
import {sentenceCase} from 'change-case';

// ----------------------------------------------------------------------

const RedSwitch = styled(Switch)(({theme}) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: red[700],
        '&:hover': {
            backgroundColor: alpha(red[700], theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: red[700],
    },
}));

// ----------------------------------------------------------------------

export default function EditUserPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [user, setUser] = useState([]);

    // handle states
    const [username, setUsername] = useState('');
    const [flags, setFlags] = useState([]);
    const [status, setStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState(false);

    let mappedFlags = [];

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUser = async () => {
            try {
                const response = await axiosPrivate.get(`/users/${id}`, {
                    signal: controller.signal
                });

                isMounted && setUser(response.data);

                setUsername(response.data.username);
                setFlags(response.data.permission_flags);
                setStatus(response.data.status);
            } catch (err) {
                console.error(err);
            }
        }

        getUser().then(() => {
            return () => {
                isMounted = false;
                controller.abort();
            }
        });
        // eslint-disable-next-line
    }, [])

    if (user?.permission_flags) {
        mappedFlags = user?.permission_flags?.map(value => (
            {
                index: value,
                name: fFlag(value)
            }
        ));
    }

    const handleCancel = () => {
        navigate('/users');
    }

    const handleSave = () => {
        setIsSaving(true);

        setTimeout(async () => {
            await axiosPrivate.put(`/users`, {
                id: id,
                username: username,
                permission_flags: JSON.stringify(flags),
                status: status
            }).then(() => {
                setIsSaving(false);
                setSnackbar(true);
            });
        }, 2000);
    }

    const handleUsername = (event) => {
        const value = event.target.value;

        setUsername(value);
    }

    const handleFlags = (event, value) => {
        const newArray = value.map(elem => elem.index);

        setFlags(newArray);
    }

    const handleStatus = (event, value) => {
        setStatus(value ? "banned" : "active");
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbar(false);
    }

    return (
        <>
            <Helmet>
                <title>Edit User | {config.PROJECT_NAME}</title>
            </Helmet>

            {user?.permission_flags ? (
                <Container>
                    <Typography variant="h4" sx={{mb: 5}}>
                        Edit User
                    </Typography>

                    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={snackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                            User has been updated!
                        </Alert>
                    </Snackbar>

                    <Grid>
                        <Label sx={{
                            position: 'relative',
                            left: '85%',
                            top: 10,
                            width: '10%',
                            zIndex: 1
                        }}
                               color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        <Card sx={{p: 3}}>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField id="outlined-basic" defaultValue={user.username} label="Username"
                                               variant="outlined" onChange={handleUsername} fullWidth/>
                                </Grid>
                                <Grid item xs={10}>
                                    <CheckboxesTags label="Flags" data={config.PERMISSION_FLAGS}
                                                    defaultValue={mappedFlags} onChange={handleFlags}/>
                                </Grid>
                                <Grid item xs={2}>
                                    <FormControlLabel
                                        control={
                                            <RedSwitch defaultChecked={user.status === 'banned'} name="status"
                                                       onChange={handleStatus}/>
                                        }
                                        label="Ban User"
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <LoadingButton
                                        loading={isSaving}
                                        loadingPosition="start"
                                        onClick={handleSave}
                                        startIcon={<SaveIcon/>}
                                        variant="contained"
                                    >
                                        Save
                                    </LoadingButton>
                                </Grid>
                                <Grid item xs={1}>
                                    <LoadingButton
                                        loadingPosition="start"
                                        onClick={handleCancel}
                                        startIcon={<CancelIcon/>}
                                        variant="outlined"
                                    >
                                        Cancel
                                    </LoadingButton>
                                </Grid>
                                {/*<Grid item xs={10}>
                                    <Grid container direction="row"
                                          justifyContent="flex-end">

                                    </Grid>
                                </Grid>*/}
                            </Grid>
                        </Card>
                    </Grid>
                </Container>
            ) : <p>Loading user data...</p>}
        </>
    );
}
