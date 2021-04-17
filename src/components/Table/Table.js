import PropTypes from "prop-types";
import React from "react";

export const TableColor = React.createContext("light");

export default function Table({ color, children }) {
    return (
        <TableColor.Provider value={color}>
            <table className="items-center w-full bg-transparent border-collapse">
                {children}
            </table>
        </TableColor.Provider>
    );
}

Table.defaultProps = {
    color: "light",
};

Table.propTypes = {
    color: PropTypes.oneOf(["light", "dark"])
}