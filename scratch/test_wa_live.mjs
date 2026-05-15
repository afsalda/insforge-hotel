/**
 * Quick diagnostic: hit the live verify-payment-like WhatsApp path
 * to see what's happening.
 * 
 * We'll call the Meta API directly with the same template & params
 * that verify-payment.ts uses.
 */

// Read env from .env or hardcode from Vercel dashboard
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const ACCESS_TOKEN    = process.env.WHATSAPP_ACCESS_TOKEN    || '';
const TEST_PHONE      = process.env.WHATSAPP_OWNER_PHONE     || '';

if (!PHONE_NUMBER_ID || !ACCESS_TOKEN || !TEST_PHONE) {
  console.error('❌ Missing env vars. Set WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, and WHATSAPP_OWNER_PHONE');
  process.exit(1);
}

const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID.trim()}/messages`;

// Test 1: Send _booking_confirmed template (same as verify-payment.ts)
const body = {
  messaging_product: "whatsapp",
  to: TEST_PHONE.split(',')[0].trim(),
  type: "template",
  template: {
    name: "_booking_confirmed",
    language: { code: "en" },
    components: [
      {
        type: "header",
        parameters: [
          { type: "text", text: "STD-1234" }
        ]
      },
      {
        type: "body",
        parameters: [
          { type: "text", text: "Test Guest" },
          { type: "text", text: "Standard Room" },
          { type: "text", text: "15 May 2026" },
          { type: "text", text: "16 May 2026" },
          { type: "text", text: "₹1500" }
        ]
      }
    ]
  }
};

console.log('📤 Sending test WhatsApp message...');
console.log('   URL:', url);
console.log('   To:', body.to);
console.log('   Template:', body.template.name);
console.log('   Components:', JSON.stringify(body.template.components, null, 2));

try {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN.trim()}`
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  console.log('\n📬 Response status:', res.status);
  console.log('📬 Response body:', JSON.stringify(data, null, 2));

  if (res.ok) {
    console.log('\n✅ Message sent successfully! ID:', data.messages?.[0]?.id);
  } else {
    console.log('\n❌ FAILED. Error details:');
    console.log('   Code:', data.error?.code);
    console.log('   Message:', data.error?.message);
    console.log('   Error subcode:', data.error?.error_subcode);
    console.log('   Error data:', JSON.stringify(data.error?.error_data, null, 2));
    
    // Common fixes
    if (data.error?.code === 190) {
      console.log('\n🔧 FIX: Access token has expired. Generate a new one from Meta Business dashboard.');
    }
    if (data.error?.code === 100 && data.error?.error_subcode === 33) {
      console.log('\n🔧 FIX: Phone number not registered or parameter mismatch.');
    }
    if (data.error?.code === 132000 || data.error?.message?.includes('parameter')) {
      console.log('\n🔧 FIX: Template parameter count mismatch. Check template in Meta dashboard.');
    }
  }
} catch (err) {
  console.error('❌ Network error:', err.message);
}
