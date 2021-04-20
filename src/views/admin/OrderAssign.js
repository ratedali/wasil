import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import { useFirestore, useFirestoreDocData,useFirestoreCollectionData } from 'reactfire';

import classNames from 'classnames';
import { Link } from 'react-router-dom';

export default function OrderAssign() {


  const { id } = useParams();
  const querystring = `fuelOrders/${id}`;
  const query = useFirestore().doc(querystring);
  const { data: order } = useFirestoreDocData(query);

  const queryCustomer = useFirestore().doc(`users/${order.customerId}`);
  const { data: customer } = useFirestoreDocData(queryCustomer);

  const queryDeliveries = useFirestore()
    .collection('refillDrivers')
    .where("available", "==", true)
  const { data: drivers } = useFirestoreCollectionData(queryDeliveries);

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
          <div className="text-center mt-1">
            <h5 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
              OrderId
            </h5>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-dollar-sign mr-2 text-lg text-blueGray-400"></i>
              Gas Price: {order.price}
            </div>
          
            <div className="mb-2 text-blueGray-600">
              <div className="w-full lg:w-12/12 px-4 lg:order-1">
            <div className="flex justify-center py-4 lg:pt-7 pt-8">
              <div className="mr-4 p-3 text-center">
              <i className="fas fa-dollar-sign mr-2 text-lg text-blueGray-400"></i>
              Assign Driver: 
              </div>
              <div className="mr-4 p-3 text-center">
              <SelectDriver drivers={drivers} />
              </div>
            </div>
          </div>
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
            <div className="mb-12 text-blueGray-600">
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



function SelectDriver({ drivers }) {

  const { id } = useParams();
  
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selected, setSelected] = useState(false);

  const inputHandler = (e) => {
    console.log("e: ", e.target.value)
    setSelectedDriver(e.target.value)
    setSelected(true)
  }

  const  clickHandler =() => {
    console.log("update DataBase: ", selectedDriver)
  }


  return (
    <>
    <select onChange={inputHandler} value={selectedDriver}>
      {drivers.map(driver => (<option value={driver.name}>{driver.name}</option>))}
      </select>
    
    <Link to={`/admin/orders/id/${id}`}>
    <button type="button"
    onClick={clickHandler}
    disabled={!selected}
    className={classNames(
      "py-2 px-4 rounded border-0 shadow hover:shadow-md focus:outline-none",
      "uppercase font-bold text-xs text-white",
      {
        "bg-violet-500 hover:bg-violet-400 active:bg-violet-600": selected,
        "bg-trueGray-200": !selected
      },
      )}>
    assign
</button>
      </Link>
</>
  )
                  
                }
                