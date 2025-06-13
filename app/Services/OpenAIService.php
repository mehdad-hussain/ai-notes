<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    public function summarizeText(string $content): string
    {
        try {
            // Log that we're attempting to use OpenAI
            Log::info('Attempting to summarize text with OpenAI', [
                'content_length' => strlen($content),
                'api_key_configured' => !empty(config('openai.api_key'))
            ]);

            $response = OpenAI::chat()->create([
                'model' => config('openai.model', 'gpt-4.1-nano-2025-04-14'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a helpful assistant that creates concise summaries of text content. Keep summaries under 100 words.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "Please summarize this text:\n\n" . $content
                    ]
                ],
                'max_tokens' => 150,
            ]);

            Log::info('OpenAI summarization successful');
            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            Log::error('OpenAI summarization failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return "Summary: " . substr($content, 0, 100) . "... [AI summarization temporarily unavailable - " . $e->getMessage() . "]";
        }
    }
    public function summarizeTextStream(string $content)
    {
        try {
            Log::info('Attempting to stream summarize text with OpenAI');

            return OpenAI::chat()->createStreamed([
                'model' => config('openai.model', 'gpt-4.1-nano-2025-04-14'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a helpful assistant that creates concise summaries of text content. Keep summaries under 100 words.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "Please summarize this text:\n\n" . $content
                    ]
                ],
                'max_tokens' => 150,
            ]);
        } catch (\Exception $e) {
            Log::error('OpenAI stream summarization failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            // Return a mock stream for development when API is not available
            return $this->createMockStream("Summary: " . substr($content, 0, 100) . "... [AI summarization temporarily unavailable - " . $e->getMessage() . "]");
        }
    }
    public function improveContent(string $content): string
    {
        try {
            Log::info('Attempting to improve content with OpenAI');

            $response = OpenAI::chat()->create([
                'model' => config('openai.model', 'gpt-4.1-nano-2025-04-14'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a writing assistant that improves text clarity, grammar, and style while maintaining the original meaning and tone.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "Please improve this text:\n\n" . $content
                    ]
                ],
                'max_tokens' => 500,
            ]);

            Log::info('OpenAI content improvement successful');
            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            Log::error('OpenAI content improvement failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return "Improved: " . $content . "\n\n[AI content improvement temporarily unavailable - " . $e->getMessage() . "]";
        }
    }
    public function improveContentStream(string $content)
    {
        try {
            Log::info('Attempting to stream improve content with OpenAI');

            return OpenAI::chat()->createStreamed([
                'model' => config('openai.model', 'gpt-4.1-nano-2025-04-14'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are a writing assistant that improves text clarity, grammar, and style while maintaining the original meaning and tone.'
                    ],
                    [
                        'role' => 'user',
                        'content' => "Please improve this text:\n\n" . $content
                    ]
                ],
                'max_tokens' => 500,
            ]);
        } catch (\Exception $e) {
            Log::error('OpenAI stream content improvement failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            // Return a mock stream for development when API is not available
            return $this->createMockStream("Improved: " . $content . "\n\n[AI content improvement temporarily unavailable - " . $e->getMessage() . "]");
        }
    }
    public function generateTags(string $content): array
    {
        try {
            Log::info('Attempting to generate tags with OpenAI');

            $response = OpenAI::chat()->create([
                'model' => config('openai.model', 'gpt-4.1-nano-2025-04-14'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Generate 3-5 relevant tags for the given content. Return only the tags as a comma-separated list, no explanations.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $content
                    ]
                ],
                'max_tokens' => 50,
            ]);

            $tagsString = $response->choices[0]->message->content;
            $tags = array_map('trim', explode(',', $tagsString));

            Log::info('OpenAI tag generation successful', ['tags' => $tags]);
            return $tags;
        } catch (\Exception $e) {
            Log::error('OpenAI tag generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            // Return mock tags when API is not available
            $words = str_word_count($content, 1);
            $commonWords = array_slice(array_unique($words), 0, 3);
            return array_merge($commonWords, ['ai-demo', 'note', 'error: ' . $e->getMessage()]);
        }
    }

    /**
     * Create a mock stream response for development/testing
     */
    private function createMockStream(string $content)
    {
        // Create a simple generator that yields mock response objects
        return (function () use ($content) {
            $chunks = str_split($content, 10); // Split into chunks of 10 characters
            foreach ($chunks as $chunk) {
                yield (object) [
                    'choices' => [(object) [
                        'delta' => (object) [
                            'content' => $chunk
                        ]
                    ]]
                ];
                // Small delay to simulate streaming
                usleep(100000); // 0.1 seconds
            }
        })();
    }
}
