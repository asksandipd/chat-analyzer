'use client';

import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Paper,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import { useModelConfig } from '../context/ModelContext';
import { ModelProvider } from '../types';

const ModelSelector = () => {
  const { config, updateConfig, setProvider } = useModelConfig();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render on client side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProviderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProvider(event.target.value as ModelProvider);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSaveSettings = () => {
    setOpen(false);
  };

  // Return null on initial server render
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Paper elevation={0} sx={{ p: 1, display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mr: 2 }}>
          Analysis Engine:
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="model-provider"
            name="model-provider"
            value={config.provider}
            onChange={handleProviderChange}
          >
            <FormControlLabel 
              value="openai" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  OpenAI
                  <Tooltip title="Uses OpenAI's API. Requires an API key. Data is sent to OpenAI.">
                    <InfoIcon fontSize="small" sx={{ ml: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
                  </Tooltip>
                </Box>
              } 
            />
            <FormControlLabel 
              value="ollama" 
              control={<Radio />} 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Ollama (Local)
                  <Tooltip title="Uses a local Ollama instance. Data stays on your machine. Requires Ollama to be running.">
                    <InfoIcon fontSize="small" sx={{ ml: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
                  </Tooltip>
                </Box>
              } 
            />
          </RadioGroup>
        </FormControl>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={handleOpenDialog} size="small" color="primary">
          <SettingsIcon />
        </IconButton>
      </Paper>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Model Settings</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
            OpenAI Settings
          </Typography>
          <TextField
            fullWidth
            label="OpenAI Model"
            value={config.openaiModel}
            onChange={(e) => updateConfig({ openaiModel: e.target.value })}
            margin="normal"
            size="small"
            helperText="e.g., gpt-3.5-turbo, gpt-4"
          />

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Ollama Settings
          </Typography>
          <TextField
            fullWidth
            label="Ollama URL"
            value={config.ollamaUrl}
            onChange={(e) => updateConfig({ ollamaUrl: e.target.value })}
            margin="normal"
            size="small"
            helperText="URL where Ollama is running (default: http://localhost:11434)"
          />
          <TextField
            fullWidth
            label="Ollama Model"
            value={config.ollamaModel}
            onChange={(e) => updateConfig({ ollamaModel: e.target.value })}
            margin="normal"
            size="small"
            helperText="e.g., llama3, mistral, phi, llama3:8b"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSettings} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModelSelector; 