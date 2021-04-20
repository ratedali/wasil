import classNames from "classnames";
import Card from "components/Cards/Card.js";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import LoadingBar from "components/Loading/LoadingBar.js";
import Cell from "components/Table/Cell.js";
import HeadingCell from "components/Table/HeadingCell.js";
import RowHeadingCell from "components/Table/RowHeadingCell.js";
import Table from "components/Table/Table.js";
import TablePagination from "components/Table/TablePagination";
import { format } from "date-fns/fp";
import React, { Suspense, useState } from "react";
import { Link } from "react-router-dom";
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocData,
} from "reactfire";

const headings = [
  "Driver",
  "Status",
  "Gasoline",
  "Benzene",
  "Joined At",
  "Actions",
];
export default function Drivers() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <Suspense fallback={<LoadingCard />}>
            <DriversCard />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function LoadingCard() {
  return (
    <Card title="Fuel Delivery">
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

function DriversCard() {
  const query = useFirestore()
    .collection("refillDrivers")
    .orderBy("joinedAt", "desc");
  const { data: collection } = useFirestoreCollection(query);
  const [page, setPage] = useState(1);
  const numRows = 10;
  const numPages = Math.ceil(collection.docs.length / numRows);
  const nextPage = () => setPage((page) => Math.min(numPages, page + 1));
  const prevPage = () => setPage((page) => Math.max(1, page - 1));
  return (
    <Card
      title="Fuel Delivery"
      action={
        <Link
          to="drivers/new"
          role="button"
          className="py-2 px-4 rounded border-0 shadow uppercase font-bold text-xs text-white bg-violet-500 focus:outline-none hover:bg-violet-400 hover:shadow-md active:bg-violet-600"
        >
          Add
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
              <Driver key={doc.id} doc={doc} />
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

function Driver({ doc }) {
  const { data: driver } = useFirestoreDocData(doc.ref);
  const formatDate = format("dd/MM/yyyy");
  return (
    <tr>
      <RowHeadingCell avatar={require("assets/img/bootstrap.jpg").default}>
        <Link to={`drivers/id/${doc.id}`}>{driver.name}</Link>
      </RowHeadingCell>
      <Cell>
        <i
          className={classNames("fas fa-circle mr-2", {
            "text-emerald-500": driver.available,
            "text-red-500": !driver.available,
          })}
        ></i>
        {driver.available ? "ONLINE" : "OFFLINE"}
      </Cell>
      <Cell>595/1000 Liters</Cell>
      <Cell>595/1000 Liters</Cell>
      <Cell>
        {driver.joinedAt ? formatDate(driver.joinedAt.toDate()) : "-"}
      </Cell>
      <Cell action={true}>
        <TableDropdown />
      </Cell>
    </tr>
  );
}
