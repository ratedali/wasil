import classNames from "classnames";
import Card from "components/Cards/Card.js";
import normalizePhone from "phone";
import React, { useState } from "react";
import { useFirestore } from "reactfire";


export default function NewOrder() {
    const [orderInfo, setOrderInfo] = useState({
        "orderType": "instant",
        "fuelType": "benzene",
        "state": "khartoum",
        "paymentMethod": "cash",
        "amount": "0.00",
        "price": 0,
        "deliveryPrice": 0,
        "dropLocation": [0, 0],
    });
    const handleOrderChange = ({ target: { name, value } }) => {
        setOrderInfo(orderInfo => ({
            ...orderInfo,
            [name]: value,
        }));
    };
    const handleUnitChange = ({ target: { value } }) => {
        setOrderInfo(orderInfo => {
            let amount = Number.parseFloat(orderInfo.amount);
            if (value === 'liters') {
                amount *= 3.785
            } else if (value === 'gallons') {
                amount /= 3.785;
            }
            return {
                ...orderInfo,
                amount: amount.toFixed(2)
            };
        });
    };
    const [userInfo, setUserInfo] = useState({
        name: "",
        phone: "",
        city: "",
    });
    const handleUserChange = ({ target: { name, value } }) => {
        setUserInfo(userInfo => ({
            ...userInfo,
            [name]: value,
        }));
    };
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(null);
    const [errors, setErrors] = useState({
        order: {},
        user: {},
    });
    const validate = () => {
        let valid = true;
        const errors = {
            order: {},
            user: {},
        };
        if (Number.isNaN(Number.parseFloat(orderInfo.amount)) || Number.parseFloat(orderInfo.amount) <= 0) {
            valid = false;
            errors.order.amount = "The fuel amount must be a positive number";
        }
        if (Number.isNaN(Number.parseFloat(orderInfo.deliveryPrice)) || Number.parseFloat(orderInfo.deliveryPrice) < 0) {
            valid = false;
            errors.order.deliveryPrice = "The delivery price must be a nonnegative number";
        }
        if (!userInfo.name) {
            valid = false;
            errors.user.name = "The customer's name is required";
        }
        if (!userInfo.phone) {
            valid = false;
            errors.user.phone = "The customer's phone number is required";
        } else {
            const result = normalizePhone(userInfo.phone, "SDN", true);
            if (result.length < 1) {
                valid = false;
                errors.user.phone = "Please enter a valid phone number";
            } else {
                userInfo.user.phone = result[0];
            }
        }
        setErrors(errors);
        return valid;
    };
    const firestore = useFirestore();
    const fieldValue = useFirestore.FieldValue;
    const onSave = async () => {
        if (validate()) {
            setSaving(true);
            try {
                const customers = firestore.collection("customers");
                const matching = await customers
                    .where("phone", "==", userInfo.phone)
                    .get();
                let customerId = undefined;
                if (matching.empty) {
                    // create a customer account
                    const doc = firestore
                        .collection("customers")
                        .doc();
                    customerId = doc.id;
                    await doc.set({
                        ...userInfo,
                        joinedAt: fieldValue.serverTimestamp(),
                    });
                } else {
                    customerId = matching.docs[0].id;
                }
                firestore.collection('fuelOrders')
                    .doc()
                    .set({
                        ...orderInfo,
                        customerId: customerId,
                        status: "confirmed",
                    });
                setSaved(userInfo);
            } finally {
                setSaving(false);
            }
        }
    };
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <Card
                        title="New Fuel Refill Order"
                        action={
                            <button
                                type="button"
                                onClick={onSave}
                                disabled={saving}
                                className={classNames(
                                    "py-2 px-4 rounded border-0 shadow hover:shadow-md focus:outline-none",
                                    "uppercase font-bold text-xs text-white",
                                    {
                                        "bg-violet-500 hover:bg-violet-400 active:bg-violet-600": !saving,
                                        "bg-trueGray-200": saving,
                                    }
                                )}
                            >
                                Confirm
                          </button>
                        }
                    >
                        <div className="px-4 lg:px-10 pb-10 pt-1 bg-blueGray-100">
                            <form>
                                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                    Customer Information
                                </h6>
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600":
                                                            errors.user.name == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600":
                                                            errors.user.name,
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving,
                                                    }
                                                )}
                                                placeholder="First & Last Name"
                                                name="name"
                                                disabled={saving}
                                                value={userInfo.name}
                                                onChange={handleUserChange}
                                            />
                                            {errors.user.name ? (
                                                <p className="text-xs text-red-600 mt-2 text-right">
                                                    {errors.user.name}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Phone
                                            </label>
                                            <input
                                                type="text"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600":
                                                            errors.user.phone == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600":
                                                            errors.user.phone,
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving,
                                                    }
                                                )}
                                                placeholder="Used For Account Authentication"
                                                name="phone"
                                                disabled={saving}
                                                value={userInfo.phone}
                                                onChange={handleUserChange}
                                            />
                                            {errors.user.phone ? (
                                                <p className="text-xs text-red-600 mt-2 text-right">
                                                    {errors.user.phone}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="w-full px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                City
                                            </label>
                                            <select
                                                type="select"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    "text-blueGray-600",
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving,
                                                    }
                                                )}
                                                name="city"
                                                disabled={saving}
                                                value={userInfo.city}
                                                onChange={handleUserChange}
                                            >
                                                <option value="khartoum">Khartoum</option>
                                                <option value="khartoum-north">Khartoum North</option>
                                                <option value="umdurman">Umdurman</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                    Order Details
                                </h6>
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Fuel
                                             </label>
                                            <select
                                                type="select"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    "text-blueGray-600",
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving,
                                                    }
                                                )}
                                                name="fuelType"
                                                disabled={saving}
                                                value={orderInfo.fuelType}
                                                onChange={handleOrderChange}
                                            >
                                                <option value="benzene">Benzene</option>
                                                <option value="gasoline">Gasoline</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                State
                                             </label>
                                            <select
                                                type="select"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    "text-blueGray-600",
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving,
                                                    }
                                                )}
                                                name="state"
                                                disabled={saving}
                                                value={orderInfo.state}
                                                onChange={handleOrderChange}
                                            >
                                                <option value="benzene">Khartoum</option>
                                                <option value="gasoline">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Amount
                                           </label>
                                            <input
                                                type="string"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600":
                                                            errors.order.amount == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600":
                                                            errors.order.amount,
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving,
                                                    }
                                                )}
                                                name="amount"
                                                disabled={saving}
                                                value={orderInfo.amount}
                                                onChange={handleOrderChange}
                                            />
                                            {errors.order.amount ? (
                                                <p className="text-xs text-red-600 mt-2 text-right">
                                                    {errors.order.amount}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Unit
                                             </label>
                                            <select
                                                type="select"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    "text-blueGray-600",
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving,
                                                    }
                                                )}
                                                name="unit"
                                                disabled={saving}
                                                onChange={handleUnitChange}
                                            >
                                                <option value="liters">Liters</option>
                                                <option value="gallons">Gallons</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Price (SDG)
                                           </label>
                                            <PriceField amount={Number.parseFloat(orderInfo.amount)} fuelType={orderInfo.fuelType} />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Delivery Price
                                           </label>
                                            <input
                                                type="string"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600":
                                                            errors.order.deliveryPrice == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600":
                                                            errors.order.deliveryPrice,
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving,
                                                    }
                                                )}
                                                name="deliveryPrice"
                                                disabled={saving}
                                                value={orderInfo.deliveryPrice}
                                                onChange={handleOrderChange}
                                            />
                                            {errors.order.deliveryPrice ? (
                                                <p className="text-xs text-red-600 mt-2 text-right">
                                                    {errors.order.deliveryPrice}
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {saved ? (
                            <div className="pt-2 pb-1 px-6 rounded-b text-xs text-right bg-violet-500 text-white font-bold">
                                Order has been added as a successfully!
                            </div>
                        ) : null}
                    </Card>
                </div>
            </div>
        </>
    );
}


function PriceField({ fuelType, amount }) {
    const benzeneRate = 115;
    const gasolineRate = 100;
    const rate = fuelType === "benzene"
        ? benzeneRate
        : fuelType === "gasoline"
            ? gasolineRate
            : 0;
    return (
        <input
            type="string"
            className="border-0 px-3 py-3 rounded shadow focus:outline-none w-full focus:ring ease-linear transition-all duration-150 text-sm placeholder-blueGray-300 text-blueGray-600 bg-trueGray-100"
            name="amount"
            disabled={true}
            value={Math.max(0, Math.round(amount * rate)).toFixed(2)}
        />
    );
}