import React from "react";

export default function CustomerDetails() {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-5/12 px-4 lg:order-2 lg:text-right lg:self-center">
              <div className="py-6 px-3 mt-32 sm:mt-0">
                <button
                  className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                  type="button">
                  Edit
              </button>
              </div>
            </div>
            <div className="w-full lg:w-7/12 px-4 lg:order-1">
              <div className="flex justify-center py-4 lg:pt-7 pt-8">
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                    22
                  </span>
                  <span className="text-sm text-blueGray-400">
                    Orders
                  </span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                    10L
                  </span>
                  <span className="text-sm text-blueGray-400">
                    Gasoline
                  </span>
                </div>
                <div className="p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                    89L
                  </span>
                  <span className="text-sm text-blueGray-400">
                    Benzene
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-1">
            <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
              Jenna Stones
            </h3>
            <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
              <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{" "}
              Khartoum - Sudan
            </div>
            <div className="mb-2 text-blueGray-600 mt-10">
              <i className="fas fa-phone mr-2 text-lg text-blueGray-400"></i>
              0912345678
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
              Joined at 12-12-2012
            </div>
            <div className="mb-2 text-blueGray-600">
              <i className="fas fa-gas-pump mr-2 text-lg text-blueGray-400"></i>
              Latest Order 10 Liters 5 days ago
            </div>
          </div>
          <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
            Order History List
          </div>
        </div>
      </div>
    </>
  );
}
