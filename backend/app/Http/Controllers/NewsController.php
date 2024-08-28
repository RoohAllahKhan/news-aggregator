<?php

namespace App\Http\Controllers;

use App\Services\NewsService;
use App\Services\UserPreferenceService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NewsController extends Controller
{
    protected UserPreferenceService $userPreferenceService;
    protected NewsService $newsService;

    public function __construct(UserPreferenceService $userPreferenceService, NewsService $newsService)
    {
        $this->userPreferenceService = $userPreferenceService;
        $this->newsService = $newsService;
    }
    
    public function fetchNews(Request $request): JsonResponse
    {
        $news = $this->newsService->getNews();

        return response()->json($news);
    }

    // to get news based on user preferences if it exists
    public function fetchPreferedNews(Request $request): JsonResponse
    {
        try {
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            $preferences = $this->userPreferenceService->getByUserId($userId);

            $categories = $preferences->categories->pluck('id')->toArray() ?? [];
            $sources = $preferences->sources->pluck('id')->toArray() ?? [];
            $authors = $preferences->authors->pluck('id')->toArray() ?? [];

            $news = $this->newsService->getPreferedNews($categories, $sources, $authors);

            return response()->json($news);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User preferences not found'], 404);
        }
    }

    // to search news based on keyword, from_date, and to_date
    public function searchNews(Request $request): JsonResponse
    {
        $keyword = $request->query('keyword');
        $fromDate = $request->query('from_date');
        $toDate = $request->query('to_date');
        $category = $request->query('category');
        $source = $request->query('source');

        $articles = $this->newsService->searchNews($keyword, $fromDate, $toDate, $category, $source);

        return response()->json($articles);
    }
}
