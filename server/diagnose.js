// Server-side only: builds the diagnosis prompt from the user's selections and calls
// Gemini with the key from the environment, so the key never ships to the browser.
// Shared by the Vercel function (api/diagnose.js) and the Vite dev server (vite.config.js).

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// The UI offers 9 body parts and 6 symptoms, all with short labels. Rejecting anything
// bigger keeps the public endpoint from being used as a general-purpose Gemini relay.
const MAX_ITEMS = 10;
const MAX_LABEL_LENGTH = 60;
const LANGUAGES = { en: 'English', es: 'Spanish' };

function cleanLabel(value) {
  if (typeof value !== 'string') return null;
  const label = value.replace(/\s+/g, ' ').trim();
  return label && label.length <= MAX_LABEL_LENGTH ? label : null;
}

function cleanLabels(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ITEMS) return null;
  const labels = value.map(cleanLabel);
  return labels.every(Boolean) ? labels : null;
}

// Returns the validated selections, or null if the body isn't a request the app would send.
export function parseSelections(body) {
  if (!body || typeof body !== 'object') return null;
  const selections = {
    parts: cleanLabels(body.parts),
    symptoms: cleanLabels(body.symptoms),
    severity: cleanLabel(body.severity),
    duration: cleanLabel(body.duration),
    language: LANGUAGES[body.lang],
  };
  return Object.values(selections).every(Boolean) ? selections : null;
}

export function buildPrompt({ parts, symptoms, severity, duration, language }) {
  return `You are a medical information assistant specializing in musculoskeletal conditions of the upper extremity (shoulder, arm, hand, and fingers).

A user has reported the following:
- Affected body parts: ${parts.join(', ')}
- Symptoms: ${symptoms.join(', ')}
- Severity: ${severity}
- Duration: ${duration}

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
- Respond in ${language} language for all text content.
- Be medically accurate but understandable to a layperson.
- DO NOT use any unescaped line breaks or newlines inside your string values. Use single spacing.
- Do not include markdown formatting, only raw JSON.`;
}

// Returns { status, body } so each runtime (Vercel, Vite) only has to send it.
export async function diagnose(requestBody, apiKey) {
  if (!apiKey) {
    return { status: 500, body: { error: 'GEMINI_API_KEY is not set on the server' } };
  }
  const selections = parseSelections(requestBody);
  if (!selections) {
    return { status: 400, body: { error: 'Invalid diagnosis request' } };
  }

  let response;
  try {
    response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(selections) }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        },
      }),
    });
  } catch (err) {
    console.error('Could not reach Gemini:', err);
    return { status: 502, body: { error: 'Could not reach Gemini' } };
  }

  if (!response.ok) {
    console.error(`Gemini responded with status ${response.status}:`, await response.text());
    return { status: 502, body: { error: `Gemini responded with status ${response.status}` } };
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return { status: 502, body: { error: 'Empty response from Gemini' } };
  }
  return { status: 200, body: { text } };
}
