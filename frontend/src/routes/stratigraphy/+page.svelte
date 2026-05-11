<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { Layers, Info, Download } from 'lucide-svelte';

  let svgContainer: HTMLDivElement;

  const layers = [
    { name: 'Holocene', depth: 1, color: '#0ea5e9', fossils: 15, age: '0-11k years' },
    { name: 'Pleistocene', depth: 2, color: '#0284c7', fossils: 42, age: '11k-2.6M years' },
    { name: 'Pliocene', depth: 4, color: '#0369a1', fossils: 68, age: '2.6-5.3M years' },
    { name: 'Miocene', depth: 6, color: '#075985', fossils: 95, age: '5.3-23M years' },
    { name: 'Oligocene', depth: 8, color: '#0c4a6e', fossils: 87, age: '23-34M years' },
    { name: 'Eocene', depth: 9.5, color: '#082f49', fossils: 53, age: '34-56M years' },
    { name: 'Paleocene', depth: 10, color: '#042f2e', fossils: 29, age: '56-66M years' },
    { name: 'Precambrian', depth: 11, color: '#020617', fossils: 12, age: '>66M years' },
  ];

  onMount(() => {
    renderStratigraphy();
  });

  function renderStratigraphy() {
    const width = svgContainer.clientWidth;
    const height = 600;
    const margin = { top: 20, right: 150, bottom: 40, left: 120 };

    const svg = d3.select(svgContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(layers, d => d.fossils) || 100])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleBand()
      .domain(layers.map(d => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    // Draw layers
    layers.forEach((layer, i) => {
      const barWidth = xScale(layer.fossils) - margin.left;
      
      svg.append('rect')
        .attr('x', margin.left)
        .attr('y', yScale(layer.name) || 0)
        .attr('width', barWidth)
        .attr('height', yScale.bandwidth())
        .attr('fill', layer.color)
        .attr('opacity', 0.8)
        .attr('rx', 4)
        .on('mouseover', function() {
          d3.select(this).attr('opacity', 1);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 0.8);
        });

      // Fossil count label
      svg.append('text')
        .attr('x', xScale(layer.fossils) + 10)
        .attr('y', (yScale(layer.name) || 0) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('fill', '#94a3b8')
        .attr('font-size', '12px')
        .text(`${layer.fossils} fossils`);
    });

    // Y axis
    svg.append('g')
      .selectAll('text')
      .data(layers)
      .join('text')
      .attr('x', margin.left - 10)
      .attr('y', d => (yScale(d.name) || 0) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', '#e2e8f0')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .text(d => d.name);

    // Age labels
    svg.append('g')
      .selectAll('text')
      .data(layers)
      .join('text')
      .attr('x', margin.left - 10)
      .attr('y', d => (yScale(d.name) || 0) + yScale.bandwidth() / 2 + 16)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .text(d => d.age);

    // Depth indicator
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '12px')
      .text('← Deeper Knowledge (Older) | Shallower Knowledge (Newer) →');
  }
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-white">Stratigraphic Layers</h1>
      <p class="text-dark-400">Geological depth mapping of knowledge artifacts</p>
    </div>
    <button class="btn-secondary">
      <Download class="w-4 h-4 mr-2" />
      Export Report
    </button>
  </div>

  <!-- Info Card -->
  <div class="card p-4 flex items-start gap-4">
    <div class="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
      <Info class="w-5 h-5 text-primary-400" />
    </div>
    <div>
      <h3 class="font-medium text-white">About Stratigraphic Depth</h3>
      <p class="text-dark-400 text-sm mt-1">
        Knowledge depth is calculated based on three factors: temporal age (40%), 
        propagation breadth (40%), and retention through fine-tuning cycles (20%).
        Older, widely-spread, well-retained knowledge sinks to deeper geological layers.
      </p>
    </div>
  </div>

  <!-- Stratigraphy Visualization -->
  <div class="card p-6">
    <div bind:this={svgContainer} class="w-full" />
  </div>

  <!-- Layer Details Grid -->
  <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each layers as layer}
      <div class="card p-4 border-l-4" style="border-left-color: {layer.color}">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-white">{layer.name}</h3>
          <Layers class="w-5 h-5" style="color: {layer.color}" />
        </div>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-dark-500">Depth</span>
            <span class="text-dark-300">{layer.depth}m</span>
          </div>
          <div class="flex justify-between">
            <span class="text-dark-500">Fossils</span>
            <span class="text-dark-300">{layer.fossils}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-dark-500">Age</span>
            <span class="text-dark-300">{layer.age}</span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
