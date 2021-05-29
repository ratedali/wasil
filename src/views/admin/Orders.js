import classNames from "classnames";
import Card from "components/Cards/Card.js";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import LoadingBar from "components/Loading/LoadingBar.js";
import Cell from "components/Table/Cell.js";
import HeadingCell from "components/Table/HeadingCell.js";
import Table from "components/Table/Table.js";
import TablePagination from "components/Table/TablePagination.js";
import React, { Suspense, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocData
} from "reactfire";

const headings = [
  "Customer",
  "Amount",
  "Fuel",
  "Fee",
  "Driver",
  "Time",
  "Status",
  "Actions",
];

export default function Orders() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <Suspense fallback={<LoadingCard />}>
            <OrdersCard status={params.get('status') ?? 'all'} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function LoadingCard() {
  return (
    <Card title="Fuel Orders">
      <Table>
        <thead>
          <tr>
            {headings.map((heading) => (
              <HeadingCell key={heading}>{heading}</HeadingCell>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5}>
              <LoadingBar />
            </td>
          </tr>
        </tbody>
      </Table>
    </Card>
  );
}

function OrdersCard({ status }) {
  let query = useFirestore()
    .collection("fuelOrders")
    .orderBy("lastModified", "desc");
  if (status !== 'all') {
    query = query.where('status', '==', status);
  }
  const { data: collection } = useFirestoreCollection(query);
  const [page, setPage] = useState(1);
  const numRows = 10;
  const numPages = Math.ceil(collection.docs.length / numRows);
  const nextPage = () => setPage((page) => Math.min(numPages, page + 1));
  const prevPage = () => setPage((page) => Math.min(1, page - 1));
  return (
    <Card
      title="Fuel Orders"
      action={
        <Link
          to="orders/new"
          role="button"
          className="py-2 px-4 rounded border-0 shadow uppercase font-bold text-xs text-white bg-violet-500 focus:outline-none hover:bg-violet-400 hover:shadow-md active:bg-violet-600"
        >
          New
        </Link>
      }
    >
      <Table>
        <thead>
          <tr>
            {headings.map((heading) => (
              <HeadingCell key={heading}>{heading}</HeadingCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {collection.docs
            .slice((page - 1) * numRows, page * numRows)
            .map((doc) => (
              <Order key={doc.id} doc={doc} />
            ))}
        </tbody>
      </Table>
      <hr />
      <TablePagination
        current={page}
        total={numPages}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </Card>
  );
}

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

function Order({ doc }) {
  const firestore = useFirestore();
  const { data: order } = useFirestoreDocData(doc.ref);
  const { data: customer } = useFirestoreDocData(
    firestore.doc(`users/${order.customerId}`)
  );
  const { data: driver } = useFirestoreDocData(
    firestore.doc(`refillDrivers/${order.orderId}`)
  );
  return (
    <tr>
      <Cell>
        <Link to={`customers/id/${order.customerId}`}>{customer?.name}</Link>
      </Cell>
      <Cell>{order.amount}L</Cell>
      <Cell>{typeLabels.get(order.fuelType)}</Cell>
      <Cell>{order.price > 0 ? `${order.price} SDG` : "-"}</Cell>
      <Cell>
        {order.driverId ? (
          <Link to={`drivers/id/${order.driverId}`}>
            {order.driverId ? driver.name : null}
          </Link>
        ) : (
          "-"
        )}
      </Cell>
      <Cell></Cell>
      <Cell>
        <Link to={`orders/id/${doc.id}`}>
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
        </Link>
      </Cell>
      <Cell action={true}>
        <TableDropdown />
      </Cell>
    </tr>
  );
}
