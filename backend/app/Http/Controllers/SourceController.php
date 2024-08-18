<?php

namespace App\Http\Controllers;

use App\Services\SourceService;
use Illuminate\Http\JsonResponse;

class SourceController extends Controller
{
    protected SourceService $sourceService;

    public function __construct(SourceService $sourceService)
    {
        $this->sourceService = $sourceService;
    }

    public function index(): JsonResponse
    {
        return response()->json($this->sourceService->getAll());
    }
}
