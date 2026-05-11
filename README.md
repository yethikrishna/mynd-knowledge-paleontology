<div align="center">
  <img src="https://img.shields.io/badge/MYND-Knowledge%20Paleontology-blue" alt="MYND Knowledge Paleontology" />
  <h1>🧬 MYND Knowledge Paleontology</h1>
  <p><strong>The Fossil Record of AI Knowledge</strong></p>
  <p>World's first knowledge origin and lineage tracking platform for AI systems</p>

  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#documentation">Documentation</a> •
    <a href="#license">License</a>
  </p>

  <br />
</div>

## Overview

MYND Knowledge Paleontology is the world's first knowledge origin and lineage tracking platform for AI systems. It serves as the "fossil record of AI knowledge" that enables you to:

- 🔍 **Trace Origin**: Find the first occurrence of any fact or concept in the AI ecosystem
- 🔗 **Track Lineage**: Follow knowledge propagation across models, agents, and fine-tuning runs
- ⚠️ **Detect Contamination**: Identify knowledge mutation and semantic drift during transfer
- 🔐 **Verify Provenance**: Cryptographically verify knowledge origin with Merkle tree proofs
- 📊 **Visualize Networks**: Map knowledge diffusion networks across your AI infrastructure
- ⏳ **Detect Extinction**: Identify knowledge lost during distillation and quantization

This product fits into **MYND Layer 3 (Data & Knowledge)** as the knowledge provenance and archaeology platform for the entire MYND ecosystem.

## Features

### Core Engine
1. **Knowledge Fossilization** - Timestamp every knowledge artifact with cryptographic proof of origin
2. **Stratigraphic Layering** - Map knowledge to geological depth based on age and propagation
3. **Propagation Tracking** - Graph-based diffusion analysis across models and agents
4. **Contamination Detection** - Semantic mutation scoring and drift analysis
5. **Provenance Chains** - Complete chain-of-custody with Merkle verification
6. **First Occurrence Search** - Temporal embedding similarity search for origin detection
7. **Extinction Detection** - Identify knowledge lost during model compression

### Application Features
- Interactive knowledge diffusion network viewer with Sigma.js
- Stratigraphic knowledge layer visualization with D3.js
- Knowledge provenance chain explorer with Merkle proof verification
- Contamination detection dashboard with mutation severity scoring
- First occurrence search engine with temporal similarity ranking
- Knowledge extinction event timeline with recovery suggestions
- Team collaboration with organization-level knowledge libraries
- REST API for automated knowledge fossilization during training
- Stripe subscription system (Free/Pro/Enterprise tiers)

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for development)
- Python 3.11+ (for development)

### One-Command Deployment

```bash
# Clone the repository
git clone https://github.com/myndlabs/knowledge-paleontology.git
cd knowledge-paleontology

# Start all services
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost/api/v1
- API Documentation: http://localhost/docs

### Development Setup

```bash
# Install root dependencies
npm install

# Start backend (terminal 1)
cd backend && npm install && npm run dev

# Start frontend (terminal 2)
cd frontend && npm install && npm run dev

# Start Python worker (terminal 3)
cd python && pip install -r requirements.txt && uvicorn main:app --reload
```

## Architecture

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | SvelteKit 2.x, Tailwind CSS 3.x, Sigma.js, D3.js, Chart.js |
| **Backend** | Node.js, Fastify, TypeScript, Zod, JWT, OAuth2 |
| **Computation** | Python 3.11, FastAPI, NumPy, SciPy, scikit-learn |
| **Database** | PostgreSQL 16, Redis 7, TimescaleDB, ChromaDB |
| **DevOps** | Docker, Docker Compose, GitHub Actions |

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                             │
│  SvelteKit + Tailwind + Sigma.js + D3.js                        │
├─────────────────────────────────────────────────────────────────┤
│                        API Gateway                              │
│  Nginx Reverse Proxy                                            │
├─────────────────────────────────────────────────────────────────┤
│                  Core Services Layer                            │
│  Fastify Backend  •  Python Computation Worker                  │
├─────────────────────────────────────────────────────────────────┤
│                       Data Layer                                │
│  PostgreSQL  •  Redis  •  TimescaleDB  •  ChromaDB              │
└─────────────────────────────────────────────────────────────────┘
```

For detailed architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Complete system architecture and design
- [API.md](docs/API.md) - REST API endpoint documentation
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) - Production deployment guide
- [USER_GUIDE.md](docs/USER_GUIDE.md) - Product usage and features guide

## Repository Structure

```
mynd-knowledge-paleontology/
├── frontend/                 # SvelteKit frontend application
│   ├── src/
│   │   ├── routes/           # All application pages
│   │   └── lib/components/   # Reusable UI components
├── backend/                  # Fastify + TypeScript backend
│   ├── src/
│   │   ├── routes/           # API endpoint handlers
│   │   ├── services/         # Business logic
│   │   └── middleware/       # Authentication and utilities
├── python/                   # Python computation engine
│   ├── paleontology_engine.py # Core algorithms
│   └── main.py               # FastAPI server
├── database/migrations/      # SQL migration files
├── docs/                     # Documentation
├── .github/workflows/        # CI/CD pipelines
├── nginx/                    # Reverse proxy configuration
├── docker-compose.yml        # Production orchestration
└── Dockerfile.*              # Multi-stage builds
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the **Apache License 2.0** for the core open-source components, with commercial licensing available for cloud and enterprise features.

- **Core**: Apache 2.0 (open source)
- **Cloud/Enterprise**: Commercial license

See `LICENSE` file for details.

---

<div align="center">
  <strong>Built with ❤️ by MYND Labs</strong>
  <br />
  <small>Part of the MYND 7-Layer AI Stack - Layer 3 (Data & Knowledge)</small>
</div>
