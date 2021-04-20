import AuthContext from "components/AuthContext.js";
import LoadingPage from "components/Loading/LoadingPage.js";
import { Suspense } from "react";
import { Redirect, Route, useLocation } from 'react-router-dom';
import { useFirestore, useFirestoreCollection, useFirestoreDocData, useUser } from 'reactfire';

export default function PrivateRoute({ admin, ...props }) {
    const location = useLocation();
    return (
        <Suspense fallback={<LoadingPage text="Logging In..." />}>
            <AuthCheck
                admin={admin}
                fallback={<Redirect
                    to={{
                        pathname: '/auth/login',
                        state: { from: location },
                    }}
                />}
                adminFallback={<Redirect to='/' />}
                {...props}
            >
                <Route {...props} />
            </AuthCheck>
        </Suspense>
    );
}

function AuthCheck({ admin, fallback, adminFallback, children }) {
    const { data: user } = useUser();
    if (!user) return <>{fallback}</>;
    return (
        <Suspense fallback={<LoadingPage text="Gathering Info..." />}>
            <AdminCheck
                user={user}
                fallback={admin ? adminFallback : children}
            >
                {children}
            </AdminCheck>
        </Suspense>
    );
}


function AdminCheck({ user, fallback, children }) {
    const ref = useFirestore()
        .collection(`staff`)
        .where('uid', '==', user.uid);
    const { data: { docs: results } } = useFirestoreCollection(ref);
    const { data: doc } = useFirestoreDocData(results[0].ref);
    if (doc.admin) {
        return (
            <AuthContext.Provider value={{ admin: true, user: doc }}>
                {children}
            </AuthContext.Provider>
        );
    } else {
        return (
            <AuthContext.Provider value={{ admin: false, user: doc }}>
                {fallback}
            </AuthContext.Provider>
        );
    }
}