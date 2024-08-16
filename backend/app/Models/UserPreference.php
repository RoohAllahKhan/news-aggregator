<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'user_preferences';

    /**
     * @var array
     */
    protected $guarded = [];

    /**
     * @param string|null $value
     * @return null
     */
    public function getSourcesAttribute(?string $value)
    {
        if (is_null($value)) return null;
        $sources = json_decode($value);
        return Source::whereIn('id', $sources)->get();
    }

    /**
     * @param array $value
     * @return void
     */
    public function setSourcesAttribute(array $value): void
    {
        $this->attributes['sources'] = json_encode($value);
    }

    /**
     * @param string|null $value
     * @return null
     */
    public function getCategoriesAttribute(?string $value)
    {
        if (is_null($value)) return null;
        $categories = json_decode($value);

        return Category::whereIn('id', $categories)->get();
    }

    /**
     * @param array $value
     * @return void
     */
    public function setCategoriesAttribute(array $value): void
    {
        $this->attributes['categories'] = json_encode($value);
    }

    /**
     * @param string|null $value
     * @return null
     */
    public function getAuthorsAttribute(?string $value)
    {
        if (is_null($value)) return null;
        $authors = json_decode($value);

        return Author::whereIn('id', $authors)->get();
    }

    /**
     * @param array $value
     * @return void
     */
    public function setAuthorsAttribute(array $value): void
    {
        $this->attributes['authors'] = json_encode($value);
    }
}
