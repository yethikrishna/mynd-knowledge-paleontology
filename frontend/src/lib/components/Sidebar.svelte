<script lang="ts">
  import { page } from '$app/stores';
  import { 
    LayoutDashboard, 
    Network, 
    Layers, 
    Link, 
    AlertTriangle, 
    Search, 
    Clock, 
    Users, 
    CreditCard,
    Fossil
  } from 'lucide-svelte';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/network', label: 'Diffusion Network', icon: Network },
    { href: '/stratigraphy', label: 'Stratigraphic Layers', icon: Layers },
    { href: '/provenance', label: 'Provenance Chain', icon: Link },
    { href: '/contamination', label: 'Contamination', icon: AlertTriangle },
    { href: '/search', label: 'First Occurrence', icon: Search },
    { href: '/extinction', label: 'Extinction Events', icon: Clock },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/billing', label: 'Billing', icon: CreditCard },
  ];
</script>

<aside class="w-64 bg-dark-900 border-r border-dark-800 flex flex-col">
  <!-- Logo -->
  <div class="p-4 border-b border-dark-800">
    <a href="/dashboard" class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
        <Fossil class="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 class="font-bold text-white">MYND</h1>
        <p class="text-xs text-dark-400">Knowledge Paleontology</p>
      </div>
    </a>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 p-3 space-y-1 overflow-y-auto">
    {#each navItems as item}
      <a 
        href={item.href}
        class:nav-link-active={$page.url.pathname === item.href}
        class="nav-link"
      >
        <svelte:component this={item.icon} class="w-5 h-5" />
        <span class="text-sm">{item.label}</span>
      </a>
    {/each}
  </nav>

  <!-- Plan Badge -->
  <div class="p-4 border-t border-dark-800">
    <div class="card p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-dark-400">Current Plan</span>
        <span class="badge badge-success">Pro</span>
      </div>
      <div class="text-xs text-dark-500">
        842 / 10,000 fossils used
      </div>
      <div class="mt-2 h-1.5 bg-dark-800 rounded-full overflow-hidden">
        <div class="h-full bg-primary-500 rounded-full" style="width: 8.42%" />
      </div>
    </div>
  </div>
</aside>
