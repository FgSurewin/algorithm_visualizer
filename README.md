<h1 align="center">
  <br>
  📊 Algorithm Visualizer
  <br>
</h1>

<h4 align="center">A highly modular, generic, interactive algorithm visualizer built with React and Vite.</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#architecture-overview">Architecture</a> •
  <a href="#technologies">Technologies</a>
</p>

---

**Algorithm Visualizer** is a modern, dark-themed educational tool designed to help developers and students seamlessly understand code logic, variable mutations, and data structures. Unlike typical visualizers that are hardcoded for sorting bars, this platform includes a decoupled playback engine capable of illustrating everything from graph traversal to line-by-line custom code debugging.

## ✨ Key Features

- **🎨 Multi-Renderer Support**  
  Algorithms automatically render within optimal layouts: a `Bar Chart` for sorts, `Node Trees` for recursion and BSTs, `Network Graphs` for BFS/DFS, and a `Grid` for pathfinding.  
- **💻 Interactive IDE Code Tracer**  
  The *Custom* code tab allows users to explore any arbitrary JavaScript algorithm! Code is parsed and instrumented via our generic debugger engine, visually tracing all variables, tracking loops, array updates, and `console.log` evaluations line-by-line using a premium PrismJS interface.  
- **🔁 Exhaustive Synchronous Tracing**  
  Tired of visualizers that highlight code slightly too late? We enforce a strict **Data-Driven Snapshot Model** ensuring 1:1 perfect synchronization between visual components (comparing / swapping bars) and highlighted logic in the code frame.  
- **🌍 Polyglot Ready**  
  Algorithms present logic across **Python**, **C++**, and **Java** intuitively mapping matching line structures via the `codeLineMap` protocol.  
- **⚒️ Fully Resizable Split Interface**  
  Adjustable vertical and horizontal sidebars put learners in complete ergonomic control over code panel real-estate.  
- **⏳ Realtime Playback**  
  Scrub algorithms forward and backward without breaking states, featuring a custom speed-range controller.

---

## 🚀 How To Use

To clone and run this application simply run:

```bash
# Clone this repository
$ git clone https://github.com/FgSurewin/algorithm_visualizer

# Go into the repository
$ cd algorithm_visualizer/algo_visualizer

# Install dependencies
$ npm install

# Run the app locally
$ npm run dev
```

Visit the console URL (typically `http://localhost:5173/`).

> **Vercel Deployment**: This application is a standard `Vite` boilerplate app. It is perfectly ready to be deployed on Vercel for free. To deploy to Vercel, simply import the GitHub repository in your Vercel Dashboard, ensure the Framework Preset is set to `Vite`, Build Command to `npm run build`, and Output Directory to `dist`. It will deploy effortlessly with zero additional configuration needed.

---

## 🏗️ Architecture Overview

Curious how you can instantly add a completely new algorithm without touching any React state or DOM logic? 

The application utilizes a **Snapshot Model**, decoupling execution processing entirely from canvas renders. We record explicit snapshot fragments of variables, arrays, or trees and funnel them into a step manager (`usePlayback`). The renderers are "dumb" canvases reacting only to snapshot boundaries.

For a full step-by-step tutorial on contributing algorithms (like Recursive Factorial mapping to a Node Tree template), check out the [ARCHITECTURE documentation](ARCHITECTURE.md)!

---

## 🛠 Technologies

- **[React 18](https://react.dev/) / Vite** 
- **[Tailwind CSS](https://tailwindcss.com/)** - Core component and utility styling
- **[React-Syntax-Highlighter / PrismJS](https://github.com/react-syntax-highlighter/react-syntax-highlighter)** - Line trace mapping and IDE theming
- **[Lucide Icons](https://lucide.dev/)**
- **JavaScript AST / Interpolation** - For our interactive custom debugger tracing.
