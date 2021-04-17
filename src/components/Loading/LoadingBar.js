export default function LoadingBar() {
    return (
        <div className="absolute w-full overflow-hidden h-2 mb-4 text-xs flex bg-purple-200">
            <div className="bg-purple-500 w-1/5 animate-loading"></div>
        </div>
    );
}