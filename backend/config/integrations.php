<?php

return [
    'guardian' => [
        'api_key' => env('GUARDIAN_API_KEY'),
        'api_url' => env('GUARDIAN_API_URL')
    ],
    'new_york_times' => [
        'api_key' => env('NEW_YORK_TIMES_API_KEY'),
        'secret_key' => env('NEW_YORK_TIMES_SECRET_KEY'),
        'api_url' => env('NEW_YORK_TIMES_API_URL')
    ],
    'news_api_org' => [
        'api_key' => env('NEWS_ORG_API_KEY'),
        'api_url' => env('NEWS_ORG_API_URL')
    ]
];