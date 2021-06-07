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
import { useFirestore, useFirestoreCollection, useFirestoreDocData } from "reactfire";

const headings = [
  "Username",
  "Email",
  "Role",
  "Created At",
  "Last Login",
];

export default function Staff() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <Suspense fallback={<LoadingCard />}>
            <StaffCard />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function LoadingCard() {
  return (
    <Card title="System Staff">
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
  const nextPage = () => setPage(page => Math.min(numPages, page + 1));
  const prevPage = () => setPage(page => Math.max(1, page - 1));
  return (
    <Card
      title="System Staff"
      action={
        <Link to="staff/new" role="button"
          className="py-2 px-4 rounded border-0 shadow uppercase font-bold text-xs text-white bg-violet-500 focus:outline-none hover:bg-violet-400 hover:shadow-md active:bg-violet-600">
          Add
        </Link>
      }
    >
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
            .map(doc => <StaffMember key={doc.id} doc={doc} />)}
        </tbody>
      </Table>
      <hr />
      <TablePagination current={page} total={numPages} onNext={nextPage} onPrev={prevPage} />
    </Card>
  );
}

function StaffMember({ doc }) {
  const { data: staff } = useFirestoreDocData(doc.ref)
  const formatDate = format('dd/MM/yyyy');
  return (
    <tr>
      <RowHeadingCell>{staff.username}</RowHeadingCell>
      <Cell>{staff.email}</Cell>
      <Cell>{staff.admin ? "Administrator" : "Regular"}</Cell>
      <Cell>{staff.createdAt ? formatDate(staff.createdAt.toDate()) : '-'}</Cell>
      <Cell>{staff.lastLogin ? formatDate(staff.lastLogin.toDate()) : '-'}</Cell>
    </tr>
  );
}
