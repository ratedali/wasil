import CardLineChart from "components/Cards/CardLineChart.js";
import { eachMonthOfInterval, endOfMonth, format, startOfYear } from "date-fns/fp";
import { Suspense } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";


export default function CardRevenueChart() {
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

    const revenue = [];
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
        const monthRevenue = monthOrders.reduce(
            (sum, order) => sum + order.price + order.deliveryPrice,
            0
        );
        revenue.push(monthRevenue);
    }
    const datasets = [
        {
            label: "Fuel Refill Revenue",
            backgroundColor: "#ffffff",
            borderColor: "#ffffff",
            data: revenue,
            fill: false,
        }
    ]
    return (
        <CardLineChart title="Order Revenue" subtitle="Monthly Overview"
            xlabel="Month" labels={labels}
            ylabel="Revenue" datasets={datasets} />
    );
}

function LoadingCard() {
    return (
        <CardLineChart
            title="Order Revenue" subtitle="Monthly Overview"
            xlabel="Month" ylabel="Revenue"
        />
    );
}