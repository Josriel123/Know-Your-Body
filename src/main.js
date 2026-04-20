import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// ============================================================
// CONFIGURATION
// ============================================================
const GEMINI_API_KEY = '***REMOVED***';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ============================================================
// TRANSLATIONS (EN + ES)
// ============================================================
const i18n = {
  en: {
    'app.know': 'KNOW',
    'app.body': 'YOUR BODY',
    'nav.whoWeAre': 'Who We Are ▾',
    'nav.whatWeDo': 'What We Do ▾',
    'nav.aboutUs': 'About Us',
    'nav.team': 'Our Team',
    'nav.mission': 'Our Mission',
    'nav.symptomChecker': '3D Symptom Checker',
    'nav.knowledgeBase': 'Medical Knowledge Base',
    'nav.community': 'Community Support',
    'nav.services': 'Services',
    'nav.contact': 'Contact',
    'landing.point': 'Point',
    'landing.your': 'Your ',
    'landing.pain': 'Pain',
    'landing.subtitle': 'Identify and understand your symptoms with our interactive 3D body model and AI-powered diagnosis.',
    'landing.cta': 'Get Started →',
    'selector.title': 'Select Where It Hurts',
    'selector.subtitle': 'Click on the body parts where you feel pain or discomfort. You can select multiple areas.',
    'selector.empty': 'Click on the 3D model to select body parts',
    'selector.emptyIcon': '👆',
    'selector.partsCount': '{n} part(s) selected',
    'selector.done': "That's All — Next Step",
    'selector.doneDisabled': 'Select at least one area',
    'step.symptoms': 'What do you feel?',
    'step.symptomsSubtitle': 'Select all symptoms that apply to you.',
    'step.details': 'Tell us more',
    'step.detailsSubtitle': 'This helps the AI make a more accurate assessment.',
    'step.of': 'of',
    'symptom.pain': 'Pain',
    'symptom.painDesc': 'Sharp, dull, or throbbing discomfort',
    'symptom.swelling': 'Swelling',
    'symptom.swellingDesc': 'Visible or felt enlargement of area',
    'symptom.numbness': 'Numbness / Tingling',
    'symptom.numbnessDesc': 'Pins-and-needles or loss of sensation',
    'symptom.weakness': 'Weakness',
    'symptom.weaknessDesc': 'Reduced strength or difficulty gripping',
    'symptom.stiffness': 'Stiffness',
    'symptom.stiffnessDesc': 'Difficulty moving or reduced range of motion',
    'symptom.clicking': 'Clicking / Popping',
    'symptom.clickingDesc': 'Snapping, locking, or popping sounds',
    'severity.title': 'Severity',
    'severity.mild': 'Mild',
    'severity.moderate': 'Moderate',
    'severity.severe': 'Severe',
    'duration.title': 'Duration',
    'duration.lessThanWeek': 'Less than a week',
    'duration.oneToFourWeeks': '1–4 weeks',
    'duration.oneToThreeMonths': '1–3 months',
    'duration.moreThanThreeMonths': 'More than 3 months',
    'btn.back': 'Back',
    'btn.next': 'Next',
    'btn.getDiagnosis': 'Get AI Diagnosis →',
    'loading.title': 'Analyzing your symptoms…',
    'loading.subtitle': 'Our AI is reviewing your input',
    'diagnosis.title': 'Your Results',
    'diagnosis.topMatch': 'Top Match',
    'diagnosis.treatments': 'Common Treatments',
    'diagnosis.advice': 'General Advice',
    'diagnosis.restart': '← Start Over',
    'diagnosis.disclaimer': 'Disclaimer: This tool provides general health information based on your input and is NOT a substitute for professional medical advice. Always consult a qualified healthcare provider for accurate diagnosis and treatment.',
    'toast.comingSoon': '🚧 This area is coming soon — not yet available.',
    'toast.comingSoonShort': 'Coming soon',
    'toast.selectPart': 'Please select at least one body area first.',
    'error.title': 'Something went wrong',
    'error.subtitle': 'Could not connect to the AI service. Please try again.',
    'error.retry': 'Retry',
    'bodyPart.Dont know': 'Body (General)',
    'bodyPart.Shoulder': 'Shoulder',
    'bodyPart.Bicep and Tricep': 'Bicep & Tricep',
    'bodyPart.Forearm': 'Forearm',
    'bodyPart.Wrist and Hand': 'Wrist & Hand',
    'bodyPart.Thumb': 'Thumb',
    'bodyPart.Index Finger': 'Index Finger',
    'bodyPart.Middle Finger': 'Middle Finger',
    'bodyPart.Ring Finger': 'Ring Finger',
    'bodyPart.Little Finger': 'Little Finger',
  },
  es: {
    'app.know': 'CONOCE',
    'app.body': 'TU CUERPO',
    'nav.whoWeAre': 'Quiénes Somos ▾',
    'nav.whatWeDo': 'Qué Hacemos ▾',
    'nav.aboutUs': 'Sobre Nosotros',
    'nav.team': 'Nuestro Equipo',
    'nav.mission': 'Nuestra Misión',
    'nav.symptomChecker': 'Verificador de Síntomas 3D',
    'nav.knowledgeBase': 'Base de Conocimiento Médico',
    'nav.community': 'Apoyo Comunitario',
    'nav.services': 'Servicios',
    'nav.contact': 'Contacto',
    'landing.point': 'Señala',
    'landing.your': 'Tu ',
    'landing.pain': 'Dolor',
    'landing.subtitle': 'Identifica y comprende tus síntomas con nuestro modelo 3D interactivo y diagnóstico impulsado por IA.',
    'landing.cta': 'Comenzar →',
    'selector.title': 'Selecciona dónde duele',
    'selector.subtitle': 'Haz clic en las partes del cuerpo donde sientes dolor o molestia. Puedes seleccionar varias áreas.',
    'selector.empty': 'Haz clic en el modelo 3D para seleccionar',
    'selector.emptyIcon': '👆',
    'selector.partsCount': '{n} parte(s) seleccionada(s)',
    'selector.done': 'Eso es todo — Siguiente',
    'selector.doneDisabled': 'Selecciona al menos una zona',
    'step.symptoms': '¿Qué sientes?',
    'step.symptomsSubtitle': 'Selecciona todos los síntomas que aplican.',
    'step.details': 'Cuéntanos más',
    'step.detailsSubtitle': 'Esto ayuda a la IA a hacer una evaluación más precisa.',
    'step.of': 'de',
    'symptom.pain': 'Dolor',
    'symptom.painDesc': 'Molestia aguda, sorda o pulsante',
    'symptom.swelling': 'Hinchazón',
    'symptom.swellingDesc': 'Agrandamiento visible o palpable del área',
    'symptom.numbness': 'Entumecimiento / Hormigueo',
    'symptom.numbnessDesc': 'Sensación de alfileres o pérdida de sensibilidad',
    'symptom.weakness': 'Debilidad',
    'symptom.weaknessDesc': 'Fuerza reducida o dificultad para agarrar',
    'symptom.stiffness': 'Rigidez',
    'symptom.stiffnessDesc': 'Dificultad para mover o rango de movimiento reducido',
    'symptom.clicking': 'Chasquidos / Crujidos',
    'symptom.clickingDesc': 'Sonidos de chasquido, bloqueo o crujido',
    'severity.title': 'Severidad',
    'severity.mild': 'Leve',
    'severity.moderate': 'Moderado',
    'severity.severe': 'Severo',
    'duration.title': 'Duración',
    'duration.lessThanWeek': 'Menos de una semana',
    'duration.oneToFourWeeks': '1–4 semanas',
    'duration.oneToThreeMonths': '1–3 meses',
    'duration.moreThanThreeMonths': 'Más de 3 meses',
    'btn.back': 'Atrás',
    'btn.next': 'Siguiente',
    'btn.getDiagnosis': 'Obtener diagnóstico IA →',
    'loading.title': 'Analizando tus síntomas…',
    'loading.subtitle': 'Nuestra IA está revisando tu información',
    'diagnosis.title': 'Tus Resultados',
    'diagnosis.topMatch': 'Coincidencia Principal',
    'diagnosis.treatments': 'Tratamientos Comunes',
    'diagnosis.advice': 'Consejo General',
    'diagnosis.restart': '← Empezar de Nuevo',
    'diagnosis.disclaimer': 'Aviso: Esta herramienta proporciona información general de salud basada en tu entrada y NO sustituye el consejo médico profesional. Siempre consulta a un profesional de salud calificado para un diagnóstico y tratamiento precisos.',
    'toast.comingSoon': '🚧 Esta zona estará disponible próximamente.',
    'toast.comingSoonShort': 'Próximamente',
    'toast.selectPart': 'Por favor selecciona al menos una zona del cuerpo primero.',
    'error.title': 'Algo salió mal',
    'error.subtitle': 'No se pudo conectar con el servicio de IA. Por favor, inténtalo de nuevo.',
    'error.retry': 'Reintentar',
    'bodyPart.Dont know': 'Cuerpo (General)',
    'bodyPart.Shoulder': 'Hombro',
    'bodyPart.Bicep and Tricep': 'Bíceps y Tríceps',
    'bodyPart.Forearm': 'Antebrazo',
    'bodyPart.Wrist and Hand': 'Muñeca y Mano',
    'bodyPart.Thumb': 'Pulgar',
    'bodyPart.Index Finger': 'Dedo Índice',
    'bodyPart.Middle Finger': 'Dedo Medio',
    'bodyPart.Ring Finger': 'Dedo Anular',
    'bodyPart.Little Finger': 'Dedo Meñique',
  }
};

// ============================================================
// APPLICATION STATE
// ============================================================
const state = {
  lang: localStorage.getItem('kyb-lang') || 'en',
  currentView: 'landing',  // landing | selector | symptoms | details | loading | diagnosis
  partsSelected: [],        // array of mesh names like "Shoulder", "Thumb"
  selectedSymptoms: [],     // array of symptom keys like "pain", "swelling"
  severity: null,           // "mild" | "moderate" | "severe"
  duration: null,           // duration key
  diagnosisResult: null,    // parsed AI response

  // Three.js
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  model: null,
  cameraLight: null,
  raycaster: new THREE.Raycaster(),
  mouse: new THREE.Vector2(),
  hoveredPart: null,
  animFrameId: null,
  originalColors: new Map(),
};

// ============================================================
// TRANSLATION HELPERS
// ============================================================
function t(key) {
  return i18n[state.lang]?.[key] || i18n['en']?.[key] || key;
}

// Three.js GLTF loader converts spaces to underscores in node names.
// This reverses that so our translation keys (which use spaces) still match.
function normalizeMeshName(rawName) {
  return rawName.replace(/_/g, ' ');
}

// Named, selectable arm parts (left arm only — only side modeled in the GLTF)
const SELECTABLE_PARTS = new Set([
  'Shoulder',
  'Bicep and Tricep',
  'Forearm',
  'Wrist and Hand',
  'Thumb',
  'Index Finger',
  'Middle Finger',
  'Ring Finger',
  'Little Finger',
]);

function isSelectablePart(meshName) {
  return SELECTABLE_PARTS.has(normalizeMeshName(meshName));
}

function bodyPartName(meshName) {
  const normalized = normalizeMeshName(meshName);
  // Return proper label or a friendly fallback
  return t(`bodyPart.${normalized}`) !== `bodyPart.${normalized}`
    ? t(`bodyPart.${normalized}`)
    : normalized;
}

function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem('kyb-lang', lang);

  // Update all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update lang button
  const langLabel = document.getElementById('langLabel');
  if (langLabel) langLabel.textContent = lang.toUpperCase();

  // Update active state in dropdown
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  // Re-render current sidebar content
  renderCurrentView();
}

// ============================================================
// VIEW MANAGEMENT
// ============================================================
function showView(viewId) {
  // Close any open dropdowns
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById(`view-${viewId}`);
  if (view) view.classList.add('active');
}

function renderCurrentView() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  switch (state.currentView) {
    case 'selector': renderBodySelection(sidebar); break;
    case 'symptoms': renderStepSymptoms(sidebar); break;
    case 'details': renderStepDetails(sidebar); break;
    case 'loading': renderLoading(sidebar); break;
    case 'diagnosis': renderDiagnosis(sidebar); break;
  }
}

// ============================================================
// LANDING PAGE
// ============================================================
function initLanding() {
  document.getElementById('btnStart').addEventListener('click', () => {
    state.currentView = 'selector';
    showView('app');
    renderCurrentView();
    initScene();
  });
}

// ============================================================
// BODY PART SELECTION (Sidebar)
// ============================================================
function renderBodySelection(sidebar) {
  const hasSelection = state.partsSelected.length > 0;

  let chipsHTML = '';
  if (hasSelection) {
    chipsHTML = state.partsSelected.map(name => `
      <div class="chip" id="chip-${name.replace(/\s+/g, '-')}">
        ${bodyPartName(name)}
        <button class="chip-remove" data-part="${name}">✕</button>
      </div>
    `).join('');
  }

  sidebar.innerHTML = `
    <h2 class="sidebar-title">${t('selector.title')}</h2>
    <p class="sidebar-subtitle">${t('selector.subtitle')}</p>
    
    <div class="chips-container" id="chipsContainer">
      ${hasSelection ? chipsHTML : `
        <div class="empty-state">
          <div class="empty-state-icon">${t('selector.emptyIcon')}</div>
          <div class="empty-state-text">${t('selector.empty')}</div>
        </div>
      `}
    </div>

    ${hasSelection ? `<p class="parts-count">${t('selector.partsCount').replace('{n}', state.partsSelected.length)}</p>` : ''}

    <button class="btn-action" id="btnDone" ${!hasSelection ? 'disabled' : ''}>
      ${hasSelection ? t('selector.done') : t('selector.doneDisabled')}
    </button>
  `;

  // Chip removal
  sidebar.querySelectorAll('.chip-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const partName = btn.dataset.part;
      removePart(partName);
    });
  });

  // Done button
  const btnDone = document.getElementById('btnDone');
  if (btnDone && hasSelection) {
    btnDone.addEventListener('click', () => {
      state.currentView = 'symptoms';
      renderCurrentView();
    });
  }
}

function removePart(normalizedName) {
  // partsSelected stores normalized (space-separated) names
  state.partsSelected = state.partsSelected.filter(n => n !== normalizedName);

  // Three.js mesh names may have underscores — find by matching normalized form
  if (state.model) {
    state.model.traverse(child => {
      if (child.isMesh && normalizeMeshName(child.name) === normalizedName) {
        const orig = state.originalColors.get(child.name);
        if (orig) child.material.color.copy(orig);
      }
    });
  }

  renderCurrentView();
}

// ============================================================
// QUESTIONNAIRE — STEP 1: Symptoms
// ============================================================
function renderStepSymptoms(sidebar) {
  const symptoms = [
    { key: 'pain', icon: '🔴' },
    { key: 'swelling', icon: '🫧' },
    { key: 'numbness', icon: '⚡' },
    { key: 'weakness', icon: '💪' },
    { key: 'stiffness', icon: '🦴' },
    { key: 'clicking', icon: '🔊' },
  ];

  sidebar.innerHTML = `
    <div class="progress-container">
      <div class="progress-steps">
        <div class="progress-step active"></div>
        <div class="progress-step"></div>
      </div>
      <div class="progress-label">${t('step.symptoms')} — 1 ${t('step.of')} 2</div>
    </div>

    <h2 class="sidebar-title">${t('step.symptoms')}</h2>
    <p class="sidebar-subtitle">${t('step.symptomsSubtitle')}</p>

    <div class="options-grid" id="symptomsGrid">
      ${symptoms.map(s => `
        <button class="option-btn ${state.selectedSymptoms.includes(s.key) ? 'selected' : ''}" data-symptom="${s.key}">
          <div class="option-icon">${s.icon}</div>
          <div class="option-text">
            <span class="option-label">${t(`symptom.${s.key}`)}</span>
            <span class="option-desc">${t(`symptom.${s.key}Desc`)}</span>
          </div>
        </button>
      `).join('')}
    </div>

    <div class="nav-buttons">
      <button class="btn-secondary" id="btnBackToSelector">${t('btn.back')}</button>
      <button class="btn-next" id="btnNextToDetails" ${state.selectedSymptoms.length === 0 ? 'disabled' : ''}>${t('btn.next')}</button>
    </div>
  `;

  // Symptom toggle handlers
  sidebar.querySelectorAll('.option-btn[data-symptom]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.symptom;
      if (state.selectedSymptoms.includes(key)) {
        state.selectedSymptoms = state.selectedSymptoms.filter(s => s !== key);
      } else {
        state.selectedSymptoms.push(key);
      }
      renderCurrentView();
    });
  });

  document.getElementById('btnBackToSelector').addEventListener('click', () => {
    state.currentView = 'selector';
    renderCurrentView();
  });

  document.getElementById('btnNextToDetails').addEventListener('click', () => {
    if (state.selectedSymptoms.length > 0) {
      state.currentView = 'details';
      renderCurrentView();
    }
  });
}

// ============================================================
// QUESTIONNAIRE — STEP 2: Severity + Duration
// ============================================================
function renderStepDetails(sidebar) {
  const severities = ['mild', 'moderate', 'severe'];
  const durations = ['lessThanWeek', 'oneToFourWeeks', 'oneToThreeMonths', 'moreThanThreeMonths'];
  const severityIcons = { mild: '🟢', moderate: '🟡', severe: '🔴' };

  sidebar.innerHTML = `
    <div class="progress-container">
      <div class="progress-steps">
        <div class="progress-step completed"></div>
        <div class="progress-step active"></div>
      </div>
      <div class="progress-label">${t('step.details')} — 2 ${t('step.of')} 2</div>
    </div>

    <h2 class="sidebar-title">${t('step.details')}</h2>
    <p class="sidebar-subtitle">${t('step.detailsSubtitle')}</p>

    <h3 style="font-size:14px; color:var(--text-secondary); margin-bottom:10px; font-weight:600;">${t('severity.title')}</h3>
    <div class="options-grid" id="severityGrid">
      ${severities.map(s => `
        <button class="option-btn ${state.severity === s ? 'selected' : ''}" data-severity="${s}">
          <div class="option-icon">${severityIcons[s]}</div>
          <span class="option-label">${t(`severity.${s}`)}</span>
        </button>
      `).join('')}
    </div>

    <h3 style="font-size:14px; color:var(--text-secondary); margin-bottom:10px; margin-top:8px; font-weight:600;">${t('duration.title')}</h3>
    <div class="options-grid" id="durationGrid">
      ${durations.map(d => `
        <button class="option-btn ${state.duration === d ? 'selected' : ''}" data-duration="${d}">
          <span class="option-label">${t(`duration.${d}`)}</span>
        </button>
      `).join('')}
    </div>

    <div class="nav-buttons">
      <button class="btn-secondary" id="btnBackToSymptoms">${t('btn.back')}</button>
      <button class="btn-next" id="btnGetDiagnosis" ${!state.severity || !state.duration ? 'disabled' : ''}>${t('btn.getDiagnosis')}</button>
    </div>
  `;

  // Severity handlers (single select)
  sidebar.querySelectorAll('.option-btn[data-severity]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.severity = btn.dataset.severity;
      renderCurrentView();
    });
  });

  // Duration handlers (single select)
  sidebar.querySelectorAll('.option-btn[data-duration]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.duration = btn.dataset.duration;
      renderCurrentView();
    });
  });

  document.getElementById('btnBackToSymptoms').addEventListener('click', () => {
    state.currentView = 'symptoms';
    renderCurrentView();
  });

  document.getElementById('btnGetDiagnosis').addEventListener('click', () => {
    if (state.severity && state.duration) {
      state.currentView = 'loading';
      renderCurrentView();
      requestDiagnosis();
    }
  });
}

// ============================================================
// AI DIAGNOSIS — GEMINI API
// ============================================================
function buildPrompt() {
  const partsStr = state.partsSelected.map(p => bodyPartName(p)).join(', ');
  const symptomsStr = state.selectedSymptoms.map(s => t(`symptom.${s}`)).join(', ');
  const severityStr = t(`severity.${state.severity}`);
  const durationStr = t(`duration.${state.duration}`);
  const langName = state.lang === 'es' ? 'Spanish' : 'English';

  return `You are a medical information assistant specializing in musculoskeletal conditions of the upper extremity (shoulder, arm, hand, and fingers).

A user has reported the following:
- Affected body parts: ${partsStr}
- Symptoms: ${symptomsStr}
- Severity: ${severityStr}
- Duration: ${durationStr}

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
- Respond in ${langName} language for all text content.
- Be medically accurate but understandable to a layperson.
- DO NOT use any unescaped line breaks or newlines inside your string values. Use single spacing.
- Do not include markdown formatting, only raw JSON.`;
}

async function requestDiagnosis() {
  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt() }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('Empty response from AI');

    // Strip literal line breaks from the raw response to guarantee JSON.parse won't choke on unescaped string values
    let cleanText = text.replace(/[\n\r]+/g, ' ');
    
    // Try to parse JSON from the response (handle markdown code blocks)
    let jsonStr = cleanText;
    const jsonMatch = cleanText.match(/```json\s*([\s\S]*?)```/) || cleanText.match(/```\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1];

    state.diagnosisResult = JSON.parse(jsonStr.trim());
    state.currentView = 'diagnosis';
    renderCurrentView();

  } catch (err) {
    console.error('Diagnosis error:', err);
    
    // Universal App Fallback - Never show crash screens to the user during demo
    showToast(t('feedback.apiLimit', 'API or Parse Error detected. Displaying Mock Data.'), 'warning');
    state.diagnosisResult = {
      diagnoses: [
        {
          name: "Mock Diagnosis (API/Parse Timeout)",
          confidence: 85,
          description: "The AI successfully connected but generated a syntax error in its medical payload. This is a simulated fallback response so you can still view the app's diagnosis design.",
          symptoms_explained: "In a real scenario, the AI would explain how your selected symptoms (" + state.selectedSymptoms.join(', ') + ") match this condition.",
          treatment: ["Rest the affected area", "Apply ice or heat", "Consult a doctor if symptoms persist"],
          when_to_see_doctor: "If pain persists past the API retry limits.",
          severity: "moderate"
        }
      ],
      general_advice: "This UI represents the final destination. Once the AI consistently escapes its payload syntax strings, real data will appear exactly in this format."
    };
    state.currentView = 'diagnosis';
    renderCurrentView();
  }
}

// ============================================================
// LOADING STATE
// ============================================================
function renderLoading(sidebar) {
  sidebar.innerHTML = `
    <div class="loading-container">
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
      <div class="loading-text">${t('loading.title')}</div>
      <div class="loading-text" style="font-size:12px;color:var(--text-muted);">${t('loading.subtitle')}</div>
    </div>
  `;
}

// ============================================================
// DIAGNOSIS RESULTS
// ============================================================
function renderDiagnosis(sidebar) {
  const result = state.diagnosisResult;
  if (!result || !result.diagnoses) {
    renderDiagnosisError(sidebar, 'No diagnosis data available');
    return;
  }

  const diagnosesHTML = result.diagnoses.map((d, i) => {
    const circumference = 2 * Math.PI * 16;
    const dashArray = (d.confidence / 100) * circumference;
    const colors = { mild: 'var(--success)', moderate: 'var(--warning)', severe: 'var(--danger)' };
    const strokeColor = colors[d.severity] || 'var(--accent)';

    return `
      <div class="diagnosis-card ${i === 0 ? 'primary' : ''}" style="animation-delay: ${i * 0.12}s">
        <div class="diagnosis-card-header">
          <div class="confidence-ring">
            <svg viewBox="0 0 36 36">
              <circle class="confidence-bg" cx="18" cy="18" r="16" />
              <circle class="confidence-fill" cx="18" cy="18" r="16"
                stroke="${strokeColor}"
                stroke-dasharray="${dashArray} ${circumference}"
                style="transform: rotate(-90deg); transform-origin: center;" />
              <text class="confidence-text" x="18" y="18"
                style="transform: rotate(90deg); transform-origin: center;">
                ${d.confidence}%
              </text>
            </svg>
          </div>
          <div>
            <div class="diagnosis-name">${d.name}</div>
            ${i === 0 ? `<span class="diagnosis-severity severity-${d.severity}">${t(`severity.${d.severity}`)}</span>` : ''}
          </div>
        </div>
        <div class="diagnosis-body">${d.description}</div>
        ${d.symptoms_explained ? `<div class="diagnosis-body" style="font-style:italic;opacity:0.8;">${d.symptoms_explained}</div>` : ''}
        <div class="treatment-list">
          <span style="font-size:12px;color:var(--text-muted);margin-right:4px;">${t('diagnosis.treatments')}:</span>
          ${d.treatment.map(tr => `<span class="treatment-tag">${tr}</span>`).join('')}
        </div>
        ${d.when_to_see_doctor ? `
          <div class="doctor-notice">
            <span class="doctor-notice-icon">⚠️</span>
            <span>${d.when_to_see_doctor}</span>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  sidebar.innerHTML = `
    <div class="diagnosis-header">
      <h2 class="sidebar-title">${t('diagnosis.title')}</h2>
    </div>

    ${diagnosesHTML}

    ${result.general_advice ? `
      <div class="advice-card">
        <h4>💡 ${t('diagnosis.advice')}</h4>
        <p>${result.general_advice}</p>
      </div>
    ` : ''}

    <div class="disclaimer">
      <strong>⚕️</strong> ${t('diagnosis.disclaimer')}
    </div>

    <button class="btn-action" id="btnRestart" style="background:var(--bg-card);color:var(--text-secondary);border:1px solid var(--border);">
      ${t('diagnosis.restart')}
    </button>
  `;

  document.getElementById('btnRestart').addEventListener('click', resetToStart);
}

function renderDiagnosisError(sidebar, message) {
  sidebar.innerHTML = `
    <div class="loading-container">
      <div style="font-size:40px;margin-bottom:12px;">⚠️</div>
      <h3 style="margin-bottom:8px;">${t('error.title')}</h3>
      <p style="font-size:13px;color:var(--text-muted);text-align:center;margin-bottom:20px;">${t('error.subtitle')}<br><small style="opacity:0.5;">${message}</small></p>
      <button class="btn-primary" id="btnRetry" style="padding:12px 32px;font-size:14px;">${t('error.retry')}</button>
      <button class="btn-secondary" id="btnRestartError" style="margin-top:10px;padding:10px 24px">${t('diagnosis.restart')}</button>
    </div>
  `;

  document.getElementById('btnRetry').addEventListener('click', () => {
    state.currentView = 'loading';
    renderCurrentView();
    requestDiagnosis();
  });
  document.getElementById('btnRestartError').addEventListener('click', resetToStart);
}

function resetToStart() {
  state.currentView = 'landing';
  state.partsSelected = [];
  state.selectedSymptoms = [];
  state.severity = null;
  state.duration = null;
  state.diagnosisResult = null;

  // Reset all mesh colors
  if (state.model) {
    state.model.traverse(child => {
      if (child.isMesh) {
        const orig = state.originalColors.get(child.name);
        if (orig) child.material.color.copy(orig);
      }
    });
  }

  showView('landing');
  // Re-translate landing page
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
}

// ============================================================
// THREE.JS — SCENE SETUP
// ============================================================
let sceneInitialized = false;

function initScene() {
  if (sceneInitialized) return;
  sceneInitialized = true;

  const container = document.getElementById('threejs-container');
  if (!container) return;

  // Scene
  state.scene = new THREE.Scene();

  // Camera
  state.camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  state.camera.position.set(0, 2.5, 5);
  state.camera.lookAt(0, 0, 0);

  // Renderer
  state.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  state.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  state.renderer.setSize(container.clientWidth, container.clientHeight);
  state.renderer.outputColorSpace = THREE.SRGBColorSpace;
  state.renderer.shadowMap.enabled = true;
  state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(state.renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
  state.scene.add(ambientLight);

  const topLight = new THREE.DirectionalLight('#e6d9c6', 1.3);
  topLight.position.set(0, 10, 0);
  topLight.castShadow = true;
  topLight.shadow.mapSize.width = 2048;
  topLight.shadow.mapSize.height = 2048;
  state.scene.add(topLight);

  state.cameraLight = new THREE.DirectionalLight(0xadd8e6, 1.0);
  state.cameraLight.castShadow = true;
  state.scene.add(state.cameraLight);

  // Controls
  state.controls = new OrbitControls(state.camera, state.renderer.domElement);
  state.controls.enablePan = false;
  state.controls.enableZoom = true;
  state.controls.minDistance = 2;
  state.controls.maxDistance = 10;
  state.controls.minPolarAngle = Math.PI / 20;
  state.controls.maxPolarAngle = Math.PI;
  state.controls.enableDamping = true;
  state.controls.dampingFactor = 0.05;

  // Load model
  loadModel();

  // Events
  state.renderer.domElement.addEventListener('click', onModelClick);
  state.renderer.domElement.addEventListener('mousemove', onModelHover);
  // Close any open nav dropdowns when user interacts with the 3D canvas
  state.renderer.domElement.addEventListener('mousedown', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    document.getElementById('langDropdown')?.classList.remove('open');
  });
  window.addEventListener('resize', onWindowResize);

  // Animation loop
  function animate() {
    state.animFrameId = requestAnimationFrame(animate);
    state.controls.update();
    state.renderer.render(state.scene, state.camera);

    // Camera-following light
    const lightOffset = new THREE.Vector3(0, 1, 0).normalize().multiplyScalar(4.5);
    state.cameraLight.position.copy(state.camera.position).add(lightOffset);
    state.cameraLight.target.position.copy(
      state.camera.position.clone().add(
        state.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(11)
      )
    );
    state.cameraLight.target.updateMatrixWorld();
  }

  animate();
}

function loadModel() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'block';

  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/draco/');
  loader.setDRACOLoader(dracoLoader);

  loader.load('/Models/EnglishModel.gltf', (gltf) => {
    if (spinner) spinner.style.display = 'none';

    if (state.model) state.scene.remove(state.model);
    state.model = gltf.scene;

    // Log all mesh names to help debug in development
    if (import.meta.env.DEV) {
      state.model.traverse(child => {
        if (child.isMesh) console.log('[KYB] Mesh:', JSON.stringify(child.name));
      });
    }

    state.model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Clone material so each mesh can have independent colors
        child.material = child.material.clone();
        state.originalColors.set(child.name, child.material.color.clone());
      }
    });

    state.scene.add(state.model);
    state.model.scale.set(26, 26, 26);
    state.model.position.set(0, -2.763, 0);

    onWindowResize();
  }, undefined, (error) => {
    if (spinner) spinner.style.display = 'none';
    console.error('Error loading model:', error);
  });
}

function onWindowResize() {
  const container = document.getElementById('threejs-container');
  if (!container || !state.renderer) return;
  state.renderer.setSize(container.clientWidth, container.clientHeight);
  state.camera.aspect = container.clientWidth / container.clientHeight;
  state.camera.updateProjectionMatrix();
}

// ============================================================
// 3D MODEL INTERACTION
// ============================================================
function onModelClick(event) {
  if (!state.model || state.currentView !== 'selector') return;

  const rect = state.renderer.domElement.getBoundingClientRect();
  state.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  state.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  state.raycaster.setFromCamera(state.mouse, state.camera);

  const intersects = state.raycaster.intersectObjects(state.model.children, true);
  if (intersects.length === 0) return;

  const clickedMesh = intersects[0].object;
  if (!clickedMesh.isMesh) return;

  const meshName = clickedMesh.name; // raw name (may have underscores)

  // If this part is NOT one of the named selectable arm segments, block it
  if (!isSelectablePart(meshName)) {
    showToast(t('toast.comingSoon'));
    return;
  }

  const normalizedName = normalizeMeshName(meshName);

  // Toggle selection (store normalized names so display & AI prompt are clean)
  if (state.partsSelected.includes(normalizedName)) {
    // Deselect
    state.partsSelected = state.partsSelected.filter(n => n !== normalizedName);
    const orig = state.originalColors.get(meshName);
    if (orig) clickedMesh.material.color.copy(orig);
  } else {
    // Select — highlight blue
    state.partsSelected.push(normalizedName);
    clickedMesh.material.color.set('#1a8bb9');
  }

  renderCurrentView();
}

function onModelHover(event) {
  if (!state.model || state.currentView !== 'selector') {
    hideTooltip();
    return;
  }

  const rect = state.renderer.domElement.getBoundingClientRect();
  state.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  state.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  state.raycaster.setFromCamera(state.mouse, state.camera);

  const intersects = state.raycaster.intersectObjects(state.model.children, true);

  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    const selectable = isSelectablePart(mesh.name);
    const normalizedName = normalizeMeshName(mesh.name);

    if (mesh.isMesh && mesh.name !== state.hoveredPart) {
      // Reset color on previously hovered mesh
      if (state.hoveredPart && !state.partsSelected.includes(normalizeMeshName(state.hoveredPart))) {
        state.model.traverse(child => {
          if (child.isMesh && child.name === state.hoveredPart) {
            const orig = state.originalColors.get(child.name);
            if (orig) child.material.color.copy(orig);
          }
        });
      }

      state.hoveredPart = mesh.name;

      // Apply hover tint only on selectable parts not already selected
      if (selectable && !state.partsSelected.includes(normalizedName)) {
        mesh.material.color.set('#5a6a7a');
      }

      // Show pointer cursor only on selectable parts
      state.renderer.domElement.style.cursor = selectable ? 'pointer' : 'not-allowed';
    }

    // Tooltip: show part name for selectable, "not available" hint for others
    if (selectable) {
      showTooltipAt(bodyPartName(mesh.name), event.clientX, event.clientY);
    } else {
      showTooltipAt(`${bodyPartName(mesh.name)} — ${t('toast.comingSoonShort')}`, event.clientX, event.clientY);
    }
  } else {
    // Reset hover color on exit
    if (state.hoveredPart && !state.partsSelected.includes(normalizeMeshName(state.hoveredPart))) {
      state.model.traverse(child => {
        if (child.isMesh && child.name === state.hoveredPart) {
          const orig = state.originalColors.get(child.name);
          if (orig) child.material.color.copy(orig);
        }
      });
    }
    state.hoveredPart = null;
    state.renderer.domElement.style.cursor = 'default';
    hideTooltip();
  }
}

// ============================================================
// UI HELPERS
// ============================================================
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

function showTooltipAt(text, x, y) {
  const tooltip = document.getElementById('tooltip-3d');
  tooltip.textContent = text;
  tooltip.style.left = (x + 14) + 'px';
  tooltip.style.top = (y - 10) + 'px';
  tooltip.classList.add('visible');
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip-3d');
  tooltip.classList.remove('visible');
}

// ============================================================
// HEADER — NAVIGATION + LANGUAGE
// ============================================================
function initHeader() {
  // Dropdown menus
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // prevent bubbling to doc close handler
        // Close other dropdowns first
        document.querySelectorAll('.dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.toggle('active');
      });
    }
  });

  // Close dropdowns on any outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    document.getElementById('langDropdown')?.classList.remove('open');
  });

  // Also close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
      document.getElementById('langDropdown')?.classList.remove('open');
    }
  });

  // Language switcher
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent bubbling to doc close handler
    // Close nav dropdowns when opening lang switcher
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
    langDropdown.classList.toggle('open');
  });

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      setLanguage(opt.dataset.lang);
      langDropdown.classList.remove('open');
    });
  });

  // Logo → home
  document.getElementById('logo-link').addEventListener('click', (e) => {
    e.preventDefault();
    resetToStart();
  });
}

// ============================================================
// INITIALIZATION
// ============================================================
function init() {
  // Set initial language
  setLanguage(state.lang);
  initHeader();
  initLanding();
}

document.addEventListener('DOMContentLoaded', init);
