<script lang="ts">
  import { Users, Plus, MoreVertical, Shield, Mail, Crown } from 'lucide-svelte';

  const teamMembers = [
    {
      id: '1',
      name: 'Yethikrishna R',
      email: 'founder@myndlabs.tech',
      role: 'OWNER',
      avatar: 'Y',
      joined: 'Jan 15, 2024',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      email: 'sarah@myndlabs.tech',
      role: 'ADMIN',
      avatar: 'SC',
      joined: 'Feb 1, 2024',
    },
    {
      id: '3',
      name: 'Alex Kumar',
      email: 'alex@myndlabs.tech',
      role: 'EDITOR',
      avatar: 'AK',
      joined: 'Feb 15, 2024',
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@myndlabs.tech',
      role: 'VIEWER',
      avatar: 'EW',
      joined: 'Mar 1, 2024',
    },
  ];

  const roleColors: Record<string, string> = {
    OWNER: 'bg-primary-500/20 text-primary-400',
    ADMIN: 'bg-accent-500/20 text-accent-400',
    EDITOR: 'bg-success/20 text-success',
    VIEWER: 'bg-dark-700 text-dark-300',
  };

  const roleIcons: Record<string, any> = {
    OWNER: Crown,
    ADMIN: Shield,
    EDITOR: Mail,
    VIEWER: Users,
  };
</script>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-white">Team Management</h1>
      <p class="text-dark-400">Manage organization members and access permissions</p>
    </div>
    <button class="btn-primary">
      <Plus class="w-5 h-5 mr-2" />
      Invite Member
    </button>
  </div>

  <!-- Organization Info -->
  <div class="card p-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-white">MYND Labs</h3>
        <p class="text-dark-400">Organization settings and member management</p>
      </div>
      <button class="btn-secondary">
        Edit Organization
      </button>
    </div>
  </div>

  <!-- Team Members -->
  <div class="card overflow-hidden">
    <div class="p-4 border-b border-dark-800 flex items-center justify-between">
      <h3 class="text-lg font-semibold text-white">Team Members ({teamMembers.length})</h3>
      <div class="flex items-center gap-2">
        <input type="text" class="input py-2 text-sm w-64" placeholder="Search members..." />
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-dark-800">
            <th class="text-left p-4 text-sm font-medium text-dark-400">Member</th>
            <th class="text-left p-4 text-sm font-medium text-dark-400">Role</th>
            <th class="text-left p-4 text-sm font-medium text-dark-400">Joined</th>
            <th class="text-left p-4 text-sm font-medium text-dark-400">Status</th>
            <th class="text-left p-4 text-sm font-medium text-dark-400"></th>
          </tr>
        </thead>
        <tbody>
          {#each teamMembers as member}
            <tr class="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium text-sm">
                    {member.avatar}
                  </div>
                  <div>
                    <p class="text-white font-medium">{member.name}</p>
                    <p class="text-dark-500 text-sm">{member.email}</p>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span class="badge {roleColors[member.role]} inline-flex items-center gap-1.5">
                  <svelte:component this={roleIcons[member.role]} class="w-3.5 h-3.5" />
                  {member.role}
                </span>
              </td>
              <td class="p-4 text-dark-300 text-sm">{member.joined}</td>
              <td class="p-4">
                <span class="badge badge-success">Active</span>
              </td>
              <td class="p-4">
                <button class="p-2 rounded hover:bg-dark-700 transition-colors">
                  <MoreVertical class="w-5 h-5 text-dark-400" />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Roles Reference -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-white mb-4">Role Permissions</h3>
    <div class="grid md:grid-cols-4 gap-4">
      <div class="p-4 rounded-lg bg-dark-800/50">
        <div class="flex items-center gap-2 mb-3">
          <Crown class="w-5 h-5 text-primary-400" />
          <span class="font-medium text-white">OWNER</span>
        </div>
        <ul class="space-y-1 text-sm text-dark-400">
          <li>• Full organization access</li>
          <li>• Billing & subscription</li>
          <li>• Delete organization</li>
          <li>• All admin permissions</li>
        </ul>
      </div>
      <div class="p-4 rounded-lg bg-dark-800/50">
        <div class="flex items-center gap-2 mb-3">
          <Shield class="w-5 h-5 text-accent-400" />
          <span class="font-medium text-white">ADMIN</span>
        </div>
        <ul class="space-y-1 text-sm text-dark-400">
          <li>• Invite/remove members</li>
          <li>• Manage roles</li>
          <li>• API key management</li>
          <li>• All editor permissions</li>
        </ul>
      </div>
      <div class="p-4 rounded-lg bg-dark-800/50">
        <div class="flex items-center gap-2 mb-3">
          <Mail class="w-5 h-5 text-success" />
          <span class="font-medium text-white">EDITOR</span>
        </div>
        <ul class="space-y-1 text-sm text-dark-400">
          <li>• Create fossils</li>
          <li>• Run analysis</li>
          <li>• Export reports</li>
          <li>• All viewer permissions</li>
        </ul>
      </div>
      <div class="p-4 rounded-lg bg-dark-800/50">
        <div class="flex items-center gap-2 mb-3">
          <Users class="w-5 h-5 text-dark-400" />
          <span class="font-medium text-white">VIEWER</span>
        </div>
        <ul class="space-y-1 text-sm text-dark-400">
          <li>• View dashboards</li>
          <li>• Read-only access</li>
          <li>• View fossils</li>
          <li>• No write access</li>
        </ul>
      </div>
    </div>
  </div>
</div>
