
// Mock service for Gemini AI integration
// In a real app, this would connect to a backend service that uses the Google AI API

export interface AIServiceResponse {
  text: string;
  error?: string;
}

export async function analyzeCode(code: string): Promise<AIServiceResponse> {
  try {
    // This is a simulation of what would happen with a real backend
    // In production, you would make an API call to your backend service
    
    console.log('Analyzing code with Gemini AI...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demonstration, we'll return different explanations based on the input
    if (!code.trim()) {
      return {
        text: "I don't see any code to analyze. Please paste your code in the editor.",
      };
    }
    
    if (code.includes('kathai-gen') || code.toLowerCase().includes('story generator')) {
      return {
        text: `# Kathai-Gen: Story Generator

This Python script is a creative writing tool that generates stories in Tamil (and potentially other languages) using AI language models.

## Core Functionality
- It leverages pre-trained language models from Hugging Face to generate coherent narrative text
- The script is specialized for Tamil language story generation
- It includes functionality for maintaining context and coherence across longer narratives

## Use Cases
- Creative writing assistance
- Education tools for language learning
- Content generation for Tamil language publications
- Storytelling applications

The code handles prompting, text generation, and maintaining story context through a well-structured approach that balances creativity with narrative consistency.`
      };
    }
    
    // Default response for any other code
    return {
      text: `# Code Analysis

This code appears to ${code.length > 500 ? 'be a complex' : 'be a simple'} ${detectLanguage(code)} program.

## Main Features
- Contains ${code.split('\n').length} lines of code
- ${code.includes('function') || code.includes('def') ? 'Defines functions or methods' : 'No explicit function definitions found'}
- ${code.includes('class') ? 'Implements class-based structures' : 'Does not use object-oriented patterns'}

This code would likely be used for ${guessCodePurpose(code)}.

For a more accurate analysis, I would need to examine the specific functionality in more detail.`,
    };
  } catch (error) {
    console.error('Error analyzing code:', error);
    return {
      text: '',
      error: 'Failed to analyze code. Please try again.',
    };
  }
}

// Helper functions for the mock service
function detectLanguage(code: string): string {
  if (code.includes('def ') && code.includes('import ')) return 'Python';
  if (code.includes('function') && code.includes('var ')) return 'JavaScript';
  if (code.includes('function') && code.includes('let ')) return 'JavaScript';
  if (code.includes('class') && code.includes('public ')) return 'Java or C#';
  if (code.includes('<html>') || code.includes('</div>')) return 'HTML';
  if (code.includes('useState') || code.includes('React')) return 'React';
  return 'programming';
}

function guessCodePurpose(code: string): string {
  if (code.includes('fetch') || code.includes('axios')) return 'API communication';
  if (code.includes('render') || code.includes('component')) return 'user interface development';
  if (code.includes('test') || code.includes('assert')) return 'testing';
  if (code.includes('class') && code.includes('model')) return 'data modeling';
  if (code.includes('router') || code.includes('path')) return 'routing or navigation';
  return 'general programming tasks';
}
