import CardTable from 'components/Cards/CardTable.js';
import TableDropdown from 'components/Dropdowns/TableDropdown.js';
import Cell from 'components/Table/Cell.js';
import HeadingCell from 'components/Table/HeadingCell.js';
import RowHeadingCell from 'components/Table/RowHeadingCell.js';
import React, { Suspense } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import LoadingSpinner from 'components/LoadingSpinner';
import { format } from "date-fns/fp";


export default function Customers() {
  const query = useFirestore()
    .collection('users')
    .limit(10);
  const customers = useFirestoreCollectionData(query);
  const formatDate = format('dd/MM/yyyy');
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable>
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
              <Suspense fallback={<LoadingSpinner />}>
                {customers.data.map(customer => (
                  <tr key={customer.id}>
                    <RowHeadingCell avatar={require("assets/img/bootstrap.jpg").default}>{customer.name}</RowHeadingCell>
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
              </Suspense>
            </tbody>
          </CardTable>
        </div>
      </div>
    </>
  );
}
