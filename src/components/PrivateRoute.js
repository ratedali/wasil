import { Redirect, Route, useLocation } from 'react-router-dom';
import { useAuth } from 'reactfire';

export default function PrivateRoute(props) {
    const auth = useAuth()
    const location = useLocation();
    return (auth.currentUser
        ? <Route {...props} />
        : <Redirect to={{
            pathname: '/auth/login', state: { from: location }
        }} />
    )
}