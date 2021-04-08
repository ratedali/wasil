import PrivateRoute from 'components/PrivateRoute';
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                {/* add routes with layouts */}
                <PrivateRoute path="/admin" component={Admin} />
                <Route path="/auth" component={Auth} />
                {/* add routes without layouts */}
                <PrivateRoute path="/profile" exact component={Profile} />
                <Route path="/landing" exact component={Landing} />
                {/* add redirect for first page */}
                <Redirect from="*" to="/admin" />
            </Switch>
        </BrowserRouter>
    );
}