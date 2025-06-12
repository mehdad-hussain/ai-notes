<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\AIController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('google.callback');

// Protected routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [NoteController::class, 'index'])->name('dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Note routes
    Route::resource('notes', NoteController::class);
    Route::post('/notes/{note}/auto-save', [NoteController::class, 'autoSave'])->name('notes.auto-save');

    // AI routes
    Route::post('/notes/{note}/ai/summarize', [AIController::class, 'summarize'])->name('notes.ai.summarize');
    Route::post('/notes/{note}/ai/improve', [AIController::class, 'improveContent'])->name('notes.ai.improve');
    Route::post('/notes/{note}/ai/tags', [AIController::class, 'generateTags'])->name('notes.ai.tags');
});
