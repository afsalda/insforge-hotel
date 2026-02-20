/**
 * insforge.js — InsForge database client singleton.
 * All database operations go through this client instance.
 */
import { createClient } from '@insforge/sdk';
import env from './env.js';

const client = createClient({
    baseUrl: env.INSFORGE_URL,
    anonKey: env.INSFORGE_ANON_KEY,
});

export const db = client.database;
export default client;
