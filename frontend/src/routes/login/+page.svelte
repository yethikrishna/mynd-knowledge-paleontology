<script lang="ts">
  import { Fossil, Github, Chrome } from 'lucide-svelte';
</script>

<div class="min-h-screen bg-dark-950 flex items-center justify-center p-6">
  <div class="w-full max-w-md">
    <!-- Logo -->
    <div class="text-center mb-8">
      <a href="/" class="inline-flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <Fossil class="w-6 h-6 text-white" />
        </div>
      </a>
      <h1 class="text-2xl font-bold text-white mt-4">Welcome back</h1>
      <p class="text-dark-400 mt-2">Sign in to your MYND account</p>
    </div>

    <!-- Card -->
    <div class="card p-8">
      <!-- Social Login -->
      <div class="space-y-3 mb-6">
        <button class="btn-secondary w-full">
          <Chrome class="w-5 h-5 mr-2" />
          Continue with Google
        </button>
        <button class="btn-secondary w-full">
          <Github class="w-5 h-5 mr-2" />
          Continue with GitHub
        </button>
      </div>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-dark-700" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-dark-900 text-dark-500">or continue with email</span>
        </div>
      </div>

      <!-- Form -->
      <form class="space-y-4">
        <div>
          <label class="label">Email</label>
          <input type="email" class="input" placeholder="you@example.com" />
        </div>
        <div>
          <label class="label">Password</label>
          <input type="password" class="input" placeholder="••••••••" />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2">
            <input type="checkbox" class="rounded border-dark-700 bg-dark-800 text-primary-500 focus:ring-primary-500" />
            <span class="text-sm text-dark-400">Remember me</span>
          </label>
          <a href="#" class="text-sm text-primary-400 hover:text-primary-300">Forgot password?</a>
        </div>

        <button type="submit" class="btn-primary w-full">
          Sign In
        </button>
      </form>
    </div>

    <p class="text-center text-dark-500 mt-6">
      Don't have an account? 
      <a href="/register" class="text-primary-400 hover:text-primary-300">Sign up</a>
    </p>
  </div>
</div>
