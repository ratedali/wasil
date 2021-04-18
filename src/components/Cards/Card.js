import classNames from 'classnames';
import PropTypes from "prop-types";
import React from "react";

export default function Card({ title, color, children, action }) {
    return (
        <>
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
                        {action ?? null}
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {children}
                </div>
            </div>
        </>
    );
}

Card.defaultProps = {
    title: "Card",
    color: "light",
};

Card.propTypes = {
    title: PropTypes.element.isRequired,
    color: PropTypes.oneOf(["light", "dark"]),
}