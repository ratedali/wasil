import React from "react";
import PropTypes from "prop-types";
import { createPopper } from "@popperjs/core";
import rejectionReasons from "assets/rejection_reasons.json";

const RejectDropdown = ({ onReasonSelection }) => {
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();
    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "left-start",
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    const handleClick = (reason) => (e) => {
        e.preventDefault();
        closeDropdownPopover();
        onReasonSelection(reason);
    }
    return (
        <>
            <button
                className="mr-2 py-1 px-3 rounded text-red-600 uppercase hover:bg-gray-100 focus:outline-none active:bg-gray-200 transition"
                ref={btnDropdownRef}
                onClick={(e) => {
                    e.preventDefault();
                    dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                }}
            >
                Reject
            </button>
            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? "block " : "hidden ") +
                    "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
                }
            >
                {Object.keys(rejectionReasons).map(reason => (
                    <a
                        href="#pablo"
                        className={
                            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                        }
                        onClick={handleClick(reason)}
                    >
                        {rejectionReasons[reason].short}
                    </a>
                ))}
            </div>
        </>
    );
};

RejectDropdown.defaultProps = {
    onReasonSelection: () => { },
};

RejectDropdown.propTypes = {
    onReasonSelection: PropTypes.func,
};

export default RejectDropdown;
