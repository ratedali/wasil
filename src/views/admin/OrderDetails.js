import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocData } from "reactfire";

const statusLabels = new Map([
  ["new", "New"],
  ["unconfirmed", "Unconfirmed"],
  ["confirmed", "Confirmed"],
  ["rejected", "Rejected"],
  ["in-progress", "In Progress"],
  ["finished", "Finished"],
]);

export default function OrderDetails() {
  const { id } = useParams();
  const firestore = useFirestore();
  const querystring = `fuelOrders/${id}`;
  const query = firestore.doc(querystring);
  const { data: order } = useFirestoreDocData(query);

  const queryCustomer = firestore.doc(`users/${order.customerId}`);
  const { data: customer } = useFirestoreDocData(queryCustomer);

  const [loadingDriver, setLoadingDriver] = useState(false);
  const [driver, setDriver] = useState();
  useEffect(() => {
    async function getDriverInfo() {
      const result = await firestore.doc(`refillDrivers/${order.driverId}`).get();

      if (result.exists) {
        setDriver(result.data());
      }
    }
    if (order.driverId) {
      setLoadingDriver(true);
      getDriverInfo().finally(() => setLoadingDriver(false));
    }
  }, [firestore, order.driverId]);

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-6/12 px-4 lg:order-2 lg:text-right lg:self-center">
              <div className="py-6 px-3 mt-32 sm:mt-0">
                <Link to={`/admin/approve/${order.driverId}`}>
                  <EditButton status={order.status} />
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4 lg:order-1">
              <div className="flex justify-center py-4 lg:pt-7 pt-8">
                <div className="mr-20 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
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
                    <span className="text-sm text-blueGray-400">
                      {statusLabels.get(order.status)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-1">
            <h5 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
              Order Details
            </h5>

            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-dollar-sign mr-2 text-lg text-blueGray-400"></i>
              Price: {order.price} ({order.paymentMethod})
            </div>

            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
              Created At {timeConverter(order.createdAt.seconds)}
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
              <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
              {order.dropLocation != null
                ? `${order.dropLocation.latitude}, ${order.dropLocation.longitude}`
                : "N/A"}
            </div>

            {order?.driverId
              ? (
                <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-truck mr-2 text-lg text-blueGray-400"></i>
                  {loadingDriver
                    ? "Loading..."
                    : (
                      <Link to={`/admin/drivers/${order.driverId}`}>
                        {driver?.name ?? "Not Assigned"}
                      </Link>
                    )
                  }
                </div>
              )
              : null
            }
            <div className="mb-12 text-blueGray-600"></div>
          </div>
        </div>
      </div>
    </>
  );
}

function EditButton({ status }) {
  const { id } = useParams();
  if (status === "new") {
    return (
      <Link to={`/admin/orders/approve/${id}`}>
        <button
          className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
          type="button"
        >
          Approve
      </button>
      </Link>
    )
  }

  if (status === "confirmed") {
    return (
      <Link to={`/admin/orders/assign/${id}`}>
        <button
          className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
          type="button"
        >
          Assign
      </button>
      </Link>
    )
  }

  return (
    <Link to={`/admin/dashboard`}>
      <button
        className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
        type="button"
      >
        Go to Dashboard
      </button>
    </Link>
  )

}