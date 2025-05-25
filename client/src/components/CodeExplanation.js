import React from 'react';
import ReactMarkdown from 'react-markdown';

function CodeExplanation({ response }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md prose prose-lg">
      <ReactMarkdown>
        {response}
      </ReactMarkdown>
    </div>
  );
}

export default CodeExplanation;
