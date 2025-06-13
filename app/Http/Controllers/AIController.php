<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AIController extends Controller
{
    use AuthorizesRequests;

    protected $openAIService;

    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

    public function summarize(Request $request, Note $note)
    {
        $this->authorize('update', $note);

        return new StreamedResponse(function () use ($note) {
            try {
                $stream = $this->openAIService->summarizeTextStream($note->content);
                $fullSummary = '';

                foreach ($stream as $response) {
                    $content = $response->choices[0]->delta->content ?? '';
                    if ($content) {
                        $fullSummary .= $content;
                        echo "data: " . json_encode(['content' => $content]) . "\n\n";
                        ob_flush();
                        flush();
                    }
                }

                // Update note with complete summary
                $note->update(['ai_summary' => $fullSummary]);
                echo "data: " . json_encode(['complete' => true, 'summary' => $fullSummary]) . "\n\n";
            } catch (\Exception $e) {
                echo "data: " . json_encode(['error' => 'Failed to generate summary: ' . $e->getMessage()]) . "\n\n";
            }
        }, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
        ]);
    }

    public function improveContent(Request $request, Note $note)
    {
        $this->authorize('update', $note);

        return new StreamedResponse(function () use ($note) {
            try {
                $stream = $this->openAIService->improveContentStream($note->content);
                $fullImproved = '';

                foreach ($stream as $response) {
                    $content = $response->choices[0]->delta->content ?? '';
                    if ($content) {
                        $fullImproved .= $content;
                        echo "data: " . json_encode(['content' => $content]) . "\n\n";
                        ob_flush();
                        flush();
                    }
                }

                echo "data: " . json_encode(['complete' => true, 'improved' => $fullImproved]) . "\n\n";
            } catch (\Exception $e) {
                echo "data: " . json_encode(['error' => 'Failed to improve content: ' . $e->getMessage()]) . "\n\n";
            }
        }, 200, [
            'Content-Type' => 'text/plain',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
        ]);
    }

    public function generateTags(Request $request, Note $note)
    {
        $this->authorize('update', $note);

        try {
            $tags = $this->openAIService->generateTags($note->title . ' ' . $note->content);

            $note->update(['tags' => $tags]);

            // Always return JSON response since frontend is making AJAX call
            return response()->json([
                'success' => true,
                'message' => 'Tags generated successfully',
                'tags' => $tags
            ]);
        } catch (\Exception $e) {
            Log::error('Tag generation failed in controller', [
                'error' => $e->getMessage(),
                'note_id' => $note->id
            ]);

            // Always return JSON error response
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate tags: ' . $e->getMessage()
            ], 500);
        }
    }
}
