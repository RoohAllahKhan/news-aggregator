<?php
namespace App\Services;

use App\Models\Author;

class AuthorService extends BaseService
{
    public function __construct(Author $author)
    {
        parent::__construct($author);
    }
}