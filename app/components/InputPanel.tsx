import React from 'react';
import { TextField, Button, Paper, Typography, Box, CircularProgress } from '@mui/material';

interface InputPanelProps {
  chatText: string;
  setChatText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ 
  chatText, 
  setChatText, 
  onAnalyze,
  isLoading
}) => {
  return (
    <Paper elevation={2} sx={{ 
      p: 3, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.paper'
    }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Chat Thread Input
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Paste your Microsoft Teams chat thread here for analysis
      </Typography>
      
      <TextField
        multiline
        rows={20}
        variant="outlined"
        fullWidth
        placeholder="Paste your chat thread here..."
        value={chatText}
        onChange={(e) => setChatText(e.target.value)}
        sx={{ mb: 2, flexGrow: 1 }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onAnalyze}
          disabled={isLoading || !chatText.trim()}
          sx={{ borderRadius: '28px' }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              Analyzing...
            </>
          ) : (
            'Analyze Chat'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default InputPanel; 