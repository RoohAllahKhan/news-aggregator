<?php

namespace App\Services;

use App\Models\News;
use App\Models\Source;
use App\Models\Author;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class NewsService
{
    public function fetchAndSaveNews(): void
    {
        $guardianData = $this->fetchGuardianNews(1);
        $nytData = $this->fetchNYTimesNews(1);
        $newsApiData = $this->fetchNewsApiOrg(1);
        $newsData = array_merge($guardianData, $nytData, $newsApiData);

        $this->saveNews($newsData);
    }

    protected function fetchGuardianNews(int $page): array | null
    {
        $response = Http::get(config('integrations.guardian.api_url'), [
            'api-key' => config('integrations.guardian.api_key'),
            'from-date' => Carbon::yesterday()->format('Y-m-d'),
            'to-date' => Carbon::today()->format('Y-m-d'),
            'page' => $page,
            'page-size' => 50,
            'show-fields' => 'headline,thumbnail'
        ]);
        $data = $response->json('response.results');
        if (empty($data)) {
            return null;
        }

        return $this->formatGuardianResponse($data);
    }

    protected function fetchNYTimesNews(int $page): array | null
    {
        $response = Http::get(config('integrations.new_york_times.api_url'), [
            'api-key' => config('integrations.new_york_times.api_key'),
            'from-date' => str_replace('-', '', Carbon::yesterday()->format('Y-m-d')),
            'to-date' => str_replace('-', '', Carbon::today()->format('Y-m-d')),
            'page' => $page,
            'sort' => 'newest'
        ]);
        $data = $response->json('response.docs');
        if (empty($data)) {
            return null;
        }

        return $this->formatNYTimesResponse($data);
    }

    protected function fetchNewsApiOrg(int $page): array | null
    {
        $response = Http::get(config('integrations.news_api_org.api_url'), [
            'apiKey' => config('integrations.news_api_org.api_key'),
            'from_date' => Carbon::yesterday()->format('Y-m-d'),
            'to_date' => Carbon::today()->format('y-m-d'),
            'page' => $page,
            'q' => 'a'
        ]);
        $data = $response->json('articles');
        if (empty($data)) {
            return null;
        }

        return $this->formatNewsApiOrgResponse($data);
    }

    protected function formatGuardianResponse(array $data): array
    {
        $formattedData = [];
        foreach ($data as $newsFeed) {        
            $formattedData[] = [
                'article' => [
                    'title' => $newsFeed['webTitle'],
                    'description' => $newsFeed['fields']['headline'],
                    'published_at' => Carbon::parse($newsFeed['webPublicationDate']),
                    'image_url' => $newsFeed['fields']['thumbnail'],
                    
                ],
                'source' => [
                    'name' => 'The Guardian',
                ],
                'author' => null,
                'category' => [
                    'name' => $newsFeed['sectionName'],
                ]
            ];
        }

        return $formattedData;
    }

    protected function formatNYTimesResponse(array $data): array
    {
        $formattedData = [];
        foreach ($data as $newsFeed) {
            $imageUrl = null;
            $multimedia = $newsFeed['multimedia'];
            foreach ($multimedia as $media) {
                if ($media['subtype'] === 'xlarge') {
                    $imageUrl = 'https://www.nytimes.com/' . $media['url'];
                    break;
                }
            }
            $formattedData[] = [
                'article' => [
                    'title' => $newsFeed['headline']['main'],
                    'description' => $newsFeed['lead_paragraph'],
                    'published_at' => Carbon::parse($newsFeed['pub_date']),
                    'image_url' => $imageUrl,
                ],
                'source' => [
                    'name' => $newsFeed['source'] ?? ''
                ],
                'author' => $newsFeed['byline']['original'] ?
                    ['name' => substr($newsFeed['byline']['original'], 3)] :
                    null,
                'category' => [
                    'name' => $newsFeed['section_name']
                ]
                
            ];
        }

        return $formattedData;
    }

    protected function formatNewsApiOrgResponse(array $data): array
    {
        $formattedData = [];
        foreach ($data as $newsFeed) {
            if ($newsFeed['title'] !== "[Removed]") {
                $formattedData[] = [
                    'article' => [
                        'title' => $newsFeed['title'],
                        'description' => $newsFeed['description'],
                        'published_at' => Carbon::parse($newsFeed['publishedAt']),
                        'image_url' => $newsFeed['urlToImage'],
                    ],
                    'source' => [
                        'name' => $newsFeed['source']['name']
                    ],
                    'author' => $newsFeed['author'] ? [
                        'name' => explode(',', $newsFeed['author'])[0] ?? ''
                    ] : null,
                    'category' => null
                ];
            }
        }

        return $formattedData;
    }

    protected function saveNews(array $newsData): void
    {
        $newsSaveData = [];
        foreach ($newsData as $newsItem) {
            $source = null;
            $author = null;
            $category = null;
            if ($newsItem['source']) {
                $source = Source::firstOrCreate(
                    ['name' => $newsItem['source']['name']]
                );
            }
    
            if ($newsItem['author']) {
                $author = Author::firstOrCreate(
                    ['name' => $newsItem['author']['name']]
                );
            }
    
            if ($newsItem['category']) {
                $category = Category::firstOrCreate(
                    ['name' => $newsItem['category']['name']]
                );
            }

            $newsSaveData[] = array_merge($newsItem['article'], [
                'source_id' => $source ? $source->id : null,
                'author_id' => $author ? $author->id : null,
                'category_id' => $category ? $category->id : null
            ]);
        }

        //Bulk insertion
        News::upsert($newsSaveData, [
            'title',
            'description',
            'published_at',
            'source_id',
            'author_id',
            'category_id'
        ]);
    }
}
