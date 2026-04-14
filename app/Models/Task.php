<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    //
    protected $table = 'TASKS';
    protected $primaryKey = 'nTaskID';

    protected $fillable = [
        'cTasksTitle',
        'cTasksDescription',
        'bTasksCompleted',
        'dTasksDueDate',
        'list_id'
    ];

    public function list(): BelongsTo
    {
        return $this->belongsTo(TaskList::class, 'list_id');
    }
}
