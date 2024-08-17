<?php
namespace App\Services;

use App\Models\Source;

class SourceService extends BaseService
{
    public function __construct(Source $source)
    {
        parent::__construct($source);
    }
}