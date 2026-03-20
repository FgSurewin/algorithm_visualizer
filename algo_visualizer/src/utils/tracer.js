// --- JavaScript Code Tracer ---
// Instruments user JavaScript code to capture variable state at each line.
// Uses line-by-line insertion of trace calls with variable snapshots.

const MAX_STEPS = 1000;

const DEFAULT_CODE = `// Find the maximum value in an array
let arr = [3, 7, 1, 9, 4, 6];
let max = arr[0];

for (let i = 1; i < arr.length; i++) {
  if (arr[i] > max) {
    max = arr[i];
    console.log("New max found:", max);
  }
}

console.log("Maximum is:", max);`;

/**
 * Extract variable names from JavaScript code using regex.
 * Captures let/const/var declarations and for-loop variables.
 */
function extractVarNames(code) {
  const names = new Set();

  // let/const/var declarations
  const declRegex = /\b(?:let|const|var)\s+(\w+)/g;
  let match;
  while ((match = declRegex.exec(code)) !== null) {
    names.add(match[1]);
  }

  // for...of / for...in variables
  const forRegex = /\bfor\s*\(\s*(?:let|const|var)\s+(\w+)/g;
  while ((match = forRegex.exec(code)) !== null) {
    names.add(match[1]);
  }

  // Function parameters (function declarations)
  const fnRegex = /function\s+\w*\s*\(([^)]*)\)/g;
  while ((match = fnRegex.exec(code)) !== null) {
    match[1].split(',').forEach((p) => {
      const name = p.trim().replace(/\s*=.*/, '');
      if (name && /^\w+$/.test(name)) names.add(name);
    });
  }

  return names;
}

/**
 * Instrument code by inserting __t() trace calls after each executable line.
 */
function instrumentCode(code, varNames) {
  // Build snapshot expression that safely captures all known variables
  const snapshotParts = [...varNames].map(
    (v) => `'${v}': (() => { try { return ${v}; } catch(e) { return undefined; } })()`
  );
  const snapshot = `{ ${snapshotParts.join(', ')} }`;

  const lines = code.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    result.push(line);

    // Skip non-executable lines
    if (
      !trimmed ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed === '{' ||
      trimmed === '}' ||
      trimmed === '};' ||
      /^}\s*else\b/.test(trimmed) ||
      trimmed === 'else {' ||
      /^}\s*catch\b/.test(trimmed) ||
      /^}\s*finally\b/.test(trimmed) ||
      /^(?:function|class)\s/.test(trimmed)
    ) {
      continue;
    }

    result.push(`__t(${i}, ${snapshot});`);
  }

  return result.join('\n');
}

/**
 * Trace JavaScript code execution, capturing variable state at each line.
 * Returns an array of steps for the DebuggerRenderer.
 */
export function traceCode(codeString) {
  const varNames = extractVarNames(codeString);
  const instrumented = instrumentCode(codeString, varNames);

  const steps = [];
  const output = [];

  const __t = (line, vars) => {
    if (steps.length >= MAX_STEPS) {
      throw new Error(`Step limit (${MAX_STEPS}) reached — possible infinite loop`);
    }

    // Deep clone variable values for snapshot
    const snapshot = {};
    for (const [k, v] of Object.entries(vars)) {
      if (v === undefined) continue;
      try {
        snapshot[k] = JSON.parse(JSON.stringify(v));
      } catch {
        snapshot[k] = String(v);
      }
    }

    steps.push({
      line,
      variables: snapshot,
      output: [...output],
      message: `Executing line ${line + 1}`,
    });
  };

  const __log = (...args) => {
    output.push(
      args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ')
    );
  };

  // Initial step
  steps.push({
    line: -1,
    variables: {},
    output: [],
    message: 'Starting execution...',
  });

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      '__t',
      'console',
      instrumented
    );
    fn(__t, { log: __log, warn: __log, error: __log, info: __log });
  } catch (e) {
    steps.push({
      line: -1,
      variables: {},
      output: [...output, `❌ Error: ${e.message}`],
      message: `Error: ${e.message}`,
    });
  }

  // Final step
  const lastVars = steps.length > 1 ? steps[steps.length - 1].variables : {};
  steps.push({
    line: -1,
    variables: lastVars,
    output: [...output],
    message: 'Execution complete',
  });

  return steps;
}

export { DEFAULT_CODE };
