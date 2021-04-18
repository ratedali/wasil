import classNames from "classnames";
import Card from "components/Cards/Card.js";
import normalizePhone from "phone";
import React, { useState } from "react";
import { useFirestore } from "reactfire";

const initialState = {
    name: "",
    phone: "",
    gasolineCapacity: 0,
    benzeneCapacity: 0,
};

export default function NewDriver() {
    const [driverInfo, setDriverInfo] = useState(initialState);
    const handleChange = ({ target: { name, value } }) => setDriverInfo(driverInfo => ({
        ...driverInfo,
        [name]: value
    }));
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(null);
    const [errors, setErrors] = useState({});
    const validate = () => {
        let valid = true;
        const errors = {};
        if (!driverInfo.name) {
            valid = false;
            errors.name = "The driver's name is required";
        }
        if (!driverInfo.phone) {
            valid = false;
            errors.phone = "The driver's phone number is required";
        } else {
            const result = normalizePhone(driverInfo.phone, "SDN", true);
            if (result.length < 1) {
                valid = false;
                errors.phone = "Please enter a valid phone number";
            } else {
                driverInfo.phone = result[0];
            }
        }
        if (!driverInfo.gasolineCapacity && !driverInfo.gasolineCapacity) {
            valid = false;
            errors.capacity = "You need to provide the car's capacity for at least one fuel type";
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
                const drivers = firestore.collection('refillDrivers');
                const matching = await drivers.where('phone', '==', driverInfo.phone).get();
                if (matching.empty) {
                    await firestore.collection('refillDrivers').doc().set({
                        ...driverInfo,
                        available: false,
                        joinedAt: fieldValue.serverTimestamp(),
                    });
                    setSaved(driverInfo);
                    setDriverInfo(initialState);
                } else {
                    setErrors({ phone: 'This phone number is already registered!' });
                }
            } finally {
                setSaving(false);
            }
        }
    };
    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <Card title="New Fuel Refill Driver"
                        action={
                            <button type="button"
                                onClick={onSave}
                                disabled={saving}
                                className={classNames(
                                    "py-2 px-4 rounded border-0 shadow hover:shadow-md focus:outline-none",
                                    "uppercase font-bold text-xs text-white",
                                    {
                                        "bg-violet-500 hover:bg-violet-400 active:bg-violet-600": !saving,
                                        "bg-trueGray-200": saving
                                    },
                                )}>
                                Save
                            </button>
                        }>
                        <div className="px-4 lg:px-10 pb-10 pt-1 bg-blueGray-100">
                            <form>
                                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                    Personal Information
                                </h6>
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Name
                                            </label>
                                            <input type="text"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600": errors.name == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600": errors.name
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving
                                                    },
                                                )}
                                                placeholder="First & Last Name"
                                                name="name"
                                                disabled={saving}
                                                value={driverInfo.name}
                                                onChange={handleChange} />
                                            {errors.name
                                                ? <p className="text-xs text-red-600 mt-2 text-right">{errors.name}</p>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Phone
                                            </label>
                                            <input type="text"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600": errors.phone == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600": errors.phone
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving
                                                    },
                                                )}
                                                placeholder="Used For Account Authentication"
                                                name="phone"
                                                disabled={saving}
                                                value={driverInfo.phone}
                                                onChange={handleChange} />
                                            {errors.phone
                                                ? <p className="text-xs text-red-600 mt-2 text-right">{errors.phone}</p>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                                    Car Information
                                </h6>
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Gasoline Capacity
                                            </label>
                                            <input type="number"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600": errors.capacity == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600": errors.capacity
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving
                                                    },
                                                )}
                                                placeholder="Total Capacity in Liters"
                                                name="gasolineCapacity"
                                                disabled={saving}
                                                value={driverInfo.gasolineCapacity}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Benzene Capacity
                                            </label>
                                            <input type="number"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600": errors.capacity == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600": errors.capacity
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving
                                                    },
                                                )}
                                                placeholder="Total Capacity in Liters"
                                                name="benzeneCapacity"
                                                disabled={saving}
                                                value={driverInfo.benzeneCapacity}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    {errors.capacity
                                        ? (
                                            <div className="w-full px-4">
                                                <p className="text-xs text-red-600 mt-2 text-center">{errors.capacity}</p>
                                            </div>
                                        )
                                        : null}
                                </div>
                            </form>
                        </div>
                        {saved
                            ? (
                                <div className="pt-2 pb-1 px-6 rounded-b text-xs text-right bg-violet-500 text-white font-bold">
                                    {saved.name} has been added as a driver
                                </div>
                            )
                            : null}
                    </Card>
                </div>
            </div>
        </>
    );
}