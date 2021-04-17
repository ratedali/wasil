import classNames from "classnames";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocData } from "reactfire";


export default function OrderDetails() {


  const { id } = useParams();
  const querystring = `fuelOrders/${id}`;
  const query = useFirestore().doc(querystring);
  const { data: order } = useFirestoreDocData(query);

  const queryDriver = useFirestore().doc(`refillDrivers/${order.driverId}`);
  const { data: driver } = useFirestoreDocData(queryDriver);

  const queryCustomer = useFirestore().doc(`users/${order.customerId}`);
  const { data: customer } = useFirestoreDocData(queryCustomer);

  const dropoff = order.dropLocation.latitude + ", " + order.dropLocation.longitude;

  const statusLabels = new Map([
    ['unconfirmed', 'Unconfirmed'],
    ['in-progress', 'In Progress'],
    ['finished', 'Finished'],
  ]);


  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-6/12 px-4 lg:order-2 lg:text-right lg:self-center">
              <div className="py-6 px-3 mt-32 sm:mt-0">
                <button
                  className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                  type="button">
                  Edit
                </button>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4 lg:order-1">
              <div className="flex justify-center py-4 lg:pt-7 pt-8">
                <div className="mr-20 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                    <i className={classNames(
                      "fas fa-circle mr-2",
                      {
                        "text-gray-300": order.status === 'new',
                        "text-yellow-300 ": order.status === 'in-progress',
                        "text-emerald-300 ": order.status === 'finished',
                      }
                    )}></i>
                  </span>
                  <span className="text-sm text-blueGray-400">
                    {statusLabels.get(order.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-1">
            <h5 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
              OrderId
            </h5>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
              {dropoff}
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-dollar-sign mr-2 text-lg text-blueGray-400"></i>
              {order.price}
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
              Created At
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-gas-pump mr-2 text-lg text-blueGray-400"></i>
              {order.fuelType}
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-tachometer-alt mr-2 text-lg text-blueGray-400"></i>
              {order.amount}L
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-user mr-2 text-lg text-blueGray-400"></i>
              <Link to={`/admin/customers/${order.customerId}`}>
                {customer.name}
              </Link>
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-truck mr-2 text-lg text-blueGray-400"></i>
              <Link to={`/admin/drivers/${order.driverId}`}>
                {(driver.name == null) ? "Not Set" : driver.name}
              </Link>
            </div>
            <div className="mb-12 text-blueGray-600">
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
