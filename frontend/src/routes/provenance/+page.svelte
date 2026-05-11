<script lang="ts">
  import { Link, Shield, CheckCircle, XCircle, ChevronRight } from 'lucide-svelte';

  const provenanceChain = [
    {
      id: '1',
      fossilId: 'fossil-001',
      name: 'Original Training Data',
      type: 'dataset',
      timestamp: '2024-01-15 09:30:00',
      confidence: 1.0,
      verified: true,
      contamination: 0,
    },
    {
      id: '2',
      fossilId: 'fossil-042',
      name: 'Base Model v1.0',
      type: 'model',
      timestamp: '2024-02-20 14:15:00',
      confidence: 0.98,
      verified: true,
      contamination: 0.02,
    },
    {
      id: '3',
      fossilId: 'fossil-156',
      name: 'Fine-tuning Run #42',
      type: 'training_run',
      timestamp: '2024-03-05 11:45:00',
      confidence: 0.95,
      verified: true,
      contamination: 0.05,
    },
    {
      id: '4',
      fossilId: 'fossil-284',
      name: 'Agent Model Alpha',
      type: 'agent',
      timestamp: '2024-03-18 16:20:00',
      confidence: 0.92,
      verified: true,
      contamination: 0.08,
    },
    {
      id: '5',
      fossilId: 'fossil-412',
      name: 'Distilled Model Lite',
      type: 'model',
      timestamp: '2024-04-02 08:00:00',
      confidence: 0.87,
      verified: false,
      contamination: 0.13,
    },
  ];

  const trustScore = 0.92;
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div>
    <h1 class="text-2xl font-bold text-white">Provenance Chain Explorer</h1>
    <p class="text-dark-400">Cryptographic chain-of-custody verification</p>
  </div>

  <!-- Trust Score Card -->
  <div class="card p-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-white mb-2">Chain Trust Score</h3>
        <p class="text-dark-400">Overall confidence in this provenance chain</p>
      </div>
      <div class="text-right">
        <div class="text-4xl font-bold text-success">{Math.round(trustScore * 100)}%</div>
        <div class="text-sm text-dark-500">Cryptographically verified</div>
      </div>
    </div>
    <div class="mt-4 h-3 bg-dark-800 rounded-full overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-success to-primary-500 rounded-full transition-all" 
        style="width: {trustScore * 100}%"
      />
    </div>
  </div>

  <!-- Chain Visualization -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-white mb-6">Chain of Custody</h3>
    
    <div class="relative">
      <!-- Vertical line -->
      <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-700" />
      
      <div class="space-y-6">
        {#each provenanceChain as link, i}
          <div class="relative flex items-start gap-4 pl-12">
            <!-- Node -->
            <div class="absolute left-4 w-5 h-5 rounded-full border-4 {
              link.verified ? 'bg-success border-success/30' : 'bg-warning border-warning/30'
            }" />
            
            <!-- Content -->
            <div class="flex-1 card p-4 hover:border-primary-600/50 transition-all cursor-pointer">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-medium text-white">{link.name}</h4>
                    {#if link.verified}
                      <Shield class="w-4 h-4 text-success" />
                    {:else}
                      <XCircle class="w-4 h-4 text-warning" />
                    {/if}
                  </div>
                  <p class="text-dark-500 text-sm">
                    {link.fossilId} • {link.timestamp}
                  </p>
                </div>
                <div class="text-right">
                  <span class="badge {link.confidence > 0.95 ? 'badge-success' : 'badge-info'}">
                    {Math.round(link.confidence * 100)}% confidence
                  </span>
                  {#if link.contamination > 0.1}
                    <p class="text-xs text-warning mt-1">
                      {Math.round(link.contamination * 100)}% contamination
                    </p>
                  {/if}
                </div>
              </div>
              
              <!-- Transfer method -->
              {#if i < provenanceChain.length - 1}
                <div class="mt-3 pt-3 border-t border-dark-800">
                  <div class="flex items-center gap-2 text-sm text-dark-400">
                    <ChevronRight class="w-4 h-4" />
                    <span>Transfer via: {['dataset export', 'fine-tuning', 'distillation', 'RAG injection'][i]}</span>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Merkle Proof Section -->
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white">Merkle Tree Verification</h3>
      <button class="btn-primary">
        <CheckCircle class="w-4 h-4 mr-2" />
        Verify Proof
      </button>
    </div>
    
    <div class="bg-dark-950 rounded-lg p-4 font-mono text-sm">
      <div class="text-dark-500 mb-2">// Merkle Root</div>
      <div class="text-primary-400 break-all">
        0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
      </div>
      <div class="text-dark-500 mt-4 mb-2">// Proof Path</div>
      <div class="text-accent-400 break-all text-xs">
        [0x1234..., 0x5678..., 0x9abc..., 0xdef0...]
      </div>
    </div>
  </div>
</div>
