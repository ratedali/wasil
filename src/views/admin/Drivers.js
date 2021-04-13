import CardTable from 'components/Cards/CardTable.js';
import TableDropdown from 'components/Dropdowns/TableDropdown.js';
import LoadingBar from 'components/LoadingBar';
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
                <HeadingCell>Joined At</HeadingCell>
                <HeadingCell>Current Status</HeadingCell>
                <HeadingCell>Available Fuel</HeadingCell>
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
    .collection('drivers')
    .limit(10);
  const { data: drivers } = useFirestoreCollectionData(query);
  const formatDate = format('dd/MM/yyyy');
  return (
    <tbody>
      {drivers.map(driver => (
        <tr>
          <RowHeadingCell avatar={require("assets/img/bootstrap.jpg").default}><Link to={`/admin/drivers/${driver.id}`}>{driver.name}</Link></RowHeadingCell>
          <Cell>{driver.joinedAt ? formatDate(driver.joinedAt.toDate()) : '-'}</Cell>
          <Cell>
            <i className="fas fa-circle text-emerald-500 mr-2"></i> AVAILABLE
                    </Cell>
          <Cell>595/1000 Liters</Cell>
          <Cell action={true}>
            <TableDropdown />
          </Cell>
        </tr>
      ))}
    </tbody>
  );
}
