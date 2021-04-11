import classNames from 'classnames';
import PropTypes from "prop-types";
import React from "react";

export const TableColor = React.createContext("light");

export default function CardTable({ title, color, children }) {
  return (
    <>
      <TableColor.Provider value={color}>
        <div
          className={classNames(
            "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded",
            {
              "bg-white": color === "light",
              "bg-lightBlue-900 text-white": color === "dark",
            }
          )}
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3
                  className={classNames(
                    "font-semibold text-lg",
                    {
                      "text-blueGray-700": color === "light",
                      "text-white": color === "dark"
                    }
                  )}
                >
                  {title}
                </h3>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            {/* Projects table */}
            <table className="items-center w-full bg-transparent border-collapse">
              {children}
            </table>
          </div>
        </div>
      </TableColor.Provider>
    </>
  );
}

CardTable.defaultProps = {
  title: "Table",
  color: "light",
};

CardTable.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["light", "dark"]),
  children: PropTypes.any,
};
