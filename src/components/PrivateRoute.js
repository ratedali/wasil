import { Redirect, Route, useLocation } from 'react-router-dom';
import { AuthCheck } from 'reactfire';
import { Suspense } from "react";
import LoadingPage from "components/loading/LoadingPage.js";

export default function PrivateRoute(props) {
    const location = useLocation();
    return (
        <Suspense fallback={<LoadingPage text="Logging In..." />}>
            <AuthCheck fallback={
                <Redirect to={{
                    pathname: '/auth/login',
                    state: { from: location },
                }} />
            }>
                <Route {...props} />
            </AuthCheck>
        </Suspense>
    );
}
