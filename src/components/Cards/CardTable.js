import PropTypes from "prop-types";
import React from "react";
import Card from './Card';

export const TableColor = React.createContext("light");

export default function CardTable({ title, color, children }) {
  return (
    <Card title={title}>
      <TableColor.Provider value={color}>
        <table className="items-center w-full bg-transparent border-collapse">
          {children}
        </table>
      </TableColor.Provider>
    </Card>
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
