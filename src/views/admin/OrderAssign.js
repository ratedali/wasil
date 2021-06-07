import React, { useState, Fragment } from 'react';

import Select from 'react-select';
import { useParams } from "react-router-dom";
import {
  useFirestore,
  useFirestoreDocData,
  useFirestoreCollection,
} from "reactfire";

import classNames from "classnames";
import { Link } from "react-router-dom";

export default function OrderAssign() {
  const { id } = useParams();
  const querystring = `fuelOrders/${id}`;
  const query = useFirestore().doc(querystring);
  const { data: order } = useFirestoreDocData(query);

  const queryCustomer = useFirestore().doc(`customers/${order.customerId}`);
  const { data: customer } = useFirestoreDocData(queryCustomer);

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
          <div className="text-center mt-1">
            <h5 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
              Assign Order
            </h5>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-dollar-sign mr-2 text-lg text-blueGray-400"></i>
              Price: {order.price}
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
                {customer.username}
              </Link>
            </div>

            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
              {order.dropLocation != null
                ? `${order.dropLocation.latitude}, ${order.dropLocation.longitude}`
                : "N/A"}
            </div>
            <div className="mb-2 text-blueGray-600">
              Assign Driver:
            </div>
            <div className="mb-2 text-blueGray-600">
              <SelectDriver id={id} />
            </div>
            <div className="mb-12 text-blueGray-600"></div>
          </div>
        </div>
      </div>
    </>
  );
}

function SelectDriver({ id }) {


  const queryDeliveries = useFirestore()
    .collection("refillDrivers")
    .where("available", "==", true);
  const { data } = useFirestoreCollection(queryDeliveries);
  var driverNames = []
  const Addtolist = (doc) => {
    const { data: { name }, } = useFirestoreDocData(doc.ref);
    driverNames.push({ value: doc.id, label: name })
  }
  data.docs.map((doc) => (Addtolist(doc)));

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selected, setSelected] = useState(false);
  const [assinged, setAssinged] = useState(false);

  const handleChange = selectedDriver => {
    setSelectedDriver(selectedDriver)
    setSelected(true)
    console.log("S: ", selectedDriver);
  };
  const firestore = useFirestore();
  const clickHandler = async () => {
    await firestore.doc(`fuelOrders/${id}`).update("driverId", selectedDriver.value);
    await firestore.doc(`fuelOrders/${id}`).update("status", "in-progress");
    await firestore.doc(`refillDrivers/${selectedDriver.value}`).update("available", false);
    setAssinged(true)
    console.log("update DataBase: ", selectedDriver);
  };

  const DriverList = ({ drivers }) => {
    return (
      <Fragment>
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={selectedDriver}
          isDisabled={assinged}
          name="Drivers"
          options={drivers}
          onChange={handleChange}
        />

      </Fragment>
    );

  }

  return (
    <>

      <DriverList drivers={driverNames} />

      <div className="flex justify-center py-4 lg:pt-7 pt-8">

        <Link to={`/admin/orders/id/${id}`}>
          <button
            type="button"
            onClick={clickHandler}
            disabled={!selected}
            className={classNames(
              "py-2 px-4 rounded border-0 shadow hover:shadow-md focus:outline-none",
              "uppercase font-bold text-xs text-white",
              {
                "bg-violet-500 hover:bg-violet-400 active:bg-violet-600": selected,
                "bg-trueGray-200": !selected,
              }
            )}
          >
            assign
        </button>
        </Link>
      </div>
    </>
  );
}
