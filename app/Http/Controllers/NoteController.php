<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NoteController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $notes = Auth::user()->notes()
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($note) {
                return [
                    'id' => $note->id,
                    'title' => $note->title,
                    'content' => substr(strip_tags($note->content), 0, 150) . '...',
                    'word_count' => $note->word_count,
                    'reading_time' => $note->reading_time,
                    'tags' => $note->tags,
                    'updated_at' => $note->updated_at->diffForHumans(),
                ];
            });

        return Inertia::render('Notes/Index', [
            'notes' => $notes
        ]);
    }

    public function create()
    {
        return Inertia::render('Notes/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $note = new Note($request->all());
        $note->user_id = Auth::id();
        $note->calculateWordCount()->save();

        return redirect()->route('notes.edit', $note->id);
    }

    public function edit(Note $note)
    {
        $this->authorize('update', $note);

        return Inertia::render('Notes/Edit', [
            'note' => $note
        ]);
    }

    public function update(Request $request, Note $note)
    {
        $this->authorize('update', $note);

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $note->update($request->all());
        $note->calculateWordCount()->save();

        return response()->json([
            'message' => 'Note saved successfully',
            'note' => $note
        ]);
    }

    public function destroy(Note $note)
    {
        $this->authorize('delete', $note);

        $note->delete();

        return redirect()->route('notes.index');
    }

    // Auto-save endpoint
    public function autoSave(Request $request, Note $note)
    {
        $this->authorize('update', $note);

        $note->update($request->only(['title', 'content']));
        $note->calculateWordCount()->save();

        return response()->json(['status' => 'saved']);
    }
}
