import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Calendar, List, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

declare function route(name: string, params?: any): string;

interface Task {
    nTaskID: number;
    cTasksTitle: string;
    cTasksDescription: string;
    bTasksCompleted: boolean;
    dTasksDueDate: string | null;
    list_id: number;
    list: {
        nListID: number;
        cListTitle: string;
    };
}

interface List {
    nListID: number;
    cListTitle: string; // fixed: was cListsTitle (extra 's')
}

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    lists: List[];
    filters: {
        search: string;
        filter: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks', // fixed: was '/task'
    },
];

export default function TasksIndex({ tasks, lists, filters, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [completionFilter, setCompletionFilter] = useState<'All' | 'Completed' | 'Pending'>(
        filters.filter as 'All' | 'Completed' | 'Pending'
    );

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const { data, setData, post, put, processing, reset, delete: destroy } = useForm({
        cTasksTitle: '',
        cTasksDescription: '',
        dTasksDueDate: '',
        list_id: '',
        bTasksCompleted: false as boolean,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingTask) {
            put(route('tasks.update', editingTask.nTaskID), {
                onSuccess: () => { setIsOpen(false); reset(); setEditingTask(null); },
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => { setIsOpen(false); reset(); },
            });
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setData({
            cTasksTitle: task.cTasksTitle,
            cTasksDescription: task.cTasksDescription || '',
            dTasksDueDate: task.dTasksDueDate || '',
            list_id: task.list_id.toString(),
            bTasksCompleted: Boolean(task.bTasksCompleted),
        });
        setIsOpen(true);
    };

    const handleDelete = (taskId: number) => {
        destroy(route('tasks.destroy', taskId));
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('tasks.index'), {
            search: searchTerm,
            filter: completionFilter,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleFilterChange = (value: 'All' | 'Completed' | 'Pending') => {
        setCompletionFilter(value);
        router.get(route('tasks.index'), {
            search: searchTerm,
            filter: value,
        }, { preserveState: true, preserveScroll: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('tasks.index'), {
            page,
            search: searchTerm,
            filter: completionFilter,
        }, { preserveState: true, preserveScroll: true });
    };

    return (
        <>
            <Head title='Tasks' />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">

                {/* Toast */}
                {showToast && (
                    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${
                        toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                        {toastType === 'success'
                            ? <CheckCircle2 className="h-5 w-5" />
                            : <XCircle className="h-5 w-5" />
                        }
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                        <p className="text-muted-foreground mt-1">Manage your tasks and stay organized.</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) { reset(); setEditingTask(null); } // reset on close
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                                <DialogDescription>
                                    {editingTask
                                        ? 'Update the details of your task.'
                                        : 'Fill in the details to create a new task.'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cTasksTitle">Title</Label>
                                    <Input
                                        id="cTasksTitle"
                                        value={data.cTasksTitle}
                                        onChange={(e) => setData('cTasksTitle', e.target.value)}
                                        placeholder="Enter task title"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cTasksDescription">Description</Label>
                                    <Textarea
                                        id="cTasksDescription"
                                        value={data.cTasksDescription}
                                        onChange={(e) => setData('cTasksDescription', e.target.value)}
                                        placeholder="Enter task description"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="list_id">List</Label>
                                    <Select value={data.list_id} onValueChange={(value) => setData('list_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a list" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lists.map((list) => (
                                                <SelectItem key={list.nListID} value={list.nListID.toString()}>
                                                    {list.cListTitle} {/* fixed: was cListsTitle */}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dTasksDueDate">Due Date</Label>
                                    <Input
                                        id="dTasksDueDate"
                                        type="date"
                                        value={data.dTasksDueDate}
                                        onChange={(e) => setData('dTasksDueDate', e.target.value)}
                                    />
                                </div>
                                {/* fixed: was a self-closing div causing checkbox/label to float outside form */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="bTasksCompleted"
                                        checked={data.bTasksCompleted}
                                        onChange={(e) => setData('bTasksCompleted', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="bTasksCompleted">Completed</Label>
                                </div>
                                <Button type="submit" disabled={processing} className="w-full">
                                    {editingTask ? 'Update' : 'Create'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </form>
                    <Select value={completionFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Tasks</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">List</th>
                                    {/* fixed: added List column header to match the 6 tds */}
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {tasks.data.map((task) => (
                                    <tr key={task.nTaskID} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{task.cTasksTitle}</td>
                                        <td className="p-4 align-middle max-w-[200px] truncate">
                                            {task.cTasksDescription || 'No description'}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {/* fixed: List column now correctly shows list name */}
                                            <div className="flex items-center gap-2">
                                                <List className="h-4 w-4 text-muted-foreground" />
                                                {task.list?.cListTitle}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {/* fixed: Due Date column now correctly shows due date */}
                                            {task.dTasksDueDate ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    {new Date(task.dTasksDueDate).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">No due date</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {task.bTasksCompleted ? (
                                                <div className="flex items-center gap-2 text-green-500">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span>Completed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-yellow-500">
                                                    <span>Pending</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(task)} className="hover:bg-primary/10 hover:text-primary">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(task.nTaskID)} className="hover:bg-destructive/10 hover:text-destructive">
                                                    {/* fixed: was 'desctructive' typo */}
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {tasks.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                            No tasks found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                        Showing {tasks.from} to {tasks.to} of {tasks.total} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(tasks.current_page - 1)}
                            disabled={tasks.current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: tasks.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === tasks.current_page ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(tasks.current_page + 1)}
                            disabled={tasks.current_page === tasks.last_page}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

            </div>
        </>
    );
}