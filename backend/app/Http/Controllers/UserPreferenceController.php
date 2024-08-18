<?php

namespace App\Http\Controllers;

use App\Services\UserPreferenceService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    protected UserPreferenceService $userPreferenceService;

    public function __construct(UserPreferenceService $userPreferenceService)
    {
        $this->userPreferenceService = $userPreferenceService;
    }

    // To create or update user preference
    public function storeOrUpdate(Request $request): JsonResponse
    {
        try {
            $userPreference = $this->userPreferenceService->createOrUpdate($request->all());

            return response()->json($userPreference);
        } catch (\Illuminate\Validation\ValidationException $exception) {
            return response()->json(['error' => $exception->errors()], 422);
        }
    }

    // To retrieve a user preference by user id
    public function show(Request $request, int $userId): JsonResponse
    {
        try {
            $userPreference = $this->userPreferenceService->getByUserId($userId);

            return response()->json($userPreference);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'User preference not found'], 404);
        }
    }
}
