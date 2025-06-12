<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'tags',
        'ai_summary',
        'word_count',
        'reading_time',
        'user_id',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function calculateWordCount()
    {
        $this->word_count = str_word_count(strip_tags($this->content));
        $this->reading_time = max(1, ceil($this->word_count / 200)); // 200 words per minute
        return $this;
    }
}
