export function tokenizeDescription(desc) {
  if (!desc) return [];
  return desc.split(/(\{.*?\})/g).map((part) => {
    const isHighlight = part.startsWith("{") && part.endsWith("}");
    return { text: isHighlight ? part.slice(1, -1) : part, highlight: isHighlight };
  });
}