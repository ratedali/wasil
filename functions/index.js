const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.newStaffMember = functions.firestore.document("staff/{orderId}")
    .onCreate(async (snapshot) => {
        const staff = snapshot.data();
        functions.logger.log(`New staff user ${staff.email}`);
        const user = await admin.auth()
            .createUser({
                displayName: `${staff.lastName}, ${staff.firstName}`,
                email: staff.email,
                password: staff.password,
                emailVerified: true,
            });
        await admin.auth()
            .setCustomUserClaims(user.uid, { admin: staff.admin });
        return snapshot.ref.update({
            uid: user.uid,
            password: admin.firestore.FieldValue.delete(),
        });
    });

exports.orderStatusNotification = functions.firestore.document("/fuelOrders/{orderId}")
    .onUpdate(async ({ after, before }, context) => {
        const { orderId } = context.params;
        const status = after.get("status");
        const beforeStatus = before.get("status");
        const customer = await admin.firestore()
            .doc(`customers/${after.get("customerId")}`)
            .get();
        if (beforeStatus === "new" && status === "unconfirmed") {
            functions.logger.log(`Order #${orderId} approved!`);
            admin.messaging().sendMulticast({
                tokens: customer.get("notificationTokens"),
                notification: {
                    title: "Order Status Changed",
                    body: "Your fuel refill order has been approved! Please double check details and confirm it.",
                },
                data: {
                    "orderType": "fuel_refill",
                    "event": "order_approval",
                    "orderId": orderId,
                },
            });
        } else if (beforeStatus === "new" && status === "rejected") {
            functions.logger.log(`Order #${orderId} rejected.`);
            admin.messaging().sendMulticast({
                tokens: customer.get("notificationTokens"),
                notification: {
                    title: "Order Status Changed",
                    body: "Your fuel refill order has been rejected. You can try again with a different order.",
                },
                data: {
                    "orderType": "fuel_refill",
                    "event": "order_rejection",
                    "orderId": orderId,
                },
            });
        } else if (beforeStatus === "unconfirmed" && status === "confirmed") {
            functions.logger.log(`Order #${orderId} Confirmed!`);
        } else if (beforeStatus === "confirmed" && status === "assigned") {
            const driverId = after.get("driverId");
            const driver = await admin.firestore()
                .doc(`refillDrivers/${driverId}`)
                .get();
            functions.logger.log(`Order #${orderId} assigned to the driver "${driver.get("name")}"`);

            admin.messaging().sendMulticast({
                tokens: customer.get("notificationTokens"),
                notification: {
                    title: "Order Status Changed",
                    body: "Our driver is on their way to your specified location! Tap for more details."
                },
                data: {
                    "orderType": "fuel_refill",
                    "event": "order_assigned",
                    "orderId": orderId,
                },
            });
            admin.messaging().sendMulticast({
                tokens: driver.get("notificationTokens"),
                notification: {
                    title: "New Order Added",
                    body: "A new order has been added to your job queue. Tap for more info"
                },
                data: {
                    "orderType": "fuel_refill",
                    "event": "order_assigned",
                    "orderId": orderId,
                },
            });
        }
        return null;
    });
