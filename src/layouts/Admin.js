import HeaderStats from "components/Headers/HeaderStats.js";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import CustomerDetails from 'views/admin/CustomerDetails.js';
import Customers from 'views/admin/Customers';
import Dashboard from "views/admin/Dashboard.js";
import DriverDetails from 'views/admin/DriverDetails.js';
import Drivers from 'views/admin/Drivers';
import Inventories from 'views/admin/Inventories';
import Maps from "views/admin/Maps.js";
import OrderDetails from 'views/admin/OrderDetails.js';
import Orders from 'views/admin/Orders';
import Settings from "views/admin/Settings.js";


export default function Admin() {
  
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/customers" exact component={Customers} />
            <Route path="/admin/customers/:id" exact component={CustomerDetails} />
            <Route path="/admin/drivers" exact component={Drivers} />
            <Route path="/admin/drivers/:id" exact component={DriverDetails} />
            <Route path="/admin/orders" exact component={Orders} />
            <Route path="/admin/orders/:id" exact component={OrderDetails} />
            <Route path="/admin/inventories" exact component={Inventories} />
            <Route path="/admin/maps" exact component={Maps} />
            <Route path="/admin/settings" exact component={Settings} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
        </div>
      </div>
    </>
  );
}
