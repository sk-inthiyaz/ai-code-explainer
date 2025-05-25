import React from "react";
import ReactMarkdown from "react-markdown";
import CodeExplanation from "./CodeExplanation";

function isPlainMessage(content) {
  return (
    content.trim().startsWith("👋 Hi! I'm a code explainer bot.") ||
    content.trim() === "This is an AI Code Explainer. Please enter code to get an explanation."
  );
}

function ChatWindow({ messages, isLoading }) {
  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-4 h-[70vh] overflow-y-auto flex flex-col gap-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${
            msg.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[75%] px-4 py-3 rounded-lg break-words ${
              msg.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 border border-gray-300"
            } shadow prose-pre:bg-gray-100 prose-pre:p-2 prose-pre:rounded prose-code:text-blue-600`}
          >
            {msg.role === "ai" ? (
              isPlainMessage(msg.content) ? (
                <div className="text-gray-600 italic">{msg.content}</div>
              ) : (
                <CodeExplanation response={msg.content} />
              )
            ) : (
              msg.content
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="px-4 py-3 rounded-lg bg-gray-200 text-gray-800 italic">
            Thinking...
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
