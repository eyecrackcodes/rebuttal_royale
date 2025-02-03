const isServer = typeof window === 'undefined';

// Add debugging
console.log("Environment check:", {
  isServer,
  hasAnthropicEnv: !!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  envKeys: Object.keys(process.env),
});

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1'
  },
  anthropic: {
    apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
    baseUrl: process.env.ANTHROPIC_API_BASE_URL || 'https://api.anthropic.com'
  },
  elevenlabs: {
    apiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
    baseUrl: process.env.ELEVENLABS_API_BASE_URL || 'https://api.elevenlabs.io/v1'
  }
};

// Add debugging
console.log("Config loaded:", {
  hasAnthropicKey: !!config.anthropic.apiKey,
  baseUrl: config.anthropic.baseUrl,
  keyPrefix: config.anthropic.apiKey?.substring(0, 10),
});

// Only validate on server
if (isServer) {
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_ANTHROPIC_API_KEY',
    'NEXT_PUBLIC_ELEVENLABS_API_KEY'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

export { config }; 