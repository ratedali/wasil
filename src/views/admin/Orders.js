import classNames from 'classnames';
import CardTable from 'components/Cards/CardTable.js';
import TableDropdown from 'components/Dropdowns/TableDropdown.js';
import LoadingBar from 'components/Loading/LoadingBar.js';
import Cell from 'components/Table/Cell.js';
import HeadingCell from 'components/Table/HeadingCell.js';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useFirestore, useFirestoreCollection, useFirestoreDocData } from 'reactfire';


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
                <HeadingCell>Driver</HeadingCell>
                <HeadingCell>Time</HeadingCell>
                <HeadingCell>Status</HeadingCell>
                <HeadingCell>Actions</HeadingCell>
              </tr>
            </thead>
            <tbody>
              <Suspense fallback={<tr><td colSpan={5}><LoadingBar /></td></tr>}>
                <OrderRows />
              </Suspense>
            </tbody>
          </CardTable>
        </div>
      </div>
    </>
  );
}

function OrderRows() {
  const firestore = useFirestore();
  const query = firestore
    .collection('fuelOrders')
    .limit(10);
  const { data: collection } = useFirestoreCollection(query);
  return collection.docs.map(doc => <Order key={doc.id} doc={doc} />);
}

const typeLabels = new Map([
  ['benzene', 'Benzene'],
  ['gasoline', 'Gasoline'],
]);
const statusLabels = new Map([
  ['new', 'New'],
  ['unconfirmed', 'Unconfirmed'],
  ['in-progress', 'In Progress'],
  ['finished', 'Finished'],
]);

function Order({ doc }) {
  const firestore = useFirestore();
  const { data: order } = useFirestoreDocData(doc.ref);
  const { data: customer } = useFirestoreDocData(firestore.doc(`users/${order.customerId}`));
  const { data: driver } = useFirestoreDocData(firestore.doc(`refillDrivers/${order.orderId}`));
  return (
    <tr>
      <Cell><Link to={`/admin/customers/${order.customerId}`}>{customer?.name}</Link></Cell>
      <Cell>{order.amount}L</Cell>
      <Cell>{typeLabels.get(order.fuelType)}</Cell>
      <Cell>{order.price > 0 ? `${order.price} SDG` : '-'}</Cell>
      <Cell>
        {order.driverId
          ? (
            <Link to={`/admin/drivers/${order.driverId}`}>
              {order.driverId ? driver.name : null}
            </Link>
          )
          : '-'}
      </Cell>
      <Cell></Cell>
      <Cell>
        <i className={classNames(
          "fas fa-circle mr-2",
          {
            "text-lightBlue-300": order.status === 'new',
            "text-gray-300": order.status === 'unconfirmed',
            "text-yellow-300 ": order.status === 'in-progress',
            "text-emerald-300 ": order.status === 'finished',
          }
        )}></i> {statusLabels.get(order.status)}
      </Cell>
      <Cell action={true}>
        <TableDropdown />
      </Cell>
    </tr>
  );
}
