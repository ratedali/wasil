import classNames from "classnames";
import React from "react";

export default function TablePagination({ onNext, onPrev, current, total }) {
    const firstPage = current === 1;
    const lastPage = current === total;
    return (
        <div className="w-full py-4 px-8 flex items-center justify-end">
            <button
                type="button"
                className={classNames(
                    "py-2 px-4 rounded-full border-0 focus:outline-none text-xs",
                    {
                        "text-gray-300": firstPage,
                        "text-gray-500 hover:bg-violet-100 active:bg-violet-200": !firstPage,
                    }
                )}
                disabled={firstPage}
                onClick={onPrev}>
                <i className="fas fa-chevron-left"></i>
            </button>
            <div className="mx-16 text-xs">{current} of {total}</div>
            <button
                type="button"
                className={classNames(
                    "py-2 px-4 rounded-full border-0 focus:outline-none text-xs",
                    {
                        "text-gray-500 hover:bg-violet-100 active:bg-violet-200": !lastPage,
                        "text-gray-300": lastPage,
                    }
                )}
                disabled={lastPage}
                onClick={onNext}>
                <i className="fas fa-chevron-right"></i>
            </button>
        </div>
    );
}