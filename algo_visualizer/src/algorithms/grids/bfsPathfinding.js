const GRID = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0],
  [1, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 1, 0, 0],
];
const START = [0, 0];
const END = [7, 7];
const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]];

const bfsPathfinding = {
  id: 'bfs-path',
  name: 'BFS Pathfinding',
  category: 'grids',
  renderer: 'grid',
  description: 'Find the shortest path in a grid using Breadth-First Search.',
  code: `def bfs_path(grid, start, end):
    queue = [start]
    visited = {start: None}
    while queue:
        r, c = queue.pop(0)
        if (r, c) == end:
            break
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0<=nr<len(grid) and 0<=nc<len(grid[0]):
                if grid[nr][nc] == 0 and (nr,nc) not in visited:
                    visited[(nr,nc)] = (r,c)
                    queue.append((nr,nc))`,
  codeVersions: {
    python: `def bfs_path(grid, start, end):
    queue = [start]
    visited = {start: None}
    while queue:
        r, c = queue.pop(0)
        if (r, c) == end:
            break
        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0<=nr<len(grid) and 0<=nc<len(grid[0]):
                if grid[nr][nc] == 0 and (nr,nc) not in visited:
                    visited[(nr,nc)] = (r,c)
                    queue.append((nr,nc))`,
    cpp: `vector<pair<int,int>> bfsPath(vector<vector<int>>& grid,
        pair<int,int> start, pair<int,int> end) {
    queue<pair<int,int>> q;
    map<pair<int,int>,pair<int,int>> parent;
    q.push(start);
    parent[start] = {-1,-1};
    int dirs[4][2] = {{0,1},{1,0},{0,-1},{-1,0}};
    while (!q.empty()) {
        auto [r,c] = q.front(); q.pop();
        if (r == end.first && c == end.second) break;
        for (auto& d : dirs) {
            int nr = r+d[0], nc = c+d[1];
            if (nr>=0 && nr<grid.size() && nc>=0 && nc<grid[0].size()
                && grid[nr][nc]==0 && !parent.count({nr,nc})) {
                parent[{nr,nc}] = {r,c};
                q.push({nr,nc});
            }
        }
    }
}`,
    java: `List<int[]> bfsPath(int[][] grid, int[] start, int[] end) {
    Queue<int[]> queue = new LinkedList<>();
    Map<String, int[]> parent = new HashMap<>();
    queue.add(start);
    parent.put(start[0]+","+start[1], null);
    int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};
    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        if (curr[0]==end[0] && curr[1]==end[1]) break;
        for (int[] d : dirs) {
            int nr = curr[0]+d[0], nc = curr[1]+d[1];
            String key = nr+","+nc;
            if (nr>=0 && nr<grid.length && nc>=0 && nc<grid[0].length
                && grid[nr][nc]==0 && !parent.containsKey(key)) {
                parent.put(key, curr);
                queue.add(new int[]{nr,nc});
            }
        }
    }
}`,
  },
  codeLineMap: {
    python: { initQueue: 2, initVisited: 3, whileLoop: 4, dequeue: 5, checkEnd: 6, found: 7, forLoop: 8, calcCoord: 9, checkBounds: 10, checkValid: 11, markVisited: 12, enqueue: 13 },
    cpp: { initQueue: 4, initVisited: 5, whileLoop: 8, dequeue: 9, checkEnd: 10, found: 10, forLoop: 11, calcCoord: 12, checkBounds: 13, checkValid: 14, markVisited: 15, enqueue: 16 },
    java: { initQueue: 4, initVisited: 5, whileLoop: 7, dequeue: 8, checkEnd: 9, found: 9, forLoop: 10, calcCoord: 11, checkBounds: 13, checkValid: 14, markVisited: 15, enqueue: 16 },
  },
  defaultData: [0],
  generateSteps() {
    const steps = [];
    const rows = GRID.length, cols = GRID[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = {};
    const queue = [[...START]];
    
    function snapshot(cur, vis, pth, fCells, cAction, msg) {
      steps.push({
        grid: GRID, visited: vis.map(r => [...r]), path: pth,
        current: cur, start: START, end: END, frontierCells: fCells.map(q => [...q]),
        codeAction: cAction, message: msg,
      });
    }

    steps.push({
      grid: GRID, visited: visited.map(r => [...r]), path: [],
      current: null, start: START, end: END, frontierCells: [],
      codeAction: null, message: `Starting BFS from (${START[0]},${START[1]}) to (${END[0]},${END[1]})`,
    });

    snapshot(null, visited, [], queue, 'initQueue', `queue = [start]`);
    
    visited[START[0]][START[1]] = true;
    parent[`${START[0]},${START[1]}`] = null;
    snapshot(null, visited, [], queue, 'initVisited', `visited = {start: None}`);

    let found = false;

    while (queue.length > 0 && !found) {
      snapshot(null, visited, [], queue, 'whileLoop', `while queue (size: ${queue.length})`);
      
      const [r, c] = queue.shift();
      snapshot([r, c], visited, [], queue, 'dequeue', `r, c = queue.pop(0) -> (${r}, ${c})`);
      
      snapshot([r, c], visited, [], queue, 'checkEnd', `if (${r}, ${c}) == end`);

      if (r === END[0] && c === END[1]) {
        found = true;
        snapshot([r, c], visited, [], queue, 'found', `Reached destination!`);
        break;
      }

      for (const [dr, dc] of DIRS) {
        snapshot([r, c], visited, [], queue, 'forLoop', `for dr, dc in directions -> (${dr}, ${dc})`);
        
        const nr = r + dr, nc = c + dc;
        snapshot([r, c], visited, [], queue, 'calcCoord', `nr, nc = ${nr}, ${nc}`);
        
        snapshot([r, c], visited, [], queue, 'checkBounds', `if bounds check for (${nr}, ${nc})`);

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          snapshot([r, c], visited, [], queue, 'checkValid', `if cell is open (0) and not visited`);
          if (GRID[nr][nc] === 0 && !visited[nr][nc]) {
            visited[nr][nc] = true;
            parent[`${nr},${nc}`] = [r, c];
            snapshot([r, c], visited, [], queue, 'markVisited', `visited[(${nr},${nc})] = (${r},${c})`);
            
            queue.push([nr, nc]);
            snapshot([r, c], visited, [], queue, 'enqueue', `queue.append((${nr},${nc}))`);
          }
        }
      }
    }
    
    if (!found) {
        snapshot(null, visited, [], queue, 'whileLoop', `while queue (size: 0) -> Loop ends`);
    }

    // Reconstruct path
    const path = [];
    if (found) {
      let cur = `${END[0]},${END[1]}`;
      while (cur) {
        const [pr, pc] = cur.split(',').map(Number);
        path.unshift([pr, pc]);
        const p = parent[cur];
        cur = p ? `${p[0]},${p[1]}` : null;
      }
    }

    // Show path reconstruction
    for (let i = 0; i < path.length; i++) {
      steps.push({
        grid: GRID, visited: visited.map(r => [...r]),
        path: path.slice(0, i + 1),
        current: path[i], start: START, end: END, frontierCells: [],
        codeAction: null, message: `Path step ${i + 1}: (${path[i][0]}, ${path[i][1]})`,
      });
    }

    steps.push({
      grid: GRID, visited: visited.map(r => [...r]),
      path, current: null, start: START, end: END, frontierCells: [],
      codeAction: null, message: found ? `Shortest path found! Length: ${path.length}` : 'No path exists!',
    });

    return steps;
  },
};

export default bfsPathfinding;
