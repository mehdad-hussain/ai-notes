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
    const [aiProcessing, setAiProcessing] = useState(null); // Track which AI operation is running
    const [aiResult, setAiResult] = useState(""); // Store AI results
    const [showAiResult, setShowAiResult] = useState(false); // Show AI result modal
    const [lastAiOperation, setLastAiOperation] = useState(null); // Track the last completed AI operation

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
    }; // AI Enhancement Functions with Streaming
    const handleAiSummarize = async () => {
        if (!data.content.trim()) {
            alert("Please add some content before summarizing.");
            return;
        }

        setAiProcessing("summarize");
        setAiResult(""); // Clear previous result
        setShowAiResult(true); // Show modal immediately

        try {
            const response = await fetch(`/notes/${note.id}/ai/summarize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to start summarization");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop(); // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.content) {
                                setAiResult((prev) => prev + data.content);
                            } else if (data.complete) {
                                // Summary is complete
                                break;
                            } else if (data.error) {
                                throw new Error(data.error);
                            }
                        } catch (e) {
                            console.error("Error parsing streaming data:", e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("AI Summarize failed:", error);
            setAiResult("Failed to generate summary. Please try again.");
        } finally {
            setAiProcessing(null);
            setLastAiOperation("summarize");
        }
    };

    const handleAiImprove = async () => {
        if (!data.content.trim()) {
            alert("Please add some content before improving.");
            return;
        }

        setAiProcessing("improve");
        setAiResult(""); // Clear previous result
        setShowAiResult(true); // Show modal with loading state

        try {
            const response = await fetch(`/notes/${note.id}/ai/improve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to start content improvement");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.content) {
                                setAiResult((prev) => prev + data.content);
                            } else if (data.complete) {
                                break;
                            } else if (data.error) {
                                throw new Error(data.error);
                            }
                        } catch (e) {
                            console.error("Error parsing streaming data:", e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("AI Improve failed:", error);
            setAiResult("Failed to improve content. Please try again.");
        } finally {
            setAiProcessing(null);
            setLastAiOperation("improve");
        }
    };

    const handleAiTags = async () => {
        if (!data.content.trim() && !data.title.trim()) {
            alert("Please add some content or title before generating tags.");
            return;
        }
        setAiProcessing("tags");
        setAiResult(""); // Clear previous result
        setShowAiResult(true); // Show modal immediately

        try {
            const response = await fetch(`/notes/${note.id}/ai/tags`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
            });

            if (response.ok) {
                const result = await response.json();
                setAiResult(
                    `Generated tags: ${result.tags.join(
                        ", "
                    )}\n\nTags have been saved to your note.`
                );
                // Note: Don't reload the page anymore - let user see the result in modal
            } else {
                throw new Error("Failed to generate tags");
            }
        } catch (error) {
            console.error("AI Tags failed:", error);
            setAiResult("Failed to generate tags. Please try again.");
        } finally {
            setAiProcessing(null);
            setLastAiOperation("tags");
        }
    };
    const applyImprovedContent = () => {
        if (aiResult && aiProcessing !== "tags") {
            setData({
                ...data,
                content: aiResult,
            });
            setShowAiResult(false);
            setAiResult("");
        }
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
                                )}{" "}
                            </div>
                        </div>
                    </div>
                    {/* Tags Section */}
                    {note.tags && note.tags.length > 0 && (
                        <div className="card">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">
                                        🏷️ Tags
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        Generated by AI
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {note.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* AI Enhancement Section */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            🤖 AI Enhancement
                        </h3>{" "}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                type="button"
                                className="btn-secondary text-center"
                                onClick={handleAiSummarize}
                                disabled={aiProcessing === "summarize"}
                            >
                                {aiProcessing === "summarize" ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 inline"
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
                                        Summarizing...
                                    </>
                                ) : (
                                    "📝 Summarize"
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary text-center"
                                onClick={handleAiImprove}
                                disabled={aiProcessing === "improve"}
                            >
                                {aiProcessing === "improve" ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 inline"
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
                                        Improving...
                                    </>
                                ) : (
                                    "✨ Improve Writing"
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary text-center"
                                onClick={handleAiTags}
                                disabled={aiProcessing === "tags"}
                            >
                                {aiProcessing === "tags" ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 inline"
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
                                        Generating...
                                    </>
                                ) : (
                                    "🏷️ Generate Tags"
                                )}
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

            {/* AI Result Modal */}
            {showAiResult && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    🤖 AI Result
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowAiResult(false);
                                        setAiResult("");
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="mb-4">
                                {aiProcessing ? (
                                    <div className="flex items-center justify-center py-8">
                                        <svg
                                            className="animate-spin h-8 w-8 text-blue-600"
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
                                        <span className="ml-2 text-gray-600">
                                            Processing with AI...
                                        </span>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono max-h-96 overflow-y-auto">
                                            {aiResult}
                                        </pre>
                                    </div>
                                )}
                            </div>{" "}
                            {!aiProcessing && aiResult && (
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => {
                                            setShowAiResult(false);
                                            setAiResult("");
                                        }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                    >
                                        Close
                                    </button>

                                    <div className="flex space-x-2">
                                        {/* Show Apply button for summarize and improve features */}
                                        {aiProcessing === null &&
                                            aiResult &&
                                            lastAiOperation &&
                                            (lastAiOperation === "summarize" ||
                                                lastAiOperation ===
                                                    "improve") && (
                                                <button
                                                    onClick={
                                                        applyImprovedContent
                                                    }
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Apply to Note
                                                </button>
                                            )}

                                        {/* Show Refresh button for tags feature */}
                                        {aiProcessing === null &&
                                            aiResult &&
                                            lastAiOperation === "tags" &&
                                            aiResult.includes(
                                                "Generated tags:"
                                            ) && (
                                                <button
                                                    onClick={() =>
                                                        window.location.reload()
                                                    }
                                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    Refresh Page
                                                </button>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
