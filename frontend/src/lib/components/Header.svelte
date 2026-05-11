<script lang="ts">
  import { Bell, Search, User, ChevronDown } from 'lucide-svelte';
</script>

<header class="h-16 bg-dark-900 border-b border-dark-800 flex items-center justify-between px-6">
  <!-- Search -->
  <div class="flex-1 max-w-md">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
      <input 
        type="text" 
        placeholder="Search knowledge fossils..." 
        class="input pl-10 py-1.5 text-sm"
      />
    </div>
  </div>

  <!-- Right side -->
  <div class="flex items-center gap-4">
    <!-- Notifications -->
    <button class="relative p-2 rounded-lg hover:bg-dark-800 transition-colors">
      <Bell class="w-5 h-5 text-dark-400" />
      <span class="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
    </button>

    <!-- User menu -->
    <button class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-800 transition-colors">
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
        <User class="w-4 h-4 text-white" />
      </div>
      <div class="text-left hidden sm:block">
        <p class="text-sm font-medium text-white">Demo User</p>
        <p class="text-xs text-dark-500">demo@myndlabs.tech</p>
      </div>
      <ChevronDown class="w-4 h-4 text-dark-500 hidden sm:block" />
    </button>
  </div>
</header>
