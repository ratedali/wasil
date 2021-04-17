import classNames from 'classnames';
import CardTable from 'components/Cards/CardTable.js';
import TableDropdown from 'components/Dropdowns/TableDropdown.js';
import LoadingBar from 'components/Loading/LoadingBar.js';
import Cell from 'components/Table/Cell.js';
import HeadingCell from 'components/Table/HeadingCell.js';
import RowHeadingCell from 'components/Table/RowHeadingCell.js';
import { format } from 'date-fns/fp';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

export default function Drivers() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable title="Fuel Delivery">
            <thead>
              <tr>
                <HeadingCell>Driver</HeadingCell>
                <HeadingCell>Status</HeadingCell>
                <HeadingCell>Gasoline</HeadingCell>
                <HeadingCell>Benzene</HeadingCell>
                <HeadingCell>Joined At</HeadingCell>
                <HeadingCell>Actions</HeadingCell>
              </tr>
            </thead>
            <Suspense fallback={<LoadingBar />}>
              <DriverRows />
            </Suspense>
          </CardTable>
        </div>
      </div>
    </>
  );
}

function DriverRows() {
  const query = useFirestore()
    .collection('refillDrivers')
    .orderBy('joinedAt', 'desc')
    .limit(10);
  const collectionData = useFirestoreCollectionData(query);
  const { data: drivers } = collectionData;
  const formatDate = format('dd/MM/yyyy');
  return (
    <tbody>
      {drivers.map(driver => (
        <tr>
          <RowHeadingCell avatar={require("assets/img/bootstrap.jpg").default}><Link to={`/admin/drivers/${driver.id}`}>{driver.name}</Link></RowHeadingCell>
          <Cell>
            <i className={classNames("fas fa-circle mr-2", {
              "text-emerald-500": driver.available,
              "text-red-500": !driver.available,
            })}></i>
            {driver.available ? "ONLINE" : "OFFLINE"}
          </Cell>
          <Cell>595/1000 Liters</Cell>
          <Cell>595/1000 Liters</Cell>
          <Cell>{driver.joinedAt ? formatDate(driver.joinedAt.toDate()) : '-'}</Cell>
          <Cell action={true}>
            <TableDropdown />
          </Cell>
        </tr>
      ))}
    </tbody>
  );
}
