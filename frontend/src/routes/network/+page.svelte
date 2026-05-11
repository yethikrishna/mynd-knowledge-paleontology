<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Sigma from 'sigma';
  import Graph from 'graphology';
  import forceAtlas2 from 'graphology-layout-forceatlas2';
  import { 
    Network, 
    ZoomIn, 
    ZoomOut, 
    Maximize, 
    RefreshCw,
    Filter,
    Download
  } from 'lucide-svelte';

  let container: HTMLDivElement;
  let renderer: Sigma;
  let graph: Graph;
  let selectedNode: string | null = null;
  let nodeCount = 0;
  let edgeCount = 0;

  const nodeTypes = ['model', 'agent', 'dataset', 'training_run'];
  const colors = {
    model: '#3b82f6',
    agent: '#8b5cf6',
    dataset: '#10b981',
    training_run: '#f59e0b',
  };

  onMount(() => {
    initGraph();
  });

  function initGraph() {
    graph = new Graph();
    
    // Add nodes
    for (let i = 0; i < 50; i++) {
      const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      graph.addNode(`node-${i}`, {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 5 + Math.random() * 10,
        color: colors[type as keyof typeof colors],
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`,
        type,
      });
    }

    // Add edges
    for (let i = 0; i < 80; i++) {
      const source = Math.floor(Math.random() * 50);
      let target = Math.floor(Math.random() * 50);
      while (target === source || graph.hasEdge(`node-${source}`, `node-${target}`)) {
        target = Math.floor(Math.random() * 50);
      }
      
      const hasContamination = Math.random() > 0.85;
      graph.addEdge(`node-${source}`, `node-${target}`, {
        size: 1 + Math.random() * 2,
        color: hasContamination ? '#ef4444' : '#22c55e',
        contamination: hasContamination,
      });
    }

    nodeCount = graph.order;
    edgeCount = graph.size;

    // Run ForceAtlas2 layout
    forceAtlas2.assign(graph, {
      iterations: 200,
      settings: {
        gravity: 1,
        scalingRatio: 10,
        slowDown: 10,
      },
    });

    // Initialize sigma
    renderer = new Sigma(graph, container, {
      allowInvalidContainer: true,
      renderEdgeLabels: false,
    });

    // Node click handler
    renderer.on('clickNode', (event) => {
      selectedNode = event.node;
    });

    renderer.on('clickStage', () => {
      selectedNode = null;
    });
  }

  function zoomIn() {
    renderer.getCamera().animatedZoom({ factor: 1.5 });
  }

  function zoomOut() {
    renderer.getCamera().animatedZoom({ factor: 0.666 });
  }

  function resetView() {
    renderer.getCamera().animatedReset();
  }

  function refresh() {
    renderer.kill();
    initGraph();
  }

  onDestroy(() => {
    if (renderer) renderer.kill();
  });
</script>

<div class="h-full flex flex-col gap-6">
  <!-- Page Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-white">Knowledge Diffusion Network</h1>
      <p class="text-dark-400">Interactive map of knowledge propagation across models</p>
    </div>
    <div class="flex items-center gap-3">
      <button class="btn-secondary" on:click={refresh}>
        <RefreshCw class="w-4 h-4 mr-2" />
        Refresh
      </button>
      <button class="btn-secondary">
        <Filter class="w-4 h-4 mr-2" />
        Filter
      </button>
      <button class="btn-secondary">
        <Download class="w-4 h-4 mr-2" />
        Export
      </button>
    </div>
  </div>

  <!-- Stats Bar -->
  <div class="flex items-center gap-6">
    <div class="flex items-center gap-2">
      <Network class="w-5 h-5 text-primary-400" />
      <span class="text-dark-300">{nodeCount} nodes</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-4 h-0.5 bg-success rounded" />
      <span class="text-dark-300">{edgeCount} edges</span>
    </div>
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 rounded-full bg-danger" />
      <span class="text-dark-300">Contaminated</span>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex gap-6">
    <!-- Graph Container -->
    <div class="flex-1 card relative overflow-hidden">
      <div bind:this={container} class="w-full h-full" />
      
      <!-- Controls -->
      <div class="absolute bottom-4 right-4 flex flex-col gap-2">
        <button class="btn-secondary p-2" on:click={zoomIn} title="Zoom In">
          <ZoomIn class="w-5 h-5" />
        </button>
        <button class="btn-secondary p-2" on:click={zoomOut} title="Zoom Out">
          <ZoomOut class="w-5 h-5" />
        </button>
        <button class="btn-secondary p-2" on:click={resetView} title="Reset View">
          <Maximize class="w-5 h-5" />
        </button>
      </div>

      <!-- Legend -->
      <div class="absolute top-4 left-4 card p-3">
        <p class="text-xs font-medium text-dark-400 mb-2">Node Types</p>
        <div class="space-y-1.5">
          {#each Object.entries(colors) as [type, color]}
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" style="background: {color}" />
              <span class="text-xs text-dark-300 capitalize">{type}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Side Panel -->
    <div class="w-80 card p-4 overflow-y-auto">
      {#if selectedNode}
        <h3 class="text-lg font-semibold text-white mb-4">Node Details</h3>
        <div class="space-y-4">
          <div>
            <label class="label">ID</label>
            <p class="text-dark-300 font-mono text-sm">{selectedNode}</p>
          </div>
          <div>
            <label class="label">Label</label>
            <p class="text-dark-300">{graph.getNodeAttribute(selectedNode, 'label')}</p>
          </div>
          <div>
            <label class="label">Type</label>
            <span class="badge badge-info capitalize">{graph.getNodeAttribute(selectedNode, 'type')}</span>
          </div>
          <div>
            <label class="label">Connections</label>
            <p class="text-dark-300">{graph.degree(selectedNode)} edges</p>
          </div>
          <div>
            <label class="label">Contamination Risk</label>
            <div class="mt-2 h-2 bg-dark-800 rounded-full overflow-hidden">
              <div class="h-full bg-warning rounded-full" style="width: {Math.random() * 100}%" />
            </div>
          </div>
        </div>
      {:else}
        <div class="h-full flex flex-col items-center justify-center text-center">
          <Network class="w-12 h-12 text-dark-600 mb-4" />
          <p class="text-dark-400">Click on a node to view details</p>
        </div>
      {/if}
    </div>
  </div>
</div>
