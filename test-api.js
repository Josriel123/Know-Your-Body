// Smoke test for the diagnosis pipeline without the browser.
// Uses the same server code as /api/diagnose. Run with:
//   node --env-file=.env.local test-api.js
import { diagnose } from './server/diagnose.js';

const sample = {
  parts: ['Wrist and Hand', 'Thumb', 'Index Finger'],
  symptoms: ['Numbness / Tingling', 'Weakness', 'Pain'],
  severity: 'Moderate',
  duration: '1-3 months',
  lang: 'en',
};

console.log('Sending medical prompt...');
const { status, body } = await diagnose(sample, process.env.GEMINI_API_KEY);
console.log('STATUS:', status);

if (status !== 200) {
  console.error('FAILED:', body.error);
  process.exit(1);
}

console.log('\nRAW TEXT RETURNED:');
console.log('------------------------');
console.log(body.text);
console.log('------------------------');

try {
  const res = JSON.parse(body.text.replace(/[\n\r]+/g, ' ').trim());
  console.log('JSON PARSE SUCCESS!');
  console.log(JSON.stringify(res, null, 2).substring(0, 300) + '...');
} catch (err) {
  console.error('JSON PARSE FAILED:', err.message);
}
