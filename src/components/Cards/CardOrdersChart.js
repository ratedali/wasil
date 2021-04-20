import CardBarChart from "components/Cards/CardBarChart.js";
import { eachMonthOfInterval, endOfMonth, format, startOfYear } from "date-fns/fp";
import { Suspense } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

export default function CardOrdersChart() {
    return (
        <Suspense fallback={<LoadingCard />}>
            <Chart />
        </Suspense>
    )
}

function Chart() {
    const today = new Date();
    const months = eachMonthOfInterval({
        start: startOfYear(today),
        end: today
    });
    const labels = months.map(format('MMMM'));
    const firestore = useFirestore();
    const { data: orders } = useFirestoreCollectionData(
        firestore
            .collection('fuelOrders')
            .orderBy('deliveredDate', 'asc')
            .where('deliveredDate', '>=', startOfYear(today))
            .where('deliveredDate', '<=', endOfMonth(today))
    );

    const numOrders = [];
    const remainingOrders = orders.slice();
    for (const month of months) {
        const nextMonthIdx = remainingOrders.findIndex(order =>
            order.deliveredDate.toDate() > endOfMonth(month)
        );
        let monthOrders = null;
        if (nextMonthIdx === -1) {
            monthOrders = remainingOrders.splice(0);
        } else {
            monthOrders = remainingOrders.splice(0, nextMonthIdx);
        }
        numOrders.push(monthOrders.length);
    }
    return (
        <CardBarChart title="Total Orders" subtitle="Monthly Performance"
            xlabel="Month" labels={labels}
            ylabel="Orders" datasets={[
                {
                    label: "Fuel Refill Orders",
                    backgroundColor: "#4c51bf",
                    borderColor: "#4c51bf",
                    data: numOrders,
                    fill: false,
                    barThickness: 16,
                },

            ]} />
    );
}

function LoadingCard() {
    return (
        <CardBarChart
            title="Total Orders" subtitle="Monthly Performance"
            xlabel="Month" ylabel="Orders"
        />
    );
}