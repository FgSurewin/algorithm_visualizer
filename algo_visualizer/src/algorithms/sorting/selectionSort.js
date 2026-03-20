const selectionSort = {
  id: 'selection',
  name: 'Selection Sort',
  category: 'sorting',
  renderer: 'bar-chart',
  description: 'Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.',
  code: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[min_idx] > arr[j]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
  codeVersions: {
    python: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[min_idx] > arr[j]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[min_idx] > arr[j])
                min_idx = j;
        }
        swap(arr[i], arr[min_idx]);
    }
}`,
    java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[minIdx] > arr[j])
                minIdx = j;
        }
        swap(arr, i, minIdx); // Helper
    }
}`,
  },
  codeLineMap: {
    python: { outerLoop: 2, setMin: 3, innerLoop: 4, compare: 5, newMin: 6, swap: 7 },
    cpp: { outerLoop: 2, setMin: 3, innerLoop: 4, compare: 5, newMin: 6, swap: 8 },
    java: { outerLoop: 3, setMin: 4, innerLoop: 5, compare: 6, newMin: 7, swap: 9 },
  },
  defaultData: [45, 22, 89, 12, 56, 33, 71, 10, 64, 28],
  generateSteps(inputData) {
    const steps = [];
    const arr = [...inputData];

    steps.push({
      array: [...arr], highlights: [], comparing: [], swapping: [], sorted: [],
      codeAction: null, message: 'Starting Selection Sort...',
    });

    steps.push({
      array: [...arr], highlights: [], comparing: [], swapping: [], sorted: [],
      codeAction: 'initN', message: `n = ${arr.length}`,
    });

    for (let i = 0; i < arr.length; i++) {
      const currentSorted = Array.from({ length: i }, (_, k) => k);

      steps.push({ array: [...arr], highlights: [], sorted: currentSorted, codeAction: 'outerLoop', message: `Outer loop: i = ${i}` });
      
      let min_idx = i;
      steps.push({ array: [...arr], highlights: [i], sorted: currentSorted, codeAction: 'setMin', message: `min_idx = ${i}` });
      
      for (let j = i + 1; j < arr.length; j++) {
        steps.push({ array: [...arr], comparing: [min_idx, j], sorted: currentSorted, codeAction: 'innerLoop', message: `Inner loop: j = ${j}` });
        
        steps.push({ array: [...arr], comparing: [min_idx, j], sorted: currentSorted, codeAction: 'compare', message: `if arr[${min_idx}] > arr[${j}] (${arr[min_idx]} > ${arr[j]})` });
        
        if (arr[j] < arr[min_idx]) {
          min_idx = j;
          steps.push({ array: [...arr], highlights: [min_idx], sorted: currentSorted, codeAction: 'newMin', message: `min_idx = ${j}` });
        }
      }
      steps.push({ array: [...arr], swapping: [i, min_idx], sorted: currentSorted, codeAction: 'swap', message: `swap(arr[${i}], arr[${min_idx}])` });
      [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
    }

    steps.push({
      array: [...arr], highlights: [], comparing: [], swapping: [],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      codeAction: null, message: 'Sorting complete!',
    });

    return steps;
  },
};

export default selectionSort;
