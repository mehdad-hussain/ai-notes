<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;

class OpenAIService
{
    public function summarizeText(string $content): string
    {
        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo',
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

            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            return "Summary: " . substr($content, 0, 100) . "... [AI summarization temporarily unavailable]";
        }
    }
    public function summarizeTextStream(string $content)
    {
        try {
            return OpenAI::chat()->createStreamed([
                'model' => 'gpt-3.5-turbo',
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
            // Return a mock stream for development when API is not available
            return $this->createMockStream("Summary: " . substr($content, 0, 100) . "... [AI summarization temporarily unavailable]");
        }
    }
    public function improveContent(string $content): string
    {
        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo',
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

            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            return "Improved: " . $content . "\n\n[AI content improvement temporarily unavailable]";
        }
    }
    public function improveContentStream(string $content)
    {
        try {
            return OpenAI::chat()->createStreamed([
                'model' => 'gpt-3.5-turbo',
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
            // Return a mock stream for development when API is not available
            return $this->createMockStream("Improved: " . $content . "\n\n[AI content improvement temporarily unavailable]");
        }
    }
    public function generateTags(string $content): array
    {
        try {
            $response = OpenAI::chat()->create([
                'model' => 'gpt-3.5-turbo',
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
            return array_map('trim', explode(',', $tagsString));
        } catch (\Exception $e) {
            // Return mock tags when API is not available
            $words = str_word_count($content, 1);
            $commonWords = array_slice(array_unique($words), 0, 3);
            return array_merge($commonWords, ['ai-demo', 'note']);
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
