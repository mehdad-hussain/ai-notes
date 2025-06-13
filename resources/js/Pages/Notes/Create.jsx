import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "../../Layouts/AppLayout";

export default function Create({ auth }) {
    const [data, setData] = useState({
        title: "",
        content: "",
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Clear previous errors
        setErrors({});

        console.log("Submitting data:", data); // Debug log

        router.post("/notes", data, {
            onSuccess: () => {
                // Will redirect to edit page
                console.log("Success: Note created successfully");
            },
            onError: (errors) => {
                console.log("Validation errors:", errors);
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };
    return (
        <AppLayout user={auth.user}>
            <div className="max-w-4xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back to Notes
                        </Link>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Create New Note
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Start writing your thoughts and ideas
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card">
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Title
                                </label>{" "}
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title || ""}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter note title..."
                                    required
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Content */}
                            <div>
                                <label
                                    htmlFor="content"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Content
                                </label>{" "}
                                <textarea
                                    id="content"
                                    value={data.content || ""}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            content: e.target.value,
                                        })
                                    }
                                    rows="15"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Start writing your note..."
                                    required
                                />
                                {errors.content && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.content}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>{" "}
                    {/* Actions */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Create Note
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
