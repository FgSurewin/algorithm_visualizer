const factorial = {
  id: 'factorial',
  name: 'Factorial Recursion',
  category: 'recursion',
  renderer: 'tree',
  description: 'Visualize the recursive call stack for computing the factorial of a number.',
  code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
  codeVersions: {
    python: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    cpp: `int factorial(int n) {
    if (n <= 1)
        return 1;
    return n * factorial(n - 1);
}`,
    java: `int factorial(int n) {
    if (n <= 1)
        return 1;
    return n * factorial(n - 1);
}`,
  },
  codeLineMap: {
    python: { call: 1, checkBase: 2, returnBase: 3, returnRec: 4 },
    cpp: { call: 1, checkBase: 2, returnBase: 3, returnRec: 4 },
    java: { call: 1, checkBase: 2, returnBase: 3, returnRec: 4 },
  },
  defaultData: [5],
  generateSteps(inputData) {
    const raw = Math.abs(inputData[0]) || 5;
    const n = Math.min(Math.max(raw, 1), 8); // clamp to 1-8 to avoid huge trees
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

    steps.push({
      tree: null,
      activeNodes: [],
      completedNodes: [],
      returningNodes: [],
      message: `Starting Factorial recursion for n = ${n}...`,
      codeAction: null,
    });

    function fact(num, parent) {
      const node = {
        id: nodeIdCounter++,
        label: `fact(${num})`,
        value: null,
        children: [],
      };
      if (!root) root = node;
      if (parent) parent.children.push(node);

      snapshot([node.id], [], `factorial(${num}) called`, 'call');
      snapshot([node.id], [], `if (${num} <= 1)`, 'checkBase');

      if (num <= 1) {
        node.value = 1;
        completedIds.add(node.id);
        snapshot([], [node.id], `Base case reached: return 1`, 'returnBase');
        return 1;
      }

      snapshot([node.id], [], `return ${num} * factorial(${num - 1})`, 'returnRec');
      
      const childVal = fact(num - 1, node);
      
      node.value = num * childVal;
      completedIds.add(node.id);
      snapshot([], [node.id], `factorial(${num}) = ${num} * ${childVal} = ${node.value}. Returning up the tree!`, 'returnRec');
      
      return node.value;
    }

    fact(n, null);

    steps.push({
      tree: cloneTree(root),
      activeNodes: [],
      completedNodes: [...completedIds],
      returningNodes: [],
      message: `Complete! factorial(${n}) = ${root.value}`,
      codeAction: null,
    });

    return steps;
  },
};

export default factorial;
