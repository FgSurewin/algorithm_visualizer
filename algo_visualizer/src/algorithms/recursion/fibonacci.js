const fibonacci = {
  id: 'fibonacci',
  name: 'Fibonacci Recursion',
  category: 'recursion',
  renderer: 'tree',
  description: 'Visualize the recursive call tree for computing Fibonacci numbers.',
  code: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,
  codeVersions: {
    python: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,
    cpp: `int fib(int n) {
    if (n <= 1)
        return n;
    return fib(n - 1) + fib(n - 2);
}`,
    java: `int fib(int n) {
    if (n <= 1)
        return n;
    return fib(n - 1) + fib(n - 2);
}`,
  },
  codeLineMap: {
    python: { call: 1, checkBase: 2, returnBase: 3, returnRec: 4 },
    cpp: { call: 1, checkBase: 2, returnBase: 3, returnRec: 4 },
    java: { call: 1, checkBase: 2, returnBase: 3, returnRec: 4 },
  },
  defaultData: [5],
  generateSteps(inputData) {
    // Clamp n to a reasonable range for visualization
    const raw = Math.abs(inputData[0]) || 5;
    const n = Math.min(Math.max(raw <= 7 ? raw : (raw % 6) + 2, 2), 7);
    const steps = [];
    const completedIds = new Set();
    let root = null;
    let nodeIdCounter = 0;

    function cloneTree(node) {
      if (!node) return null;
      return {
        id: node.id,
        label: node.label,
        value: node.value,
        children: node.children.map((c) => cloneTree(c)),
      };
    }

    function snapshot(activeIds, returningIds, message, codeAction) {
      steps.push({
        tree: root ? cloneTree(root) : null,
        activeNodes: activeIds,
        completedNodes: [...completedIds],
        returningNodes: returningIds,
        message,
        codeAction,
      });
    }

    // Initial step
    steps.push({
      tree: null,
      activeNodes: [],
      completedNodes: [],
      returningNodes: [],
      message: `Starting Fibonacci recursion for n = ${n}...`,
      codeAction: null,
    });

    function fib(num, parent) {
      const node = {
        id: nodeIdCounter++,
        label: `fib(${num})`,
        value: null,
        children: [],
      };
      if (!root) root = node;
      if (parent) parent.children.push(node);

      // Call function
      snapshot([node.id], [], `fib(${num}) called`, 'call');

      // Check base case
      snapshot([node.id], [], `if (${num} <= 1)`, 'checkBase');

      if (num <= 1) {
        node.value = num;
        completedIds.add(node.id);
        snapshot([], [node.id], `return ${num}`, 'returnBase');
        return num;
      }

      // Start recursive calls
      snapshot([node.id], [], `return fib(${num - 1}) + fib(${num - 2})`, 'returnRec');
      
      const leftVal = fib(num - 1, node);
      snapshot([node.id], [], `fib(${num - 1}) returned ${leftVal}. Now calling fib(${num - 2}).`, 'returnRec');
      
      const rightVal = fib(num - 2, node);
      node.value = leftVal + rightVal;
      completedIds.add(node.id);
      snapshot([], [node.id], `fib(${num}) = ${leftVal} + ${rightVal} = ${node.value}`, 'returnRec');
      return node.value;
    }

    fib(n, null);

    // Final step
    steps.push({
      tree: cloneTree(root),
      activeNodes: [],
      completedNodes: [...completedIds],
      returningNodes: [],
      message: `Complete! fib(${n}) = ${root.value}`,
      codeAction: null,
    });

    return steps;
  },
};

export default fibonacci;
