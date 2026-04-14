<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;
use App\Http\Controllers\ListController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::resource('lists', ListController::class);
//     Route::inertia('dashboard', 'dashboard')->name('dashboard');
// });

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('lists', ListController::class);
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
