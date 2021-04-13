/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import classNames from 'classnames';

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const links = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'fa-tv',
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: 'fa-users',
    },
    {
      name: 'Drivers',
      path: '/admin/drivers',
      icon: 'fa-car',
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: 'fa-shopping-cart',
    },
    {
      name: 'Maps',
      path: '/admin/maps',
      icon: 'fa-map-marked',
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: 'fa-tools',
    },
  ]
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/"
          >
            WASIL
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    Wasil
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="border-0 px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {links.map(({ name, path, icon }) => {
                const active = window.location.href.indexOf(path) !== -1;
                return (
                  <li className="items-center" key={path}>
                    <Link
                      className={classNames(
                        "text-xs uppercase py-3 font-bold block",
                        {
                          "text-purple-600 hover:text-purple-800": active,
                          "text-blueGray-700 hover:text-blueGray-500": !active
                        },
                      )}
                      to={path}
                    >
                      <i
                        className={classNames(
                          "fas mr-2 text-sm",
                          icon,
                          {
                            "opacity-75": active,
                            "text-blueGray-300": !active
                          },
                        )}
                      ></i>
                      {' '}{name}
                    </Link>
                  </li>
                )
              })}
            </ul>

          </div>
        </div>
      </nav>
    </>
  );
}
