import classNames from "classnames";
import Cell from "components/Table/Cell.js";
import HeadingCell from "components/Table/HeadingCell.js";
import { format } from "date-fns/fp";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";

const typeLabels = new Map([
  ["benzene", "Benzene"],
  ["gasoline", "Gasoline"],
]);
const statusLabels = new Map([
  ["new", "New"],
  ["unconfirmed", "Unconfirmed"],
  ["confirmed", "Confirmed"],
  ["rejected", "Rejected"],
  ["in-progress", "In Progress"],
  ["finished", "Finished"],
]);

export default function CustomerDetails() {
  const { id } = useParams();
  const querystring = `customers/${id}`;
  const query = useFirestore().doc(querystring);
  const { data: customer } = useFirestoreDocData(query);
  const formatDate = format("dd/MM/yyyy");

  const queryOrder = useFirestore()
    .collection("fuelOrders")
    .where("customerId", "==", id);
  const { data: customerOrders } = useFirestoreCollectionData(queryOrder);
  var benzeneCount = 0;
  for (const order of customerOrders) {
    if (order.fuelType == "benzene") {
      benzeneCount += 1;
    }
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="px-6">
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
              <div className="flex justify-center py-4 lg:pt-7 pt-8">
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                    {customerOrders.length}
                  </span>
                  <span className="text-sm text-blueGray-400">Orders</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                    {customerOrders.length - benzeneCount}L
                  </span>
                  <span className="text-sm text-blueGray-400">Gasoline</span>
                </div>
                <div className="p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                    {benzeneCount}L
                  </span>
                  <span className="text-sm text-blueGray-400">Benzene</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center ">
            <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
              {customer.username}
            </h3>
            <div className="text-sm leading-normal  mb-2 text-blueGray-400 font-bold uppercase">
              <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
              {customer.city}
            </div>
            <div className="mb-2 text-blueGray-600 ">
              <i className="fas fa-phone mr-2 text-lg text-blueGray-400"></i>
              {customer.phone}
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
              Joined at{" "}
              {customer.joinedAt
                ? formatDate(customer.joinedAt.toDate())
                : null}
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
                        <HeadingCell>Amount</HeadingCell>
                        <HeadingCell>Fuel</HeadingCell>
                        <HeadingCell>Fee</HeadingCell>
                        <HeadingCell>Payment</HeadingCell>
                        <HeadingCell>Status</HeadingCell>
                        <HeadingCell>Driver</HeadingCell>
                      </tr>
                    </thead>
                    <tbody>
                      {customerOrders.map((order) => <OrderRow order={order} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
}

function OrderRow({ order }) {
  const firestore = useFirestore();
  const [loading, setLoading] = useState(!!order.driverId);
  const [driver, setDriver] = useState();
  useEffect(() => {
    async function fetchDriver() {
      const doc = await firestore.doc(`refillDrivers/${order.driverId}`).get();
      setDriver(doc.data());
    }
    if (order.driverId) {
      setLoading(true);
      fetchDriver().finally(() => setLoading(false));
    }
  }, [firestore, order]);
  return (
    <tr>
      <Cell>{order.amount}L</Cell>
      <Cell>{typeLabels.get(order.fuelType)}</Cell>
      <Cell>{order.price > 0 ? `${order.price} SDG` : "-"}</Cell>
      <Cell>{order.paymentMethod}</Cell>
      <Cell>
        <i
          className={classNames("fas fa-circle mr-2", {
            "text-lightBlue-500": order.status === "new",
            "text-gray-500": order.status === "unconfirmed",
            "text-teal-500": order.status === "confirmed",
            "text-red-500": order.status === "rejected",
            "text-yellow-500 ": order.status === "in-progress",
            "text-green-500 ": order.status === "finished",
          })}
        ></i>{" "}
        {statusLabels.get(order.status)}
      </Cell>
      <Cell>
        {loading
          ? '...'
          : order.driverId
            ? (
              <Link to={`/admin/drivers/${order.driverId}`}>
                {driver.name}
              </Link>
            )
            :
            "-"
        }
      </Cell>
    </tr>
  );
}
