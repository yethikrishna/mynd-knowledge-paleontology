<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Sigma from 'sigma';
  import Graph from 'graphology';

  let container: HTMLDivElement;
  let renderer: Sigma;

  onMount(() => {
    // Create demo graph for animation
    const graph = new Graph();
    
    // Add nodes
    const nodeTypes = ['model', 'agent', 'dataset', 'training_run'];
    const colors = {
      model: '#3b82f6',
      agent: '#8b5cf6',
      dataset: '#10b981',
      training_run: '#f59e0b',
    };

    for (let i = 0; i < 30; i++) {
      const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      graph.addNode(`node-${i}`, {
        x: Math.random() * 10,
        y: Math.random() * 10,
        size: 5 + Math.random() * 10,
        color: colors[type as keyof typeof colors],
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`,
      });
    }

    // Add edges
    for (let i = 0; i < 50; i++) {
      const source = Math.floor(Math.random() * 30);
      let target = Math.floor(Math.random() * 30);
      while (target === source) target = Math.floor(Math.random() * 30);
      
      const hasContamination = Math.random() > 0.85;
      graph.addEdge(`node-${source}`, `node-${target}`, {
        size: 1 + Math.random() * 2,
        color: hasContamination ? '#ef4444' : '#22c55e',
      });
    }

    // Initialize sigma
    renderer = new Sigma(graph, container, {
      allowInvalidContainer: true,
      renderEdgeLabels: false,
    });

    // Animate
    let animationFrame: number;
    const animate = () => {
      graph.forEachNode((node) => {
        const attrs = graph.getNodeAttributes(node);
        attrs.x += (Math.random() - 0.5) * 0.02;
        attrs.y += (Math.random() - 0.5) * 0.02;
      });
      renderer.refresh();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    onDestroy(() => {
      cancelAnimationFrame(animationFrame);
      renderer.kill();
    });
  });
</script>

<div bind:this={container} class="w-full h-full" />
