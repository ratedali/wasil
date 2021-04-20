import classNames from "classnames";
import LoadingBar from "components/Loading/LoadingBar.js";
import Cell from "components/Table/Cell.js";
import HeadingCell from "components/Table/HeadingCell.js";
import { format } from "date-fns/fp";
import React, { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";

export default function DriverDetails() {
  const { id } = useParams();
  const querystring = `refillDrivers/${id}`;
  const query = useFirestore().doc(querystring);
  const { data: driver } = useFirestoreDocData(query);
  const formatDate = format("dd/MM/yyyy");

  const queryDeliveries = useFirestore()
    .collection("fuelOrders")
    .where("driverId", "==", id);
  const { data: driverDeliveries } = useFirestoreCollectionData(
    queryDeliveries
  );
  var benzeneCount = 0;
  for (const delivery of driverDeliveries) {
    if (delivery.fuelType == "benzene") {
      benzeneCount += 1;
    }
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white px-6 w-full mb-6 shadow-lg rounded">
        <div className="flex flex-wrap justify-center">
          <div className="w-full lg:w-5/12 px-4 lg:order-2 lg:text-right lg:self-center">
            <div className="py-6 px-3 mt-32 sm:mt-0">
              <button
                className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                Edit
              </button>
            </div>
          </div>
          <div className="w-full lg:w-7/12 px-4 lg:order-1">
            <div className="flex justify-start py-4 lg:pt-7 pt-8">
              <div className="mr-4 p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  {driverDeliveries.length}
                </span>
                <span className="text-sm text-blueGray-400">Deliveries</span>
              </div>
              <div className="mr-4 p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  {driverDeliveries.length - benzeneCount}
                </span>
                <span className="text-sm text-blueGray-400">Gasoline</span>
              </div>
              <div className="p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  {benzeneCount}
                </span>
                <span className="text-sm text-blueGray-400">Benzene</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-1">
          <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
            {driver.name}
          </h3>
          <div className="mb-2 text-blueGray-600">
            <i className="fas fa-phone mr-2 text-lg text-blueGray-400"></i>
            {driver.phone}
          </div>
          <div className="mb-2 text-blueGray-600">
            <i className="fas fa-truck mr-2 text-lg text-blueGray-400"></i>
            Truck Info
          </div>
          <div className="mb-2 text-blueGray-600">
            <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
            Joined at{" "}
            {driver.joinedAt ? formatDate(driver.joinedAt.toDate()) : null}
          </div>
          <div className="mb-2 text-blueGray-600">
            <i className="fas fa-gas-pump mr-2 text-lg text-blueGray-400"></i>
            Latest Order 10 Liters 5 days ago
          </div>
        </div>
        <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
          <>
            <div className="flex flex-wrap mt-4">
              <div className="w-full mb-12 px-4">
                <table>
                  <thead>
                    <tr>
                      <HeadingCell>Customer</HeadingCell>
                      <HeadingCell>Amount</HeadingCell>
                      <HeadingCell>Fuel</HeadingCell>
                      <HeadingCell>Fee</HeadingCell>
                      <HeadingCell>Status</HeadingCell>
                      <HeadingCell>Driver</HeadingCell>
                    </tr>
                  </thead>
                  <Suspense fallback={<LoadingBar />}>
                    <DriverDiliveriRow orders={driverDeliveries} />
                  </Suspense>
                </table>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
}

function DriverDiliveriRow({ orders }) {
  const typeLabels = new Map([
    ["benzene", "Benzene"],
    ["gasoline", "Gasoline"],
  ]);
  const statusLabels = new Map([
    ["unconfirmed", "Unconfirmed"],
    ["in-progress", "In Progress"],
    ["finished", "Finished"],
  ]);
  return (
    <tbody>
      {orders.map((order) => (
        <tr>
          <Cell>
            <Link to={`/admin/customers/${order.customerId}`}>
              {order.customerName}
            </Link>
          </Cell>
          <Cell>{order.amount}L</Cell>
          <Cell>{typeLabels.get(order.fuelType)}</Cell>
          <Cell>{order.price > 0 ? `${order.price} SDG` : "-"}</Cell>
          <Cell>
            <i
              className={classNames("fas fa-circle mr-2", {
                "text-gray-300": order.status === "new",
                "text-yellow-300 ": order.status === "in-progress",
                "text-emerald-300 ": order.status === "finished",
              })}
            ></i>{" "}
            {statusLabels.get(order.status)}
          </Cell>
          <Cell>
            {order.driverId ? (
              <Link to={`/admin/drivers/${order.driverId}`}>
                {order.driverId}
              </Link>
            ) : (
              "-"
            )}
          </Cell>
        </tr>
      ))}
    </tbody>
  );
}
