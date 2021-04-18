import CardOrdersChart from "components/Cards/CardOrdersChart.js";
// components
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardRevenueChart from "components/Cards/CardRevenueChart.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";
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
          <CardPageVisits />
        </div>
        <div className="w-full xl:w-4/12 px-4">
          <CardSocialTraffic />
        </div>
      </div>
    </>
  );
}
