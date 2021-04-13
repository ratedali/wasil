import React from "react";

import Sidebar from "components/Sidebar/Sidebar.js";

export default function OrderDetails() {
  return (
    <>
      <Sidebar  />
      <div className="relative md:ml-64 bg-red-100">
      <main className="profile-page">
        <section className="relative block h-500-px">
        </section>
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-6/12 px-4 lg:order-2 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <button
                        className="bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        type="button"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-7 pt-8">
                      <div className="mr-20 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                          Status
                        </span>
                        <span className="text-sm text-blueGray-400">
                          Ongoing
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-1">
                  <h5 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    OrderId
                  </h5>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                     Drop Off Location
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-dollar-sign mr-2 text-lg text-blueGray-400"></i>
                     Fee
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-calendar-alt mr-2 text-lg text-blueGray-400"></i>
                     Created At
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-gas-pump mr-2 text-lg text-blueGray-400"></i>
                     Type
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-tachometer-alt mr-2 text-lg text-blueGray-400"></i>
                     Amount
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-user mr-2 text-lg text-blueGray-400"></i>
                     Customer Name
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-truck mr-2 text-lg text-blueGray-400"></i>
                     Driver Name
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      </div>
    </>
  );
}
