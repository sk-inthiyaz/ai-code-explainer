import React from "react";
import CodeExplanation from "./CodeExplanation";

function isPlainMessage(content) {
  return (
    content.trim().startsWith("👋 Hi! I'm a code explainer bot.") ||
    content.trim() === "This is an AI Code Explainer. Please enter code to get an explanation."
  );
}

function ChatWindow({ messages, isLoading }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-2 sm:p-4 h-[70vh] overflow-y-auto flex flex-col gap-3 sm:gap-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[95%] sm:max-w-[75%] px-3 py-2 sm:px-4 sm:py-3 rounded-lg break-words shadow 
            ${msg.role === "user"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
            } 
            prose-pre:bg-gray-100 prose-pre:p-2 prose-pre:rounded prose-code:text-blue-600`}
          >
            {msg.role === "ai" ? (
              isPlainMessage(msg.content) ? (
                <div className="text-gray-600 italic dark:text-gray-300">{msg.content}</div>
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
          <div className="px-4 py-2 sm:py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 italic">
            Thinking...
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
