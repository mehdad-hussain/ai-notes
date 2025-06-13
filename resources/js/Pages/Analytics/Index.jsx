import { useState } from "react";
import AppLayout from "../../Layouts/AppLayout";

export default function Index({
    auth,
    analytics: initialAnalytics,
    error: initialError,
}) {
    const [analytics, setAnalytics] = useState(initialAnalytics);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(initialError);

    if (loading) {
        return (
            <AppLayout user={auth.user}>
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <svg
                            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
                        <p className="text-gray-600">Analyzing your notes...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout user={auth.user}>
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <svg
                                className="h-6 w-6 text-red-600 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="text-red-800 font-medium">
                                    Analytics Error
                                </h3>
                                <p className="text-red-700 text-sm mt-1">
                                    {error}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={fetchAnalytics}
                            className="mt-4 btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout user={auth.user}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            📊 Note Analytics
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Deep insights into your writing patterns
                        </p>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            🔧 Powered by Raw PHP Analytics Engine
                        </span>
                    </div>
                </div>

                {analytics && (
                    <div className="space-y-6">
                        {/* Overview Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="card text-center">
                                <div className="text-3xl font-bold text-blue-600">
                                    {analytics.total_notes}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Total Notes
                                </div>
                            </div>
                            <div className="card text-center">
                                <div className="text-3xl font-bold text-green-600">
                                    {analytics.total_words?.toLocaleString()}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Total Words
                                </div>
                            </div>
                            <div className="card text-center">
                                <div className="text-3xl font-bold text-purple-600">
                                    {analytics.average_words_per_note}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Avg Words/Note
                                </div>
                            </div>
                            <div className="card text-center">
                                <div className="text-3xl font-bold text-orange-600">
                                    {analytics.total_reading_time}
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Total Reading Time (min)
                                </div>
                            </div>
                        </div>

                        {/* Writing Patterns */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Most Productive Day */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    📅 Writing Patterns
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-600">
                                            Most Productive Day:
                                        </span>
                                        <span className="ml-2 font-medium text-blue-600">
                                            {analytics.most_productive_day}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Analysis */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    🧠 Content Quality
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-600">
                                            Sentiment Score:
                                        </span>
                                        <span
                                            className={`ml-2 font-medium ${
                                                analytics.content_analysis
                                                    ?.sentiment_score >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {
                                                analytics.content_analysis
                                                    ?.sentiment_score
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">
                                            Readability Score:
                                        </span>
                                        <span className="ml-2 font-medium text-blue-600">
                                            {
                                                analytics.content_analysis
                                                    ?.complexity_score
                                            }
                                            /100
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Most Common Words */}
                        {analytics.content_analysis?.most_common_words && (
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    🔤 Most Common Words
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(
                                        analytics.content_analysis
                                            .most_common_words
                                    ).map(([word, count]) => (
                                        <span
                                            key={word}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                        >
                                            {word}{" "}
                                            <span className="ml-1 text-xs bg-blue-200 px-1 rounded">
                                                {count}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Topics Distribution */}
                        {analytics.content_analysis?.topics && (
                            <div className="card">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    📋 Topic Distribution
                                </h3>
                                <div className="space-y-2">
                                    {Object.entries(
                                        analytics.content_analysis.topics
                                    ).map(([topic, count]) => (
                                        <div
                                            key={topic}
                                            className="flex items-center"
                                        >
                                            <span className="w-20 text-sm text-gray-600">
                                                {topic}:
                                            </span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${
                                                            (count /
                                                                Math.max(
                                                                    ...Object.values(
                                                                        analytics
                                                                            .content_analysis
                                                                            .topics
                                                                    )
                                                                )) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="ml-2 text-sm font-medium text-gray-900">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tag Distribution */}
                        {analytics.tag_distribution &&
                            Object.keys(analytics.tag_distribution).length >
                                0 && (
                                <div className="card">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        🏷️ Tag Usage
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(
                                            analytics.tag_distribution
                                        ).map(([tag, count]) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                                            >
                                                #{tag}{" "}
                                                <span className="ml-1 text-xs bg-green-200 px-1 rounded">
                                                    {count}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* Recent Activity */}
                        {analytics.recent_activity &&
                            analytics.recent_activity.length > 0 && (
                                <div className="card">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        ⚡ Recent Activity
                                    </h3>
                                    <div className="space-y-3">
                                        {analytics.recent_activity.map(
                                            (note, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {note.title}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {note.word_count}{" "}
                                                            words
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(
                                                            note.updated_at
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
