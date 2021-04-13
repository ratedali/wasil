import CardTable from 'components/Cards/CardTable.js';
import TableDropdown from 'components/Dropdowns/TableDropdown.js';
import LoadingBar from 'components/LoadingBar';
import Cell from 'components/Table/Cell.js';
import HeadingCell from 'components/Table/HeadingCell.js';
import RowHeadingCell from 'components/Table/RowHeadingCell.js';
import { format } from "date-fns/fp";
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';


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
          <Suspense fallback={<LoadingBar />}>
            <CustomerRows />
          </Suspense>
        </CardTable>
      </div>
    </div>
  );
}

function CustomerRows() {
  const query = useFirestore()
    .collection('users')
    .limit(10);
  const { data: customers } = useFirestoreCollectionData(query);
  const formatDate = format('dd/MM/yyyy');
  return (
    <tbody>
      {customers.map(customer => (
        <tr key={customer.id}>
          <RowHeadingCell avatar={require("assets/img/bootstrap.jpg").default}><Link to={`/admin/customers/${customer.id}`}>{customer.name}</Link></RowHeadingCell>
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
      ))}
    </tbody>
  );
}
