import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeExplanation.css';

function CodeExplanation({ response, isDark }) {
  return (
    <div className="code-explanation">
      <ReactMarkdown
        components={{
          code({
            node, inline, className, children, ...props
          }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                style={isDark ? atomDark : vs}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {response}
      </ReactMarkdown>
    </div>
  );
}

export default CodeExplanation;
