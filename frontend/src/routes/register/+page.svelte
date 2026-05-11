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
      <h1 class="text-2xl font-bold text-white mt-4">Create your account</h1>
      <p class="text-dark-400 mt-2">Start fossilizing your knowledge artifacts</p>
    </div>

    <!-- Card -->
    <div class="card p-8">
      <!-- Social Login -->
      <div class="space-y-3 mb-6">
        <button class="btn-secondary w-full">
          <Chrome class="w-5 h-5 mr-2" />
          Sign up with Google
        </button>
        <button class="btn-secondary w-full">
          <Github class="w-5 h-5 mr-2" />
          Sign up with GitHub
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
          <label class="label">Full Name</label>
          <input type="text" class="input" placeholder="John Doe" />
        </div>
        <div>
          <label class="label">Organization Name</label>
          <input type="text" class="input" placeholder="My Company" />
        </div>
        <div>
          <label class="label">Email</label>
          <input type="email" class="input" placeholder="you@example.com" />
        </div>
        <div>
          <label class="label">Password</label>
          <input type="password" class="input" placeholder="••••••••" />
        </div>

        <label class="flex items-start gap-2">
          <input type="checkbox" class="rounded border-dark-700 bg-dark-800 text-primary-500 focus:ring-primary-500 mt-0.5" />
          <span class="text-sm text-dark-400">
            I agree to the <a href="#" class="text-primary-400">Terms of Service</a> and 
            <a href="#" class="text-primary-400">Privacy Policy</a>
          </span>
        </label>

        <button type="submit" class="btn-primary w-full">
          Create Account
        </button>
      </form>
    </div>

    <p class="text-center text-dark-500 mt-6">
      Already have an account? 
      <a href="/login" class="text-primary-400 hover:text-primary-300">Sign in</a>
    </p>
  </div>
</div>
