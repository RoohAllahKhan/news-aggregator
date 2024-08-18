<?php
namespace App\Services;

use App\Models\UserPreference;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class UserPreferenceService
{
    /**
     * Create or update user preferences.
     *
     * @param array $data
     * @return UserPreference
     * @throws ValidationException
     */
    public function createOrUpdate(array $data): UserPreference
    {
        $validator = Validator::make($data, [
            'user_id' => 'required|exists:users,id',
            'categories' => 'array',
            'categories.*' => 'integer|exists:categories,id',
            'sources' => 'array',
            'sources.*' => 'integer|exists:sources,id',
            'authors' => 'array',
            'authors.*' => 'integer|exists:authors,id',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return UserPreference::updateOrCreate(
            ['user_id' => $data['user_id']],
            [
                'categories' => $data['categories'],
                'sources' => $data['sources'],
                'authors' => $data['authors'],
            ]
        );
    }

    public function getByUserId(int $userId): UserPreference
    {
        return UserPreference::where('user_id', $userId)->firstOrFail();
    }
}
