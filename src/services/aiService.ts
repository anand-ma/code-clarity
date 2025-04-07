import { GoogleGenerativeAI } from "@google/generative-ai";

// Mock service for Gemini AI integration
// In a real app, this would connect to a backend service that uses the Google AI API

export interface AIServiceResponse {
  text: string;
  error?: string;
}

let genAI: GoogleGenerativeAI | null = null;

export function initializeGemini(apiKey: string) {
  if (!apiKey) {
    throw new Error("API key is required");
  }
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function analyzeCode(code: string): Promise<AIServiceResponse> {
  try {
    if (!genAI) {
      return {
        text: "",
        error: "Gemini API not initialized. Please enter your API key.",
      };
    }

    if (!code.trim()) {
      return {
        text: "I don't see any code to analyze. Please paste your code in the editor.",
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Analyze the following code and provide a detailed explanation in markdown format. Include:
1. A brief overview
2. Use cases
3. Key components and their purposes
4. Notable patterns or design decisions
5. Potential improvements or considerations

Format the response with proper markdown headers, code blocks, and bullet points.

Code to analyze:
\`\`\`
${code}
\`\`\``;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the markdown output
    const formattedText = text
      .replace(/^```markdown\n?/, '') // Remove opening markdown block
      .replace(/\n?```$/, '') // Remove closing markdown block
      .replace(/```/g, '`') // Replace remaining triple backticks with single
      .replace(/`([^`]+)`/g, '`$1`') // Ensure code blocks are properly formatted
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .trim();

    return {
      text: formattedText || "No analysis available.",
    };
  } catch (error) {
    console.error("Error analyzing code:", error);
    return {
      text: "",
      error: "Failed to analyze code. Please check your API key and try again.",
    };
  }
}
