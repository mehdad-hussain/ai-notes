export default function Login({ error, message }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome to AI Notes
                    </h2>{" "}
                    <p className="mt-2 text-sm text-gray-600">
                        Your intelligent note-taking companion
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {message}
                    </div>
                )}

                <div className="mt-8 space-y-6">
                    <div className="bg-white py-8 px-6 shadow rounded-lg">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🤖</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Sign in with Google
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Create, edit, and enhance your notes with
                                AI-powered features
                            </p>

                            <a
                                href="/auth/google"
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </a>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                                <div className="text-2xl mb-1">✍️</div>
                                <div>Smart Editing</div>
                            </div>
                            <div>
                                <div className="text-2xl mb-1">🤖</div>
                                <div>AI Enhancement</div>
                            </div>
                            <div>
                                <div className="text-2xl mb-1">💾</div>
                                <div>Auto-Save</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
