// Default fallback configuration
const defaultConfig = {
  API_BASE_URL: 'http://localhost:5000',
};

// Kept for backward compatibility if imported anywhere, but does nothing now
export async function loadRuntimeConfig(): Promise<void> {
  console.log('loadRuntimeConfig is deprecated, using environment variables directly');
}

// Get current configuration
export function getConfig() {
  // Use Vite environment variables (for Vercel and local development)
  if (import.meta.env.VITE_API_BASE_URL) {
    const viteConfig = {
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    };
    return viteConfig;
  }

  // Fall back to default
  return defaultConfig;
}

// Dynamic API_BASE_URL getter
export function getAPIBaseURL(): string {
  return getConfig().API_BASE_URL;
}

export const config = {
  get API_BASE_URL() {
    return getAPIBaseURL();
  },
};
