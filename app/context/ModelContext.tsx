'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ModelConfig, ModelProvider as ModelProviderType } from '../types';

// Default configuration
const defaultConfig: ModelConfig = {
  provider: 'openai',
  openaiModel: 'gpt-3.5-turbo',
  ollamaModel: 'llama3:8b',
  ollamaUrl: 'http://localhost:11434',
};

interface ModelContextType {
  config: ModelConfig;
  updateConfig: (newConfig: Partial<ModelConfig>) => void;
  setProvider: (provider: ModelProviderType) => void;
  isReady: boolean;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ModelConfig>(defaultConfig);
  const [isReady, setIsReady] = useState(false);

  // Use effect to mark context as ready only on client-side
  useEffect(() => {
    setIsReady(true);
  }, []);

  const updateConfig = (newConfig: Partial<ModelConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  };

  const setProvider = (provider: ModelProviderType) => {
    updateConfig({ provider });
  };

  return (
    <ModelContext.Provider value={{ config, updateConfig, setProvider, isReady }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModelConfig() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModelConfig must be used within a ModelConfigProvider');
  }
  return context;
} 