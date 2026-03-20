let phantomIdCounter = -1;

function newPhantom() {
  return { id: phantomIdCounter--, label: '', value: null, children: [], _phantom: true };
}

const bstInsert = {
  id: 'bst-insert',
  name: 'BST Insertion',
  category: 'trees',
  renderer: 'tree',
  description: 'Insert values one by one into a Binary Search Tree, showing the traversal path.',
  code: `def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.val:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root`,
  codeVersions: {
    python: `def insert(root, key):
    if root is None:
        return Node(key)
    if key < root.val:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root`,
    cpp: `Node* insert(Node* root, int key) {
    if (root == nullptr)
        return new Node(key);
    if (key < root->val)
        root->left = insert(root->left, key);
    else
        root->right = insert(root->right, key);
    return root;
}`,
    java: `Node insert(Node root, int key) {
    if (root == null)
        return new Node(key);
    if (key < root.val)
        root.left = insert(root.left, key);
    else
        root.right = insert(root.right, key);
    return root;
}`,
  },
  codeLineMap: {
    python: { call: 1, checkBase: 2, returnBase: 3, checkLeft: 4, goLeft: 5, checkRight: 6, goRight: 7, returnRoot: 8 },
    cpp: { call: 1, checkBase: 2, returnBase: 3, checkLeft: 4, goLeft: 5, checkRight: 6, goRight: 7, returnRoot: 8 },
    java: { call: 1, checkBase: 2, returnBase: 3, checkLeft: 4, goLeft: 5, checkRight: 6, goRight: 7, returnRoot: 8 },
  },
  defaultData: [50, 30, 70, 20, 40, 60, 80],
  generateSteps(inputData) {
    const steps = [];
    let root = null;
    let nodeIdCounter = 0;
    const placedIds = new Set();
    phantomIdCounter = -1;

    function cloneTree(node) {
      if (!node) return null;
      const result = {
        id: node.id,
        label: String(node.val),
        value: null,
        children: [],
      };
      // Include phantom children for layout positioning
      if (node.left || node.right) {
        result.children.push(node.left ? cloneTree(node.left) : newPhantom());
        result.children.push(node.right ? cloneTree(node.right) : newPhantom());
      }
      return result;
    }

    function snapshot(activeIds, newIds, message, codeAction) {
      steps.push({
        tree: root ? cloneTree(root) : null,
        activeNodes: activeIds,
        completedNodes: [...placedIds],
        returningNodes: newIds,
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
      message: `Starting BST insertion with ${inputData.length} values...`,
      codeAction: null,
    });

    for (const val of inputData) {
      if (!root) {
        snapshot([], [], `call insert(null, ${val})`, 'call');
        snapshot([], [], `if root is None (null == null)`, 'checkBase');
        root = { id: nodeIdCounter++, val, left: null, right: null };
        placedIds.add(root.id);
        snapshot([], [root.id], `return Node(${val})`, 'returnBase');
        continue;
      }

      let current = root;
      // In a real recursion, we trace down. We simulate the recursive stack trace iteratively.
      snapshot([current.id], [], `call insert(${current.val}, ${val})`, 'call');

      while (true) {
        snapshot([current.id], [], `if root is None (${current.val} == null) -> false`, 'checkBase');
        snapshot([current.id], [], `if ${val} < ${current.val}`, 'checkLeft');

        if (val < current.val) {
          if (!current.left) {
            snapshot([current.id], [], `root.left = insert(null, ${val})`, 'goLeft');
            snapshot([current.id], [], `call insert(null, ${val})`, 'call'); // Simulating inner call
            snapshot([current.id], [], `if root is None (null == null)`, 'checkBase'); // Simulating inner call

            const newNode = { id: nodeIdCounter++, val, left: null, right: null };
            current.left = newNode;
            placedIds.add(newNode.id);
            snapshot([newNode.id], [newNode.id], `return Node(${val})`, 'returnBase'); // Inner call returns
            break;
          }
          snapshot([current.id], [], `root.left = insert(${current.left.val}, ${val})`, 'goLeft');
          current = current.left;
          snapshot([current.id], [], `call insert(${current.val}, ${val})`, 'call');
        } else {
          snapshot([current.id], [], `else branch (${val} >= ${current.val})`, 'checkRight');
          
          if (!current.right) {
            snapshot([current.id], [], `root.right = insert(null, ${val})`, 'goRight');
            snapshot([current.id], [], `call insert(null, ${val})`, 'call'); // Simulating inner call
            snapshot([current.id], [], `if root is None (null == null)`, 'checkBase'); // Simulating inner call

            const newNode = { id: nodeIdCounter++, val, left: null, right: null };
            current.right = newNode;
            placedIds.add(newNode.id);
            snapshot([newNode.id], [newNode.id], `return Node(${val})`, 'returnBase'); // Inner call returns
            break;
          }
          snapshot([current.id], [], `root.right = insert(${current.right.val}, ${val})`, 'goRight');
          current = current.right;
          snapshot([current.id], [], `call insert(${current.val}, ${val})`, 'call');
        }
      }
      snapshot([], [], `return root`, 'returnRoot');
    }

    // Final step
    steps.push({
      tree: root ? cloneTree(root) : null,
      activeNodes: [],
      completedNodes: [...placedIds],
      returningNodes: [],
      message: `BST construction complete! ${inputData.length} nodes inserted.`,
      codeAction: null,
    });

    return steps;
  },
};

export default bstInsert;
