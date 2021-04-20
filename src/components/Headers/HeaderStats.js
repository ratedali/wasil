// components
import CardStats from "components/Cards/CardStats.js";
import { addDays, endOfDay, startOfDay, startOfMonth, startOfWeek, subDays, subWeeks } from "date-fns";
import React, { Suspense, useEffect, useState } from "react";
import { useFirestore, useFirestoreCollection } from "reactfire";



export default function HeaderStats() {
  const [today, setToday] = useState(new Date());
  // re-render when the day changes
  useEffect(() => {
    const tomorrow = startOfDay(addDays(today, 1));
    const timeout = setTimeout(() => setToday(new Date()), tomorrow - today);
    return () => clearTimeout(timeout);
  }, [today]);
  return (
    <>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-purple-600 to-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <Suspense fallback={<LoadingCard
                  name="Fuel Orders"
                  icon="fa-shopping-cart"
                  description="Since last month"
                  iconColor="bg-red-600"
                />}>
                  <NewOrdersCard today={today} />
                </Suspense>
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <Suspense fallback={<LoadingCard
                  name="New Users"
                  icon="fa-users"
                  description="Since last week"
                  iconColor="bg-orange-600"
                />}>
                  <NewUsersCard today={today} />
                </Suspense>
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <Suspense fallback={<LoadingCard
                  name="Sales"
                  icon="fa-dollar-sign"
                  description="Since yesterday"
                  iconColor="bg-indigo-600"
                />}>
                  <SalesCard today={today} />
                </Suspense>
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="PERFORMANCE"
                  statTitle="49,65%"
                  statArrow="up"
                  statPercent="12"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"
                  statIconName="fas fa-chart-line"
                  statIconColor="bg-purple-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function LoadingCard({ name, description, icon, iconColor }) {
  return (
    <CardStats
      statSubtitle={name}
      statTitle="LOADING"
      statArrow="none"
      statPercent="..."
      statPercentColor="text-gray-600"
      statDescripiron={description}
      statIconName={`fas ${icon}`}
      statIconColor={iconColor}
    />
  );
}

function NewOrdersCard({ today }) {
  const lastMonth = startOfMonth(subDays(startOfMonth(today), 1));
  const monthBeforeLast = startOfMonth(subDays(lastMonth, 1));
  return (
    <FirestoreStatCard
      name="Fuel Orders"
      collection="fuelOrders"
      field="lastModified"
      start={lastMonth}
      before={monthBeforeLast}
      description="Since last month"
      icon="fa-shopping-cart"
      iconColor="bg-red-600"
    />
  );
}

function NewUsersCard({ today }) {
  const lastWeek = startOfWeek(subWeeks(startOfWeek(today), 1));
  const weekBeforeLast = startOfWeek(subDays(lastWeek, 1));
  return (
    <FirestoreStatCard
      name="New Users"
      collection="users"
      field="joinedAt"
      start={lastWeek}
      before={weekBeforeLast}
      description="Since last week"
      icon="fa-users"
      iconColor="bg-orange-600"
    />
  );
}

function SalesCard({ today }) {
  const yesterday = endOfDay(subDays(today, 1));
  const dayBeforeYesterday = subDays(yesterday, 1);
  return (
    <FirestoreStatCard
      name="Sales"
      collection="fuelOrders"
      field="deliveredDate"
      start={yesterday}
      before={dayBeforeYesterday}
      description="Since yesterday"
      icon="fa-dollar-sign"
      iconColor="bg-indigo-600"
    />
  );
}

function FirestoreStatCard({
  start, before,
  icon, iconColor,
  name, description,
  collection, field
}) {
  const firestore = useFirestore();
  const {
    data: {
      docs: {
        length: value
      }
    }
  } = useFirestoreCollection(
    firestore
      .collection(collection)
      .where(field, '>', start)
  );
  const {
    data: {
      docs: {
        length: beforeValue
      }
    }
  } = useFirestoreCollection(
    firestore
      .collection(collection)
      .where(field, '<=', start)
      .where(field, '>', before)
  );
  let percent = "N/A";
  if (beforeValue !== 0) {
    percent = (Math.abs(value - beforeValue) * 100 / beforeValue).toFixed(2);
  }
  return (
    <CardStats
      statSubtitle={name}
      statTitle={value.toString()}
      statArrow={
        value > beforeValue
          ? "up"
          : value < beforeValue
            ? "down"
            : "none"
      }
      statPercent={percent}
      statPercentColor={
        value > beforeValue
          ? "text-emerald-600"
          : value === beforeValue
            ? "text-gray-600"
            : percent <= 2
              ? "text-orange-600"
              : "text-red-600"
      }
      statDescripiron={description}
      statIconName={`fas ${icon}`}
      statIconColor={iconColor}
    />
  );
}