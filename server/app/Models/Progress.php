<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Progress extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
      'user_id',
      'level_number',
      'assignment_number',
      'words_per_minute',
      'accuracy',
      'is_done',
      'date_done',
  ];
}
