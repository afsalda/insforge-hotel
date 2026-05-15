


const TOKEN = 'EAATGo8APsC8BReQ0K4dvNchLqA4yo8mZCGCxjw0Mxx5AwYMjYT0ufVy7oymFYZC9RyJeBHFvyvpYqxoDQQ5L1UlgSSxrKHVs46F3b6fnHCRlnS2elJY3D9cr3svk3yH3BptUuLexRT6eS6nx7vvNUrEGbLSmZBecjTydHrjPgb9inbHQ09leawlRaXNMwZDZD';

async function test() {
    const endpoints = [
        'https://graph.facebook.com/v21.0/1084998618027495',
        'https://graph.facebook.com/v21.0/1635370570926959/message_templates'
    ];

    for (const url of endpoints) {
        console.log(`Testing ${url}...`);
        try {
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${TOKEN}` }
            });
            const data = await res.json();
            console.log(JSON.stringify(data, null, 2));
        } catch (e) {
            console.error(e.message);
        }
    }
}

test();
