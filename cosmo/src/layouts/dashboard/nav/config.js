// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{width: 1, height: 1}}/>;

const navConfig = [
    {
        title: 'dashboard',
        path: '/',
        icon: icon('ic_analytics')
    },
    {
        title: 'users',
        path: '/users',
        icon: icon('ic_user'),
        permission_flags: ["FLAG_VIEW"]
    },
];

export default navConfig;
