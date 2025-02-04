const isServer = typeof window === 'undefined';

// Add debugging
console.log("Environment check:", {
  isServer,
  hasAnthropicEnv: !!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  envKeys: Object.keys(process.env),
});

interface EnvironmentConfig {
  anthropic: {
    apiKey: string;
    baseUrl: string;
  };
  elevenlabs: {
    apiKey: string;
    baseUrl: string;
  };
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    anthropic: {
      apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
      baseUrl: 'https://api.anthropic.com'
    },
    elevenlabs: {
      apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
      baseUrl: 'https://api.elevenlabs.io'
    }
  };
};

export const config = getEnvironmentConfig();

// Helper function to check if Anthropic key is configured
export const hasValidAnthropicKey = (): boolean => {
  return Boolean(config.anthropic.apiKey && config.anthropic.apiKey.startsWith('sk-ant'));
};

// Debug logging only on server side
if (isServer) {
  console.log("Server-side environment check:", {
    hasAnthropicKey: hasValidAnthropicKey(),
    baseUrl: config.anthropic.baseUrl
  });
}

// Simplified validation
if (isServer) {
  const missingVars = [];
  
  if (!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY) {
    missingVars.push('NEXT_PUBLIC_ANTHROPIC_API_KEY');
  }
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
} 