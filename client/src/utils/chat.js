// Utility for generating a simple chat title from the first user message
export function getChatTitle(messages) {
  if (!messages || messages.length === 0) return "New Chat";
  const firstUserMsg = messages.find(m => m.role === "user");
  if (!firstUserMsg) return "New Chat";
  // Use first 6 words or 32 chars
  const words = firstUserMsg.content.trim().split(/\s+/).slice(0, 6).join(" ");
  return words.length > 32 ? words.slice(0, 32) + "..." : words;
}
