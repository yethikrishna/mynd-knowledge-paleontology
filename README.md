<div align="center">

<h1>🧬 MYND Knowledge Paleontology</h1>

<p><strong>The Fossil Record of AI Knowledge</strong></p>

<p>
![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=flat-square&logo=svelte&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square) ![MYND](https://img.shields.io/badge/MYND-Ecosystem-6366f1?style=flat-square) ![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)
</p>

<p><em>World's first knowledge origin & lineage tracking for AI systems — excavate what AI knows and where it came from</em></p>

</div>

---

> **Part of the [MYND AI Ecosystem](https://github.com/yethikrishna/mynd-platform)** — A 7-layer architecture for next-generation AI agent systems.
>
> [![MYND Ecosystem](https://img.shields.io/badge/MYND-Ecosystem-6366f1?style=for-the-badge)](https://github.com/yethikrishna/mynd-platform)

---

## Overview

MYND Knowledge Paleontology is the **fossil record of AI knowledge**. Just as paleontologists excavate rock layers to understand evolutionary history, this tool excavates the strata of AI knowledge — tracing every piece of information an AI system holds back to its origin, tracking how knowledge transforms across training, fine-tuning, RAG retrieval, and inference.

Visualize knowledge lineages, detect fossilized misconceptions, trace knowledge transfer between models, and build a complete stratigraphic map of what your AI knows.

## Features

- 🦴 **Knowledge Fossil Excavation** — Dig through model knowledge layers to identify the origin of specific beliefs, facts, and patterns
- 📚 **Knowledge Lineage Graph** — Interactive graph visualization powered by Graphology and Sigma.js showing knowledge ancestry and transformation paths
- 🔬 **Stratigraphic Layer Analysis** — Map knowledge to training data, fine-tuning, RAG contexts, and inference-time reasoning layers
- 🧬 **Knowledge Mutation Tracking** — Detect how facts mutate, distort, or hallucinate as they pass through model layers and retrieval pipelines
- 🕸️ **Graphology Network Visualization** — High-performance graph rendering with ForceAtlas2 layout for exploring massive knowledge graphs
- 📊 **D3.js + Chart.js Analytics** — Temporal analysis of knowledge drift with date-fns powered time-series
- 🐍 **Python Paleontology Engine** — FastAPI backend with NumPy, SciPy, scikit-learn for deep knowledge analysis
- 🗄️ **ChromaDB Vector Store** — Semantic knowledge storage with embedding-based retrieval and similarity search
- 🔴 **Redis Caching Layer** — High-performance caching for frequent lineage queries
- 🐳 **Multi-Stage Docker** — Separate Dockerfiles for backend, frontend, and Python workers
- 🔐 **OAuth2 Authentication** — Enterprise-grade auth via @fastify/oauth2 with JWT tokens

## MYND 7-Layer Architecture

MYND Knowledge Paleontology operates at **Layer 4 — Knowledge Infrastructure**:

```
Layer 7: Application    → mynd-platform
Layer 6: Skills         → mynd-skill-forge
Layer 5: Decisions      → mynd-decision-paleontology (builds on knowledge layer)
Layer 4: Knowledge  ██→ THIS PROJECT: Knowledge Paleontology (knowledge lineage)
Layer 3: Cognition      → mynd-prompt-phylogeny (feeds into knowledge)
Layer 2: Models         → mynd-model-holography, mynd-model-arena
Layer 1: Synchronization→ mynd-synchron
Layer 0: Foundation     → mynd-agent-replay
```

**Role:** Provides the knowledge provenance layer. Every decision in Layer 5 traces its knowledge inputs back through this layer. Every evolved prompt in Layer 3 contributes knowledge artifacts here.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Svelte/SvelteKit, TypeScript, Graphology, Sigma.js, D3.js, Chart.js |
| **Backend (Node)** | Fastify, TypeScript, Prisma, Redis, ChromaDB |
| **Backend (Python)** | FastAPI, Uvicorn, NumPy, SciPy, scikit-learn, pandas |
| **Database** | PostgreSQL (database/), Redis, ChromaDB |
| **Visualization** | Graphology + ForceAtlas2, Sigma.js, D3.js, Chart.js |
| **Auth** | OAuth2 (@fastify/oauth2), JWT, bcrypt |
| **Styling** | Tailwind CSS, clsx, tailwind-merge, Lucide Svelte |
| **Infra** | Docker (multi-stage), Nginx reverse proxy, Docker Compose |

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose
- PostgreSQL 15+, Redis 7+

### Installation

```bash
git clone https://github.com/yethikrishna/mynd-knowledge-paleontology.git
cd mynd-knowledge-paleontology

# Install Node dependencies
npm install

# Set up Python environment
cd python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scriptsctivate
pip install -r requirements.txt
cd ..

# Environment configuration
cp .env.example .env
# Configure database, Redis, ChromaDB, OAuth2 credentials

# Start all services
docker-compose up -d

# Run database migrations
cd backend && npx prisma migrate dev && cd ..

# Start development
npm run dev
```

### Running the Python Engine

```bash
cd python
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Python API docs at http://localhost:8000/docs
```

## Project Structure

```
mynd-knowledge-paleontology/
├── backend/               # Fastify Node.js API server
│   ├── src/
│   │   ├── routes/        # Knowledge graph, lineage, excavation APIs
│   │   └── services/      # Graph operations, ChromaDB integration
│   └── prisma/
├── frontend/              # Svelte/SvelteKit web application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/ # Graphology/Sigma.js graph views
│   │   │   └── stores/
│   │   └── routes/
├── python/                # FastAPI Python analysis engine
│   ├── main.py            # FastAPI application
│   ├── paleontology_engine.py  # Core knowledge analysis algorithms
│   └── requirements.txt
├── database/              # SQL schemas and migrations
├── nginx/                 # Nginx reverse proxy config
├── docs/                  # Additional documentation
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── Dockerfile.python
```

## Key Analysis Capabilities

| Analysis Type | Description |
|---------------|-------------|
| Origin Tracing | Trace a fact/concept to its training data, fine-tuning, or RAG source |
| Lineage Graph | View the ancestral path of knowledge through model layers |
| Drift Detection | Detect how knowledge changes over time or across fine-tuning runs |
| Hallucination Fossils | Identify persistent hallucinations as "fossilized errors" in knowledge strata |
| Cross-Model Transfer | Map knowledge flow between different models in the MYND ecosystem |
| RAG Provenance | Track which retrieval contexts influenced specific knowledge outputs |

## Related MYND Projects

This project is part of the larger **MYND AI Ecosystem**. Explore related projects:

| Project | Description |
|---------|-------------|
| [mynd-platform](https://github.com/yethikrishna/mynd-platform) | The core MYND AI orchestration platform |
| [mynd-plan](https://github.com/yethikrishna/mynd-plan) | Hierarchical planning and task decomposition |
| [mynd-agent-replay](https://github.com/yethikrishna/mynd-agent-replay) | Agent execution replay and debugging |
| [mynd-model-arena](https://github.com/yethikrishna/mynd-model-arena) | Model comparison and benchmarking arena |
| [mynd-synchron](https://github.com/yethikrishna/mynd-synchron) | Real-time multi-agent synchronization |
| [mynd-skill-forge](https://github.com/yethikrishna/mynd-skill-forge) | AI skill creation and management platform |
| [mynd-decision-paleontology](https://github.com/yethikrishna/mynd-decision-paleontology) | Decision forensics for AI agents |
| [mynd-knowledge-paleontology](https://github.com/yethikrishna/mynd-knowledge-paleontology) | Knowledge lineage and origin tracking |

## Contributing

We welcome contributions from paleontologists of all kinds!

1. Fork the repository
2. Create a branch (`git checkout -b feature/new-excavation-tool`)
3. Add tests for new analysis methods
4. Ensure both Node and Python tests pass
5. Submit a PR with detailed description of the knowledge layer you're excavating

## License

MIT License — see [LICENSE](LICENSE) file for details.

---

<!-- SEO Keywords -->
<!--
knowledge lineage tracking, AI knowledge provenance, AI knowledge origin, 
knowledge graph visualization, fossil record AI, knowledge drift detection, 
AI hallucination detection, RAG provenance tracking, model knowledge transfer, 
Graphology Sigma.js visualization, knowledge stratigraphy, AI memory forensics, 
training data attribution, knowledge mutation AI, SvelteKit knowledge explorer, 
FastAPI Python AI analysis, ChromaDB knowledge base, AI auditing tools, 
MYND ecosystem Layer 4, knowledge paleontology, AI transparency tools, 
model interpretability knowledge
-->
