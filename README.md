# Know Your Body 🫀

> **Point Your Pain** — An interactive 3D symptom checker powered by AI

Know Your Body is a web application that lets users visually identify where they feel pain on an interactive 3D human body model and receive AI-generated diagnostic insights powered by **Google Gemini 2.5 Flash**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧍 **3D Body Model** | Click directly on a Three.js-rendered 3D anatomical model to select affected areas |
| 🧠 **AI Diagnosis** | Gemini 2.5 Flash analyzes your symptoms and returns the top 3 most likely conditions with confidence scores |
| 💊 **Treatment Recommendations** | Each diagnosis includes practical treatment suggestions and a "when to see a doctor" warning |
| 🌐 **Bilingual Support** | Full English / Spanish (EN/ES) localization with a live language switcher |
| 🎨 **Dark Glassmorphism UI** | Premium dark-theme design with micro-animations and glassmorphism styling |
| 📱 **Responsive Layout** | Works across desktop and mobile screen sizes |

---

## 🗂 Project Structure

```
Know-Your-Body/
├── index.html              # Main SPA entry point (landing + 3D checker)
├── src/
│   └── main.js             # Core application logic (Three.js, questionnaire, i18n)
├── api/
│   └── diagnose.js         # Vercel serverless function: POST /api/diagnose
├── server/
│   └── diagnose.js         # Builds the prompt and calls Gemini (server-side only)
├── public/
│   ├── Models/             # GLTF/GLB 3D body models
│   ├── draco/              # Draco mesh decompression workers
│   ├── Style/
│   │   └── style.css       # Global design system
│   ├── services.html       # Services page
│   ├── contact-us.html     # Contact page
│   ├── about-us.html
│   ├── team.html
│   ├── mission.html
│   ├── knowledge-base.html
│   ├── community.html
│   └── ...                 # Additional informational pages
├── vite.config.js          # Vite config (also serves /api/diagnose during local dev)
├── vercel.json             # Function timeout for /api/diagnose
├── .env.example            # Template for .env.local
└── package.json
```

---

## 🛠 Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES Modules)
- **3D Rendering:** [Three.js](https://threejs.org/) v0.167 with GLTF + Draco loader
- **AI Backend:** [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash`), called from a [Vercel](https://vercel.com/) serverless function so the API key never reaches the browser
- **Bundler:** [Vite](https://vitejs.dev/) v8
- **Typography:** Inter (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (required by Vite 8)
- A valid [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/Josriel123/Know-Your-Body.git
cd Know-Your-Body

# Install dependencies
npm install
```

### Configuration

The Gemini key lives only on the server. Copy the template and add your key:

```bash
cp .env.example .env.local        # macOS/Linux
copy .env.example .env.local      # Windows
```

```env
GEMINI_API_KEY=your_gemini_api_key
```

`.env.local` is gitignored. Keep the name `GEMINI_API_KEY`: a `VITE_` prefix would make Vite bundle the key into the browser code.

### Running Locally

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser. The dev server also answers `POST /api/diagnose` with the same code the Vercel function runs, so the AI diagnosis works locally. Without a key, the app falls back to sample results.

To test the Gemini call on its own, without the browser:

```bash
node --env-file=.env.local test-api.js
```

### Building for Production

```bash
npm run build
```

### Deploying to Vercel

1. Import the repository in [Vercel](https://vercel.com/new). It detects Vite and deploys `api/diagnose.js` as a serverless function.
2. In **Settings → Environment Variables**, add `GEMINI_API_KEY` for Production (and Preview, if you want AI results on preview deployments).
3. Deploy. The site calls `/api/diagnose` on the same domain, so no other configuration is needed.

---

## 🔧 How It Works

1. **User clicks "Get Started"** → the 3D body model loads via Three.js + GLTF.
2. **User clicks on a mesh** (shoulder, forearm, fingers, etc.) → the part highlights and is added to a selection list.
3. **Multi-step questionnaire** collects:
   - Symptoms (pain, swelling, numbness, weakness, stiffness, clicking)
   - Severity (mild / moderate / severe)
   - Duration
4. **Gemini API call** — the browser sends the selections to `/api/diagnose`. The serverless function validates them, builds a structured prompt, and asks Gemini for a JSON response with the top 3 diagnoses, confidence percentages, treatments, and general advice.
5. **Results are rendered** as animated diagnosis cards with SVG confidence rings.

---

## 🌐 Pages

| Route | Description |
|---|---|
| `/` | Landing page + 3D Symptom Checker |
| `/services.html` | Overview of all platform services |
| `/contact-us.html` | Contact form |
| `/about-us.html` | About the project |
| `/team.html` | Meet the team |
| `/mission.html` | Mission statement |
| `/knowledge-base.html` | Medical knowledge base (coming soon) |
| `/community.html` | Community support (coming soon) |

---

## ⚕️ Disclaimer

> Know Your Body provides general health information based on user input and is **NOT** a substitute for professional medical advice. Always consult a qualified healthcare provider for accurate diagnosis and treatment.

---

## 📄 License

This project is for educational purposes.
