'use client';

import { useState } from 'react';
import { Container, Grid, Box, Typography, AppBar, Toolbar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import ModelSelector from './components/ModelSelector';
import { ProblemSolution } from './types';
import { useModelConfig } from './context/ModelContext';

export default function Home() {
  const [chatText, setChatText] = useState('');
  const [results, setResults] = useState<ProblemSolution[] | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { config, isReady } = useModelConfig();

  const handleAnalyze = async () => {
    if (!chatText.trim()) return;
    
    setIsLoading(true);
    setError(undefined);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chatText,
          modelConfig: config 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while analyzing the chat');
      }
      
      // Check if the response has results property
      if (data.results) {
        setResults(data.results);
      } else {
        // If not, assume the response itself is an array of results
        setResults(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error analyzing chat:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <ChatIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chat Thread Analyzer
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Knowledge Base Generator for Healthcare Support Teams
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Extract problems and solutions from Microsoft Teams chat threads to build knowledge bases for healthcare insurance production support.
        </Typography>
        
        {/* Only render ModelSelector when client context is ready */}
        {isReady && <ModelSelector />}
        
        <Box sx={{ flexGrow: 1, height: 'calc(100vh - 250px)', mt: 2 }}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ height: '100%' }}>
              <InputPanel 
                chatText={chatText}
                setChatText={setChatText}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ height: '100%' }}>
              <ResultsPanel 
                results={results}
                error={error}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
