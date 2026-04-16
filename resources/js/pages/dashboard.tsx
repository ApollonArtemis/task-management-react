import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Plus,
    CheckCircle,
    Clock,
    List,
    TrendingUp,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

declare function route(name: string, params?: any): string;

interface Props {
    stats?: {
        totalLists: number;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
    };
    recentActivity?: {
        id: number;
        type: 'list' | 'task';
        action: string;
        label: string;
        time: string;
    }[];
}

const breadCrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    stats = {
        totalLists: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
    },
    recentActivity = [],
}: Props) {
    const completionRate =
        stats.totalTasks > 0
            ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
            : 0;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br from-background to-muted/20 p-6">
                {/* ── Row 1: Header ── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Welcome back! Here's your overview.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Link href={route('lists.index')}>
                            <Button className="bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
                                <List className="mr-2 h-4 w-4" />
                                View Lists
                            </Button>
                        </Link>

                        <Link href={route('tasks.index')}>
                            <Button className="bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                View Tasks
                            </Button>
                        </Link>

                        <Link href={route('tasks.create')}>
                            <Button variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Task
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ── Row 2: Stat Cards ── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Lists */}
                    <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-500">
                                Total Lists
                            </CardTitle>
                            <List className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">
                                {stats.totalLists}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Your task lists
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Tasks */}
                    <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-500">
                                Total Tasks
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">
                                {stats.totalTasks}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All your tasks
                            </p>
                        </CardContent>
                    </Card>

                    {/* Pending Tasks */}
                    <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-500">
                                Pending Tasks
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">
                                {stats.pendingTasks}
                            </div>
                            {/* ✅ Fixed typo: "to completed" → "to complete" */}
                            <p className="text-xs text-muted-foreground">
                                Tasks to complete
                            </p>
                        </CardContent>
                    </Card>

                    {/* Completed Tasks */}
                    {/* ✅ Fixed: border-purple-500/20 (was missing /20) */}
                    {/* ✅ Fixed: CheckCircle icon (was AlertCircle — wrong semantic) */}
                    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-500">
                                Completed Tasks
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-500">
                                {stats.completedTasks}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tasks done
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Row 3: Progress Bar ── */}
                {stats.totalTasks > 0 && (
                    <Card className="border-primary/20">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    Overall Progress
                                </CardTitle>
                                <span className="text-sm font-bold text-primary">
                                    {completionRate}%
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-700"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {stats.completedTasks} of {stats.totalTasks}{' '}
                                tasks completed
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* ── Row 4: Quick Actions + Recent Activity ── */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Quick Actions */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                {/* ✅ Fixed: both buttons now have distinct labels */}
                                <Link href={route('lists.index')}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                    >
                                        <span className="flex items-center gap-2">
                                            <List className="h-4 w-4" />
                                            View All Lists
                                        </span>
                                        <ArrowRight className="h-4 w-4 opacity-50" />
                                    </Button>
                                </Link>

                                <Link href={route('tasks.index')}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                    >
                                        <span className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            View All Tasks
                                        </span>
                                        <ArrowRight className="h-4 w-4 opacity-50" />
                                    </Button>
                                </Link>

                                <Link href={route('lists.create')}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            Create New List
                                        </span>
                                        <ArrowRight className="h-4 w-4 opacity-50" />
                                    </Button>
                                </Link>

                                <Link href={route('tasks.create')}>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            Create New Task
                                        </span>
                                        <ArrowRight className="h-4 w-4 opacity-50" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="rounded-full bg-primary/10 p-2">
                                                {item.type === 'list' ? (
                                                    <List className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <CheckCircle className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {item.label}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.action} · {item.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    /* Empty state */
                                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <Sparkles className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Welcome to Task Manager
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Get started by creating your
                                                first list or task
                                            </p>
                                        </div>
                                        <Link href={route('lists.create')}>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="gap-1"
                                            >
                                                <Plus className="h-3 w-3" />
                                                Create your first list
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
