<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Fossil, 
    Network, 
    AlertTriangle, 
    Clock, 
    Layers,
    TrendingUp,
    Plus,
    ChevronRight
  } from 'lucide-svelte';
  import StatCard from '$components/StatCard.svelte';

  const recentFossils = [
    {
      id: '1',
      hash: 'a1b2c3d4e5f6',
      preview: 'Knowledge distillation techniques for...',
      source: 'model',
      timestamp: '2 minutes ago',
      depth: 7.2,
    },
    {
      id: '2',
      hash: 'f6e5d4c3b2a1',
      preview: 'Transformer architecture optimization...',
      source: 'training_run',
      timestamp: '15 minutes ago',
      depth: 5.8,
    },
    {
      id: '3',
      hash: '9a8b7c6d5e4f',
      preview: 'RLHF alignment best practices...',
      source: 'dataset',
      timestamp: '1 hour ago',
      depth: 8.4,
    },
    {
      id: '4',
      hash: '3d4e5f6a7b8c',
      preview: 'LoRA fine-tuning parameter efficiency...',
      source: 'agent',
      timestamp: '3 hours ago',
      depth: 4.1,
    },
  ];

  const contaminationAlerts = [
    { id: '1', severity: 'high', message: 'Semantic drift detected in Model v2.1', time: '5 min ago' },
    { id: '2', severity: 'medium', message: 'Knowledge mutation during distillation', time: '32 min ago' },
    { id: '3', severity: 'low', message: 'Minor encoding variation detected', time: '2 hours ago' },
  ];
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>
      <p class="text-dark-400">Knowledge paleontology overview</p>
    </div>
    <button class="btn-primary">
      <Plus class="w-5 h-5 mr-2" />
      New Fossil
    </button>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard 
      title="Total Fossils" 
      value="842" 
      change="+12.5%" 
      icon={Fossil}
      color="primary"
    />
    <StatCard 
      title="Models Tracked" 
      value="24" 
      change="+3" 
      icon={Network}
      color="accent"
    />
    <StatCard 
      title="Contamination Events" 
      value="7" 
      change="-23%" 
      icon={AlertTriangle}
      color="danger"
    />
    <StatCard 
      title="Extinction Events" 
      value="3" 
      change="0" 
      icon={Clock}
      color="warning"
    />
  </div>

  <!-- Main Content Grid -->
  <div class="grid lg:grid-cols-3 gap-6">
    <!-- Recent Fossils -->
    <div class="lg:col-span-2 card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">Recent Fossilization</h2>
        <a href="/fossils" class="text-sm text-primary-400 hover:text-primary-300 flex items-center">
          View all
          <ChevronRight class="w-4 h-4 ml-1" />
        </a>
      </div>
      
      <div class="space-y-3">
        {#each recentFossils as fossil}
          <div class="flex items-center justify-between p-3 rounded-lg hover:bg-dark-800 transition-colors cursor-pointer">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                <Fossil class="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p class="text-white font-medium truncate max-w-xs">{fossil.preview}</p>
                <p class="text-dark-500 text-sm">
                  {fossil.hash} • {fossil.source} • {fossil.timestamp}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Layers class="w-4 h-4 text-dark-500" />
              <span class="text-sm text-dark-400">{fossil.depth}m</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Contamination Alerts -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">Contamination Alerts</h2>
        <a href="/contamination" class="text-sm text-primary-400 hover:text-primary-300 flex items-center">
          View all
          <ChevronRight class="w-4 h-4 ml-1" />
        </a>
      </div>
      
      <div class="space-y-3">
        {#each contaminationAlerts as alert}
          <div class="p-3 rounded-lg bg-dark-800/50 border-l-4 {
            alert.severity === 'high' ? 'border-danger' :
            alert.severity === 'medium' ? 'border-warning' : 'border-info'
          }">
            <p class="text-white text-sm">{alert.message}</p>
            <p class="text-dark-500 text-xs mt-1">{alert.time}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Stratigraphic Depth Distribution -->
  <div class="card p-6">
    <h2 class="text-lg font-semibold text-white mb-4">Stratigraphic Depth Distribution</h2>
    <div class="h-64 flex items-end gap-2">
      {#each [15, 42, 68, 95, 124, 87, 53, 29, 12, 5] as count, i}
        <div class="flex-1 flex flex-col items-center">
          <div 
            class="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 transition-all hover:from-primary-500 hover:to-primary-300"
            style="height: {count}%"
          />
          <span class="text-xs text-dark-500 mt-2">{i}-{i + 1}m</span>
        </div>
      {/each}
    </div>
  </div>
</div>
