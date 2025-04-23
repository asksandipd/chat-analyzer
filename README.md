# Chat Thread Analyzer

A Next.js application that analyzes Microsoft Teams chat threads to extract problems and their solutions using AI, helping healthcare support teams build knowledge bases.

## Features

- Modern, responsive UI built with Next.js, Tailwind CSS, and Material UI
- Chat thread input with large text area
- AI-powered analysis of chat content
- Support for both OpenAI API and local Ollama models
- Privacy-focused option to keep data local with Ollama
- Automatic extraction of problems and solutions
- Results displayed in expandable accordion components
- JSON export functionality
- Google Material Design aesthetics

## Prerequisites

- Node.js 18.x or later
- For OpenAI: An OpenAI API key
- For Ollama: [Ollama](https://ollama.ai/) installed and running locally

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chat-analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key (if using OpenAI):
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   
   **Bash/CMD:**
   ```bash
   npm run dev
   ```
   
   **PowerShell:**
   ```powershell
   # Use the provided PowerShell script
   .\run-dev.ps1
   
   # Or run the command directly
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## Usage

1. Select your preferred AI engine (OpenAI or Ollama)
   - OpenAI: Uses the OpenAI API (requires API key)
   - Ollama: Uses a locally running Ollama instance (keeps data private)

2. Configure your model settings (optional)
   - OpenAI: Choose between gpt-3.5-turbo, gpt-4, etc.
   - Ollama: Set URL and model name (e.g., llama3, mistral, phi)

3. Paste a Microsoft Teams chat thread into the text area on the left side

4. Click the "Analyze Chat" button

5. View extracted problems and solutions in the accordions on the right side

6. Download the analysis results as a JSON file using the Download button

## Setting Up Ollama (for Local Analysis)

To use the local Ollama option:

1. Download and install [Ollama](https://ollama.ai/) for your platform

2. Pull a model using the command line:
   ```bash
   ollama pull llama3
   ```
   (You can replace "llama3" with any other supported model like mistral, phi, etc.)

3. Make sure Ollama is running in the background

4. In the app, select "Ollama (Local)" as your Analysis Engine

## How It Works

The application uses AI models to analyze chat text and identify problems and solutions discussed in the conversation. The process works as follows:

1. User inputs the chat text from Microsoft Teams
2. User selects the AI engine (OpenAI or Ollama)
3. The application sends the text to a backend API route
4. The API route processes the text using the selected model
5. The AI extracts problems and their corresponding solutions
6. Results are returned as structured JSON and displayed in the UI

## Technologies Used

- **Frontend**: Next.js, React, Material UI, Tailwind CSS
- **AI/ML**: OpenAI GPT API, Ollama local models
- **Styling**: Emotion (CSS-in-JS), Material Design principles

## Environment Variables

| Variable | Description |
|----------|-------------|
| OPENAI_API_KEY | Your OpenAI API key for accessing GPT models (required only for OpenAI engine) |

## License

MIT
