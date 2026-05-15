/**
 * Fetch the _booking_confirmed template definition from Meta to see its structure
 */
const TOKEN = 'EAATGo8APsC8BReQ0K4dvNchLqA4yo8mZCGCxjw0Mxx5AwYMjYT0ufVy7oymFYZC9RyJeBHFvyvpYqxoDQQ5L1UlgSSxrKHVs46F3b6fnHCRlnS2elJY3D9cr3svk3yH3BptUuLexRT6eS6nx7vvNUrEGbLSmZBecjTydHrjPgb9inbHQ09leawlRaXNMwZDZD';
const BUSINESS_ID = '1635370570926959';

const url = `https://graph.facebook.com/v21.0/${BUSINESS_ID}/message_templates?name=_booking_confirmed`;

const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` }
});

const data = await res.json();
console.log(JSON.stringify(data, null, 2));
