<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\SourceController;
use App\Http\Controllers\UserPreferenceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('sources', [SourceController::class, 'index']);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('authors', [AuthorController::class, 'index']);
    Route::put('user-preference', [UserPreferenceController::class, 'storeOrUpdate']);
    Route::get('user-preference/{userId}', [UserPreferenceController::class, 'show']);
    Route::get('news', [NewsController::class, 'fetchNews']);
    Route::get('news/search', [NewsController::class, 'searchNews']);
});
