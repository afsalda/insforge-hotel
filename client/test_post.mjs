import { createClient } from '@insforge/sdk';
const client = createClient({ baseUrl: 'https://hve9xz4u.us-east.insforge.app', anonKey: 'ik_6726f2a82b00c4d6d9918526a4a9f65d' });

const _orig = globalThis.fetch;
globalThis.fetch = (...args) => {
    console.log('FETCH CALLED:', args[0]);
    console.log('INIT:', args[1]);
    return _orig(...args);
};

async function test() {
    const { data, error } = await client.database.from('bookings').insert([{ guest_name: 'test' }]).select();
    console.log('DATA:', data);
    console.log('ERROR:', error);
}

test();
