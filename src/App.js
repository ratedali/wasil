import PrivateRoute from 'components/PrivateRoute';
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Landing from "views/Landing.js";
import CustomerDetails from "views/CustomerDetails.js";
import OrderDetails from "views/OrderDetails.js";
import DriverDetails from "views/DriverDetails.js";

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                {/* add routes with layouts */}
                <Route path="/admin" component={Admin} />
                <Route path="/auth" component={Auth} />
                {/* add routes without layouts */}
                <Route path="/customer" exact component={CustomerDetails} />
                <Route path="/order" exact component={OrderDetails} />
                <Route path="/driver" exact component={DriverDetails} />
                <Route path="/landing" exact component={Landing} />
                {/* add redirect for first page */}
                <Redirect from="*" to="/admin" />
            </Switch>
        </BrowserRouter>
    );
}