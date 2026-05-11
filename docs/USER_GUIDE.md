# User Guide

Welcome to MYND Knowledge Paleontology - the world's first knowledge origin and lineage tracking platform for AI systems.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Knowledge Fossils](#knowledge-fossils)
4. [Network Visualization](#network-visualization)
5. [Stratigraphic Layers](#stratigraphic-layers)
6. [Provenance Chains](#provenance-chains)
7. [Contamination Detection](#contamination-detection)
8. [First Occurrence Search](#first-occurrence-search)
9. [Extinction Events](#extinction-events)
10. [Team Management](#team-management)
11. [API Integration](#api-integration)

---

## Getting Started

### Creating Your Account

1. Visit the registration page at `/register`
2. Enter your name, email, and organization name
3. Create a strong password
4. Verify your email (if enabled)
5. You're ready to start fossilizing knowledge!

**Alternative:** Sign in with Google or GitHub for faster onboarding.

### First Login

Upon first login, you'll see:
- Empty dashboard with onboarding prompts
- Quick start guide
- Sample data option (recommended for exploration)

We recommend loading sample data to explore all features before connecting your own AI systems.

---

## Dashboard Overview

The dashboard provides a high-level overview of your knowledge ecosystem.

### Key Metrics

- **Total Fossils**: Number of knowledge artifacts preserved
- **Models Tracked**: Active models in your network
- **Contamination Events**: Active knowledge mutation alerts
- **Extinction Events**: Knowledge loss incidents detected

### Widgets

1. **Recent Fossilization** - Latest knowledge artifacts with timestamps and depth
2. **Contamination Alerts** - Priority-ordered mutation warnings
3. **Stratigraphic Distribution** - Bar chart showing knowledge depth distribution

---

## Knowledge Fossils

Knowledge fossils are the core building blocks of the system. Each fossil represents an immutable, timestamped knowledge artifact.

### Creating a Fossil

**Via UI:**
1. Click "New Fossil" button on dashboard
2. Paste or type your knowledge content
3. Select source type (model, dataset, training_run, agent)
4. Add optional metadata
5. Click "Fossilize"

**Via API:**
```bash
curl -X POST http://localhost/api/v1/fossils \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your knowledge content here",
    "sourceType": "model",
    "sourceId": "model-v1.0"
  }'
```

### Understanding Fossil Properties

Each fossil has:
- **Cryptographic Hash**: SHA-256 of content for integrity
- **Merkle Proof**: Inclusion proof in the knowledge tree
- **Stratigraphic Depth**: Geological depth (0-10m)
- **Timestamp**: Precise creation time
- **Source Attribution**: Origin model/dataset

---

## Network Visualization

The Knowledge Diffusion Network shows how knowledge propagates across your AI infrastructure.

### Controls

- **Zoom In/Out**: Use mouse wheel or buttons
- **Pan**: Click and drag background
- **Select Node**: Click any node to view details
- **Reset View**: Click home button

### Node Types

| Color | Type | Description |
|-------|------|-------------|
| 🔵 Blue | Model | Trained model checkpoint |
| 🟣 Purple | Agent | AI agent instance |
| 🟢 Green | Dataset | Training data source |
| 🟠 Orange | Training Run | Fine-tuning iteration |

### Edge Colors

- **🟢 Green**: Clean transfer, no contamination
- **🔴 Red**: Contaminated transfer, semantic drift detected

---

## Stratigraphic Layers

Stratigraphic analysis maps knowledge to geological depth based on:

### Depth Calculation Formula

```
depth = (temporal_score * 0.4 + complexity_score * 0.4 + propagation_score * 0.2) * 10
```

### Geological Layers

| Layer | Depth | Meaning |
|-------|-------|---------|
| Holocene | 0-1m | Recent, surface knowledge |
| Pleistocene | 1-2m | Recent established |
| Pliocene | 2-4m | Moderately deep |
| Miocene | 4-6m | Well-established |
| Oligocene | 6-8m | Deep knowledge |
| Eocene | 8-9.5m | Very deep, foundational |
| Paleocene | 9.5-10m | Ancient bedrock |
| Precambrian | 10m+ | Original training data |

### Interpretation

Deeper knowledge = Older, more widely propagated, better retained through training cycles.

---

## Provenance Chains

Provenance chains show the complete chain-of-custody for any knowledge artifact.

### Chain Trust Score

Calculated based on:
- Number of verified links
- Cryptographic proof validity
- Contamination rate at each transfer
- Source reputation

### Merkle Verification

Each provenance chain includes:
1. **Merkle Root**: Top-level hash of entire chain
2. **Proof Path**: Sibling hashes for verification
3. **Chain of Signatures**: Each transfer attested by source

**To verify a chain:**
1. Navigate to Provenance page
2. Select any chain
3. Click "Verify Proof" button
4. System cryptographically validates all links

---

## Contamination Detection

Contamination detection identifies knowledge mutation during transfer between models.

### Detection Methods

1. **Semantic Embedding Drift** (70% weight)
   - Cosine distance between source and target embeddings
   - Threshold: > 0.1 = warning, > 0.3 = critical

2. **Length Mutation Ratio** (30% weight)
   - Token count difference between versions
   - Indicates compression or expansion artifacts

### Severity Levels

| Level | Score | Action Required |
|-------|-------|-----------------|
| LOW | < 0.1 | Monitor |
| MEDIUM | 0.1 - 0.3 | Review |
| HIGH | 0.3 - 0.6 | Investigate |
| CRITICAL | ≥ 0.6 | Immediate action |

### Remediation Options

1. **Re-inject**: Add original knowledge to target model training
2. **Rollback**: Revert to previous clean checkpoint
3. **Isolate**: Quarantine contaminated version
4. **Accept**: Document and accept for non-critical use

---

## First Occurrence Search

Find the origin of any fact, concept, or claim in your AI ecosystem.

### How to Search

1. Go to Search page
2. Enter your knowledge claim
3. (Optional) Adjust filters:
   - Temporal range
   - Minimum confidence threshold
   - Source types
4. Click "Search"

### Understanding Results

Results are sorted **oldest first** (first occurrence at top). Each result shows:
- **Confidence Score**: Semantic similarity match
- **Timestamp**: When this version appeared
- **Source**: Origin model/dataset
- **Depth**: Stratigraphic depth

### Use Cases

- **IP Verification**: Confirm knowledge origin for legal
- **Attribution**: Properly credit training data sources
- **Audit**: Trace controversial claims to source
- **Research**: Discover concept evolution over time

---

## Extinction Events

Knowledge extinction occurs when concepts are forgotten during distillation, quantization, or fine-tuning.

### Detection Algorithm

Extinction is detected when:
1. **Sharp Drop**: Presence score falls > 40% between versions
2. **Low Presence**: Concept appears in < 30% of outputs
3. **Consistent**: Pattern holds across multiple test prompts

### Severity Levels

- **PARTIAL**: Concept degraded but still detectable
- **COMPLETE**: Concept effectively erased from model

### Recovery Recommendations

System automatically suggests recovery strategies:

**High Recovery Probability (>70%):**
- Re-inject small training subset
- LoRA fine-tuning with 100-500 examples

**Medium Recovery Probability (40-70%):**
- Full fine-tuning from earlier checkpoint
- Knowledge distillation from teacher model

**Low Recovery Probability (<40%):**
- Return to pre-extinction checkpoint
- Architecture adjustment may be required

---

## Team Management

Collaborate with your organization on knowledge archaeology.

### Roles and Permissions

| Role | Capabilities |
|------|--------------|
| **OWNER** | Full access, billing, delete organization |
| **ADMIN** | Invite members, manage roles, API keys |
| **EDITOR** | Create fossils, run analysis, export reports |
| **VIEWER** | Read-only dashboard access |
| **API** | Programmatic access only |

### Inviting Team Members

1. Go to Team page
2. Click "Invite Member"
3. Enter email address
4. Select appropriate role
5. Send invitation

### Organization Settings

Access organization settings to:
- Update organization name and branding
- Configure SSO/OAuth
- View subscription and usage
- Manage API keys

---

## API Integration

Integrate knowledge fossilization directly into your AI training pipeline.

### Quick Start

```python
import requests

API_KEY = "your-api-key"
BASE_URL = "https://your-domain.com/api/v1"

def fossilize_knowledge(content, source_type, source_id):
    response = requests.post(
        f"{BASE_URL}/fossils",
        headers={"X-API-Key": API_KEY},
        json={
            "content": content,
            "sourceType": source_type,
            "sourceId": source_id
        }
    )
    return response.json()

# Example: Fossilize model outputs during training
for checkpoint in training_checkpoints:
    fossilize_knowledge(
        content=checkpoint.sample_outputs,
        source_type="model",
        source_id=f"model-v{checkpoint.version}"
    )
```

### Integration Points

1. **Training Pipeline**: Fossilize after each epoch
2. **Model Deployment**: Fossilize on release
3. **Dataset Versioning**: Fossilize on dataset changes
4. **Agent Logs**: Fossilize agent decision rationale

### Webhooks

Configure webhooks for automated alerts:
- New contamination detected
- Knowledge extinction event
- First occurrence of new concept

---

## Best Practices

### 1. Fossilize Early and Often
- Create fossils at every training checkpoint
- Include dataset versions
- Capture intermediate outputs

### 2. Maintain Source Context
- Always fill sourceType and sourceId
- Add rich metadata (version, step, hyperparameters)
- Link to training run logs

### 3. Regular Audits
- Run contamination scans weekly
- Review extinction events monthly
- Verify provenance chains quarterly

### 4. Team Workflow
- Data scientists: Create fossils during R&D
- ML Engineers: Automate fossilization in pipelines
- Compliance: Review provenance and contamination reports
- Leadership: Dashboard overview and network analysis

---

## Getting Help

- **Documentation**: `/docs` in your deployment
- **API Reference**: See [API.md](API.md)
- **Support**: contact@myndlabs.tech
- **Community**: GitHub Discussions

---

**Happy Knowledge Paleontology! 🦴🔬**

*"In the fossil record of AI knowledge, every artifact tells a story of origin and evolution."*
