import classNames from 'classnames';
import CardTable from 'components/Cards/CardTable.js';
import TableDropdown from 'components/Dropdowns/TableDropdown.js';
import LoadingBar from 'components/LoadingBar';
import Cell from 'components/Table/Cell.js';
import HeadingCell from 'components/Table/HeadingCell.js';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';


export default function Orders() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable title='Fuel Orders'>
            <thead>
              <tr>
                <HeadingCell>Customer</HeadingCell>
                <HeadingCell>Amount</HeadingCell>
                <HeadingCell>Fuel</HeadingCell>
                <HeadingCell>Fee</HeadingCell>
                <HeadingCell>Status</HeadingCell>
                <HeadingCell>Driver</HeadingCell>
                <HeadingCell>Actions</HeadingCell>
              </tr>
            </thead>
            <Suspense fallback={<LoadingBar />}>
              <OrderRows />
            </Suspense>
          </CardTable>
        </div>
      </div>
    </>
  );
}

function OrderRows() {
  const query = useFirestore()
    .collection('fuelOrders')
    .limit(10);
  const { data: orders } = useFirestoreCollectionData(query);
  const typeLabels = new Map([
    ['benzene', 'Benzene'],
    ['gasoline', 'Gasoline'],
  ]);
  const statusLabels = new Map([
    ['unconfirmed', 'Unconfirmed'],
    ['in-progress', 'In Progress'],
    ['finished', 'Finished'],
  ]);
  return (
    <tbody>
      {orders.map(order => (
        <tr>
          <Cell><Link to={`/admin/customers/${order.customerId}`}>Customer Name</Link></Cell>
          <Cell>{order.amount}L</Cell>
          <Cell>{typeLabels.get(order.fuelType)}</Cell>
          <Cell>{order.price > 0 ? `${order.price} SDG` : '-'}</Cell>
          <Cell>
            <i className={classNames(
              "fas fa-circle mr-2",
              {
                "text-gray-300": order.status === 'new',
                "text-yellow-300 ": order.status === 'in-progress',
                "text-emerald-300 ": order.status === 'finished',
              }
            )}></i> {statusLabels.get(order.status)}
          </Cell>
          <Cell>
            {order.driverId
              ? (
                <Link to={`/admin/drivers/${order.driverId}`}>
                  {order.driverId}
                </Link>
              )
              : '-'}
          </Cell>
          <Cell action={true}>
            <TableDropdown />
          </Cell>
        </tr>
      ))}
    </tbody>
  );
}
