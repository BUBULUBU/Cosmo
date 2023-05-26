import {Helmet} from 'react-helmet-async';
// config
import config from '../config.json';
// @mui
import {Grid, Container} from '@mui/material';
// sections
import {
    AppWebsiteVisits,
    AppWidgetSummary
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

const DashboardAppPage = () => {
    return (
        <>
            <Helmet>
                <title>Dashboard | {config.PROJECT_NAME}</title>
            </Helmet>

            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Registered Users" total={714000} icon={'mdi:user'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="New Users" total={1352831} color="info"
                                          icon={'ant-design:apple-filled'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Item Orders" total={1723315} color="warning"
                                          icon={'ant-design:windows-filled'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'}/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={12}>
                        <AppWebsiteVisits
                            title="Website Visits"
                            subheader="(+43%) than last year"
                            chartLabels={[
                                '01/01/2003',
                                '02/01/2003',
                                '03/01/2003',
                                '04/01/2003',
                                '05/01/2003',
                                '06/01/2003',
                                '07/01/2003',
                                '08/01/2003',
                                '09/01/2003',
                                '10/01/2003',
                                '11/01/2003',
                            ]}
                            chartData={[
                                {
                                    name: 'Team A',
                                    type: 'column',
                                    fill: 'solid',
                                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                                },
                                {
                                    name: 'Team B',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                                },
                                {
                                    name: 'Team C',
                                    type: 'line',
                                    fill: 'solid',
                                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                                },
                            ]}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default DashboardAppPage;