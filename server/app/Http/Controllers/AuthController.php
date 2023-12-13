<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Exception;

class AuthController extends Controller
{
  public function login(Request $request)
  {
    // validate the request data
    $credentials = $request->validate([
      'email' => ['required', 'email', 'exists:users,email'],
      'password' => ['required', 'string']
    ]);

    // get user for that emailcredentials
    if (!Auth::attempt($credentials)) {
      return response()->json([
        'message' => 'Credentials invalid.'
      ], 422);
    }

    $user = User::where('email', $credentials['email'])->where('role', '!=', 0)->first();
    if (!$user) {
      return response()->json([
        'message' => 'User has no permission to access the site.'
      ], 422);
    }
    $authToken = $user->createToken('auth_token')->plainTextToken;
    
    return response()->json([
      'message' => 'Successfully logged in.',
      'user' => $user,
      'token' => $authToken
    ], 200);
  }

  public function logout() 
  {
    try {
      Auth::user()->tokens->each(function($token, $key) {
          $token->delete();
      });

      return response()->json([
        'message' => 'Successfully logged out.'
      ], 200);
    } catch (Exception $e) {
      return response()->json([
        'message' => 'Failed to logout.',
        'error' => $e->getMessage(),
      ], 422);
    }
  }
}
