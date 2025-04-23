import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { ModelConfig } from '@/app/types';

// Initialize OpenAI client
// Note: In production, you'd use environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Function to analyze text with OpenAI
async function analyzeWithOpenAI(chatText: string, model: string) {
  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that analyzes chat conversations and extracts problems and their solutions. Your output should be a valid JSON array of objects, where each object has 'problem' and 'solution' fields."
      },
      {
        role: "user",
        content: `Extract problems and their solutions from this chat conversation. Return your analysis as a JSON array of objects with 'problem' and 'solution' fields:\n\n${chatText}`
      }
    ],
    temperature: 0.5,
    response_format: { type: "json_object" }
  });

  return response.choices[0].message.content;
}

// Function to analyze text with Ollama
async function analyzeWithOllama(chatText: string, model: string, ollamaUrl: string) {
  const prompt = `
  You are a helpful assistant that analyzes chat conversations and extracts problems and their solutions. 

  I will provide you with a chat conversation. 
  Your task is to extract problems and their solutions discussed in the chat.
  
  Format your response as a valid JSON object with a "results" property containing an array of objects, 
  where each object has "problem" and "solution" fields.

  Example format:
  {
    "results": [
      {
        "problem": "Description of the first problem",
        "solution": "Description of the solution to the first problem"
      },
      {
        "problem": "Description of the second problem",
        "solution": "Description of the solution to the second problem"
      }
    ]
  }

  Only respond with valid JSON. Do not include any other text before or after the JSON.

  Here is the chat conversation to analyze:

  ${chatText}
  `;

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        format: 'json'
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned an error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { chatText, modelConfig } = await request.json();
    
    if (!chatText || chatText.trim() === '') {
      return NextResponse.json(
        { error: 'Chat text is required' },
        { status: 400 }
      );
    }

    // Default model config if not provided
    const config: ModelConfig = modelConfig || {
      provider: 'openai',
      openaiModel: 'gpt-3.5-turbo',
      ollamaModel: 'llama3:8b',
      ollamaUrl: 'http://localhost:11434',
    };

    let content: string | null = null;

    // Choose the appropriate provider
    if (config.provider === 'openai') {
      content = await analyzeWithOpenAI(chatText, config.openaiModel);
    } else if (config.provider === 'ollama') {
      content = await analyzeWithOllama(chatText, config.ollamaModel, config.ollamaUrl);
    } else {
      return NextResponse.json(
        { error: 'Invalid model provider' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Failed to analyze chat' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    try {
      const parsedContent = JSON.parse(content);
      return NextResponse.json(parsedContent);
    } catch (error) {
      console.error('Failed to parse JSON response', error);
      return NextResponse.json(
        { error: 'Failed to parse analysis results' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing chat:', error);
    return NextResponse.json(
      { error: 'An error occurred while analyzing the chat' },
      { status: 500 }
    );
  }
} 