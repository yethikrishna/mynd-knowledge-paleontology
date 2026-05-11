import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

export interface MerkleProof {
  root: string;
  leaf: string;
  siblings: string[];
  path: number[];
  treeId: string;
}

export interface MerkleNode {
  hash: string;
  index: number;
  level: number;
  isLeaf: boolean;
}

export class MerkleTree {
  private leaves: string[] = [];
  private levels: string[][] = [];
  private treeId: string;

  constructor() {
    this.treeId = uuidv4();
  }

  getTreeId(): string {
    return this.treeId;
  }

  static hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static combineHash(left: string, right: string): string {
    // Ensure consistent ordering for the same pair
    const sorted = [left, right].sort();
    return crypto.createHash('sha256').update(sorted[0] + sorted[1]).digest('hex');
  }

  addLeaf(data: string): number {
    const hash = MerkleTree.hash(data);
    this.leaves.push(hash);
    return this.leaves.length - 1;
  }

  addLeaves(data: string[]): number[] {
    return data.map((d) => this.addLeaf(d));
  }

  build(): string {
    if (this.leaves.length === 0) {
      throw new Error('Cannot build empty Merkle tree');
    }

    this.levels = [this.leaves.slice()];
    let currentLevel = this.leaves.slice();

    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        nextLevel.push(MerkleTree.combineHash(left, right));
      }
      
      this.levels.push(nextLevel);
      currentLevel = nextLevel;
    }

    logger.debug(`Merkle tree built with ${this.leaves.length} leaves, root: ${this.getRoot()}`);
    return this.getRoot();
  }

  getRoot(): string {
    if (this.levels.length === 0) {
      throw new Error('Tree not built yet');
    }
    return this.levels[this.levels.length - 1][0];
  }

  getProof(leafIndex: number): MerkleProof {
    if (this.levels.length === 0) {
      throw new Error('Tree not built yet');
    }

    if (leafIndex < 0 || leafIndex >= this.leaves.length) {
      throw new Error('Leaf index out of bounds');
    }

    const siblings: string[] = [];
    const path: number[] = [];
    let index = leafIndex;

    for (let level = 0; level < this.levels.length - 1; level++) {
      const levelNodes = this.levels[level];
      const isRight = index % 2 === 1;
      const siblingIndex = isRight ? index - 1 : index + 1;
      
      // If no sibling (odd number of nodes), sibling is self
      const sibling = siblingIndex < levelNodes.length 
        ? levelNodes[siblingIndex] 
        : levelNodes[index];
      
      siblings.push(sibling);
      path.push(isRight ? 1 : 0); // 1 = right, 0 = left
      index = Math.floor(index / 2);
    }

    return {
      root: this.getRoot(),
      leaf: this.leaves[leafIndex],
      siblings,
      path,
      treeId: this.treeId,
    };
  }

  static verifyProof(proof: MerkleProof): boolean {
    let computedHash = proof.leaf;

    for (let i = 0; i < proof.siblings.length; i++) {
      const sibling = proof.siblings[i];
      const isRight = proof.path[i] === 1;
      
      if (isRight) {
        computedHash = MerkleTree.combineHash(sibling, computedHash);
      } else {
        computedHash = MerkleTree.combineHash(computedHash, sibling);
      }
    }

    const valid = computedHash === proof.root;
    logger.debug(`Merkle proof verification: ${valid ? 'VALID' : 'INVALID'}`);
    return valid;
  }

  getNodes(): MerkleNode[] {
    const nodes: MerkleNode[] = [];

    for (let level = 0; level < this.levels.length; level++) {
      const levelNodes = this.levels[level];
      for (let index = 0; index < levelNodes.length; index++) {
        nodes.push({
          hash: levelNodes[index],
          index,
          level,
          isLeaf: level === 0,
        });
      }
    }

    return nodes;
  }

  getLeafCount(): number {
    return this.leaves.length;
  }

  getLeaf(index: number): string {
    return this.leaves[index];
  }
}

// Single fossil proof generation (simplified for single item)
export function createFossilProof(content: string): { proof: MerkleProof; root: string; tree: MerkleTree } {
  const tree = new MerkleTree();
  tree.addLeaf(content);
  tree.build();
  const proof = tree.getProof(0);
  return { proof, root: tree.getRoot(), tree };
}
