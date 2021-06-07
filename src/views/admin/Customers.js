import Card from "components/Cards/Card.js";
import LoadingBar from "components/Loading/LoadingBar.js";
import Cell from "components/Table/Cell.js";
import HeadingCell from "components/Table/HeadingCell.js";
import RowHeadingCell from "components/Table/RowHeadingCell.js";
import Table from "components/Table/Table.js";
import TablePagination from "components/Table/TablePagination.js";
import { format } from "date-fns/fp";
import React, { Suspense, useState } from "react";
import { Link } from "react-router-dom";
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocData,
} from "reactfire";

const headings = ["Customer", "Phone", "Joined At", "Last Login"];

export default function Customers() {
  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <Suspense fallback={<LoadingCard />}>
          <CustomersCard />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <Card>
      <Table title="Customers">
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

function CustomersCard() {
  const query = useFirestore().collection("customers").orderBy("joinedAt", "desc");
  const { data: collection } = useFirestoreCollection(query);
  const [page, setPage] = useState(1);
  const numRows = 10;
  const numPages = Math.ceil(collection.docs.length / numRows);
  const nextPage = () => setPage((page) => Math.min(page + 1, numPages));
  const prevPage = () => setPage((page) => Math.max(1, page - 1));
  return (
    <Card title="Customers">
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
              <Customer key={doc.id} doc={doc} />
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

function Customer({ doc }) {
  const { data: customer } = useFirestoreDocData(doc.ref);
  const formatDate = format("dd/MM/yyyy");
  return (
    <tr key={doc.id}>
      <RowHeadingCell avatar={require("assets/img/bootstrap.jpg").default}>
        <Link to={`customers/id/${doc.id}`}>{customer.username}</Link>
      </RowHeadingCell>
      <Cell>{customer.phone}</Cell>
      <Cell>
        {customer.joinedAt ? formatDate(customer.joinedAt.toDate()) : null}
      </Cell>
      <Cell>
        {customer.lastLogin ? formatDate(customer.lastLogin.toDate()) : null}
      </Cell>
    </tr>
  );
}
