<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_id')->nullable()->constrained('sources')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('author_id')->nullable()->constrained('authors')->cascadeOnUpdate()->cascadeOnDelete();
            $table->text('title')->nullable()->fulltext();
            $table->text('description')->nullable()->fulltext();
            $table->text('url')->nullable();
            $table->text('image_url')->nullable();
            $table->timestampTz('published_at');
            $table->timestamps();
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
