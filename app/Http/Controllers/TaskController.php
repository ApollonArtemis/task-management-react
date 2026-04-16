<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TaskList;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $query = Task::with('list')
            ->whereHas('list', function ($query) {
                $query->where('user_id', auth()->id());
            })->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('cTasksTitle', 'like', "%{$search}%")
                    ->orWhere('cTasksDescription', 'like', "%{$search}%");
            });
        }
        if ($request->has('filter') && request('filter') !== 'all') {
            $query->where('bTasksCompleted', request('filter') === 'Completed');
        }

        $tasks = $query->paginate(10);
        $lists = TaskList::where('user_id', auth()->id())->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'lists' => $lists,
            'filters' => [
                'search' => request('search', ''),
                'filter' => request('filter', ''),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'cTasksTitle' => 'required|string|max:255',
            'cTasksDescription' => 'nullable|string',
            'dTasksDueDate' => 'nullable|date',
            'list_id' => 'required|exists:LISTS,nListID',
            'bTasksCompleted' => 'boolean'
        ]);

        Task::create($validated);

        return redirect()->route('tasks.index')->with('success', 'Task created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        //
        $validated = $request->validate([
            'cTasksTitle' => 'required|string|max:255',
            'cTasksDescription' => 'nullable|string',
            'dTasksDueDate' => 'nullable|date',
            'list_id' => 'required |exists:lists,nListID',
            'bTasksCompleted' => 'boolean'
        ]);

        $task->update($validated);

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
        $task->delete();
        return redirect()->route('tasks.index')->with('success', 'Tasks deleted successfully');
    }
}
