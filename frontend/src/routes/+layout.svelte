<script lang="ts">
  import './app.css';
  import { page } from '$app/stores';
  import Sidebar from '$components/Sidebar.svelte';
  import Header from '$components/Header.svelte';
</script>

{#if $page.url.pathname === '/' || $page.url.pathname.startsWith('/login') || $page.url.pathname.startsWith('/register')}
  <!-- Marketing/Auth pages - no sidebar -->
  <slot />
{:else}
  <!-- App layout with sidebar -->
  <div class="flex h-screen overflow-hidden">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main class="flex-1 overflow-auto p-6 bg-dark-950">
        <slot />
      </main>
    </div>
  </div>
{/if}
