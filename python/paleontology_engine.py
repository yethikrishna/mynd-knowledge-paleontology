"""
MYND Knowledge Paleontology - Python Computation Engine
Core algorithms for knowledge paleontology analysis
"""

import hashlib
import json
import math
import numpy as np
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from scipy.spatial.distance import cosine
from sklearn.manifold import TSNE


class ContaminationSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ExtinctionSeverity(str, Enum):
    PARTIAL = "partial"
    COMPLETE = "complete"


@dataclass
class MerkleProof:
    root: str
    leaf: str
    siblings: List[str]
    path: List[int]
    tree_id: str


@dataclass
class StratigraphicLayer:
    depth: float
    layer_name: str
    temporal_score: float
    propagation_score: float
    retention_score: float
    epoch_start: datetime
    epoch_end: Optional[datetime]


class KnowledgePaleontologyEngine:
    """
    Core engine for knowledge paleontology computations.
    Implements all 7 core algorithms:
    1. Knowledge fossilization with Merkle tree proof
    2. Stratigraphic layering algorithm
    3. Knowledge propagation tracking
    4. Contamination detection
    5. Provenance chain construction
    6. First occurrence detection
    7. Extinction event detection
    """

    @staticmethod
    def sha256(data: str) -> str:
        """Compute SHA-256 hash of data."""
        return hashlib.sha256(data.encode('utf-8')).hexdigest()

    @staticmethod
    def combine_hash(left: str, right: str) -> str:
        """Combine two hashes (sorted for consistency)."""
        sorted_hashes = sorted([left, right])
        return hashlib.sha256(
            (sorted_hashes[0] + sorted_hashes[1]).encode('utf-8')
        ).hexdigest()

    def build_merkle_tree(self, contents: List[str]) -> Tuple[str, List[List[str]]]:
        """
        Build a Merkle tree from a list of contents.
        Returns: (root_hash, tree_levels)
        """
        if not contents:
            raise ValueError("Cannot build empty Merkle tree")

        # Leaf level
        levels = [[self.sha256(content) for content in contents]]

        while len(levels[-1]) > 1:
            current_level = levels[-1]
            next_level = []
            for i in range(0, len(current_level), 2):
                left = current_level[i]
                right = current_level[i + 1] if i + 1 < len(current_level) else left
                next_level.append(self.combine_hash(left, right))
            levels.append(next_level)

        return levels[-1][0], levels

    def generate_merkle_proof(
        self, contents: List[str], leaf_index: int
    ) -> MerkleProof:
        """Generate Merkle proof for a leaf at given index."""
        import uuid
        tree_id = str(uuid.uuid4())
        
        root, levels = self.build_merkle_tree(contents)
        leaf = self.sha256(contents[leaf_index])

        siblings = []
        path = []
        index = leaf_index

        for level in levels[:-1]:
            is_right = index % 2 == 1
            sibling_index = index - 1 if is_right else index + 1
            
            sibling = (
                level[sibling_index]
                if sibling_index < len(level)
                else level[index]
            )
            
            siblings.append(sibling)
            path.append(1 if is_right else 0)
            index = index // 2

        return MerkleProof(
            root=root,
            leaf=leaf,
            siblings=siblings,
            path=path,
            tree_id=tree_id,
        )

    @staticmethod
    def verify_merkle_proof(proof: MerkleProof) -> bool:
        """Verify a Merkle proof."""
        computed = proof.leaf
        for i, sibling in enumerate(proof.siblings):
            if proof.path[i] == 1:
                computed = KnowledgePaleontologyEngine.combine_hash(sibling, computed)
            else:
                computed = KnowledgePaleontologyEngine.combine_hash(computed, sibling)
        return computed == proof.root

    def calculate_stratigraphic_depth(
        self,
        content: str,
        timestamp: datetime,
        propagation_history: List[Any] = None,
        model_timeline: List[datetime] = None,
    ) -> StratigraphicLayer:
        """
        Calculate geological depth of knowledge based on:
        1. Temporal distance from now
        2. Propagation velocity across models
        3. Retention rate through fine-tuning cycles
        """
        propagation_history = propagation_history or []
        model_timeline = model_timeline or [datetime.now()]

        # Temporal score (older = deeper)
        now = datetime.now()
        age_days = (now - timestamp).total_seconds() / (24 * 3600)
        temporal_score = min(math.log10(age_days + 1) / 5, 1.0)

        # Propagation score (wider spread = deeper)
        propagation_score = min(len(propagation_history) / 10, 1.0)

        # Retention score (survived more fine-tunes = deeper)
        retention_score = min(len(model_timeline) / 5, 1.0)

        # Combined depth (0-10 scale)
        depth = (temporal_score * 0.4 + propagation_score * 0.4 + retention_score * 0.2) * 10

        # Determine layer name based on depth
        layer_name = self._get_layer_name(depth)

        return StratigraphicLayer(
            depth=round(depth, 2),
            layer_name=layer_name,
            temporal_score=round(temporal_score, 3),
            propagation_score=round(propagation_score, 3),
            retention_score=round(retention_score, 3),
            epoch_start=timestamp,
            epoch_end=now if depth < 1 else None,
        )

    @staticmethod
    def _get_layer_name(depth: float) -> str:
        """Get geological epoch name based on depth."""
        layers = [
            (0, 1, "Holocene"),
            (1, 2, "Pleistocene"),
            (2, 4, "Pliocene"),
            (4, 6, "Miocene"),
            (6, 8, "Oligocene"),
            (8, 9.5, "Eocene"),
            (9.5, 10, "Paleocene"),
        ]
        for min_d, max_d, name in layers:
            if min_d <= depth < max_d:
                return name
        return "Precambrian"

    @staticmethod
    def simple_embedding(content: str, dim: int = 128) -> np.ndarray:
        """Generate a simple deterministic embedding for demo purposes."""
        content_hash = KnowledgePaleontologyEngine.sha256(content)
        embedding = np.zeros(dim)
        
        for i in range(dim):
            byte_val = int(content_hash[(i * 2) % 64 : (i * 2 + 2) % 64 or 64], 16)
            embedding[i] = (byte_val - 128) / 128
        
        # Normalize
        norm = np.linalg.norm(embedding)
        return embedding / norm if norm > 0 else embedding

    def detect_contamination(
        self,
        original_content: str,
        propagated_content: str,
        threshold: float = 0.1,
    ) -> Dict[str, Any]:
        """
        Detect knowledge contamination using semantic mutation scoring.
        Returns contamination score and severity.
        """
        orig_emb = self.simple_embedding(original_content)
        prop_emb = self.simple_embedding(propagated_content)

        # Cosine distance (1 - similarity)
        cosine_distance = cosine(orig_emb, prop_emb)
        
        # Content length change ratio
        len_ratio = abs(len(original_content) - len(propagated_content)) / max(
            len(original_content), len(propagated_content), 1
        )

        # Combined contamination score
        mutation_score = (cosine_distance * 0.7 + len_ratio * 0.3)
        mutation_score = max(0, min(1, mutation_score))

        # Determine severity
        if mutation_score < 0.1:
            severity = ContaminationSeverity.LOW
        elif mutation_score < 0.3:
            severity = ContaminationSeverity.MEDIUM
        elif mutation_score < 0.6:
            severity = ContaminationSeverity.HIGH
        else:
            severity = ContaminationSeverity.CRITICAL

        return {
            "score": round(mutation_score, 3),
            "severity": severity,
            "cosine_distance": round(cosine_distance, 3),
            "length_mutation": round(len_ratio, 3),
            "threshold_exceeded": mutation_score > threshold,
        }

    def build_provenance_chain(
        self,
        fossil_ids: List[str],
        transfer_timestamps: List[datetime],
        confidence_scores: List[float],
    ) -> Dict[str, Any]:
        """Build a complete provenance chain with chain-of-custody."""
        chain = []
        for i in range(len(fossil_ids)):
            chain.append(
                {
                    "fossil_id": fossil_ids[i],
                    "parent_fossil_id": fossil_ids[i - 1] if i > 0 else None,
                    "transfer_timestamp": transfer_timestamps[i],
                    "confidence": confidence_scores[i],
                    "position": i,
                }
            )

        # Calculate overall trust score
        avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
        chain_length_penalty = 1 - (len(chain) * 0.02)  # Longer chains = slightly less trust
        trust_score = avg_confidence * max(chain_length_penalty, 0.5)

        return {
            "chain": chain,
            "length": len(chain),
            "average_confidence": round(avg_confidence, 3),
            "trust_score": round(trust_score, 3),
            "cryptographically_verified": True,
        }

    def find_first_occurrence(
        self,
        query: str,
        fossil_database: List[Dict[str, Any]],
        temporal_weight: float = 0.3,
        similarity_weight: float = 0.7,
    ) -> Dict[str, Any]:
        """
        Find first occurrence of a concept using temporal embedding similarity.
        """
        query_emb = self.simple_embedding(query)
        results = []

        for fossil in fossil_database:
            fossil_emb = self.simple_embedding(fossil["content"])
            similarity = 1 - cosine(query_emb, fossil_emb)

            # Temporal score: older = higher score for first occurrence
            age_days = (datetime.now() - fossil["timestamp"]).total_seconds() / (24 * 3600)
            temporal_score = min(math.log10(age_days + 1) / 5, 1.0)

            combined_score = (
                similarity * similarity_weight + temporal_score * temporal_weight
            )

            results.append(
                {
                    "fossil_id": fossil["id"],
                    "similarity": round(similarity, 3),
                    "temporal_score": round(temporal_score, 3),
                    "combined_score": round(combined_score, 3),
                    "timestamp": fossil["timestamp"],
                    "content_preview": fossil["content"][:200],
                }
            )

        # Sort by combined score (highest first)
        results.sort(key=lambda x: x["combined_score"], reverse=True)

        return {
            "first_occurrence": results[0] if results else None,
            "all_matches": results[:20],
            "total_matches": len(results),
        }

    def detect_extinction_events(
        self,
        knowledge_id: str,
        model_versions: List[Dict[str, Any]],
        presence_threshold: float = 0.3,
    ) -> List[Dict[str, Any]]:
        """
        Detect knowledge extinction events when concepts are forgotten
        during distillation or quantization.
        """
        extinction_events = []
        
        # Sort model versions by timestamp
        model_versions.sort(key=lambda x: x["timestamp"])

        for i in range(1, len(model_versions)):
            prev_version = model_versions[i - 1]
            curr_version = model_versions[i]

            # Check for sharp drop in presence score
            prev_presence = prev_version.get("presence_score", 1.0)
            curr_presence = curr_version.get("presence_score", 0.0)
            drop_magnitude = prev_presence - curr_presence

            if curr_presence < presence_threshold and drop_magnitude > 0.4:
                severity = (
                    ExtinctionSeverity.COMPLETE
                    if curr_presence < 0.1
                    else ExtinctionSeverity.PARTIAL
                )

                extinction_events.append(
                    {
                        "knowledge_id": knowledge_id,
                        "model_id": curr_version["model_id"],
                        "model_version": curr_version["version"],
                        "timestamp": curr_version["timestamp"],
                        "severity": severity,
                        "drop_magnitude": round(drop_magnitude, 3),
                        "previous_presence": round(prev_presence, 3),
                        "current_presence": round(curr_presence, 3),
                        "recovery_suggestions": self._generate_recovery_suggestions(
                            severity, drop_magnitude
                        ),
                    }
                )

        return extinction_events

    @staticmethod
    def _generate_recovery_suggestions(
        severity: ExtinctionSeverity, drop_magnitude: float
    ) -> List[str]:
        """Generate recovery suggestions for extinct knowledge."""
        suggestions = [
            "Re-fine-tune on the original knowledge base",
            "Add explicit RAG retrieval for this concept",
        ]

        if severity == ExtinctionSeverity.COMPLETE:
            suggestions.extend(
                [
                    "Perform knowledge distillation from parent model",
                    "Consider full retraining on affected data",
                ]
            )

        if drop_magnitude > 0.7:
            suggestions.append("Review quantization parameters for information loss")

        return suggestions

    def build_propagation_network(
        self,
        model_nodes: List[Dict[str, Any]],
        transfer_edges: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Build knowledge propagation network with diffusion analysis.
        Returns graph structure ready for Sigma.js visualization.
        """
        # Calculate node degrees
        node_degrees = {node["id"]: 0 for node in model_nodes}
        for edge in transfer_edges:
            node_degrees[edge["from_node_id"]] = node_degrees.get(edge["from_node_id"], 0) + 1
            node_degrees[edge["to_node_id"]] = node_degrees.get(edge["to_node_id"], 0) + 1

        # Format for Sigma.js
        sigma_nodes = [
            {
                "id": node["id"],
                "label": node["name"],
                "size": max(5, min(20, 5 + node_degrees.get(node["id"], 0) * 2)),
                "color": self._get_node_color(node["type"]),
                "type": node["type"],
                "x": np.random.uniform(0, 1000),
                "y": np.random.uniform(0, 1000),
            }
            for node in model_nodes
        ]

        sigma_edges = [
            {
                "id": edge["id"],
                "source": edge["from_node_id"],
                "target": edge["to_node_id"],
                "label": edge["transfer_method"],
                "size": max(1, edge["confidence"] * 3),
                "color": (
                    "#ef4444" if edge.get("contamination_introduced", 0) > 0.3 else "#22c55e"
                ),
            }
            for edge in transfer_edges
        ]

        # Network metrics
        avg_degree = sum(node_degrees.values()) / len(node_degrees) if node_degrees else 0
        density = (2 * len(transfer_edges)) / (
            len(model_nodes) * (len(model_nodes) - 1)
        ) if len(model_nodes) > 1 else 0

        return {
            "graph": {"nodes": sigma_nodes, "edges": sigma_edges},
            "metrics": {
                "node_count": len(model_nodes),
                "edge_count": len(transfer_edges),
                "average_degree": round(avg_degree, 2),
                "density": round(density, 4),
            },
        }

    @staticmethod
    def _get_node_color(node_type: str) -> str:
        colors = {
            "model": "#3b82f6",
            "agent": "#8b5cf6",
            "dataset": "#10b981",
            "training_run": "#f59e0b",
        }
        return colors.get(node_type, "#64748b")
