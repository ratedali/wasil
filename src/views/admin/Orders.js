import CardTable from 'components/Cards/CardTable.js';
import Cell from 'components/Table/Cell.js';
import HeadingCell from 'components/Table/HeadingCell.js';
import TableDropdown from 'components/Dropdowns/TableDropdown.js';
import React from 'react';


export default function Orders() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable>
            <thead>
              <tr>
                <HeadingCell>Service</HeadingCell>
                <HeadingCell>Customer</HeadingCell>
                <HeadingCell>Fee</HeadingCell>
                <HeadingCell>Status</HeadingCell>
                <HeadingCell>Driver</HeadingCell>
                <HeadingCell>Actions</HeadingCell>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Cell>Fuel Delivery</Cell>
                <Cell>Earl Simmons</Cell>
                <Cell>SDG20,000</Cell>
                <Cell>
                  <i className="fas fa-circle text-yellow-300 mr-2"></i> NEW
                </Cell>
                <Cell>Earl Simmons</Cell>
                <Cell action={true}>
                  <TableDropdown />
                </Cell>
              </tr>
            </tbody>
          </CardTable>
        </div>
      </div>
    </>
  );
}
