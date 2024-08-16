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
    protected $signature = 'news:fetch {count=10}';

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
        $count = (int) $this->argument('count');
        $this->info("Fetching $count news articles...");
        $this->newsService->fetchAndSaveNews($count);
        $this->info("News fetching completed.");
    }
}
