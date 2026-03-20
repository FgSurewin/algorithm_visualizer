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

const bfs = {
  id: 'bfs',
  name: 'BFS Traversal',
  category: 'graphs',
  renderer: 'graph',
  description: 'Breadth-First Search explores all neighbors at the current depth before moving deeper.',
  code: `def bfs(graph, start):
    visited = set()
    queue = [start]
    visited.add(start)
    while queue:
        node = queue.pop(0)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
  codeVersions: {
    python: `def bfs(graph, start):
    visited = set()
    queue = [start]
    visited.add(start)
    while queue:
        node = queue.pop(0)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
    cpp: `void bfs(vector<vector<int>>& adj, int start) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int node = q.front(); q.pop();
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`,
    java: `void bfs(List<List<Integer>> adj, int start) {
    boolean[] visited = new boolean[adj.size()];
    Queue<Integer> queue = new LinkedList<>();
    visited[start] = true;
    queue.add(start);
    while (!queue.isEmpty()) {
        int node = queue.poll();
        for (int nb : adj.get(node)) {
            if (!visited[nb]) {
                visited[nb] = true;
                queue.add(nb);
            }
        }
    }
}`,
  },
  codeLineMap: {
    python: { initVisited: 2, initQueue: 3, markStart: 4, whileLoop: 5, dequeue: 6, forLoop: 7, check: 8, visit: 9, enqueue: 10 },
    cpp: { initVisited: 2, initQueue: 3, markStart: 4, whileLoop: 6, dequeue: 7, forLoop: 8, check: 9, visit: 10, enqueue: 11 },
    java: { initVisited: 2, initQueue: 3, markStart: 4, whileLoop: 6, dequeue: 7, forLoop: 8, check: 9, visit: 10, enqueue: 11 },
  },
  defaultData: [0],
  generateSteps() {
    const adj = buildAdj(GRAPH);
    const steps = [];
    const visited = new Set();
    const visitedEdges = [];
    const queue = ['A'];
    
    function snapshot(acNodes, visNodes, acEdges, visEdges, q, cAction, msg) {
      steps.push({
        nodes: GRAPH.nodes, edges: GRAPH.edges,
        activeNodes: acNodes, visitedNodes: visNodes, activeEdges: acEdges, visitedEdges: visEdges,
        queue: [...q], queueLabel: 'Queue',
        codeAction: cAction, message: msg,
      });
    }

    steps.push({
      nodes: GRAPH.nodes, edges: GRAPH.edges,
      activeNodes: [], visitedNodes: [], activeEdges: [], visitedEdges: [],
      queue: [], queueLabel: 'Queue',
      codeAction: null, message: 'Starting BFS from node A',
    });

    snapshot([], [], [], [], [], 'initVisited', `visited = set()`);
    snapshot([], [], [], [], ['A'], 'initQueue', `queue = ['A']`);
    
    visited.add('A');
    snapshot(['A'], [], [], [], ['A'], 'markStart', `visited.add('A')`);

    while (queue.length > 0) {
      snapshot(['A'], [...visited].filter(n => n !== queue[0]), [], [...visitedEdges], queue, 'whileLoop', `while queue (size: ${queue.length})`);
      
      const node = queue.shift();
      snapshot([node], [...visited].filter(n => n !== node), [], [...visitedEdges], queue, 'dequeue', `node = queue.pop(0) -> ${node}`);

      for (const neighbor of adj[node]) {
        snapshot([node], [...visited], [[node, neighbor]], [...visitedEdges], queue, 'forLoop', `for neighbor in graph[${node}] -> checking ${neighbor}`);
        
        snapshot([node], [...visited], [[node, neighbor]], [...visitedEdges], queue, 'check', `if ${neighbor} not in visited`);

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          snapshot([node, neighbor], [...visited].filter(n=>n!==node && n!==neighbor), [[node, neighbor]], [...visitedEdges], queue, 'visit', `visited.add(${neighbor})`);
          
          queue.push(neighbor);
          visitedEdges.push([node, neighbor]);
          snapshot([node, neighbor], [...visited].filter(n=>n!==node && n!==neighbor), [[node, neighbor]], [...visitedEdges], queue, 'enqueue', `queue.append(${neighbor})`);
        }
      }
    }
    
    snapshot([], [...visited], [], [...visitedEdges], queue, 'whileLoop', `while queue (size: 0) -> Loop ends`);

    steps.push({
      nodes: GRAPH.nodes, edges: GRAPH.edges,
      activeNodes: [], visitedNodes: [...visited],
      activeEdges: [], visitedEdges: [...visitedEdges],
      queue: [], queueLabel: 'Queue',
      codeAction: null, message: `BFS complete! Visited ${visited.size} nodes.`,
    });

    return steps;
  },
};

export default bfs;
