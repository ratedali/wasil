import PropTypes from "prop-types";
import LoadingSpinner from './LoadingSpinner.js';

export default function LoadingPage({ text }) {
    return (
        <div className="w-full mx-auto flex justify-center items-center" style={{ height: '100vh' }}>
            <LoadingSpinner width={64} height={64}>
                {text}
            </LoadingSpinner>
        </div>
    );
}

LoadingPage.defaultProps = {
    text: "Loading...",
};

LoadingPage.propTypes = {
    text: PropTypes.string,
};