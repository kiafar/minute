<?php

use App\Http\Controllers\TagController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        \Illuminate\Support\Facades\Log::info('User authenticated');
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/tags/manage', function () {
        return Inertia::render('ManageTags', [
            'tags' => auth()->user()->tags,
        ]);
    })->name('tags.manage');

    Route::post('/tags', [TagController::class, 'store_tag'])->name('tags.store');
    Route::put('/tags/{tag}', [TagController::class, 'update_tag'])->name('tags.update');
    Route::delete('/tags/{tag}', [TagController::class, 'delete_tag'])->name('tags.destroy');
    Route::get('/tags', [TagController::class, 'get_tags'])->name('tags.get');

    Route::get('/addnote', function () {
        return Inertia::render('AddNote', []);
    })->name('note.add');
});
