import React from 'react';
import { 
  Paper, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Box,
  Alert,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ProblemSolution } from '../types';

interface ResultsPanelProps {
  results: ProblemSolution[] | null;
  error?: string;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, error }) => {
  const handleDownloadJson = () => {
    if (!results) return;
    
    const jsonData = JSON.stringify({ results }, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chat-analysis-results.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Paper elevation={2} sx={{ 
      p: 3, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.paper'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary">
          Analysis Results
        </Typography>
        {results && results.length > 0 && (
          <Button 
            startIcon={<FileDownloadIcon />} 
            onClick={handleDownloadJson}
            size="small"
            variant="outlined"
          >
            Download JSON
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {!results && !error && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          color: 'text.secondary'
        }}>
          <Typography variant="body1">
            Enter a chat thread on the left and click "Analyze" to begin
          </Typography>
        </Box>
      )}
      
      {results && results.length === 0 && (
        <Alert severity="info">
          No problems or solutions were identified in the chat thread.
        </Alert>
      )}
      
      {results && results.length > 0 && (
        <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
          {results.map((item, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography fontWeight="medium">
                  Problem {index + 1}: {item.problem.substring(0, 60)}{item.problem.length > 60 ? '...' : ''}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Problem:
                </Typography>
                <Typography paragraph>
                  {item.problem}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Solution:
                </Typography>
                <Typography>
                  {item.solution}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default ResultsPanel; 