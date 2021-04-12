import { Redirect, Route, useLocation } from 'react-router-dom';
import { AuthCheck } from 'reactfire';
import { Suspense } from "react";

export default function PrivateRoute(props) {
    const location = useLocation();
    return (
        <Suspense fallback={<div></div>}>
            <AuthCheck fallback={
                <Redirect to={{
                    pathname: '/auth/login',
                    state: { from: location },
                }} /> 
            }>
                <Route {...props}/>
            </AuthCheck>
        </Suspense>
    );
}
