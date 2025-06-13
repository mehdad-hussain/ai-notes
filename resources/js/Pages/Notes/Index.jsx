import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
import AppLayout from "../../Layouts/AppLayout";

export default function Index({ notes, auth }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (noteId, noteTitle) => {
        setNoteToDelete({ id: noteId, title: noteTitle });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!noteToDelete) return;

        setDeleting(true);
        router.delete(`/notes/${noteToDelete.id}`, {
            onFinish: () => {
                setDeleting(false);
                setShowDeleteModal(false);
                setNoteToDelete(null);
            },
        });
    };

    return (
        <AppLayout user={auth.user}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            My Notes
                        </h1>
                        <p className="text-gray-600">
                            <span>{notes.length}</span>
                            <span className="ml-1">
                                {notes.length === 1 ? "note" : "notes"}
                            </span>
                        </p>
                    </div>
                    <Link href="/notes/create" className="btn-primary">
                        ✨ Create New Note
                    </Link>
                </div>
                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
                {/* Notes Grid */}
                {filteredNotes.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-8xl mb-6">📝</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-3">
                            {searchTerm ? "No notes found" : "No notes yet"}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {searchTerm
                                ? "Try adjusting your search terms to find what you're looking for"
                                : "Create your first note to get started with your AI-powered note-taking journey"}
                        </p>
                        {!searchTerm && (
                            <Link
                                href="/notes/create"
                                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
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
                                Create Your First Note
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map((note) => (
                            <div
                                key={note.id}
                                className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-hidden relative flex flex-col h-full"
                            >
                                {/* Card Header */}
                                <div className="p-6 pb-4 flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors h-14 overflow-hidden leading-7">
                                            <span
                                                className={
                                                    note.title.length > 60
                                                        ? "line-clamp-2"
                                                        : ""
                                                }
                                            >
                                                {note.title}
                                            </span>
                                        </h3>
                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                                            <Link
                                                href={`/notes/${note.id}/edit`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit note"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        note.id,
                                                        note.title
                                                    )
                                                }
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete note"
                                            >
                                                <svg
                                                    className="w-4 h-4"
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
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-gray-600 text-sm mb-4 h-12 overflow-hidden leading-4">
                                        <span
                                            className={
                                                note.content.length > 150
                                                    ? "line-clamp-3"
                                                    : ""
                                            }
                                        >
                                            {note.content}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
                                    {/* Tags Section */}
                                    {note.tags && note.tags.length > 0 ? (
                                        <div className="mb-3">
                                            <div className="flex flex-wrap gap-1.5">
                                                {note.tags
                                                    .slice(0, 3)
                                                    .map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                                        >
                                                            <svg
                                                                className="w-2.5 h-2.5 mr-1 opacity-60"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                {note.tags.length > 3 && (
                                                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                                                        +{note.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-3 h-6 flex items-center">
                                            <span className="text-xs text-gray-400 italic">
                                                No tags yet
                                            </span>
                                        </div>
                                    )}

                                    {/* Stats and Date Section */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center text-xs text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">
                                                <svg
                                                    className="w-3.5 h-3.5 mr-1.5 text-blue-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                <span className="font-medium">
                                                    {note.word_count}
                                                </span>
                                                <span className="ml-1">
                                                    words
                                                </span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm">
                                                <svg
                                                    className="w-3.5 h-3.5 mr-1.5 text-green-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <span className="font-medium">
                                                    {note.reading_time}
                                                </span>
                                                <span className="ml-1">
                                                    min
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-400">
                                            <svg
                                                className="w-3 h-3 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {note.updated_at}
                                        </div>
                                    </div>
                                </div>
                                {/* Click overlay for navigation */}
                                <Link
                                    href={`/notes/${note.id}/edit`}
                                    className="absolute inset-0 z-0"
                                    tabIndex="-1"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Note"
                message={`Are you sure you want to delete "${noteToDelete?.title}"? This action cannot be undone and all content will be permanently lost.`}
                confirmText="Delete Note"
                loading={deleting}
            />
        </AppLayout>
    );
}
