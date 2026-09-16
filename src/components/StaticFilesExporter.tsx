import React, { useState } from 'react';
import { Copy, Check, FileCode, Download, BookOpen, Layers } from 'lucide-react';

export const StaticFilesExporter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'index' | 'admin' | 'json' | 'guide'>('index');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const indexHtmlCode = `<!DOCTYPE html>
<html lang="it" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vetrina Portfolio - Le mie Web App</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { 500: '#06b6d4', 600: '#0891b2' }
          }
        }
      }
    }
  </script>
  <!-- Font & Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-sans">
  <div className="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-800">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Vetrina Web App</h1>
        <p class="text-sm text-slate-400">Portfolio dinamico caricato da data/apps.json</p>
      </div>
      <a href="admin.html" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl text-sm font-semibold transition">
        <i class="fa-solid fa-lock mr-2"></i>Pannello Admin
      </a>
    </header>

    <!-- Filters & Search -->
    <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <i class="fa-solid fa-search absolute left-3.5 top-3 text-slate-500"></i>
          <input id="searchInput" type="text" placeholder="Cerca app per nome o tag..." class="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500">
        </div>
        <div id="counter" class="text-xs text-slate-400">Caricamento app in corso...</div>
      </div>
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60" id="categoryFilters"></div>
    </div>

    <!-- Apps Grid -->
    <div id="appsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>

    <!-- Detail Modal -->
    <div id="appModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button onclick="closeModal()" class="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><i class="fa-solid fa-xmark"></i></button>
        <div id="modalContent"></div>
      </div>
    </div>
  </div>

  <script>
    let allApps = [];
    let currentCategory = 'Tutte';

    async function loadApps() {
      try {
        const res = await fetch('data/apps.json?v=' + Date.now());
        allApps = await res.json();
        renderFilters();
        renderApps();
      } catch(e) {
        document.getElementById('appsGrid').innerHTML = '<div class="col-span-full p-8 text-center text-rose-400">Errore nel caricamento di data/apps.json</div>';
      }
    }

    function renderFilters() {
      const cats = ['Tutte', ...new Set(allApps.map(a => a.categoria).filter(Boolean))];
      const container = document.getElementById('categoryFilters');
      container.innerHTML = cats.map(c => \`
        <button onclick="filterCategory('\${c}')" class="px-3 py-1 rounded-lg text-xs font-medium \${currentCategory === c ? 'bg-cyan-500 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'}">\${c}</button>
      \`).join('');
    }

    function filterCategory(cat) {
      currentCategory = cat;
      renderFilters();
      renderApps();
    }

    function renderApps() {
      const search = document.getElementById('searchInput').value.toLowerCase();
      const filtered = allApps.filter(app => {
        const matchSearch = app.nome.toLowerCase().includes(search) || app.descrizioneBreve.toLowerCase().includes(search);
        const matchCat = currentCategory === 'Tutte' || app.categoria === currentCategory;
        return matchSearch && matchCat;
      });

      document.getElementById('counter').innerText = \`Mostrando \${filtered.length} di \${allApps.length} app\`;
      
      const grid = document.getElementById('appsGrid');
      grid.innerHTML = filtered.map(app => \`
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between">
          <div>
            <img src="\${app.schermate?.[0] || 'https://via.placeholder.com/600x350'}" class="w-full h-44 object-cover">
            <div class="p-5 space-y-2">
              <span class="text-[10px] uppercase tracking-wider font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">\${app.categoria}</span>
              <h3 class="text-lg font-bold text-white">\${app.nome}</h3>
              <p class="text-xs text-slate-400 line-clamp-2">\${app.descrizioneBreve}</p>
            </div>
          </div>
          <div class="p-5 pt-0 flex gap-2">
            <button onclick="openModal('\${app.id}')" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200">Dettagli</button>
            <a href="\${app.linkApp}" target="_blank" class="px-3 py-2 bg-cyan-950 text-cyan-400 hover:bg-cyan-900 rounded-xl text-xs flex items-center"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>
      \`).join('');
    }

    function openModal(id) {
      const app = allApps.find(a => String(a.id) === String(id));
      if(!app) return;
      const modal = document.getElementById('appModal');
      const content = document.getElementById('modalContent');
      content.innerHTML = \`
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-white">\${app.nome}</h2>
          <img src="\${app.schermate?.[0] || ''}" class="w-full h-64 object-cover rounded-xl border border-slate-800">
          <p class="text-sm text-slate-300">\${app.descrizioneDettagliata || app.descrizioneBreve}</p>
          <div class="grid grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div><strong class="text-cyan-400">Requisiti:</strong> \${app.requisiti || 'Browser moderno'}</div>
            <div><strong class="text-purple-400">Piattaforma:</strong> \${app.specifichePiattaforma || 'Web'}</div>
          </div>
          <a href="\${app.linkApp}" target="_blank" class="block w-full py-3 text-center bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl">Apri Web App</a>
        </div>
      \`;
      modal.classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('appModal').classList.add('hidden');
    }

    document.getElementById('searchInput').addEventListener('input', renderApps);
    loadApps();
  </script>
</body>
</html>`;

  const adminHtmlCode = `<!DOCTYPE html>
<html lang="it" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pannello Admin - Vetrina Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-6">
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="flex justify-between items-center border-b border-slate-800 pb-4">
      <h1 class="text-2xl font-bold text-cyan-400">Pannello Admin & Gemini AI Publish</h1>
      <a href="index.html" class="text-sm text-slate-400 hover:text-white">Torna alla Vetrina</a>
    </div>

    <!-- Credentials -->
    <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
      <h2 class="text-lg font-bold">1. Credenziali & Token</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input id="geminiKey" type="password" placeholder="Gemini API Key" class="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm">
        <input id="githubToken" type="password" placeholder="GitHub Token (PAT)" class="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm">
        <input id="githubRepo" type="text" placeholder="username/repo" class="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm">
      </div>
    </div>

    <!-- Generator -->
    <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
      <h2 class="text-lg font-bold">2. URL Web App</h2>
      <input id="appUrl" type="url" placeholder="https://mia-app.example.com" class="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm">
      <button onclick="generateWithAI()" class="w-full py-3 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl">Genera Scheda con IA</button>
    </div>

    <!-- Preview & Publish -->
    <div id="previewBox" class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 hidden">
      <h2 class="text-lg font-bold text-emerald-400">3. Anteprima & Pubblicazione</h2>
      <div id="previewData" class="text-xs space-y-2 font-mono bg-slate-950 p-4 rounded-xl border border-slate-800"></div>
      <button onclick="publishToGitHub()" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl">Pubblica su GitHub</button>
    </div>

    <div id="status" class="p-4 rounded-xl border border-slate-800 text-sm hidden"></div>
  </div>

  <script>
    let currentApp = null;

    async function generateWithAI() {
      const url = document.getElementById('appUrl').value;
      const apiKey = document.getElementById('geminiKey').value;
      if (!url) return alert('Inserisci l\'URL');

      showStatus('Generazione scheda con Gemini AI...', 'info');
      try {
        const endpoint = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${apiKey}\`;
        const prompt = \`Dato l'URL \${url}, genera JSON: {"nome":"","categoria":"","tipologia":"","descrizioneBreve":"","descrizioneDettagliata":"","requisiti":"","specifichePiattaforma":""}\`;
        
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await res.json();
        const bt = String.fromCharCode(96);
        const text = data.candidates[0].content.parts[0].text.replace(new RegExp(bt + bt + bt + 'json', 'g'), '').replace(new RegExp(bt + bt + bt, 'g'), '').trim();
        const parsed = JSON.parse(text);

        currentApp = {
          id: Date.now().toString(),
          ...parsed,
          schermate: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"],
          linkApp: url
        };

        document.getElementById('previewData').innerText = JSON.stringify(currentApp, null, 2);
        document.getElementById('previewBox').classList.remove('hidden');
        showStatus('Scheda generata con successo!', 'success');
      } catch(e) {
        showStatus('Errore generazione: ' + e.message, 'error');
      }
    }

    async function publishToGitHub() {
      const repo = document.getElementById('githubRepo').value;
      const token = document.getElementById('githubToken').value;
      if (!repo || !token || !currentApp) return alert('Token e Repo richiesti');

      showStatus('Pubblicazione su GitHub in corso...', 'info');
      try {
        const [owner, name] = repo.split('/');
        const getUrl = \`https://api.github.com/repos/\${owner}/\${name}/contents/data/apps.json\`;
        
        const getRes = await fetch(getUrl, { headers: { Authorization: \`Bearer \${token}\` } });
        let apps = [];
        let sha = null;
        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
          apps = JSON.parse(atob(fileData.content));
        }

        apps.unshift(currentApp);
        const contentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(apps, null, 2))));

        const putRes = await fetch(getUrl, {
          method: 'PUT',
          headers: { Authorization: \`Bearer \${token}\`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: \`add app \${currentApp.nome}\`, content: contentBase64, sha })
        });

        if (putRes.ok) {
          showStatus('App pubblicata! Il sito si aggiornerà su GitHub Pages entro 1 minuto.', 'success');
        } else {
          throw new Error('Errore durante il commit');
        }
      } catch(e) {
        showStatus('Errore pubblicazione: ' + e.message, 'error');
      }
    }

    function showStatus(msg, type) {
      const el = document.getElementById('status');
      el.innerText = msg;
      el.className = \`p-4 rounded-xl text-sm border \${type === 'success' ? 'bg-emerald-950 text-emerald-200 border-emerald-800' : 'bg-rose-950 text-rose-200 border-rose-800'}\`;
      el.classList.remove('hidden');
    }
  </script>
</body>
</html>`;

  const jsonSampleCode = `[
  {
    "id": "1710000001",
    "nome": "PromptCraft Studio",
    "categoria": "AI Tools",
    "tipologia": "Prompt Interface",
    "descrizioneBreve": "Studio avanzato per l'ingegneria e l'ottimizzazione in tempo reale di prompt per modelli LLM.",
    "descrizioneDettagliata": "PromptCraft Studio offre un canvas reattivo con supporto per versioning dei prompt, test A/B affiancati e stima token.",
    "requisiti": "Browser moderno, API Key Gemini opzionale",
    "specifichePiattaforma": "Web Desktop & Mobile, 100% Client-Side",
    "schermate": [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
    ],
    "linkApp": "https://promptcraft-demo.example.com",
    "tags": ["AI", "Prompting", "Developer"]
  }
]`;

  const guideText = `# Guida per Hosting su GitHub Pages

1. **Repository GitHub**:
   Crea un repository pubblico su GitHub chiamato "mio-portfolio".

2. **Carica i File**:
   Carica direttamente i file nella radice del repository:
   - index.html
   - admin.html
   - data/apps.json

3. **Crea un Personal Access Token (PAT)**:
   GitHub -> Settings -> Developer Settings -> Personal access tokens.
   Abilita i permessi di scrittura sui repository (repo / contents: write).

4. **Attiva GitHub Pages**:
   Nel tuo repo -> Settings -> Pages -> Selezione Branch main / root -> Save.

Il tuo sito portfolio sarà raggiungibile all'URL: https://tuonome.github.io/mio-portfolio/`;

  const handleCopy = (content: string, tabName: string) => {
    navigator.clipboard.writeText(content);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const currentCode =
    activeTab === 'index'
      ? indexHtmlCode
      : activeTab === 'admin'
      ? adminHtmlCode
      : activeTab === 'json'
      ? jsonSampleCode
      : guideText;

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            Codice Sorgente Standalone per GitHub Pages
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Copia o scarica i file HTML/JSON pronti per essere inseriti nel tuo repository GitHub senza richiedere alcun processo di build.
          </p>
        </div>

        <button
          onClick={() => handleCopy(currentCode, activeTab)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          {copiedTab === activeTab ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Copiato negli appunti!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-cyan-400" />
              <span>Copia Codice ({activeTab.toUpperCase()})</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveTab('index')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'index'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          1. index.html (Vetrina)
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'admin'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          2. admin.html (Pannello Admin)
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'json'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          3. data/apps.json (Dataset Iniziale)
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'guide'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          4. Guida Passo-Passo
        </button>
      </div>

      {/* Code Display Area */}
      <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto">
        <pre>{currentCode}</pre>
      </div>
    </div>
  );
};
