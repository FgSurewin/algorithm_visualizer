const bubbleSort = {
  id: 'bubble',
  name: 'Bubble Sort',
  category: 'sorting',
  renderer: 'bar-chart',
  description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
  codeVersions: {
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
    cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
    java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1); // Helper
            }
        }
    }
}`,
  },
  codeLineMap: {
    python: { initN: 2, outerLoop: 3, innerLoop: 4, compare: 5, swap: 6 },
    cpp: { initN: -1, outerLoop: 2, innerLoop: 3, compare: 4, swap: 5 },
    java: { initN: 2, outerLoop: 3, innerLoop: 4, compare: 5, swap: 6 },
  },
  defaultData: [45, 22, 89, 12, 56, 33, 71, 10, 64, 28],
  generateSteps(inputData) {
    const steps = [];
    const arr = [...inputData];

    steps.push({
      array: [...arr], highlights: [], comparing: [], swapping: [], sorted: [],
      codeAction: null, message: 'Starting Bubble Sort...',
    });

    const n = arr.length;
    steps.push({
      array: [...arr], highlights: [], comparing: [], swapping: [], sorted: [],
      codeAction: 'initN', message: `n = ${n}`,
    });

    for (let i = 0; i < n; i++) {
      const currentSorted = Array.from({ length: i }, (_, k) => n - 1 - k);
      steps.push({
        array: [...arr], highlights: [], comparing: [], swapping: [], sorted: currentSorted,
        codeAction: 'outerLoop', message: `Outer loop: i = ${i} (Pass ${i + 1} of ${n})`,
      });

      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          array: [...arr], highlights: [], comparing: [j, j + 1], swapping: [], sorted: currentSorted,
          codeAction: 'innerLoop', message: `Inner loop: j = ${j}`,
        });

        steps.push({
          array: [...arr], comparing: [j, j + 1], sorted: currentSorted,
          codeAction: 'compare', message: `if arr[${j}] > arr[${j + 1}] (${arr[j]} > ${arr[j + 1]})`,
        });

        if (arr[j] > arr[j + 1]) {
          steps.push({
            array: [...arr], swapping: [j, j + 1], sorted: currentSorted,
            codeAction: 'swap', message: `Swapping arr[${j}] and arr[${j + 1}] (${arr[j]} > ${arr[j + 1]})`,
          });
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
      steps[steps.length - 1].sorted = Array.from({ length: i + 1 }, (_, k) => n - 1 - k);
    }

    steps.push({
      array: [...arr], highlights: [], comparing: [], swapping: [],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      codeAction: null, message: 'Sorting complete!',
    });

    return steps;
  },
};

export default bubbleSort;
