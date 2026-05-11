<script lang="ts">
  import type { Component } from 'svelte';
  import { TrendingUp, TrendingDown } from 'lucide-svelte';

  export let title: string;
  export let value: string;
  export let change: string;
  export let icon: Component;
  export let color: 'primary' | 'accent' | 'success' | 'warning' | 'danger' = 'primary';

  const colorClasses: Record<string, string> = {
    primary: 'bg-primary-500/10 text-primary-400',
    accent: 'bg-accent-500/10 text-accent-400',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };

  const isPositive = !change.startsWith('-');
</script>

<div class="card p-6">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-dark-400 text-sm">{title}</p>
      <p class="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
    <div class="w-12 h-12 rounded-xl {colorClasses[color]} flex items-center justify-center">
      <svelte:component this={icon} class="w-6 h-6" />
    </div>
  </div>
  <div class="mt-4 flex items-center gap-1">
    {#if isPositive}
      <TrendingUp class="w-4 h-4 text-success" />
    {:else}
      <TrendingDown class="w-4 h-4 text-danger" />
    {/if}
    <span class="text-sm {isPositive ? 'text-success' : 'text-danger'}">{change}</span>
    <span class="text-dark-500 text-sm">vs last week</span>
  </div>
</div>
