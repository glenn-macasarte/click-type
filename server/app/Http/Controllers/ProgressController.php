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

  public function getprogress($id)
  {
    $progress = Progress::where('user_id', $id)->get();
    return response()->json([
      'message' => 'Successfully retrieved progress.',
      'progress' => $progress,
    ], 200);
  }
}
