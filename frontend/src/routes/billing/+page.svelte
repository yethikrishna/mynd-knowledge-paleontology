<script lang="ts">
  import { CreditCard, Check, X, Crown, Zap, Building, ArrowRight } from 'lucide-svelte';

  const currentPlan = 'Pro';

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'For individual researchers',
      icon: Zap,
      color: 'text-dark-400',
      bgColor: 'bg-dark-800',
      features: [
        { text: '100 knowledge fossils/month', included: true },
        { text: 'Basic contamination detection', included: true },
        { text: 'Community support', included: true },
        { text: 'Stratigraphic analysis', included: true },
        { text: 'Network visualization', included: false },
        { text: 'Merkle proof verification', included: false },
        { text: 'API access', included: false },
        { text: 'Team collaboration', included: false },
      ],
      cta: 'Current Plan',
      disabled: currentPlan === 'Free',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 49,
      description: 'For professional teams',
      icon: Crown,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
      popular: true,
      features: [
        { text: '10,000 knowledge fossils/month', included: true },
        { text: 'Advanced contamination detection', included: true },
        { text: 'Priority support', included: true },
        { text: 'Stratigraphic analysis', included: true },
        { text: 'Network visualization', included: true },
        { text: 'Merkle proof verification', included: true },
        { text: 'API access (10K req/month)', included: true },
        { text: 'Team collaboration (5 members)', included: true },
      ],
      cta: currentPlan === 'Pro' ? 'Current Plan' : 'Upgrade to Pro',
      disabled: currentPlan === 'Pro',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: null,
      description: 'For large organizations',
      icon: Building,
      color: 'text-accent-400',
      bgColor: 'bg-accent-500/10',
      features: [
        { text: 'Unlimited knowledge fossils', included: true },
        { text: 'Real-time contamination alerts', included: true },
        { text: '24/7 dedicated support', included: true },
        { text: 'Custom stratigraphic models', included: true },
        { text: 'Advanced network analytics', included: true },
        { text: 'Full Merkle tree audit', included: true },
        { text: 'Unlimited API access', included: true },
        { text: 'Unlimited team members', included: true },
      ],
      cta: 'Contact Sales',
      disabled: false,
    },
  ];

  const usage = {
    fossils: 1247,
    fossilsLimit: 10000,
    apiCalls: 3421,
    apiCallsLimit: 10000,
    storage: 2.4,
    storageLimit: 50,
  };
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div>
    <h1 class="text-2xl font-bold text-white">Billing & Subscription</h1>
    <p class="text-dark-400">Manage your subscription and payment methods</p>
  </div>

  <!-- Current Plan -->
  <div class="card p-6 border-primary-600/30">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
          <Crown class="w-6 h-6 text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white">{currentPlan} Plan</h3>
          <p class="text-dark-400">Your subscription renews on May 15, 2024</p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-white">$49/month</div>
        <button class="text-sm text-primary-400 hover:text-primary-300 mt-1">
          Manage Subscription
        </button>
      </div>
    </div>
  </div>

  <!-- Usage Stats -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-white mb-4">Usage This Month</h3>
    <div class="grid md:grid-cols-3 gap-6">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-dark-400">Knowledge Fossils</span>
          <span class="text-white font-medium">{usage.fossils} / {usage.fossilsLimit}</span>
        </div>
        <div class="h-2 bg-dark-800 rounded-full overflow-hidden">
          <div class="h-full bg-primary-500 rounded-full" style="width: {usage.fossils / usage.fossilsLimit * 100}%" />
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-dark-400">API Calls</span>
          <span class="text-white font-medium">{usage.apiCalls} / {usage.apiCallsLimit}</span>
        </div>
        <div class="h-2 bg-dark-800 rounded-full overflow-hidden">
          <div class="h-full bg-accent-500 rounded-full" style="width: {usage.apiCalls / usage.apiCallsLimit * 100}%" />
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-dark-400">Storage</span>
          <span class="text-white font-medium">{usage.storage} GB / {usage.storageLimit} GB</span>
        </div>
        <div class="h-2 bg-dark-800 rounded-full overflow-hidden">
          <div class="h-full bg-success rounded-full" style="width: {usage.storage / usage.storageLimit * 100}%" />
        </div>
      </div>
    </div>
  </div>

  <!-- Pricing Plans -->
  <div class="grid md:grid-cols-3 gap-6">
    {#each plans as plan}
      <div class="card p-6 relative {plan.popular ? 'border-primary-500/50' : ''}">
        {#if plan.popular}
          <div class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="badge badge-primary">Most Popular</span>
          </div>
        {/if}
        
        <div class="text-center mb-6">
          <div class="w-14 h-14 rounded-xl {plan.bgColor} flex items-center justify-center mx-auto mb-4">
            <svelte:component this={plan.icon} class="w-7 h-7 {plan.color}" />
          </div>
          <h3 class="text-xl font-bold text-white">{plan.name}</h3>
          <p class="text-dark-400 text-sm mt-1">{plan.description}</p>
          <div class="mt-4">
            {#if plan.price !== null}
              <span class="text-4xl font-bold text-white">${plan.price}</span>
              <span class="text-dark-500">/month</span>
            {:else}
              <span class="text-2xl font-bold text-white">Custom</span>
            {/if}
          </div>
        </div>

        <ul class="space-y-3 mb-6">
          {#each plan.features as feature}
            <li class="flex items-start gap-2">
              {#if feature.included}
                <Check class="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              {:else}
                <X class="w-5 h-5 text-dark-600 flex-shrink-0 mt-0.5" />
              {/if}
              <span class="text-sm {feature.included ? 'text-dark-300' : 'text-dark-600'}">
                {feature.text}
              </span>
            </li>
          {/each}
        </ul>

        <button 
          class="w-full {plan.popular ? 'btn-primary' : 'btn-secondary'}"
          disabled={plan.disabled}
        >
          {plan.cta}
          {#if !plan.disabled && plan.price !== null}
            <ArrowRight class="w-4 h-4 ml-2" />
          {/if}
        </button>
      </div>
    {/each}
  </div>

  <!-- Payment Methods -->
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white">Payment Methods</h3>
      <button class="btn-secondary text-sm">
        <CreditCard class="w-4 h-4 mr-2" />
        Add Payment Method
      </button>
    </div>
    
    <div class="p-4 rounded-lg bg-dark-800/50 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-8 rounded bg-dark-700 flex items-center justify-center">
          <span class="text-xs font-bold text-white">VISA</span>
        </div>
        <div>
          <p class="text-white font-medium">•••• •••• •••• 4242</p>
          <p class="text-dark-500 text-sm">Expires 12/26</p>
        </div>
      </div>
      <span class="badge badge-success">Default</span>
    </div>
  </div>
</div>
