import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);

const SNIPPETS = {
  JavaScript: {
    language: "javascript",
    code: `const developer = {
  name: "Erimo",
  stack: ["React", "Node.js", "MongoDB"],
  passion: "building delightful web apps",

  build: async (idea) => {
    const app = await ship(idea);
    return app; // ✨
  }
};`
  },
  HTML: {
    language: "xml",
    code: `<section class="hero">
  <h1>Hi, I'm Erimo 👋</h1>
  <p>I turn ideas into
     beautiful products.</p>
  <button @click="hire()">
    Hire Me
  </button>
</section>`
  },
  CSS: {
    language: "css",
    code: `.hero {
  background: linear-gradient(
    135deg, #6366f1, #a855f7
  );
  animation: float 6s
    ease-in-out infinite;
}` 
  }
};

const LINE_HEIGHT = 24;

export default function CodeBlock({ className = "" }) {
  const [active, setActive] = useState("JavaScript");
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const snippet = SNIPPETS[active];
  const lineCount = snippet.code.split("\n").length;

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [active]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // clipboard unavailable — ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotateY: -12 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl overflow-hidden shadow-2xl bg-[#0d1117] border border-white/10 backdrop-blur-sm ${className}`}
      style={{ perspective: 1000 }}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
          <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
          {Object.keys(SNIPPETS).map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-3 py-1 rounded-md transition-colors ${
                active === tab
                  ? "bg-white/10 text-gray-200"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded-md hover:bg-white/10"
          aria-label="Copy code"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Code body */}
      <div className="flex text-sm font-mono leading-6">
        {/* Line numbers */}
        <div className="text-right text-gray-600 px-3 py-4 select-none border-r border-white/5" aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} style={{ height: LINE_HEIGHT }}>{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 p-4 overflow-x-auto">
          <code ref={codeRef} className={`hljs language-${snippet.language}`}>
            {snippet.code}
          </code>
        </pre>
      </div>
    </motion.div>
  );
}