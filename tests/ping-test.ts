import createCraftClient from '../src/index.js';

// Create a client with the provided API key and endpoint
const client = createCraftClient({
  apiKey: '4G6leis24EdDxmrJN7uAypEiUIDuoq7u',
  baseUrl: 'https://mercury-sign.frb.io/api'
});

// Test the ping function
async function testPing() {
  try {
    console.log('Testing ping function...');
    const result = await client.ping();
    console.log('Ping result:', result);
    console.log('Test successful!');
  } catch (error) {
    console.error('Error testing ping function:', error);
  }
}

// Run the test
testPing();
