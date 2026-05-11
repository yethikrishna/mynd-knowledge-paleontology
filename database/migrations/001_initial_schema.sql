-- MYND Knowledge Paleontology - Database Schema
-- Initial migration: Creates all core tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable TimescaleDB extension (for time-series data)
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  plan VARCHAR(50) NOT NULL DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscription_status VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  avatar_url TEXT,
  google_id VARCHAR(255) UNIQUE,
  github_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization Members (join table)
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Knowledge Fossils (core table)
CREATE TABLE knowledge_fossils (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  hash VARCHAR(64) NOT NULL, -- SHA-256
  content TEXT NOT NULL,
  content_preview VARCHAR(1000) NOT NULL,
  embedding JSONB, -- Vector embedding
  source_type VARCHAR(50) NOT NULL,
  source_id UUID,
  source_metadata JSONB,
  merkle_root VARCHAR(64) NOT NULL,
  merkle_proof JSONB,
  "timestamp" TIMESTAMPTZ NOT NULL,
  stratigraphic_depth FLOAT NOT NULL DEFAULT 0,
  contamination_score FLOAT NOT NULL DEFAULT 0,
  first_occurrence_id UUID REFERENCES knowledge_fossils(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, hash)
);

-- Convert to hypertable for time-series
SELECT create_hypertable('knowledge_fossils', 'created_at', if_not_exists => TRUE);

-- Indexes for fossils
CREATE INDEX idx_fossils_organization ON knowledge_fossils(organization_id);
CREATE INDEX idx_fossils_hash ON knowledge_fossils(hash);
CREATE INDEX idx_fossils_timestamp ON knowledge_fossils("timestamp");
CREATE INDEX idx_fossils_depth ON knowledge_fossils(stratigraphic_depth);
CREATE INDEX idx_fossils_contamination ON knowledge_fossils(contamination_score);
CREATE INDEX idx_fossils_embedding ON knowledge_fossils USING GIN (embedding jsonb_path_ops);

-- Merkle Tree Nodes
CREATE TABLE merkle_tree_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fossil_id UUID NOT NULL REFERENCES knowledge_fossils(id) ON DELETE CASCADE,
  tree_id UUID NOT NULL,
  node_hash VARCHAR(64) NOT NULL,
  node_index INTEGER NOT NULL,
  tree_level INTEGER NOT NULL,
  is_leaf BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_merkle_fossil ON merkle_tree_nodes(fossil_id);
CREATE INDEX idx_merkle_tree ON merkle_tree_nodes(tree_id);

-- Provenance Chains
CREATE TABLE provenance_chains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fossil_id UUID NOT NULL REFERENCES knowledge_fossils(id) ON DELETE CASCADE,
  parent_fossil_id UUID REFERENCES knowledge_fossils(id),
  source_node_id UUID,
  target_node_id UUID,
  transfer_method VARCHAR(100) NOT NULL,
  transfer_timestamp TIMESTAMPTZ NOT NULL,
  confidence_score FLOAT NOT NULL,
  contamination_introduced FLOAT NOT NULL DEFAULT 0,
  proof_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_provenance_fossil ON provenance_chains(fossil_id);
CREATE INDEX idx_provenance_parent ON provenance_chains(parent_fossil_id);

-- Model Nodes (for network graph)
CREATE TABLE model_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- model, agent, dataset, training_run
  version VARCHAR(255),
  parent_id UUID REFERENCES model_nodes(id),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_model_nodes_org ON model_nodes(organization_id);
CREATE INDEX idx_model_nodes_type ON model_nodes(type);

-- Propagation Edges (knowledge transfer between nodes)
CREATE TABLE propagation_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  from_node_id UUID NOT NULL REFERENCES model_nodes(id) ON DELETE CASCADE,
  to_node_id UUID NOT NULL REFERENCES model_nodes(id) ON DELETE CASCADE,
  knowledge_ids JSONB, -- Array of fossil IDs
  transfer_method VARCHAR(50) NOT NULL,
  "timestamp" TIMESTAMPTZ NOT NULL,
  confidence FLOAT NOT NULL,
  contamination_introduced FLOAT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('propagation_edges', 'created_at', if_not_exists => TRUE);

CREATE INDEX idx_edges_from ON propagation_edges(from_node_id);
CREATE INDEX idx_edges_to ON propagation_edges(to_node_id);
CREATE INDEX idx_edges_org ON propagation_edges(organization_id);

-- Contamination Events
CREATE TABLE contamination_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fossil_id UUID NOT NULL REFERENCES knowledge_fossils(id) ON DELETE CASCADE,
  severity VARCHAR(50) NOT NULL,
  score FLOAT NOT NULL,
  detection_method VARCHAR(100) NOT NULL,
  mutation_details JSONB,
  remediated BOOLEAN NOT NULL DEFAULT false,
  remediated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contamination_fossil ON contamination_events(fossil_id);
CREATE INDEX idx_contamination_severity ON contamination_events(severity);
CREATE INDEX idx_contamination_remediated ON contamination_events(remediated);

-- Extinction Events (knowledge forgotten)
CREATE TABLE extinction_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  knowledge_id UUID NOT NULL REFERENCES knowledge_fossils(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES model_nodes(id) ON DELETE CASCADE,
  model_version VARCHAR(255) NOT NULL,
  "timestamp" TIMESTAMPTZ NOT NULL,
  severity VARCHAR(50) NOT NULL,
  recovery_suggestions JSONB,
  affected_downstream JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('extinction_events', 'created_at', if_not_exists => TRUE);

CREATE INDEX idx_extinction_org ON extinction_events(organization_id);
CREATE INDEX idx_extinction_knowledge ON extinction_events(knowledge_id);
CREATE INDEX idx_extinction_model ON extinction_events(model_id);

-- Stratigraphic Layers
CREATE TABLE stratigraphic_layers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fossil_id UUID NOT NULL REFERENCES knowledge_fossils(id) ON DELETE CASCADE,
  layer_depth FLOAT NOT NULL,
  layer_name VARCHAR(255) NOT NULL,
  temporal_score FLOAT NOT NULL,
  propagation_score FLOAT NOT NULL,
  retention_score FLOAT NOT NULL,
  epoch_start TIMESTAMPTZ NOT NULL,
  epoch_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_layers_fossil ON stratigraphic_layers(fossil_id);
CREATE INDEX idx_layers_depth ON stratigraphic_layers(layer_depth);

-- Audit Logs (immutable)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  metadata JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_hypertable('audit_logs', 'created_at', if_not_exists => TRUE);

CREATE INDEX idx_audit_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
