<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Fossil, 
    Layers, 
    Network, 
    Shield, 
    Search, 
    Clock, 
    Link, 
    AlertTriangle,
    ChevronRight,
    Github,
    Check
  } from 'lucide-svelte';
  import NetworkAnimation from '$components/NetworkAnimation.svelte';

  const features = [
    {
      icon: Fossil,
      title: 'Knowledge Fossilization',
      description: 'Timestamp every knowledge artifact with cryptographic Merkle tree proof of origin.',
    },
    {
      icon: Layers,
      title: 'Stratigraphic Layers',
      description: 'Map geological depth of knowledge based on age, propagation, and retention.',
    },
    {
      icon: Network,
      title: 'Diffusion Network',
      description: 'Track knowledge propagation across models, agents, and fine-tuning runs.',
    },
    {
      icon: AlertTriangle,
      title: 'Contamination Detection',
      description: 'Detect semantic mutation and knowledge drift during transfer.',
    },
    {
      icon: Link,
      title: 'Provenance Chains',
      description: 'Complete chain-of-custody verification with cryptographic proof.',
    },
    {
      icon: Search,
      title: 'First Occurrence',
      description: 'Find the exact origin of any fact or concept in the AI ecosystem.',
    },
    {
      icon: Clock,
      title: 'Extinction Detection',
      description: 'Detect when knowledge is forgotten during distillation or quantization.',
    },
    {
      icon: Shield,
      title: 'Immutable Audit Log',
      description: 'Cryptographically secured audit trail for compliance and governance.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For individual researchers',
      features: [
        '100 knowledge fossils',
        '5 model connections',
        '1GB storage',
        '1,000 API calls/month',
        'Community support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$99',
      description: 'For ML teams and startups',
      features: [
        '10,000 knowledge fossils',
        '50 model connections',
        '100GB storage',
        '100,000 API calls/month',
        'Priority support',
        'Team collaboration',
        'Advanced analytics',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited fossils',
        'Unlimited models',
        'Unlimited storage',
        'Unlimited API calls',
        'Dedicated support',
        'SSO & RBAC',
        'On-premise deployment',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];
</script>

<div class="min-h-screen bg-dark-950">
  <!-- Navigation -->
  <nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-800">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <Fossil class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="font-bold text-white">MYND</h1>
          <p class="text-xs text-dark-400 hidden sm:block">Knowledge Paleontology</p>
        </div>
      </a>
      
      <div class="hidden md:flex items-center gap-8">
        <a href="#features" class="text-dark-400 hover:text-white transition-colors">Features</a>
        <a href="#pricing" class="text-dark-400 hover:text-white transition-colors">Pricing</a>
        <a href="/docs" class="text-dark-400 hover:text-white transition-colors">Docs</a>
      </div>

      <div class="flex items-center gap-3">
        <a href="https://github.com" target="_blank" class="p-2 rounded-lg hover:bg-dark-800 transition-colors">
          <Github class="w-5 h-5 text-dark-400" />
        </a>
        <a href="/login" class="btn-secondary text-sm">Log In</a>
        <a href="/register" class="btn-primary text-sm">Get Started</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="pt-32 pb-20 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <span class="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span class="text-sm text-primary-400">MYND Layer 3 — Data & Knowledge</span>
          </div>
          
          <h1 class="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            The <span class="gradient-text">Fossil Record</span> of AI Knowledge
          </h1>
          
          <p class="text-xl text-dark-400 mb-8 leading-relaxed">
            Track knowledge origin, propagation, and mutation across AI systems. 
            The world's first knowledge provenance and archaeology platform.
          </p>
          
          <div class="flex flex-wrap gap-4">
            <a href="/register" class="btn-primary text-lg px-8 py-3">
              Start Free Trial
              <ChevronRight class="w-5 h-5 ml-2" />
            </a>
            <a href="#features" class="btn-secondary text-lg px-8 py-3">
              Explore Features
            </a>
          </div>

          <div class="mt-12 flex items-center gap-8">
            <div>
              <div class="text-3xl font-bold text-white">7</div>
              <div class="text-sm text-dark-500">Core Algorithms</div>
            </div>
            <div class="w-px h-12 bg-dark-800" />
            <div>
              <div class="text-3xl font-bold text-white">100%</div>
              <div class="text-sm text-dark-500">Cryptographically Verified</div>
            </div>
            <div class="w-px h-12 bg-dark-800" />
            <div>
              <div class="text-3xl font-bold text-white">Open</div>
              <div class="text-sm text-dark-500">Source Core</div>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-3xl" />
          <div class="relative card p-6 h-96">
            <NetworkAnimation />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-20 px-6 border-t border-dark-800">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-white mb-4">7 Core Engine Features</h2>
        <p class="text-xl text-dark-400 max-w-2xl mx-auto">
          Revolutionary algorithms for knowledge archaeology and provenance tracking
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each features as feature}
          <div class="card-hover p-6">
            <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4">
              <svelte:component this={feature.icon} class="w-6 h-6 text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p class="text-dark-400 text-sm">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="py-20 px-6 border-t border-dark-800">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
        <p class="text-xl text-dark-400 max-w-2xl mx-auto">
          Start free, scale as you grow. No hidden fees.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        {#each pricingPlans as plan}
          <div class="card p-8 {plan.highlighted ? 'border-primary-500 relative' : ''}">
            {#if plan.highlighted}
              <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                Most Popular
              </div>
            {/if}
            
            <h3 class="text-xl font-semibold text-white mb-2">{plan.name}</h3>
            <div class="mb-4">
              <span class="text-4xl font-bold text-white">{plan.price}</span>
              {#if plan.price !== 'Custom'}
                <span class="text-dark-500">/month</span>
              {/if}
            </div>
            <p class="text-dark-400 mb-6">{plan.description}</p>
            
            <ul class="space-y-3 mb-8">
              {#each plan.features as feature}
                <li class="flex items-start gap-3">
                  <Check class="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span class="text-dark-300 text-sm">{feature}</span>
                </li>
              {/each}
            </ul>

            <a 
              href="/register" 
              class="{plan.highlighted ? 'btn-primary' : 'btn-secondary'} w-full"
            >
              {plan.cta}
            </a>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-20 px-6 border-t border-dark-800">
    <div class="max-w-4xl mx-auto text-center">
      <h2 class="text-4xl font-bold text-white mb-6">
        Ready to excavate your AI knowledge?
      </h2>
      <p class="text-xl text-dark-400 mb-8">
        Start fossilizing your knowledge artifacts today. No credit card required.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/register" class="btn-primary text-lg px-8 py-3">
          Get Started Free
        </a>
        <a href="/docs" class="btn-secondary text-lg px-8 py-3">
          Read Documentation
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 px-6 border-t border-dark-800">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Fossil class="w-4 h-4 text-white" />
          </div>
          <span class="font-semibold text-white">MYND Knowledge Paleontology</span>
        </div>
        <div class="text-dark-500 text-sm">
          © 2026 MYND Labs. Open source under Apache 2.0.
        </div>
      </div>
    </div>
  </footer>
</div>
