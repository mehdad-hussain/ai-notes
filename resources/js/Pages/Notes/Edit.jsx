import { Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
import AppLayout from "../../Layouts/AppLayout";

export default function Edit({ auth, note }) {
    const [data, setData] = useState({
        title: note.title,
        content: note.content,
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [autoSaving, setAutoSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Auto-save functionality
    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.title.trim() || data.content.trim()) {
                autoSave();
            }
        }, 2000); // Auto-save after 2 seconds of inactivity

        return () => clearTimeout(timer);
    }, [data.title, data.content]);
    const autoSave = async () => {
        if (autoSaving) return;

        setAutoSaving(true);
        try {
            const response = await fetch(`/notes/${note.id}/auto-save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (error) {
            console.error("Auto-save failed:", error);
        } finally {
            setAutoSaving(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.put(`/notes/${note.id}`, data, {
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            },
            onError: (errors) => {
                setErrors(errors);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };
    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setDeleting(true);
        router.delete(`/notes/${note.id}`, {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
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
                    <div className="flex justify-between items-start">
                        <div className="border-l-4 border-green-500 pl-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Edit Note
                            </h1>
                            <div className="flex items-center space-x-4 mt-1">
                                <p className="text-gray-600">
                                    {note.word_count} words •{" "}
                                    {note.reading_time} min read
                                </p>
                                {autoSaving && (
                                    <span className="inline-flex items-center text-sm text-amber-600">
                                        <svg
                                            className="animate-spin -ml-1 mr-1 h-3 w-3"
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
                                        Auto-saving...
                                    </span>
                                )}
                                {saved && (
                                    <span className="inline-flex items-center text-sm text-green-600">
                                        <svg
                                            className="w-3 h-3 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Saved
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete Note
                        </button>
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
                                    rows="20"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
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
                    </div>
                    {/* AI Enhancement Section */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            🤖 AI Enhancement
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                type="button"
                                className="btn-secondary text-center"
                                onClick={() => {
                                    // TODO: Implement AI summarize
                                    alert("AI Summarize feature coming soon!");
                                }}
                            >
                                📝 Summarize
                            </button>
                            <button
                                type="button"
                                className="btn-secondary text-center"
                                onClick={() => {
                                    // TODO: Implement AI improve
                                    alert("AI Improve feature coming soon!");
                                }}
                            >
                                ✨ Improve Writing
                            </button>
                            <button
                                type="button"
                                className="btn-secondary text-center"
                                onClick={() => {
                                    // TODO: Implement AI tags
                                    alert("AI Tags feature coming soon!");
                                }}
                            >
                                🏷️ Generate Tags
                            </button>
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
                            Back to Notes
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                    Saving...
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
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Note"
                message="Are you sure you want to delete this note? This action cannot be undone and all content will be permanently lost."
                confirmText="Delete Note"
                loading={deleting}
            />
        </AppLayout>
    );
}
