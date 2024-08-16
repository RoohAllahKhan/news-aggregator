<?php

namespace App\Services;

use App\Models\News;
use App\Models\Source;
use App\Models\Author;
use App\Models\Category;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class NewsService
{
    public function fetchAndSaveNews(int $count): void
    {
        $guardianData = $this->fetchGuardianNews($count);
        $nytData = $this->fetchNYTimesNews($count);
        $newsApiData = $this->fetchNewsApiOrg($count);

        // Merge all news data
        $newsData = array_merge($guardianData, $nytData, $newsApiData);

        DB::transaction(function () use ($newsData): void {
            foreach ($newsData as $newsItem) {
                $this->saveNewsItem($newsItem);
            }
        });
    }

    protected function fetchGuardianNews(int $count): array
    {
        $response = Http::get(config('integrations.guardian.api_url'), [
            'page-size' => $count,
            'api-key' => config('integrations.guardian.api_key'),
        ]);

        $data = $response->json();
        return $this->formatGuardianResponse($data);
    }

    protected function fetchNYTimesNews(int $count): array
    {
        $response = Http::get(config('integrations.new_york_times.api_url'), [
            'api-key' => config('integrations.new_york_times.api_key'),
        ]);

        $data = $response->json();
        return $this->formatNYTimesResponse($data);
    }

    protected function fetchNewsApiOrg(int $count): array
    {
        $response = Http::get(config('integrations.news_api_org.api_url'), [
            'pageSize' => $count,
            'apiKey' => config('integrations.new_api_org.api_key'),
        ]);

        $data = $response->json();
        return $this->formatNewsApiOrgResponse($data);
    }

    protected function formatGuardianResponse(array $data): array
    {
        return [];
    }

    protected function formatNYTimesResponse(array $data): array
    {
        return [];
    }

    protected function formatNewsApiOrgResponse(array $data): array
    {
        return [];
    }

    protected function saveNewsItem(array $newsItem): void
    {
        $source = Source::updateOrCreate(
            ['name' => $newsItem['source_name']],
            ['url' => $newsItem['source_url']]
        );

        $author = Author::updateOrCreate(
            ['name' => $newsItem['author_name']]
        );

        $category = Category::updateOrCreate(
            ['name' => $newsItem['category_name']]
        );

        News::updateOrCreate(
            ['url' => $newsItem['url']],
            [
                'title' => $newsItem['title'],
                'description' => $newsItem['description'],
                'source_id' => $source->id,
                'author_id' => $author->id,
                'category_id' => $category->id,
                'published_at' => $newsItem['published_at'],
                'image_url' => $newsItem['image_url'],
            ]
        );
    }
}
