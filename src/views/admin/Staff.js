import Card from "components/Cards/Card.js";
import TableDropdown from "components/Dropdowns/TableDropdown.js";
import LoadingBar from "components/Loading/LoadingBar.js";
import Cell from "components/Table/Cell.js";
import HeadingCell from "components/Table/HeadingCell.js";
import RowHeadingCell from "components/Table/RowHeadingCell.js";
import Table from "components/Table/Table.js";
import TablePagination from "components/Table/TablePagination.js";
import { format } from "date-fns/fp";
import React, { Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { useFirestore, useFirestoreCollection, useFirestoreDocData } from "reactfire";

const headings = [
  "Email",
  "Role",
  "Created At",
  "Last Login",
  "Actions"
];

export default function Staff() {
  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <Suspense fallback={<LoadingCard />}>
          <StaffCard />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <Card title="Staff">
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

function StaffCard() {
  const query = useFirestore()
    .collection('staff')
    .orderBy('createdAt', 'desc');
  const { data: collection } = useFirestoreCollection(query);
  const [page, setPage] = useState(1);
  const numRows = 10;
  const numPages = Math.ceil(collection.docs.length / numRows);
  const nextPage = () => setPage(page => Math.min(page + 1, numPages));
  const prevPage = () => setPage(page => Math.max(1, page - 1));
  return (
    <Card title="Staff">
      <Table>
        <thead>
          <tr>
            {headings.map(heading => <HeadingCell key={heading}>{heading}</HeadingCell>)}
          </tr>
        </thead>
        <tbody>
          {collection
            .docs
            .slice((page - 1) * numRows, page * numRows)
            .map(doc => <StaffUser key={doc.id} doc={doc} />)}
        </tbody>
      </Table>
      <hr />
      <TablePagination current={page} total={numPages} onNext={nextPage} onPrev={prevPage} />
    </Card>
  );
}

function StaffUser({ doc }) {
  const { data: staff } = useFirestoreDocData(doc.ref);
  const formatDate = format('dd/MM/yyyy');
  return (
    <tr key={doc.id}>
      <RowHeadingCell><Link to={`staff/id/${doc.id}`}>{staff.email}</Link></RowHeadingCell>
      <Cell>{staff.admin ? "Administrator" : "Regular"}</Cell>
      <Cell>{
        staff.createdAt
          ? formatDate(staff.createdAt.toDate())
          : null
      }</Cell>
      <Cell>{
        staff.lastLogin
          ? formatDate(staff.lastLogin.toDate())
          : null
      }</Cell>
      <Cell action={true}>
        <TableDropdown />
      </Cell>
    </tr>

  );
}