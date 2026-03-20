const insertionSort = {
  id: 'insertion',
  name: 'Insertion Sort',
  category: 'sorting',
  renderer: 'bar-chart',
  description: 'Builds the final sorted array one item at a time, by repeatedly taking the next element and inserting it into the correct position.',
  code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
  codeVersions: {
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
    cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    java: `void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
  },
  codeLineMap: {
    python: { outerLoop: 2, pick: 3, setJ: 4, innerLoop: 5, shift: 6, decJ: 7, insert: 8 },
    cpp: { outerLoop: 2, pick: 3, setJ: 4, innerLoop: 5, shift: 6, decJ: 7, insert: 9 },
    java: { outerLoop: 2, pick: 3, setJ: 4, innerLoop: 5, shift: 6, decJ: 7, insert: 9 },
  },
  defaultData: [45, 22, 89, 12, 56, 33, 71, 10, 64, 28],
  generateSteps(inputData) {
    const steps = [];
    const arr = [...inputData];

    steps.push({
      array: [...arr], highlights: [], comparing: [], swapping: [], sorted: [],
      codeAction: null, message: 'Starting Insertion Sort...',
    });

    for (let i = 1; i < arr.length; i++) {
      steps.push({ array: [...arr], highlights: [i], codeAction: 'outerLoop', message: `Outer loop: i = ${i}` });
      
      let key = arr[i];
      steps.push({ array: [...arr], highlights: [i], codeAction: 'pick', message: `key = arr[${i}] (${key})` });
      
      let j = i - 1;
      steps.push({ array: [...arr], highlights: [i], codeAction: 'setJ', message: `j = ${j}` });

      while (true) {
        steps.push({ array: [...arr], comparing: [j, j + 1], codeAction: 'innerLoop', message: `while j >= 0 and key < arr[j] (j=${j})` });
        if (!(j >= 0 && arr[j] > key)) {
          break; // loop condition fails
        }
        steps.push({ array: [...arr], swapping: [j + 1], codeAction: 'shift', message: `Shift arr[${j}] (${arr[j]}) to right` });
        arr[j + 1] = arr[j];
        
        steps.push({ array: [...arr], highlights: [j + 1], codeAction: 'decJ', message: `j-- (j will become ${j - 1})` });
        j = j - 1;
      }

      steps.push({ array: [...arr], highlights: [j + 1], codeAction: 'insert', message: `Insert key (${key}) at arr[${j + 1}]` });
      arr[j + 1] = key;
    }

    steps.push({
      array: [...arr], highlights: [], comparing: [], swapping: [],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      codeAction: null, message: 'Sorting complete!',
    });

    return steps;
  },
};

export default insertionSort;
