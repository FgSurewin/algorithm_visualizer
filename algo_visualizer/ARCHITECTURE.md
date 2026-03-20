# Architecture Guide & Contributing

Welcome to the Algorithm Visualizer project! This document explains the core architectural patterns behind the application and serves as a guide for anyone looking to add new algorithms or extend the app's capabilities.

## Introduction: The "Data-Driven Snapshot" Model

A common pitfall when building algorithm visualizers is tightly coupling the visualization rendering logic with algorithm execution using `delay()`, `setTimeout()`, or `async/await` throughout the logic code. This almost always leads to race conditions, synchronization bugs, and spaghetti code.

Instead, this application relies on a **Data-Driven Snapshot Model**. The architecture is strictly decoupled into three un-entangled layers:

1. **The Algorithm Modules (Pure Logic)**
2. **The Renderers (Pure UI)**
3. **The Playback Engine (Orchestration)**

### 1. The Algorithm Modules (The "Generators")

Algorithms exist solely to calculate exactly *what happens* at each step, completely instantly in the background. They do not know what the UI looks like.

When an algorithm runs, it records an array of `steps` (snapshots). A single step object captures the exact state of the algorithm at a single atomic moment in time.

### 2. The Renderers (The "Canvas")

Renderers (e.g., `BarChartRenderer`, `TreeRenderer`, `GraphRenderer`) are pure React components. They take exactly *one* prop: `step`.

They look at the snapshot data (`step.array`, `step.comparing`, `step.swapping`, etc.) and paint it. They know nothing about logic, sequencing, or loops—they are "dumb" canvases rendering a freeze-frame.

### 3. The Playback Engine (The "Player")

The playback system (powered by `usePlayback.js`) maintains an array of `steps` and a `currentStepIdx` pointer. When the user hits "Play", it simply increments `currentStepIdx` on a `setInterval`. React automatically reacts by passing the new snapshot into the Renderer and Code Panel.

Because the UI strictly reflects the snapshot data, it is impossible for visual elements and logic to drift out of sync.

---

## How to Add a New Algorithm

With this architecture, you never have to touch React code or CSS to add a standard algorithm. Let's look at a complete example: Adding a Recursive **Factorial** visualizer using the existing `TreeRenderer`.

### Step 1: Create the Algorithm File

Create a new file in the appropriate category, e.g., `src/algorithms/recursion/factorial.js`. Export a metadata object detailing the algorithm:

```javascript
const factorial = {
  id: 'factorial',
  name: 'Factorial Recursion',
  category: 'recursion',
  renderer: 'tree', // We want to use the generic tree visualizer!
  description: 'Visualize the recursive call stack for computing n factorial.',
  // Define language representations
  codeVersions: {
    python: \`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)\`
  },
  // Map our semantic actions (defined below) to exactly the 1-indexed lines they correspond to in the code strings
  codeLineMap: {
    python: { call: 1, checkBase: 2, returnBase: 3, returnRec: 4 }
  },
  defaultData: [4],
  
  // This is the heart: A generator function that returns an array of snapshot objects
  generateSteps(inputData) {
    const n = inputData[0] || 4;
    const steps = [];
    const completedIds = new Set();
    let root = null;
    let nodeIdCounter = 0;

    // Helper to deeply clone our tree structure for React states
    const cloneTree = (node) => node ? { ...node, children: node.children.map(cloneTree) } : null;

    // Helper to log a single discrete snapshot step
    const snapshot = (activeIds, returningIds, message, codeAction) => {
      steps.push({
        tree: cloneTree(root),
        activeNodes: activeIds,
        completedNodes: [...completedIds],
        returningNodes: returningIds,
        message,
        codeAction // Critical: Tells the code panel which semantic action is happening!
      });
    };

    // The actual algorithm logic...
    function fact(num, parent) {
      const node = { id: nodeIdCounter++, label: \`fact(\${num})\`, value: null, children: [] };
      if (!root) root = node;
      if (parent) parent.children.push(node);

      // Record a step instantly BEFORE mutating variables/making decisions
      snapshot([node.id], [], \`factorial(\${num}) called\`, 'call');
      snapshot([node.id], [], \`Checking if (\${num} <= 1)\`, 'checkBase');

      if (num <= 1) {
        node.value = 1;
        completedIds.add(node.id);
        snapshot([], [node.id], \`Base case reached: return 1\`, 'returnBase');
        return 1;
      }

      snapshot([node.id], [], \`return \${num} * factorial(\${num - 1})\`, 'returnRec');
      
      const childVal = fact(num - 1, node); // Recurse!
      
      node.value = num * childVal;
      completedIds.add(node.id);
      snapshot([], [node.id], \`factorial(\${num}) = \${num} * \${childVal}. Returning!\`, 'returnRec');
      
      return node.value;
    }

    fact(n, null); // Run the generator instantly

    return steps; // Feed the playback engine!
  }
};

export default factorial;
```

### Step 2: Register the Algorithm

Now that you have your file, add it to `src/algorithms/registry.js` so the Sidebar and Engine know about it:

```javascript
// registry.js
...
import factorial from './recursion/factorial';

const algorithms = {
  ...
  factorial,
};
```

That's it! Because we set `renderer: 'tree'`, the UI knows to pipe these step snapshots straight into `<TreeRenderer />`, resolving the graph UI out of the box.

---

## Expanding to "Custom" User Algorithms

The same decoupling enables our generic Code Tracer (used in the "Custom" panel tab). 

Instead of writing a custom `generateSteps` and defining `codeLineMap`, the user just inputs arbitrary JavaScript. We run their logic through an AST / Execution interceptor (`utils/tracer.js`) that injects `__t()` commands under the hood. 

The generated `steps` array contains standard `{ variables: {...}, line: n }` steps, which are piped directly to the `DebuggerRenderer` and `CodePanel`. No hardcoded logic needed! 
