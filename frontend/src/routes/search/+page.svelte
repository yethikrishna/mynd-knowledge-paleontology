<script lang="ts">
  import { Search, Clock, Filter, Download, ChevronRight } from 'lucide-svelte';

  let searchQuery = '';
  let isSearching = false;
  let hasSearched = false;

  const searchResults = [
    {
      id: '1',
      fossilId: 'fossil-001',
      preview: 'Knowledge distillation techniques for large language models...',
      source: 'Original Training Corpus',
      timestamp: '2023-06-15 09:30:00',
      confidence: 0.98,
      depth: 9.2,
      isFirstOccurrence: true,
    },
    {
      id: '2',
      fossilId: 'fossil-042',
      preview: 'Distillation methods for model compression and efficiency...',
      source: 'Base Model v1.0',
      timestamp: '2023-08-20 14:15:00',
      confidence: 0.94,
      depth: 7.8,
      isFirstOccurrence: false,
    },
    {
      id: '3',
      fossilId: 'fossil-156',
      preview: 'Knowledge distillation via soft target probabilities...',
      source: 'Fine-tuning Run #42',
      timestamp: '2023-11-05 11:45:00',
      confidence: 0.89,
      depth: 6.5,
      isFirstOccurrence: false,
    },
    {
      id: '4',
      fossilId: 'fossil-284',
      preview: 'Model distillation techniques for deployment optimization...',
      source: 'Agent Model Alpha',
      timestamp: '2024-01-18 16:20:00',
      confidence: 0.85,
      depth: 4.1,
      isFirstOccurrence: false,
    },
  ];

  function handleSearch() {
    if (!searchQuery.trim()) return;
    isSearching = true;
    setTimeout(() => {
      isSearching = false;
      hasSearched = true;
    }, 1500);
  }
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div>
    <h1 class="text-2xl font-bold text-white">First Occurrence Search</h1>
    <p class="text-dark-400">Temporal + semantic search for knowledge origin detection</p>
  </div>

  <!-- Search Box -->
  <div class="card p-6">
    <div class="flex gap-4">
      <div class="flex-1 relative">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
        <input 
          type="text" 
          class="input pl-12" 
          placeholder="Enter knowledge claim, fact, or concept to trace origin..."
          bind:value={searchQuery}
          on:keydown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <button class="btn-primary min-w-[120px]" on:click={handleSearch} disabled={isSearching}>
        {#if isSearching}
          <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        {:else}
          <Search class="w-5 h-5 mr-2" />
          Search
        {/if}
      </button>
    </div>
    
    <div class="flex items-center gap-4 mt-4">
      <span class="text-sm text-dark-500">Temporal range:</span>
      <select class="input py-2 text-sm w-auto">
        <option>All time</option>
        <option>Last 30 days</option>
        <option>Last 90 days</option>
        <option>Last year</option>
        <option>Custom range...</option>
      </select>
      <span class="text-sm text-dark-500 ml-4">Min confidence:</span>
      <input type="range" min="0" max="100" value="70" class="w-32" />
      <span class="text-sm text-dark-400">70%</span>
    </div>
  </div>

  <!-- Search Results -->
  {#if hasSearched}
    <div class="card p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-semibold text-white">Search Results</h3>
          <p class="text-dark-400 text-sm">Found {searchResults.length} occurrences, sorted by timestamp (oldest first)</p>
        </div>
        <button class="btn-secondary">
          <Download class="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <!-- First Occurrence Highlight -->
      <div class="mb-6 p-4 rounded-lg bg-success/10 border border-success/30">
        <div class="flex items-center gap-2 mb-2">
          <Clock class="w-5 h-5 text-success" />
          <span class="font-semibold text-success">FIRST OCCURRENCE DETECTED</span>
        </div>
        <p class="text-dark-300 text-sm">
          The earliest verified appearance of this concept was on June 15, 2023 in the original training corpus.
          98% semantic match with 9.2m stratigraphic depth.
        </p>
      </div>

      <!-- Results Timeline -->
      <div class="relative">
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-700" />
        
        <div class="space-y-4">
          {#each searchResults as result, i}
            <div class="relative flex items-start gap-4 pl-12">
              <div class="absolute left-4 w-5 h-5 rounded-full border-4 {
                result.isFirstOccurrence 
                  ? 'bg-success border-success/30' 
                  : 'bg-dark-600 border-dark-700'
              }" />
              
              <div class="flex-1 card p-4 {result.isFirstOccurrence ? 'border-success/30' : ''}">
                <div class="flex items-start justify-between">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-medium text-white">{result.preview}</h4>
                      {#if result.isFirstOccurrence}
                        <span class="badge badge-success">First</span>
                      {/if}
                    </div>
                    <div class="flex items-center gap-4 text-sm text-dark-500">
                      <span>{result.source}</span>
                      <span>•</span>
                      <span>{result.timestamp}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm text-dark-300">{Math.round(result.confidence * 100)}% match</div>
                    <div class="text-xs text-dark-500">Depth: {result.depth}m</div>
                  </div>
                </div>
                
                {#if i < searchResults.length - 1}
                  <div class="mt-3 pt-3 border-t border-dark-800 flex items-center justify-between">
                    <span class="text-xs text-dark-500">
                      Propagation: {['Direct training', 'Fine-tuning transfer', 'Distillation', 'RAG injection'][i]}
                    </span>
                    <ChevronRight class="w-4 h-4 text-dark-600" />
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  <!-- Empty State -->
  {#if !hasSearched}
    <div class="card p-12 text-center">
      <Search class="w-16 h-16 text-dark-600 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-white mb-2">Knowledge Origin Search</h3>
      <p class="text-dark-400 max-w-md mx-auto">
        Enter any fact, concept, or knowledge claim to trace its origin through the AI ecosystem.
        Our temporal embedding search will find the first verified occurrence.
      </p>
    </div>
  {/if}
</div>
