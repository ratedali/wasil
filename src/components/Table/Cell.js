import classNames from "classnames";
import PropTypes from "prop-types";

export default function Cell({ action = false, children }) {
    return (
        <td className={classNames(
            "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4",
            {
                "text-right": action,
            }
        )}>
            {children}
        </td>
    );
}

Cell.propTypes = {
    action: PropTypes.bool,
}