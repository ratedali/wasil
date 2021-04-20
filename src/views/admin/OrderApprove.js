import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFirestore, useFirestoreDocData } from "reactfire";

import classNames from "classnames";
import { Link } from "react-router-dom";


export default function OrderApprove() {
  const { id } = useParams();
  const querystring = `fuelOrders/${id}`;
  const query = useFirestore().doc(querystring);
  const { data: order } = useFirestoreDocData(query);

  const queryCustomer = useFirestore().doc(`users/${order.customerId}`);
  const { data: customer } = useFirestoreDocData(queryCustomer);

  const dropoff =
    order.dropLocation.latitude + ", " + order.dropLocation.longitude;

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="px-6">
          <div className="text-center mt-1">
            <h5 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
              OrderId
            </h5>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-dollar-sign mr-2 text-lg text-blueGray-400"></i>
              Gas Price: {order.price}
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
              <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
              {dropoff}
            </div>
            <div className="mb-2 text-blueGray-600">
              <div className="w-full lg:w-12/12 px-4 lg:order-1">
                <div className="flex justify-center py-4 lg:pt-7 pt-8">
                  <div className="mr-4 p-3 text-center">
                    <i className="fas fa-dollar-sign mr-2 text-lg text-blueGray-400"></i>
                    Dilevriy Price (for orders outside Khartoum):
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <EditPrice order={order} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-12 text-blueGray-600"></div>
          </div>
        </div>
      </div>
    </>
  );
}

function EditPrice({ order }) {
  const { id } = useParams();

  var disabled = order.state === "khartoum";

  const initialState = order.deliveryPrice;
  const [delivery, setDelivery] = useState(initialState);
  const [valid, setValid] = useState(false);

  const onDeliveryChange = (e) => {
    setDelivery(e.target.value);
    if (Number.isNaN(delivery)) {
      setValid(false);
    } else {
      setValid(true);
    }
  };
  const firestore = useFirestore();
  const save = async () => {
    await firestore.doc(`fuelOrders/${id}`).update({
      deliveryPrice: delivery,
      status: "confirmed",
    });
  };

  return (
    <>
      <input
        type="number"
        className={classNames(
          "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
          "focus:ring ease-linear transition-all duration-150",
          "text-sm",
          {
            "placeholder-blueGray-300 text-blueGray-600": valid,
            "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600": !valid,
          },
          {
            "bg-white": !disabled,
            "bg-trueGray-100": disabled,
          }
        )}
        onChange={onDeliveryChange}
        disabled={disabled}
        value={delivery}
      />
      <div className="flex justify-center py-4 lg:pt-7 pt-8" >

        <button
          type="button"
          onClick={save}
          disabled={!valid}
          className={classNames(
            "py-2 px-4 rounded border-0 shadow hover:shadow-md focus:outline-none",
            "uppercase font-bold text-xs text-white",
            {
              "bg-violet-500 hover:bg-violet-400 active:bg-violet-600": valid,
              "bg-trueGray-200": !valid,
            }
          )}
        >
          Approve
      </button>
      </div>
    </>
  );
}
