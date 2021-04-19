import Card from "components/Cards/Card.js";
import LoadingBar from "components/Loading/LoadingBar.js";
import Cell from "components/Table/Cell.js";
import HeadingCell from "components/Table/HeadingCell.js";
import Table from "components/Table/Table.js";
import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { useFirestore, useFirestoreCollection, useFirestoreDocData } from "reactfire";

const headings = [
  "Type",
  "Amount",
  "Location",
  "Price",
  "Delivery Price",
  "Actions"
]

export default function ConfirmedOrdersCard() {
  return (
    <>
      <Suspense fallback={<LoadingCard />}>
        <OrdersCard />
      </Suspense>
    </>
  );
}


function LoadingCard() {
  return (
    <Card title="Confirmed Orders">
      <Table>
        <thead>
          <tr>
            {headings.map(heading => <HeadingCell key={heading}>{heading}</HeadingCell>)}
          </tr>
        </thead>
        <tbody>
          <tr><td colSpan={5}><LoadingBar /></td></tr>
        </tbody>
      </Table>
    </Card>
  );
}

function OrdersCard() {
  const query = useFirestore()
    .collection('fuelOrders')
    .where("status", "==", "confirmed")
    .limit(10);
  const { data: collection } = useFirestoreCollection(query);
  return (
    <Card title="Confirmed Orders" action={
      <Link role="button" to="orders?status=confirmed"
        className="bg-indigo-500 hover:bg-indigo-400 shadow hover:shadow-md text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
        See All
      </Link>
    }>
      <Table>
        <thead>
          <tr>
            {headings.map(heading => <HeadingCell key={heading}>{heading}</HeadingCell>)}
          </tr>
        </thead>
        <tbody>
          {collection
            .docs
            .map(doc => <Order key={doc.id} doc={doc} />)}
        </tbody>
      </Table>
    </Card>
  );
}

const typeLabels = new Map([
  ['benzene', 'Benzene'],
  ['gasoline', 'Gasoline'],
]);
const typeLocation = new Map([
  ['khartoum', 'Khartoum'],
  ['other', 'Other'],
]);

function Order({ doc }) {
  const { data: order } = useFirestoreDocData(doc.ref);
  return (
    <tr>
      <Cell>{typeLabels.get(order.fuelType)}</Cell>
      <Cell>{order.amount}</Cell>
      <Cell>{typeLocation.get(order.state)}</Cell>
      <Cell>{order.price}</Cell>
      <Cell>{order.deliveryPrice ?? '-'}</Cell>
      <Cell action={true}>
        <Link role="button" to={`orders/approve/${doc.id}`}
          className="py-1 px-3 rounded border-2 text-indigo-600 border-indigo-500 uppercase hover:bg-indigo-100 focus:outline-none active:bg-indigo-200 transition">
          Assign
        </Link>
      </Cell>
    </tr>
  );
}