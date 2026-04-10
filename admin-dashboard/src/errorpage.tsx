import {useRouteError } from "react-router-dom";


function ErrorPage() {
    const error = useRouteError();
    console.error("Route error:", error);
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">
                    {error?.status || "Error"}
                </h1>
                <p className="text-gray-500 mb-6">
                    {error?.statusText || error?.message || "Something went wrong"}
                </p>
                <a href="/admin-login" className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Go to Login
                </a>
            </div>
        </div>
    );
}
export default ErrorPage;