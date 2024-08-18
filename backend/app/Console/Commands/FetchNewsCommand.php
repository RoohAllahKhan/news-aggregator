<?php

namespace App\Console\Commands;

use App\Services\NewsService;
use Illuminate\Console\Command;

class FetchNewsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'news:fetch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch news articles from different sources and save them in the database';

    protected $newsService;

    public function __construct(NewsService $newsService)
    {
        parent::__construct();
        $this->newsService = $newsService;
    }
    
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Fetching news articles...");
        $this->newsService->fetchAndSaveNews();
        $this->info("News fetching completed.");
    }
}
