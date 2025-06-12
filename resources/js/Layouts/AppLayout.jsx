import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function AppLayout({ children, user }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link
                                href="/dashboard"
                                className="text-xl font-bold text-gray-900"
                            >
                                📝 AI Notes
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href="/notes/create" className="btn-primary">
                                ✨ New Note
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowDropdown(!showDropdown)
                                    }
                                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="font-medium">
                                        {user.name}
                                    </span>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            📊 Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            🚪 Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
