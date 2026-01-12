// Safe environment variable access that works in both Node and Browser
const getProcessEnv = () => {
    try {
        return typeof process !== 'undefined' ? process.env : {};
    } catch {
        return {};
    }
};

const processEnv = getProcessEnv() as Record<string, string | undefined>;

const requiredEnvVars = {
    // Gemini AI
    GEMINI_API_KEY: processEnv.GEMINI_API_KEY,

    // Unsplash
    UNSPLASH_ACCESS_KEY: processEnv.UNSPLASH_ACCESS_KEY,

    // Stripe
    STRIPE_SECRET_KEY: processEnv.STRIPE_SECRET_KEY,

    // Supabase
    VITE_SUPABASE_URL: processEnv.VITE_SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: processEnv.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY,

    // Base URL
    VITE_BASE_URL: processEnv.VITE_BASE_URL || (import.meta as any).env?.VITE_BASE_URL,

    // Admin
    ADMIN_EMAIL: processEnv.ADMIN_EMAIL,
} as const;

export function validateEnvironment() {
    // Only run validation on the server to prevent browser crashes
    if (typeof window !== 'undefined') return;

    const missing: string[] = [];

    for (const [key, value] of Object.entries(requiredEnvVars)) {
        if (!value || value.trim() === '') {
            missing.push(key);
        }
    }

    if (missing.length > 0) {
        const errorMessage = `
❌ Missing required environment variables:
${missing.map(key => `  - ${key}`).join('\n')}

Please add these to your .env.local file.
See .env.example for reference.
    `.trim();

        console.error(errorMessage);
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }

    console.log('✅ All required environment variables are configured');
}

// Export typed environment object
export const env = {
    GEMINI_API_KEY: requiredEnvVars.GEMINI_API_KEY!,
    UNSPLASH_ACCESS_KEY: requiredEnvVars.UNSPLASH_ACCESS_KEY!,
    STRIPE_SECRET_KEY: requiredEnvVars.STRIPE_SECRET_KEY!,
    VITE_SUPABASE_URL: requiredEnvVars.VITE_SUPABASE_URL!,
    VITE_SUPABASE_ANON_KEY: requiredEnvVars.VITE_SUPABASE_ANON_KEY!,
    VITE_BASE_URL: requiredEnvVars.VITE_BASE_URL!,
    ADMIN_EMAIL: requiredEnvVars.ADMIN_EMAIL!,
} as const;
