import CardTable from 'components/Cards/CardTable.js';
import TableDropdown from 'components/Dropdowns/TableDropdown.js';
import LoadingBar from 'components/loading/LoadingBar.js';
import Cell from 'components/Table/Cell.js';
import HeadingCell from 'components/Table/HeadingCell.js';
import RowHeadingCell from 'components/Table/RowHeadingCell.js';
import { format } from "date-fns/fp";
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useFirestore, useFirestoreCollection, useFirestoreDocData } from 'reactfire';


export default function Customers() {

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full mb-12 px-4">
        <CardTable title="Customers">
          <thead>
            <tr>
              <HeadingCell>Customer</HeadingCell>
              <HeadingCell>Phone</HeadingCell>
              <HeadingCell>Joined At</HeadingCell>
              <HeadingCell>Last Login</HeadingCell>
              <HeadingCell>Actions</HeadingCell>
            </tr>
          </thead>
          <tbody>
            <Suspense fallback={<tr><td colSpan={5}><LoadingBar /></td></tr>}>
              <CustomerRows />
            </Suspense>
          </tbody>
        </CardTable>
      </div>
    </div>
  );
}

function CustomerRows() {
  const query = useFirestore()
    .collection('users')
    .orderBy('joinedAt', 'desc')
    .limit(10);
  const { data: collection } = useFirestoreCollection(query);
  return collection
    .docs
    .map(doc => <Customer key={doc.id} doc={doc} />);
}

function Customer({ doc }) {
  const { data: customer } = useFirestoreDocData(doc.ref);
  const formatDate = format('dd/MM/yyyy');
  return (
    <tr key={doc.id}>
      <RowHeadingCell avatar={require("assets/img/bootstrap.jpg").default}><Link to={`/admin/customers/${doc.id}`}>{customer.name}</Link></RowHeadingCell>
      <Cell>{customer.phone}</Cell>
      <Cell>{
        customer.joinedAt
          ? formatDate(customer.joinedAt.toDate())
          : null
      }</Cell>
      <Cell>{
        customer.lastLogin
          ? formatDate(customer.lastLogin.toDate())
          : null
      }</Cell>
      <Cell action={true}>
        <TableDropdown />
      </Cell>
    </tr>

  );
}
