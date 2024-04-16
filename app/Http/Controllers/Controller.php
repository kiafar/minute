<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;

abstract class Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * This function is used to prepare the response for the client. In the case request is
     * made via Inertia, it will redirect back with the response data with responseData
     * key, which will be accessible in the client side, through response.props.responseData
     *
     * @param $response
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
     */
    function prepResponse($response)
    {
        if (request()->inertia()) {
            return redirect()->back()->with('responseData', $response);
        } else {
            return response()->json($response);
        }
    }
}
