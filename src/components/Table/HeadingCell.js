import PropTypes from "prop-types";
import classNames from 'classnames';
import { TableColor } from '../Cards/CardTable';
import { useContext } from 'react';

export default function HeadingCell({ children }) {
    const color = useContext(TableColor);
    return (
        <th
            className={classNames(
                "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left",
                {
                    "bg-blueGray-50 text-blueGray-500 border-blueGray-100": color === 'light',
                    "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700": color === 'dark',
                }
            )}
        >
            {children}
        </th>
    );
}

HeadingCell.propTypes = {
    children: PropTypes.string
}