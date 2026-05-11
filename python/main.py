"""
MYND Knowledge Paleontology - Python Microservice API
FastAPI server for paleontology computation
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import os

from paleontology_engine import (
    KnowledgePaleontologyEngine,
    ContaminationSeverity,
    ExtinctionSeverity,
    MerkleProof,
)

app = FastAPI(
    title="MYND Knowledge Paleontology API",
    description="Python microservice for knowledge paleontology computation",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = KnowledgePaleontologyEngine()


# Pydantic Models
class FossilizationRequest(BaseModel):
    content: str
    contents: Optional[List[str]] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class ContaminationRequest(BaseModel):
    original_content: str
    propagated_content: str
    threshold: float = 0.1


class FirstOccurrenceRequest(BaseModel):
    query: str
    fossils: List[Dict[str, Any]]
    temporal_weight: float = 0.3
    similarity_weight: float = 0.7


class ExtinctionDetectionRequest(BaseModel):
    knowledge_id: str
    model_versions: List[Dict[str, Any]]
    presence_threshold: float = 0.3


class NetworkRequest(BaseModel):
    model_nodes: List[Dict[str, Any]]
    transfer_edges: List[Dict[str, Any]]


class ProvenanceRequest(BaseModel):
    fossil_ids: List[str]
    transfer_timestamps: List[datetime]
    confidence_scores: List[float]


# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "paleontology-engine",
    }


# Merkle Tree endpoints
@app.post("/merkle/generate")
async def generate_merkle_proof(request: FossilizationRequest):
    try:
        contents = request.contents or [request.content]
        leaf_index = 0  # First content by default
        proof = engine.generate_merkle_proof(contents, leaf_index)
        return {
            "success": True,
            "data": {
                "proof": proof.__dict__,
                "root": proof.root,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/merkle/verify")
async def verify_merkle_proof(proof: MerkleProof):
    try:
        valid = engine.verify_merkle_proof(proof)
        return {
            "success": True,
            "data": {
                "valid": valid,
                "verified_at": datetime.now().isoformat(),
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Stratigraphic Depth endpoint
@app.post("/stratigraphy/calculate")
async def calculate_stratigraphy(request: FossilizationRequest):
    try:
        layer = engine.calculate_stratigraphic_depth(
            content=request.content,
            timestamp=request.timestamp,
            propagation_history=[],
        )
        return {
            "success": True,
            "data": {
                "depth": layer.depth,
                "layer_name": layer.layer_name,
                "temporal_score": layer.temporal_score,
                "propagation_score": layer.propagation_score,
                "retention_score": layer.retention_score,
                "epoch_start": layer.epoch_start.isoformat(),
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Contamination Detection endpoint
@app.post("/contamination/detect")
async def detect_contamination(request: ContaminationRequest):
    try:
        result = engine.detect_contamination(
            original_content=request.original_content,
            propagated_content=request.propagated_content,
            threshold=request.threshold,
        )
        return {
            "success": True,
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# First Occurrence endpoint
@app.post("/search/first-occurrence")
async def find_first_occurrence(request: FirstOccurrenceRequest):
    try:
        result = engine.find_first_occurrence(
            query=request.query,
            fossil_database=request.fossils,
            temporal_weight=request.temporal_weight,
            similarity_weight=request.similarity_weight,
        )
        return {
            "success": True,
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Extinction Detection endpoint
@app.post("/extinction/detect")
async def detect_extinction(request: ExtinctionDetectionRequest):
    try:
        events = engine.detect_extinction_events(
            knowledge_id=request.knowledge_id,
            model_versions=request.model_versions,
            presence_threshold=request.presence_threshold,
        )
        return {
            "success": True,
            "data": {
                "events": events,
                "count": len(events),
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Propagation Network endpoint
@app.post("/network/build")
async def build_network(request: NetworkRequest):
    try:
        result = engine.build_propagation_network(
            model_nodes=request.model_nodes,
            transfer_edges=request.transfer_edges,
        )
        return {
            "success": True,
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Provenance Chain endpoint
@app.post("/provenance/build")
async def build_provenance(request: ProvenanceRequest):
    try:
        result = engine.build_provenance_chain(
            fossil_ids=request.fossil_ids,
            transfer_timestamps=request.transfer_timestamps,
            confidence_scores=request.confidence_scores,
        )
        return {
            "success": True,
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Batch processing endpoint
@app.post("/batch/process")
async def batch_process(fossils: List[Dict[str, Any]]):
    """Process multiple fossils in batch"""
    results = []
    for fossil in fossils:
        try:
            layer = engine.calculate_stratigraphic_depth(
                fossil["content"],
                datetime.fromisoformat(fossil["timestamp"]) if isinstance(fossil["timestamp"], str) else fossil["timestamp"],
            )
            results.append(
                {
                    "fossil_id": fossil.get("id"),
                    "stratigraphic_depth": layer.depth,
                    "layer_name": layer.layer_name,
                }
            )
        except Exception as e:
            results.append({"fossil_id": fossil.get("id"), "error": str(e)})

    return {
        "success": True,
        "data": {
            "processed": len(results),
            "results": results,
        },
    }


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PYTHON_SERVICE_PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port)
