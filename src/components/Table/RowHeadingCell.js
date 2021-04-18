import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useContext } from 'react';
import { TableColor } from './Table.js';

export default function RowHeadingCell({ avatar, children }) {
    const color = useContext(TableColor);
    return (
        <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
            {avatar
                ? (
                    <img
                        src={require("assets/img/bootstrap.jpg").default}
                        className="inline-block h-12 w-12 bg-white rounded-full border"
                        alt="..."
                    ></img>
                )
                : null
            }
            <span
                className={classNames(
                    "ml-3 font-bold",
                    {
                        "text-blueGray-600": color === "light",
                        "text-white": color === "dark"
                    }
                )}
            >
                {avatar ? " " : null}{children}
            </span>
        </th>
    );
}

RowHeadingCell.propTypes = {
    avatar: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
}