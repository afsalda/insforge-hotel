import brevoClient from './email.js';
import env from './env.js';
import { createClient } from '@insforge/sdk';

const insforge = createClient({
    baseUrl: process.env.INSFORGE_URL,
    anonKey: process.env.INSFORGE_ANON_KEY
});

export {
    brevoClient,
    env,
    insforge
};
