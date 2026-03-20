const GRAPH = {
  nodes: [
    { id: 'A', x: 0.15, y: 0.15 }, { id: 'B', x: 0.5, y: 0.1 },
    { id: 'C', x: 0.85, y: 0.15 }, { id: 'D', x: 0.1, y: 0.5 },
    { id: 'E', x: 0.5, y: 0.45 }, { id: 'F', x: 0.9, y: 0.5 },
    { id: 'G', x: 0.3, y: 0.85 }, { id: 'H', x: 0.7, y: 0.85 },
  ],
  edges: [
    ['A', 'B'], ['A', 'D'], ['B', 'C'], ['B', 'E'],
    ['C', 'F'], ['D', 'E'], ['D', 'G'], ['E', 'F'], ['E', 'H'], ['G', 'H'],
  ],
};

function buildAdj(graph) {
  const adj = {};
  graph.nodes.forEach(n => { adj[n.id] = []; });
  graph.edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  return adj;
}

const dfs = {
  id: 'dfs',
  name: 'DFS Traversal',
  category: 'graphs',
  renderer: 'graph',
  description: 'Depth-First Search explores as far as possible along each branch before backtracking.',
  code: `def dfs(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    stack.append(neighbor)`,
  codeVersions: {
    python: `def dfs(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    stack.append(neighbor)`,
    cpp: `void dfs(vector<vector<int>>& adj, int start) {
    vector<bool> visited(adj.size(), false);
    stack<int> s;
    s.push(start);
    while (!s.empty()) {
        int node = s.top(); s.pop();
        if (!visited[node]) {
            visited[node] = true;
            for (int nb : adj[node]) {
                if (!visited[nb])
                    s.push(nb);
            }
        }
    }
}`,
    java: `void dfs(List<List<Integer>> adj, int start) {
    boolean[] visited = new boolean[adj.size()];
    Stack<Integer> stack = new Stack<>();
    stack.push(start);
    while (!stack.isEmpty()) {
        int node = stack.pop();
        if (!visited[node]) {
            visited[node] = true;
            for (int nb : adj.get(node)) {
                if (!visited[nb])
                    stack.push(nb);
            }
        }
    }
}`,
  },
  codeLineMap: {
    python: { initVisited: 2, initStack: 3, whileLoop: 4, pop: 5, checkVisited: 6, visit: 7, forLoop: 8, checkNb: 9, push: 10 },
    cpp: { initVisited: 2, initStack: 3, whileLoop: 5, pop: 6, checkVisited: 7, visit: 8, forLoop: 9, checkNb: 10, push: 11 },
    java: { initVisited: 2, initStack: 3, whileLoop: 5, pop: 6, checkVisited: 7, visit: 8, forLoop: 9, checkNb: 10, push: 11 },
  },
  defaultData: [0],
  generateSteps() {
    const adj = buildAdj(GRAPH);
    const steps = [];
    const visited = new Set();
    const visitedEdges = [];
    const stack = ['A'];

    function snapshot(acNodes, visNodes, acEdges, visEdges, q, cAction, msg) {
      steps.push({
        nodes: GRAPH.nodes, edges: GRAPH.edges,
        activeNodes: acNodes, visitedNodes: visNodes, activeEdges: acEdges, visitedEdges: visEdges,
        queue: [...q], queueLabel: 'Stack',
        codeAction: cAction, message: msg,
      });
    }

    steps.push({
      nodes: GRAPH.nodes, edges: GRAPH.edges,
      activeNodes: [], visitedNodes: [], activeEdges: [], visitedEdges: [],
      queue: [], queueLabel: 'Stack',
      codeAction: null, message: 'Starting DFS from node A',
    });

    snapshot([], [], [], [], [], 'initVisited', `visited = set()`);
    snapshot([], [], [], [], stack, 'initStack', `stack = ['A']`);

    while (stack.length > 0) {
      snapshot([], [...visited], [], [...visitedEdges], stack, 'whileLoop', `while stack (size: ${stack.length})`);
      
      const node = stack.pop();
      snapshot([node], [...visited], [], [...visitedEdges], stack, 'pop', `node = stack.pop() -> ${node}`);
      
      snapshot([node], [...visited], [], [...visitedEdges], stack, 'checkVisited', `if ${node} not in visited`);

      if (!visited.has(node)) {
        visited.add(node);
        snapshot([node], [...visited].filter(n=>n!==node), [], [...visitedEdges], stack, 'visit', `visited.add(${node})`);

        const neighbors = adj[node];
        for (const neighbor of neighbors) {
          snapshot([node], [...visited].filter(n=>n!==node), [[node, neighbor]], [...visitedEdges], stack, 'forLoop', `for neighbor in graph[${node}] -> checking ${neighbor}`);
          snapshot([node], [...visited].filter(n=>n!==node), [[node, neighbor]], [...visitedEdges], stack, 'checkNb', `if ${neighbor} not in visited`);
          
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
            // In DFS iteration, we push edges visually as they enter stack to show progression path
            if (!visitedEdges.some(e => (e[0]===node && e[1]===neighbor) || (e[0]===neighbor && e[1]===node))) {
              visitedEdges.push([node, neighbor]);
            }
            snapshot([node], [...visited].filter(n=>n!==node), [[node, neighbor]], [...visitedEdges], stack, 'push', `stack.append(${neighbor})`);
          }
        }
      } else {
         snapshot([node], [...visited], [], [...visitedEdges], stack, null, `Node ${node} already visited, skipping.`);
      }
    }
    
    snapshot([], [...visited], [], [...visitedEdges], stack, 'whileLoop', `while stack (size: 0) -> Loop ends`);

    steps.push({
      nodes: GRAPH.nodes, edges: GRAPH.edges,
      activeNodes: [], visitedNodes: [...visited],
      activeEdges: [], visitedEdges: [...visitedEdges],
      queue: [], queueLabel: 'Stack',
      codeAction: null, message: `DFS complete! Visited ${visited.size} nodes.`,
    });

    return steps;
  },
};

export default dfs;
