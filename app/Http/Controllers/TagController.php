<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TagController extends Controller
{
    public function get_tags(Request $request)
    {
        return $request->user()->tags;
    }

    public function store_tag(Request $request)
    {
        Log::info(auth()->id());
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:tags,id',
        ]);

        $tag = $request->user()->tags()->create($data);

        return $this->prepResponse($tag);
    }

    public function update_tag(Request $request, Tag $tag)
    {
        sleep(1);
        $this->authorize('update', $tag);

        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $tag->update($data);

        return $this->prepResponse($tag);
    }

    public function delete_tag(Tag $tag)
    {
        $this->authorize('delete', $tag);

        $tag->delete();

        return to_route('tags.manage');
    }
}
