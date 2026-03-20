import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Pencil, Play } from 'lucide-react';
import { DEFAULT_CODE } from '../utils/tracer';
import EditorPkg from 'react-simple-code-editor';
const Editor = EditorPkg.default || EditorPkg;
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

const LANGUAGE_LABELS = {
  python: 'Python',
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript',
};

const SYNTAX_MAP = {
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  javascript: 'javascript',
};

export default function CodePanel({ algorithm, onVisualize, currentStep }) {
  const [tab, setTab] = useState('example');
  const [customCode, setCustomCode] = useState(DEFAULT_CODE);
  const [selectedLang, setSelectedLang] = useState('python');

  const isCustomAlgo = algorithm.id === 'custom';
  const codeVersions = algorithm.codeVersions || {};
  const availableLangs = Object.keys(codeVersions);
  const displayLang = isCustomAlgo ? 'javascript' : selectedLang;
  const displayCode = isCustomAlgo ? algorithm.code : (codeVersions[selectedLang] || algorithm.code);

  // Current highlighted line
  const codeAction = currentStep?.codeAction;
  const lineMap = algorithm.codeLineMap?.[displayLang] || {};
  
  let activeLine = -1;
  if (codeAction && lineMap[codeAction] !== undefined) {
    // codeLineMaps are 1-indexed. We convert to 0-indexed.
    activeLine = lineMap[codeAction] > 0 ? lineMap[codeAction] - 1 : -1;
  } else if (currentStep?.line !== undefined) {
    // custom tracer lines are already 0-indexed
    activeLine = currentStep.line;
  }

  const handleVisualize = () => {
    if (customCode.trim()) {
      onVisualize(customCode);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab Header */}
      <div className="flex items-center bg-slate-900/80 border-b border-slate-800 shrink-0">
        <button
          onClick={() => setTab('example')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            tab === 'example'
              ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-800/30'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          {'</>'}
          <span className="ml-1">Code</span>
        </button>
        <button
          onClick={() => setTab('custom')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
            tab === 'custom'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/30'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Pencil size={12} />
          Custom
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'example' ? (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Language Selector */}
          {availableLangs.length > 0 && !isCustomAlgo && (
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-800/60 shrink-0">
              {availableLangs.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                    selectedLang === lang
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {LANGUAGE_LABELS[lang] || lang}
                </button>
              ))}
            </div>
          )}

          {/* Syntax-Highlighted Code */}
          <div className="flex-1 overflow-auto text-[13px]">
            <SyntaxHighlighter
              language={SYNTAX_MAP[displayLang] || 'python'}
              style={oneDark}
              showLineNumbers
              wrapLines
              lineNumberStyle={{
                minWidth: '2em',
                paddingRight: '1em',
                color: '#4b5563',
                userSelect: 'none',
              }}
              lineProps={(lineNumber) => {
                const isActive = activeLine >= 0 && lineNumber - 1 === activeLine;
                return {
                  style: {
                    display: 'block',
                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid #818cf8' : '3px solid transparent',
                    paddingLeft: '0.5em',
                    transition: 'background-color 0.2s ease',
                  },
                };
              }}
              customStyle={{
                margin: 0,
                padding: '0.75rem 0',
                background: 'transparent',
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              {displayCode}
            </SyntaxHighlighter>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-slate-900/50 custom-scrollbar">
            <Editor
              value={customCode}
              onValueChange={setCustomCode}
              highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
              padding={16}
              textareaClassName="focus:outline-none"
              style={{
                fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                fontSize: 14,
                backgroundColor: 'transparent',
                color: '#e2e8f0',
                minHeight: '100%',
              }}
            />
          </div>
          {/* Visualize Button */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/50 shrink-0">
            <button
              onClick={handleVisualize}
              disabled={!customCode.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20"
            >
              <Play size={14} fill="currentColor" />
              Visualize
            </button>
            <p className="text-[10px] text-slate-600 text-center mt-2">
              Supports JavaScript · Variables &amp; console.log traced
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
