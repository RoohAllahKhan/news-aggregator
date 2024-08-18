<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Source extends Model
{
    use HasFactory;

    /**
     * @var string
    */
    protected $table = 'sources';

    /**
    * @var array
    */
    protected $guarded = [];
    
    /**
    * @var array
    */
    protected $visible = ['id', 'name'];

}
