import classNames from "classnames";
import AuthContext from "components/AuthContext.js";
import React, { useContext, useState } from "react";
import { useFirestore } from "reactfire";

// components

export default function CardSettings() {
  const firstore = useFirestore();
  const { admin, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  });
  const handleInfoChange = ({ target: { name, value } }) => setInfo(info => ({
    ...info,
    [name]: value,
  }));
  const save = async () => {
    setLoading(true);
    try {
      const results = await firstore
        .collection('staff')
        .where('uid', '==', user.uid)
        .get();
      const doc = results.docs[0];
      await doc.ref.update(info);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">Settings</h6>
            <button
              className={classNames(
                "text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 ease-linear transition-all duration-150",
                {
                  "bg-lightBlue-500 hover:shadow-md ": !loading,
                  "bg-gray-200": loading
                }
              )}
              disabled={loading}
              onClick={save}
              type="button"
            >
              Save
            </button>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              User Information
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    className={classNames(
                      "border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",
                      {
                        "bg-white": !loading,
                        "bg-blueGray-100": loading,
                      }
                    )}
                    disabled={loading}
                    name="username"
                    onChange={handleInfoChange}
                    value={info.username}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    className={classNames(
                      "border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",
                      {
                        "bg-white": !loading,
                        "bg-blueGray-100": loading,
                      }
                    )}
                    disabled={loading}
                    name="email"
                    onChange={handleInfoChange}
                    value={info.email}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    className={classNames(
                      "border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",
                      {
                        "bg-white": !loading,
                        "bg-blueGray-100": loading,
                      }
                    )}
                    disabled={loading}
                    name="firstName"
                    onChange={handleInfoChange}
                    value={info.firstName}
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    className={classNames(
                      "border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150",
                      {
                        "bg-white": !loading,
                        "bg-blueGray-100": loading,
                      }
                    )}
                    disabled={loading}
                    name="lastName"
                    onChange={handleInfoChange}
                    value={info.lastName}
                  />
                </div>
              </div>
            </div>

            {
              admin
                ? (
                  <>
                    <hr className="mt-6 border-b-1 border-blueGray-300" />
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      Pricing
                    </h6>
                    <Pricing />
                  </>
                )
                : null
            }
          </form>
        </div>
      </div>
    </>
  );
}

// TODO use remote config and cloud functions implement this
function Pricing() {
  return (
    <div className="flex flex-wrap">
      <div className="w-full lg:w-6/12 px-4">
        <div className="relative w-full mb-3">
          <label
            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Gasoline <span className="normal-case font-normal text-blueGray-500">(pound / liter)</span>
          </label>
          <input
            type="number"
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            defaultValue={125}
          />
        </div>
      </div>
      <div className="w-full lg:w-6/12 px-4">
        <div className="relative w-full mb-3">
          <label
            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Benzene <span className="normal-case font-normal text-blueGray-500">(pound / liter)</span>
          </label>
          <input
            type="number"
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            defaultValue={150}
          />
        </div>
      </div>
      <div className="w-full lg:w-6/12 px-4">
        <div className="relative w-full mb-3">
          <label
            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Khartoum Delivery <span className="normal-case font-normal text-blueGray-500">(pound / kilometer)</span>
          </label>
          <input
            type="number"
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            defaultValue={50}
          />
        </div>
      </div>
      <div className="w-full lg:w-6/12 px-4">
        <div className="relative w-full mb-3">
          <label
            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Fixed Delivery Fee <span className="normal-case font-normal text-blueGray-500">(outside of Khartoum)</span>
          </label>
          <input
            type="number"
            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            defaultValue={1000}
          />
        </div>
      </div>
    </div>

  );
}