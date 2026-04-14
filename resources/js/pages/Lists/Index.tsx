import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
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
import { useForm } from '@inertiajs/react';

declare function route(name: string, params?: any): string;

// ListsIndex.layout = {
//     breadcrumbs: [
//         {
//             title: 'Lists',
//             href: '/lists',
//         },
//     ],
// };

interface List {
    nListID: number;
    cListTitle: string;
    cListDescription: string | null;
    tasks_count?: number;
}

interface Props {
    lists: List[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lists',
        href: '/lists',
    },
];

export default function ListsIndex({ lists, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingList, setEditingList] = useState<List | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

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
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        delete: destroy,
    } = useForm({
        cListTitle: '',
        cListDescription: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingList) {
            put(route('lists.update', editingList.nListID), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingList(null);
                },
            });
        } else {
            post(route('lists.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (list: List) => {
        setEditingList(list);
        setData({
            cListTitle: list.cListTitle,
            cListDescription: list.cListDescription || '',
        });
        setIsOpen(true);
    };

    const handleDelete = (listId: number) => {
        destroy(route('lists.destroy', listId));
    };

    return (
        <>
            <Head title="Lists" />
            <div className="flex h-full flex-2 flex-col gap-4 rounded-xl p-4">

                {/*Show Toast Message */}
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} animate-in text-white slide-in-from-top-5 fade-in`}
                    >
                        {toastType === 'success' ? (
                            <CheckCircle2 className="h-5 w-5" />
                        ) : (
                            <XCircle className="h-5 w-5" />
                        )}
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Create New List */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Lists</h1>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New List
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingList
                                        ? 'Edit List'
                                        : 'Create New List'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingList
                                        ? 'Update your list details.'
                                        : 'Fill in the details for your new list.'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cListTitle">Title</Label>
                                    <Input
                                        id="cListTitle"
                                        value={data.cListTitle}
                                        onChange={(e) =>
                                            setData(
                                                'cListTitle',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cListDescription">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="cListDescription"
                                        value={data.cListDescription}
                                        onChange={(e) =>
                                            setData(
                                                'cListDescription',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <Button type="submit" disabled={processing}>
                                    {editingList ? 'Updated' : 'Create'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Display Lists */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {lists.map((list) => (
                        <Card
                            key={list.nListID}
                            className="transition-colors hover:bg-accent/50"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">
                                    {list.cListTitle}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(list)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleDelete(list.nListID)
                                        }
                                        className="text-destructive hover:text-destructive/90"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    {list.cListDescription || 'No description'}
                                </p>
                                {list.tasks_count !== undefined && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {list.tasks_count} tasks
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
