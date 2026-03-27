<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\Admin\UpdateRefundStatusRequest;
use App\Http\Resources\Admin\RefundRequestResource;
use App\Models\RefundRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RefundController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = RefundRequest::with(['order', 'user']);

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $refunds = $query->paginate($request->input('per_page', 15));

        return $this->successWithMeta(
            RefundRequestResource::collection($refunds),
            [
                'current_page' => $refunds->currentPage(),
                'last_page' => $refunds->lastPage(),
                'per_page' => $refunds->perPage(),
                'total' => $refunds->total(),
            ]
        );
    }

    public function show(int $id): JsonResponse
    {
        $refund = RefundRequest::with(['order.user', 'user'])->findOrFail($id);

        return $this->success(new RefundRequestResource($refund));
    }

    public function updateStatus(UpdateRefundStatusRequest $request, int $id): JsonResponse
    {
        $refund = RefundRequest::findOrFail($id);

        $data = [
            'status' => $request->validated('status'),
            'admin_notes' => $request->validated('admin_notes'),
        ];

        $resolvedStatuses = ['approved', 'rejected', 'refunded'];
        if (in_array($request->validated('status'), $resolvedStatuses)) {
            $data['resolved_at'] = now();
        }

        $refund->update($data);

        $refund->load(['order', 'user']);

        return $this->success(
            new RefundRequestResource($refund),
            'İade durumu başarıyla güncellendi.'
        );
    }
}
