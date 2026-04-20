import fs from 'fs';

const GEMINI_API_KEY = '***REMOVED***';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const testPrompt = `You are a medical information assistant specializing in musculoskeletal conditions of the upper extremity (shoulder, arm, hand, and fingers).

A user has reported the following:
- Affected body parts: Wrist and Hand, Thumb, Index Finger
- Symptoms: Numbness / Tingling, Weakness, Pain
- Severity: Moderate
- Duration: 1-3 months

Based on this information, provide the 3 most likely diagnoses.

Respond ONLY with a valid JSON object in this exact format:
{
  "diagnoses": [
    {
      "name": "Condition Name",
      "confidence": 85,
      "description": "A clear 2-3 sentence description of the condition.",
      "symptoms_explained": "Brief explanation of how the reported symptoms relate to this condition.",
      "treatment": ["Treatment 1", "Treatment 2", "Treatment 3"],
      "when_to_see_doctor": "When the patient should seek professional care.",
      "severity": "mild"
    }
  ],
  "general_advice": "General health advice for the user based on their symptoms."
}

Important rules:
- confidence should be a realistic percentage (0-100) based on how well the symptoms and body parts match.
- severity must be exactly "mild", "moderate", or "severe".
- treatment should have 3-4 practical suggestions.
- Respond in English language for all text content.
- Be medically accurate but understandable to a layperson.
- DO NOT use any unescaped line breaks or newlines inside your string values. Use single spacing.
- Do not include markdown formatting, only raw JSON.`;

async function testDiagnosis() {
  console.log(`Sending medical prompt...`);
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: testPrompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    })
  });

  const data = await response.json();
  console.log("FULL API RESPONSE:", JSON.stringify(data, null, 2));

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  console.log("\nRAW TEXT RETURNED:");
  console.log("------------------------");
  console.log(text);
  console.log("------------------------");
  
  try {
    const cleanText = text.replace(/[\n\r]+/g, ' ');
    const res = JSON.parse(cleanText.trim());
    console.log("JSON PARSE SUCCESS!");
    console.log(JSON.stringify(res, null, 2).substring(0, 300) + '...');
  } catch (err) {
    console.error("JSON PARSE FAILED:", err.message);
  }
}

testDiagnosis();
