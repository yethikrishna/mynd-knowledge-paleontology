<script lang="ts">
  import { AlertTriangle, Search, Filter, Wrench, Eye } from 'lucide-svelte';

  let selectedSeverity = 'all';

  const contaminationEvents = [
    {
      id: '1',
      fossilId: 'fossil-412',
      preview: 'Knowledge distillation techniques for...',
      severity: 'critical',
      score: 0.78,
      detectionMethod: 'Semantic embedding drift',
      timestamp: '2024-04-02 08:15:00',
      remediated: false,
    },
    {
      id: '2',
      fossilId: 'fossil-398',
      preview: 'Transformer attention mechanism...',
      severity: 'high',
      score: 0.52,
      detectionMethod: 'Cosine distance threshold',
      timestamp: '2024-03-28 14:30:00',
      remediated: false,
    },
    {
      id: '3',
      fossilId: 'fossil-356',
      preview: 'RLHF reward modeling best practices...',
      severity: 'medium',
      score: 0.28,
      detectionMethod: 'Length mutation ratio',
      timestamp: '2024-03-21 09:45:00',
      remediated: true,
    },
    {
      id: '4',
      fossilId: 'fossil-312',
      preview: 'LoRA fine-tuning parameter efficiency...',
      severity: 'low',
      score: 0.08,
      detectionMethod: 'Semantic embedding drift',
      timestamp: '2024-03-15 11:20:00',
      remediated: true,
    },
    {
      id: '5',
      fossilId: 'fossil-287',
      preview: 'Positional encoding variants comparison...',
      severity: 'high',
      score: 0.61,
      detectionMethod: 'Cosine distance threshold',
      timestamp: '2024-03-10 16:00:00',
      remediated: false,
    },
  ];

  const severityColors: Record<string, string> = {
    critical: 'bg-danger/20 text-danger border-danger/30',
    high: 'bg-warning/20 text-warning border-warning/30',
    medium: 'bg-info/20 text-info border-info/30',
    low: 'bg-success/20 text-success border-success/30',
  };

  const summary = {
    total: contaminationEvents.length,
    critical: contaminationEvents.filter(e => e.severity === 'critical').length,
    high: contaminationEvents.filter(e => e.severity === 'high').length,
    medium: contaminationEvents.filter(e => e.severity === 'medium').length,
    low: contaminationEvents.filter(e => e.severity === 'low').length,
    remediated: contaminationEvents.filter(e => e.remediated).length,
  };
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-white">Contamination Detection</h1>
      <p class="text-dark-400">Knowledge mutation and semantic drift monitoring</p>
    </div>
    <div class="flex items-center gap-3">
      <button class="btn-secondary">
        <Filter class="w-4 h-4 mr-2" />
        Filter
      </button>
      <button class="btn-primary">
        <Search class="w-4 h-4 mr-2" />
        New Scan
      </button>
    </div>
  </div>

  <!-- Summary Stats -->
  <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
    <div class="card p-4 text-center">
      <div class="text-2xl font-bold text-white">{summary.total}</div>
      <div class="text-xs text-dark-500">Total Events</div>
    </div>
    <div class="card p-4 text-center border-danger/30">
      <div class="text-2xl font-bold text-danger">{summary.critical}</div>
      <div class="text-xs text-dark-500">Critical</div>
    </div>
    <div class="card p-4 text-center border-warning/30">
      <div class="text-2xl font-bold text-warning">{summary.high}</div>
      <div class="text-xs text-dark-500">High</div>
    </div>
    <div class="card p-4 text-center border-info/30">
      <div class="text-2xl font-bold text-info">{summary.medium + summary.low}</div>
      <div class="text-xs text-dark-500">Medium/Low</div>
    </div>
    <div class="card p-4 text-center border-success/30">
      <div class="text-2xl font-bold text-success">{summary.remediated}</div>
      <div class="text-xs text-dark-500">Remediated</div>
    </div>
  </div>

  <!-- Heatmap -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-white mb-4">Contamination Heatmap</h3>
    <div class="grid grid-cols-7 gap-2">
      {#each Array.from({ length: 35 }) as _, i}
        {@const intensity = Math.random()}
        <div 
          class="aspect-square rounded transition-all hover:scale-110 cursor-pointer"
          style="background-color: rgba(239, 68, 68, {intensity})"
          title="Contamination score: {Math.round(intensity * 100)}%"
        />
      {/each}
    </div>
    <div class="flex justify-between mt-4 text-xs text-dark-500">
      <span>← Older</span>
      <span>Stratigraphic Depth →</span>
    </div>
  </div>

  <!-- Events Table -->
  <div class="card overflow-hidden">
    <div class="p-4 border-b border-dark-800">
      <h3 class="text-lg font-semibold text-white">Detection Events</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-dark-800">
            <th class="text-left p-4 text-sm font-medium text-dark-400">Severity</th>
            <th class="text-left p-4 text-sm font-medium text-dark-400">Knowledge Fossil</th>
            <th class="text-left p-4 text-sm font-medium text-dark-400">Score</th>
            <th class="text-left p-4 text-sm font-medium text-dark-400">Detection Method</th>
            <th class="text-left p-4 text-sm font-medium text-dark-400">Timestamp</th>
            <th class="text-left p-4 text-sm font-medium text-dark-400">Status</th>
            <th class="text-left p-4 text-sm font-medium text-dark-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each contaminationEvents as event}
            <tr class="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
              <td class="p-4">
                <span class="badge border {severityColors[event.severity]}">
                  {event.severity.toUpperCase()}
                </span>
              </td>
              <td class="p-4">
                <div>
                  <p class="text-white font-medium truncate max-w-xs">{event.preview}</p>
                  <p class="text-dark-500 text-xs">{event.fossilId}</p>
                </div>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <div class="w-20 h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full"
                      style="width: {event.score * 100}%; background-color: {
                        event.score > 0.6 ? '#ef4444' : event.score > 0.3 ? '#f59e0b' : '#10b981'
                      }"
                    />
                  </div>
                  <span class="text-dark-300 text-sm">{Math.round(event.score * 100)}%</span>
                </div>
              </td>
              <td class="p-4 text-dark-300 text-sm">{event.detectionMethod}</td>
              <td class="p-4 text-dark-400 text-sm">{event.timestamp}</td>
              <td class="p-4">
                {#if event.remediated}
                  <span class="badge badge-success">Remediated</span>
                {:else}
                  <span class="badge badge-warning">Active</span>
                {/if}
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <button class="p-1.5 rounded hover:bg-dark-700 transition-colors" title="View Details">
                    <Eye class="w-4 h-4 text-dark-400" />
                  </button>
                  {#if !event.remediated}
                    <button class="p-1.5 rounded hover:bg-dark-700 transition-colors" title="Remediate">
                      <Wrench class="w-4 h-4 text-dark-400" />
                    </button>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
