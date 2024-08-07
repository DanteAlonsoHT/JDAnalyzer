/**
 * Cleans a JSON string by removing or escaping problematic characters
 * to ensure it can be safely parsed by JSON.parse.
 *
 * @param jsonStr - The JSON string to be cleaned.
 * @returns The cleaned JSON string.
 */
export function cleanJsonString(jsonStr: string): string {
  if (typeof jsonStr !== 'string') return jsonStr;
    jsonStr = jsonStr.replace(/`/g, '');
    jsonStr = jsonStr.replace(/'/g, '');
    jsonStr = jsonStr.replace(/"([^"]*?)"/g, function (match, p1) {
    const cleaned = p1.replace(/"/g, '\\"');
    return `"${cleaned}"`;
  });

  return jsonStr;
}

export function parseOpenAIResponse(response: string) {
  const cleanedResponse = response.replace(/```json\[/, '[').replace(/\]```/, ']').replace(/`/g, '');
  try {
    return JSON.parse(cleanedResponse.replace(/^json/, ''));
  } catch (error) {
    console.error('Failed to parse OpenAI response:', error);
    return [];
  }
}

