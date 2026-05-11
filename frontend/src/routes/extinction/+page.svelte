<script lang="ts">
  import { Clock, AlertTriangle, RefreshCw, Download, Wrench } from 'lucide-svelte';

  const extinctionEvents = [
    {
      id: '1',
      concept: 'Original positional encoding mechanism',
      severity: 'complete',
      detected: '2024-03-28 14:30:00',
      lastSeen: '2024-02-15 09:00:00',
      affectedModels: ['Model Lite v2.0', 'Distilled Agent'],
      recoveryScore: 0.65,
      recoverySuggestions: [
        'Re-inject original training data subset',
        'Perform knowledge distillation from full model',
        'Use LoRA fine-tuning with concept-specific data',
      ],
    },
    {
      id: '2',
      concept: 'Early tokenization edge case handling',
      severity: 'partial',
      detected: '2024-04-01 10:15:00',
      lastSeen: '2024-03-20 16:45:00',
      affectedModels: ['Model Lite v2.0'],
      recoveryScore: 0.88,
      recoverySuggestions: [
        'Add edge case examples to fine-tuning dataset',
        'Verify tokenizer vocabulary coverage',
      ],
    },
    {
      id: '3',
      concept: 'Legacy attention pattern variants',
      severity: 'complete',
      detected: '2024-04-05 08:00:00',
      lastSeen: '2024-03-01 12:30:00',
      affectedModels: ['Model Lite v2.0', 'Distilled Agent', 'Mobile Quantized'],
      recoveryScore: 0.42,
      recoverySuggestions: [
        'High priority: this pattern is critical for multilingual support',
        'Re-train from earlier checkpoint',
        'Consider architecture adjustment',
      ],
    },
  ];

  const severityColors: Record<string, string> = {
    complete: 'bg-danger/20 text-danger border-danger/30',
    partial: 'bg-warning/20 text-warning border-warning/30',
  };
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-white">Extinction Event Timeline</h1>
      <p class="text-dark-400">Knowledge lost during distillation and quantization</p>
    </div>
    <div class="flex items-center gap-3">
      <button class="btn-secondary">
        <RefreshCw class="w-4 h-4 mr-2" />
        Run Detection
      </button>
      <button class="btn-secondary">
        <Download class="w-4 h-4 mr-2" />
        Export
      </button>
    </div>
  </div>

  <!-- Summary Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="card p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center">
          <AlertTriangle class="w-5 h-5 text-danger" />
        </div>
        <div>
          <div class="text-2xl font-bold text-white">{extinctionEvents.length}</div>
          <div class="text-xs text-dark-500">Total Events</div>
        </div>
      </div>
    </div>
    <div class="card p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center">
          <Clock class="w-5 h-5 text-danger" />
        </div>
        <div>
          <div class="text-2xl font-bold text-white">{extinctionEvents.filter(e => e.severity === 'complete').length}</div>
          <div class="text-xs text-dark-500">Complete Extinction</div>
        </div>
      </div>
    </div>
    <div class="card p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
          <Clock class="w-5 h-5 text-warning" />
        </div>
        <div>
          <div class="text-2xl font-bold text-white">{extinctionEvents.filter(e => e.severity === 'partial').length}</div>
          <div class="text-xs text-dark-500">Partial Loss</div>
        </div>
      </div>
    </div>
    <div class="card p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
          <Wrench class="w-5 h-5 text-success" />
        </div>
        <div>
          <div class="text-2xl font-bold text-white">0</div>
          <div class="text-xs text-dark-500">Recovered</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Timeline -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-white mb-6">Event Timeline</h3>
    
    <div class="relative">
      <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-700" />
      
      <div class="space-y-6">
        {#each extinctionEvents as event}
          <div class="relative flex items-start gap-4 pl-12">
            <div class="absolute left-4 w-5 h-5 rounded-full border-4 {
              event.severity === 'complete' ? 'bg-danger border-danger/30' : 'bg-warning border-warning/30'
            }" />
            
            <div class="flex-1 card p-5">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <h4 class="font-semibold text-white text-lg">{event.concept}</h4>
                    <span class="badge border {severityColors[event.severity]}">
                      {event.severity.toUpperCase()} EXTINCTION
                    </span>
                  </div>
                  <div class="flex items-center gap-4 text-sm text-dark-500">
                    <span>Detected: {event.detected}</span>
                    <span>•</span>
                    <span>Last seen: {event.lastSeen}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-dark-400">Recovery Probability</div>
                  <div class="text-xl font-bold {event.recoveryScore > 0.7 ? 'text-success' : event.recoveryScore > 0.5 ? 'text-warning' : 'text-danger'}">
                    {Math.round(event.recoveryScore * 100)}%
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <div class="text-sm text-dark-400 mb-2">Affected Models:</div>
                <div class="flex flex-wrap gap-2">
                  {#each event.affectedModels as model}
                    <span class="badge badge-info">{model}</span>
                  {/each}
                </div>
              </div>

              <div class="bg-dark-800/50 rounded-lg p-4">
                <div class="text-sm font-medium text-white mb-2">Recovery Recommendations:</div>
                <ul class="space-y-1">
                  {#each event.recoverySuggestions as suggestion}
                    <li class="text-sm text-dark-300 flex items-start gap-2">
                      <span class="text-primary-400">•</span>
                      {suggestion}
                    </li>
                  {/each}
                </ul>
              </div>

              <div class="mt-4 flex justify-end gap-3">
                <button class="btn-secondary text-sm">
                  View Details
                </button>
                <button class="btn-primary text-sm">
                  <Wrench class="w-4 h-4 mr-2" />
                  Start Recovery
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
