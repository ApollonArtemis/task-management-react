<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Models\Task;
use App\Models\User;

class TaskList extends Model
{
    //
    protected $table = 'LISTS';
    protected $primaryKey = 'nListID';

    protected $fillable = [
        'cListTitle',
        'cListDescription',
        'user_id'
    ];

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

        public function user(): BelongsTo
    {
        return $this->BelongsTo(User::class);
    }
}
