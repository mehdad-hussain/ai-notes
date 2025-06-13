<?php

/**
 * Raw PHP Component: Note Analytics Engine
 * 
 * This is a standalone PHP script that analyzes notes without using Laravel framework.
 * It provides advanced statistics and insights about notes content.
 * 
 * Integration: This component can be called from Laravel controllers via exec() 
 * or included as a raw PHP file for performance-critical operations.
 */

class NoteAnalytics
{
    private $pdo;
    private $dbPath;

    public function __construct($dbPath = null)
    {
        $this->dbPath = $dbPath ?: __DIR__ . '/../database/database.sqlite';
        $this->initDatabase();
    }

    private function initDatabase()
    {
        try {
            $this->pdo = new PDO('sqlite:' . $this->dbPath);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            throw new Exception('Database connection failed: ' . $e->getMessage());
        }
    }

    /**
     * Get comprehensive analytics for a user's notes
     */
    public function getUserAnalytics($userId)
    {
        $stats = [
            'total_notes' => $this->getTotalNotes($userId),
            'total_words' => $this->getTotalWords($userId),
            'average_words_per_note' => 0,
            'total_reading_time' => $this->getTotalReadingTime($userId),
            'most_productive_day' => $this->getMostProductiveDay($userId),
            'writing_frequency' => $this->getWritingFrequency($userId),
            'content_analysis' => $this->getContentAnalysis($userId),
            'tag_distribution' => $this->getTagDistribution($userId),
            'recent_activity' => $this->getRecentActivity($userId),
        ];

        if ($stats['total_notes'] > 0) {
            $stats['average_words_per_note'] = round($stats['total_words'] / $stats['total_notes'], 2);
        }

        return $stats;
    }

    /**
     * Analyze content patterns and themes
     */
    public function getContentAnalysis($userId)
    {
        $stmt = $this->pdo->prepare("
            SELECT content, title, created_at 
            FROM notes 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$userId]);
        $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $analysis = [
            'most_common_words' => $this->findMostCommonWords($notes),
            'sentiment_score' => $this->calculateSentimentScore($notes),
            'complexity_score' => $this->calculateComplexityScore($notes),
            'topics' => $this->extractTopics($notes),
        ];

        return $analysis;
    }

    /**
     * Find most common words across all notes
     */
    private function findMostCommonWords($notes)
    {
        $wordCount = [];
        $stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];

        foreach ($notes as $note) {
            $text = strtolower($note['title'] . ' ' . $note['content']);
            $text = preg_replace('/[^a-z\s]/', '', $text);
            $words = array_filter(explode(' ', $text), function ($word) use ($stopWords) {
                return strlen($word) > 3 && !in_array($word, $stopWords);
            });

            foreach ($words as $word) {
                $wordCount[$word] = ($wordCount[$word] ?? 0) + 1;
            }
        }

        arsort($wordCount);
        return array_slice($wordCount, 0, 10, true);
    }

    /**
     * Simple sentiment analysis based on positive/negative word counts
     */
    private function calculateSentimentScore($notes)
    {
        $positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'brilliant', 'perfect', 'outstanding', 'superb', 'marvelous', 'terrific', 'fabulous', 'magnificent', 'spectacular', 'remarkable', 'incredible', 'phenomenal', 'exceptional'];
        $negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'dreadful', 'disgusting', 'appalling', 'atrocious', 'abysmal', 'deplorable', 'ghastly', 'hideous', 'horrendous', 'lousy', 'nasty', 'revolting', 'shocking', 'sickening', 'vile', 'wretched'];

        $positiveCount = 0;
        $negativeCount = 0;
        $totalWords = 0;

        foreach ($notes as $note) {
            $text = strtolower($note['content']);
            $words = str_word_count($text, 1);
            $totalWords += count($words);

            foreach ($words as $word) {
                if (in_array($word, $positiveWords)) {
                    $positiveCount++;
                } elseif (in_array($word, $negativeWords)) {
                    $negativeCount++;
                }
            }
        }

        if ($totalWords === 0) return 0;

        // Score between -1 (very negative) and 1 (very positive)
        return round(($positiveCount - $negativeCount) / $totalWords * 100, 2);
    }

    /**
     * Calculate text complexity based on average sentence length and word length
     */
    private function calculateComplexityScore($notes)
    {
        $totalSentences = 0;
        $totalWords = 0;
        $totalCharacters = 0;

        foreach ($notes as $note) {
            $text = $note['content'];
            $sentences = preg_split('/[.!?]+/', $text, -1, PREG_SPLIT_NO_EMPTY);
            $words = str_word_count($text, 1);

            $totalSentences += count($sentences);
            $totalWords += count($words);
            $totalCharacters += array_sum(array_map('strlen', $words));
        }

        if ($totalSentences === 0 || $totalWords === 0) return 0;

        $avgWordsPerSentence = $totalWords / $totalSentences;
        $avgCharsPerWord = $totalCharacters / $totalWords;

        // Flesch Reading Ease approximation (simplified)
        $complexity = 206.835 - (1.015 * $avgWordsPerSentence) - (84.6 * $avgCharsPerWord / 4.7);
        return round(max(0, min(100, $complexity)), 1);
    }

    /**
     * Extract potential topics using keyword clustering
     */
    private function extractTopics($notes)
    {
        $commonWords = $this->findMostCommonWords($notes);
        $topics = [];

        // Group similar words into topics
        $techWords = ['code', 'programming', 'software', 'development', 'application', 'system', 'database', 'algorithm', 'function', 'variable'];
        $businessWords = ['meeting', 'project', 'client', 'budget', 'deadline', 'strategy', 'goal', 'target', 'revenue', 'profit'];
        $personalWords = ['family', 'friend', 'personal', 'life', 'home', 'relationship', 'feeling', 'emotion', 'thought', 'idea'];

        foreach ($commonWords as $word => $count) {
            if (array_intersect([$word], $techWords)) {
                $topics['Technology'] = ($topics['Technology'] ?? 0) + $count;
            } elseif (array_intersect([$word], $businessWords)) {
                $topics['Business'] = ($topics['Business'] ?? 0) + $count;
            } elseif (array_intersect([$word], $personalWords)) {
                $topics['Personal'] = ($topics['Personal'] ?? 0) + $count;
            } else {
                $topics['General'] = ($topics['General'] ?? 0) + $count;
            }
        }

        arsort($topics);
        return array_slice($topics, 0, 5, true);
    }

    private function getTotalNotes($userId)
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM notes WHERE user_id = ?");
        $stmt->execute([$userId]);
        return (int) $stmt->fetchColumn();
    }

    private function getTotalWords($userId)
    {
        $stmt = $this->pdo->prepare("SELECT SUM(word_count) FROM notes WHERE user_id = ?");
        $stmt->execute([$userId]);
        return (int) $stmt->fetchColumn();
    }

    private function getTotalReadingTime($userId)
    {
        $stmt = $this->pdo->prepare("SELECT SUM(reading_time) FROM notes WHERE user_id = ?");
        $stmt->execute([$userId]);
        return (int) $stmt->fetchColumn();
    }

    private function getMostProductiveDay($userId)
    {
        $stmt = $this->pdo->prepare("
            SELECT strftime('%w', created_at) as day_of_week, COUNT(*) as note_count
            FROM notes 
            WHERE user_id = ? 
            GROUP BY day_of_week 
            ORDER BY note_count DESC 
            LIMIT 1
        ");
        $stmt->execute([$userId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) return 'No data';

        $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return $days[(int)$result['day_of_week']] ?? 'Unknown';
    }

    private function getWritingFrequency($userId)
    {
        $stmt = $this->pdo->prepare("
            SELECT DATE(created_at) as date, COUNT(*) as notes
            FROM notes 
            WHERE user_id = ? AND created_at >= date('now', '-30 days')
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getTagDistribution($userId)
    {
        $stmt = $this->pdo->prepare("SELECT tags FROM notes WHERE user_id = ? AND tags IS NOT NULL");
        $stmt->execute([$userId]);
        $tagCounts = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if ($row['tags']) {
                $tags = json_decode($row['tags'], true);
                if (is_array($tags)) {
                    foreach ($tags as $tag) {
                        $tagCounts[$tag] = ($tagCounts[$tag] ?? 0) + 1;
                    }
                }
            }
        }

        arsort($tagCounts);
        return array_slice($tagCounts, 0, 10, true);
    }

    private function getRecentActivity($userId)
    {
        $stmt = $this->pdo->prepare("
            SELECT title, word_count, created_at, updated_at
            FROM notes 
            WHERE user_id = ? 
            ORDER BY updated_at DESC 
            LIMIT 5
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

// CLI Usage Example
if (php_sapi_name() === 'cli' && isset($argv[1])) {
    $userId = (int) $argv[1];
    $analytics = new NoteAnalytics();

    try {
        $result = $analytics->getUserAnalytics($userId);
        echo json_encode($result, JSON_PRETTY_PRINT);
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        exit(1);
    }
}
