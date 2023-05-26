import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {AuthProvider} from "./context/AuthProvider";
// disable-react-devtools
import {disableReactDevTools} from '@fvilers/disable-react-devtools';
//
import App from './App';

// ----------------------------------------------------------------------

if (process.env.NODE_ENV === 'production') {
    disableReactDevTools();
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <HelmetProvider>
        <BrowserRouter>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </BrowserRouter>
    </HelmetProvider>
);