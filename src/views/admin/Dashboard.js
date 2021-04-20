import CardConfirmedOrders from "components/Cards/CardConfirmedOrders.js";
import CardNewOrders from "components/Cards/CardNewOrders.js";
import CardOrdersChart from "components/Cards/CardOrdersChart.js";
import CardRevenueChart from "components/Cards/CardRevenueChart.js";
import React from "react";

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardRevenueChart />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardOrdersChart />
        </div>
      </div>
      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          <CardNewOrders />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardConfirmedOrders />
        </div>
      </div>
    </>
  );
}
