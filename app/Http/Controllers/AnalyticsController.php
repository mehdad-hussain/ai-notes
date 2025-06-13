<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        try {
            // Include the raw PHP component
            require_once base_path('raw-php/note-analytics.php');
            $analytics = new \NoteAnalytics(database_path('database.sqlite'));
            $result = $analytics->getUserAnalytics($userId);

            return Inertia::render('Analytics/Index', [
                'analytics' => $result
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Analytics/Index', [
                'analytics' => null,
                'error' => 'Failed to generate analytics: ' . $e->getMessage()
            ]);
        }
    }

    public function getUserAnalytics()
    {
        $userId = Auth::id();

        // Include the raw PHP component
        require_once base_path('raw-php/note-analytics.php');
        try {
            $analytics = new \NoteAnalytics(database_path('database.sqlite'));
            $result = $analytics->getUserAnalytics($userId);

            return Inertia::render('Analytics/Index', [
                'analytics' => $result
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['analytics_error' => 'Failed to generate analytics: ' . $e->getMessage()]);
        }
    }

    public function getAnalyticsViaCLI()
    {
        $userId = Auth::id();

        // Alternative approach: Execute raw PHP script via CLI
        $scriptPath = base_path('raw-php/note-analytics.php');
        $command = "php \"{$scriptPath}\" {$userId}";

        $output = shell_exec($command);
        if ($output) {
            $result = json_decode($output, true);
            return Inertia::render('Analytics/CLI', [
                'analytics' => $result ?: ['error' => 'Invalid JSON output']
            ]);
        }

        return back()->withErrors(['analytics_error' => 'Failed to execute analytics script']);
    }
}
