import bubbleSort from './sorting/bubbleSort';
import insertionSort from './sorting/insertionSort';
import selectionSort from './sorting/selectionSort';
import factorial from './recursion/factorial';
import fibonacci from './recursion/fibonacci';
import bstInsert from './trees/bstInsert';
import bfs from './graphs/bfs';
import dfs from './graphs/dfs';
import bfsPathfinding from './grids/bfsPathfinding';

// --- Algorithm Registry ---

const ALL_ALGORITHMS = [
  bubbleSort,
  insertionSort,
  selectionSort,
  factorial,
  fibonacci,
  bstInsert,
  bfs,
  dfs,
  // bfsPathfinding,
];

// --- Category Definitions ---

export const CATEGORIES = [
  { id: 'sorting', name: 'Sorting', icon: 'BarChart3' },
  { id: 'recursion', name: 'Recursion', icon: 'GitBranch' },
  { id: 'trees', name: 'Trees', icon: 'Network' },
  { id: 'graphs', name: 'Graphs', icon: 'Share2' },
  // { id: 'grids', name: 'Pathfinding', icon: 'Grid3X3' },
];

// --- Lookup Helpers ---

export function getAlgorithmById(id) {
  return ALL_ALGORITHMS.find((a) => a.id === id) || ALL_ALGORITHMS[0];
}

export function getAlgorithmsByCategory(categoryId) {
  return ALL_ALGORITHMS.filter((a) => a.category === categoryId);
}

export function getAllAlgorithms() {
  return ALL_ALGORITHMS;
}

export default ALL_ALGORITHMS;
