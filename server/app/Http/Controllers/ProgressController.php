<?php

namespace App\Http\Controllers;

use App\Models\Progress;
use Illuminate\Http\Request;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class ProgressController extends Controller
{
  public function save(Request $request)
  {
    DB::beginTransaction();
    try {
      $data = [
        'user_id'           => $request->user_id,
        'level_number'      => $request->level_number,
        'assignment_number' => $request->assignment_number,
        'words_per_minute'  => $request->words_per_minute,
        'accuracy'          => $request->accuracy,
        'is_done'           => $request->is_done,
        'date_done'         => $request->date_done,
      ];

      // $progress = Progress::create($data);
      $progress = Progress::updateOrCreate([
          'user_id' => $data['user_id'],
          'level_number' => $data['level_number'], 
          'assignment_number' => $data['assignment_number']
        ],
        $data
      );
      DB::commit();

      return response()->json([
        'message' => 'Successfully saved progress.',
        'progress' => $progress,
      ], 200);
      
    } catch (Exception $e) {
      DB::rollback();
      return response()->json([
        'message' => 'Failed to save progress.',
        'progress' => $e->getMessage(),
      ], 422);
    }
  }

  public function getprogress()
  {
    $progress = Progress::where('user_id', auth()->user()->id)->orderBy('date_done', 'DESC')->get();
    $response = [];

    if ($progress) {
      $levels  = [1 => 'Beginner', 2 => 'Intermediate', 3 => 'Advanced'];
      $assignments  = [
        1 => ['Introducing asdf', 'Introducing jkl;', 'Introducing ei', 'Introducing gh', 'Introducing ru', 'Introducing ty', 'Introducing qwop', 'Introducing vbmn', 'Introducing zxc', 'Introducing .,'],
        2 => ['A Words', 'S Words', 'L Words', 'B Words', 'W Words'],
        3 => ['10 Key Functions (Numbers Only)', '10 Key Functions (Numbers and Symbols)', 'All Random Words']
      ];

      foreach ($progress as $key => $value) {
        $response[$key] = [
          'id'                => $value->id,
          'level'             => $value->level_number,
          'level_label'       => $levels[$value->level_number],
          'assignment'        => $value->assignment_number,
          'assignment_label'  => $assignments[$value->level_number][$value->assignment_number - 1],
          'words_per_minute'  => $value->words_per_minute,
          'accuracy'          => $value->accuracy,
          'date'              => date("F j, Y g:i A", strtotime($value->date_done))
        ];

        if ($value->accuracy >= 80 && $value->accuracy <= 100) {
          $efficiecy = 5;
        } else if ($value->accuracy >= 60 && $value->accuracy <= 79) {
          $efficiecy = 4;
        } else if ($value->accuracy >= 40 && $value->accuracy <= 59) {
          $efficiecy = 3;
        } else if ($value->accuracy >= 20 && $value->accuracy <= 39) {
          $efficiecy = 2;
        } else if ($value->accuracy >= 0 && $value->accuracy <= 19) {
          $efficiecy = 1;
        }
        $response[$key]['efficiency'] = $efficiecy;
      }

      return response()->json([
        'message' => 'Successfully retrieved progress.',
        'progress' => $response,
      ], 200);
    } else {
      return response()->json([
        'message' => 'You have no records yet.',
        'progress' => $response,
      ], 200);
    }
  }
}
