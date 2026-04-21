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
│   └── main.js             # Core application logic (Three.js, AI pipeline, i18n)
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
├── vite.config.js          # Vite bundler config
└── package.json
```

---

## 🛠 Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES Modules)
- **3D Rendering:** [Three.js](https://threejs.org/) v0.167 with GLTF + Draco loader
- **AI Backend:** [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash`)
- **Bundler:** [Vite](https://vitejs.dev/) v8
- **Typography:** Inter (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
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

Open `src/main.js` and replace the API key near the top of the file:

```js
const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
```

> ⚠️ **Never commit your API key to a public repository.** For production, move the key to a backend proxy or use environment variables.

### Running Locally

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

---

## 🔧 How It Works

1. **User clicks "Get Started"** → the 3D body model loads via Three.js + GLTF.
2. **User clicks on a mesh** (shoulder, forearm, fingers, etc.) → the part highlights and is added to a selection list.
3. **Multi-step questionnaire** collects:
   - Symptoms (pain, swelling, numbness, weakness, stiffness, clicking)
   - Severity (mild / moderate / severe)
   - Duration
4. **Gemini API call** — a structured prompt sends the data and requests a JSON response with the top 3 diagnoses, confidence percentages, treatments, and general advice.
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
