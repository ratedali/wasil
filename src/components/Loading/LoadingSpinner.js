import classNames from "classnames";
import PropTypes from "prop-types";

export default function LoadingSpinner({ height, width, children }) {
    return (
        <>
            <div className={classNames(
                "loader rounded-full border-8 border-t-8 border-gray-200",
                "animate-spin",
                `h-${height} w-${width}`
            )}></div>
            <div className="absolute text-violet-500 uppercase font-bold text-2xl animate-pulse">{children}</div>
        </>

    );
}

LoadingSpinner.defaultProps = {
    height: 16,
    width: 16,
    children: "Loading..."
};

LoadingSpinner.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    children: PropTypes.string,
};