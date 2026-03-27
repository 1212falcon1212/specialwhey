<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || $request->user()->role !== UserRole::Admin) {
            return response()->json([
                'success' => false,
                'message' => 'Bu işlem için yetkiniz bulunmamaktadır.',
            ], 403);
        }

        return $next($request);
    }
}
