import CardTable from 'components/Cards/CardTable.js';
import Cell from 'components/Table/Cell.js';
import HeadingCell from 'components/Table/HeadingCell.js';
import RowHeadingCell from 'components/Table/RowHeadingCell.js';
import TableDropdown from 'components/Dropdowns/TableDropdown.js';
import React from 'react';


export default function Customers() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable>
            <thead>
              <tr>
                <HeadingCell>Customer</HeadingCell>
                <HeadingCell>Joined At</HeadingCell>
                <HeadingCell>Last Login</HeadingCell>
                <HeadingCell>Order Status</HeadingCell>
                <HeadingCell>Actions</HeadingCell>
              </tr>
            </thead>
            <tbody>
              <tr>
                <RowHeadingCell avatar={require("assets/img/bootstrap.jpg").default}>Earl Simmons</RowHeadingCell>
                <Cell>18 December 1970</Cell>
                <Cell>09 April 2021</Cell>
                <Cell>
                  <i className="fas fa-circle text-orange-500 mr-2"></i> IN-PROGRESS
                </Cell>
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
