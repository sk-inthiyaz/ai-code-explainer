import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeExplanation({ response, isDark }) {
  return (
    <div className={`p-4 rounded-lg shadow-md prose prose-lg break-words ${isDark ? 'bg-gray-700 text-gray-100' : 'bg-white'} prose-pre:overflow-x-auto ${isDark ? 'prose-invert' : ''}`}>
      <style jsx>{`
        .dark .prose :where(p, li, blockquote, th, td) {
          color: #1f2937; /* text-gray-900 */
        }
      `}</style>
      <ReactMarkdown
        components={{
          code({
ode, inline, className, children, ...props}) {
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
