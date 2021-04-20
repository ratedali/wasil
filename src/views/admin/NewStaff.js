import classNames from "classnames";
import Card from "components/Cards/Card.js";
import React, { useState } from "react";
import { useFirestore } from "reactfire";

const initialState = {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    admin: false,
};

export default function NewStaff() {
    const [info, setInfo] = useState(initialState);
    const handleChange = ({ target: { name, value } }) => setInfo(info => ({
        ...info,
        [name]: value
    }));
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(null);
    const [errors, setErrors] = useState({});
    const validate = () => {
        let valid = true;
        const errors = {};
        if (!info.username) {
            valid = false;
            errors.username = "The username field is required";
        } else if (!/^[A-Za-z0-9_]*$/.test(info.username)) {
            valid = false;
            errors.username = "The username can only contain alphanumeric characters and undersocres";
        }
        if (!info.email) {
            valid = false;
            errors.email = "The email field is required";
        }
        if (!info.password) {
            valid = false;
            errors.password = "The password field is required";
        } else if (info.password.length < 6) {
            valid = false;
            errors.password = "The password must consist of at least 6 characters";
        }
        if (!info.firstName) {
            valid = false;
            errors.firstName = "The first name field is required";
        }
        if (!info.lastName) {
            valid = false;
            errors.lastName = "The last name field is required";
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
                const staff = firestore.collection('staff');
                const [matchingEmail, matchingUsername] = await Promise.all([
                    staff.where('email', '==', info.email).get(),
                    staff.where('username', '==', info.username).get(),
                ]);
                if (matchingEmail.empty && matchingUsername.empty) {
                    await firestore.collection('refillDrivers').doc().set({
                        ...info,
                        available: false,
                        createdAt: fieldValue.serverTimestamp(),
                    });
                    setSaved(info);
                    setInfo(initialState);
                } else if (!matchingEmail.empty) {
                    setErrors({ email: 'This email is already registered!' });
                } else if (!matchingUsername.empty) {
                    setErrors({ username: 'This username is in use!' });
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
                    <Card title="New Staff Member"
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
                                <div className="flex flex-wrap pt-6">
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Username
                                            </label>
                                            <input type="text"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600": errors.username == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600": errors.username
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving
                                                    },
                                                )}
                                                placeholder="Username"
                                                name="username"
                                                disabled={saving}
                                                value={info.username}
                                                onChange={handleChange} />
                                            {errors.username
                                                ? <p className="text-xs text-red-600 mt-2 text-right">{errors.username}</p>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Administrator
                                            </label>
                                            <input type="checkbox"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    "placeholder-blueGray-300 text-blueGray-600",
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving
                                                    },
                                                )}
                                                name="admin"
                                                disabled={saving}
                                                value={info.admin}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Email
                                            </label>
                                            <input type="email"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600": errors.email == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600": errors.email
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving
                                                    },
                                                )}
                                                placeholder="someone@domain.tld"
                                                name="email"
                                                disabled={saving}
                                                value={info.email}
                                                onChange={handleChange} />
                                            {errors.email
                                                ? <p className="text-xs text-red-600 mt-2 text-right">{errors.email}</p>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Password
                                            </label>
                                            <input type="password"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600": errors.password == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600": errors.password
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving
                                                    },
                                                )}
                                                name="password"
                                                disabled={saving}
                                                value={info.password}
                                                onChange={handleChange} />
                                            {errors.password
                                                ? <p className="text-xs text-red-600 mt-2 text-right">{errors.password}</p>
                                                : null}
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                First Name
                                            </label>
                                            <input type="text"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600": errors.firstName == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600": errors.firstName
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving
                                                    },
                                                )}
                                                placeholder="John"
                                                name="firstName"
                                                disabled={saving}
                                                value={info.firstName}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                                                Last Name
                                            </label>
                                            <input type="text"
                                                className={classNames(
                                                    "border-0 px-3 py-3 rounded shadow focus:outline-none w-full",
                                                    "focus:ring ease-linear transition-all duration-150",
                                                    "text-sm",
                                                    {
                                                        "placeholder-blueGray-300 text-blueGray-600": errors.lastName == null,
                                                        "ring ring-red-500 focus:ring-red-500 placeholder-red-300 text-red-600": errors.lastName
                                                    },
                                                    {
                                                        "bg-white": !saving,
                                                        "bg-trueGray-100": saving
                                                    },
                                                )}
                                                placeholder="Doe"
                                                name="lastName"
                                                disabled={saving}
                                                value={info.lastName}
                                                onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {saved
                            ? (
                                <div className="pt-2 pb-1 px-6 rounded-b text-xs text-right bg-violet-500 text-white font-bold">
                                    {saved.username} has been added as staff
                                </div>
                            )
                            : null}
                    </Card>
                </div>
            </div>
        </>
    );
}