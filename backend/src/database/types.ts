import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface OrganizationsTable {
  id: Generated<string>;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
}

export interface UsersTable {
  id: Generated<string>;
  email: string;
  password_hash: string | null;
  name: string | null;
  avatar_url: string | null;
  google_id: string | null;
  github_id: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
}

export interface OrganizationMembersTable {
  id: Generated<string>;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
}

export interface ApiKeysTable {
  id: Generated<string>;
  organization_id: string;
  name: string;
  key_hash: string;
  last_used_at: Timestamp | null;
  expires_at: Timestamp | null;
  created_at: Generated<Timestamp>;
}

export interface KnowledgeFossilsTable {
  id: Generated<string>;
  organization_id: string;
  hash: string;
  content: string;
  content_preview: string;
  embedding: string | null; // JSON array
  source_type: 'model' | 'dataset' | 'training_run' | 'manual' | 'api';
  source_id: string | null;
  source_metadata: string | null; // JSON
  merkle_root: string;
  merkle_proof: string | null; // JSON
  timestamp: Timestamp;
  stratigraphic_depth: number;
  contamination_score: number;
  first_occurrence_id: string | null;
  created_at: Generated<Timestamp>;
}

export interface MerkleTreeNodesTable {
  id: Generated<string>;
  fossil_id: string;
  tree_id: string;
  node_hash: string;
  node_index: number;
  tree_level: number;
  is_leaf: boolean;
  created_at: Generated<Timestamp>;
}

export interface ProvenanceChainsTable {
  id: Generated<string>;
  fossil_id: string;
  parent_fossil_id: string | null;
  source_node_id: string | null;
  target_node_id: string | null;
  transfer_method: string;
  transfer_timestamp: Timestamp;
  confidence_score: number;
  contamination_introduced: number;
  proof_verified: boolean;
  created_at: Generated<Timestamp>;
}

export interface PropagationEdgesTable {
  id: Generated<string>;
  organization_id: string;
  from_node_id: string;
  to_node_id: string;
  knowledge_ids: string | null; // JSON array
  transfer_method: 'finetune' | 'distillation' | 'rag' | 'api' | 'manual';
  timestamp: Timestamp;
  confidence: number;
  contamination_introduced: number;
  created_at: Generated<Timestamp>;
}

export interface ModelNodesTable {
  id: Generated<string>;
  organization_id: string;
  name: string;
  type: 'model' | 'agent' | 'dataset' | 'training_run';
  version: string | null;
  parent_id: string | null;
  metadata: string | null; // JSON
  created_at: Generated<Timestamp>;
}

export interface ContaminationEventsTable {
  id: Generated<string>;
  fossil_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  detection_method: string;
  mutation_details: string | null; // JSON
  remediated: boolean;
  remediated_at: Timestamp | null;
  created_at: Generated<Timestamp>;
}

export interface ExtinctionEventsTable {
  id: Generated<string>;
  organization_id: string;
  knowledge_id: string;
  model_id: string;
  model_version: string;
  timestamp: Timestamp;
  severity: 'partial' | 'complete';
  recovery_suggestions: string | null; // JSON array
  affected_downstream: string | null; // JSON array
  created_at: Generated<Timestamp>;
}

export interface StratigraphicLayersTable {
  id: Generated<string>;
  fossil_id: string;
  layer_depth: number;
  layer_name: string;
  temporal_score: number;
  propagation_score: number;
  retention_score: number;
  epoch_start: Timestamp;
  epoch_end: Timestamp | null;
  created_at: Generated<Timestamp>;
}

export interface AuditLogsTable {
  id: Generated<string>;
  organization_id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: string | null; // JSON
  ip_address: string | null;
  user_agent: string | null;
  created_at: Generated<Timestamp>;
}

export interface DB {
  organizations: OrganizationsTable;
  users: UsersTable;
  organization_members: OrganizationMembersTable;
  api_keys: ApiKeysTable;
  knowledge_fossils: KnowledgeFossilsTable;
  merkle_tree_nodes: MerkleTreeNodesTable;
  provenance_chains: ProvenanceChainsTable;
  propagation_edges: PropagationEdgesTable;
  model_nodes: ModelNodesTable;
  contamination_events: ContaminationEventsTable;
  extinction_events: ExtinctionEventsTable;
  stratigraphic_layers: StratigraphicLayersTable;
  audit_logs: AuditLogsTable;
}

export type Organization = Selectable<OrganizationsTable>;
export type NewOrganization = Insertable<OrganizationsTable>;
export type OrganizationUpdate = Updateable<OrganizationsTable>;

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export type KnowledgeFossil = Selectable<KnowledgeFossilsTable>;
export type NewKnowledgeFossil = Insertable<KnowledgeFossilsTable>;

export type PropagationEdge = Selectable<PropagationEdgesTable>;
export type NewPropagationEdge = Insertable<PropagationEdgesTable>;

export type ModelNode = Selectable<ModelNodesTable>;
export type NewModelNode = Insertable<ModelNodesTable>;
