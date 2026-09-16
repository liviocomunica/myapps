import React, { useState, useEffect } from 'react';
import { AppItem } from './types';
import { VetrinaView } from './components/VetrinaView';
import { AdminView } from './components/AdminView';
import { GitHubGuideModal } from './components/GitHubGuideModal';
import { StaticFilesExporter } from './components/StaticFilesExporter';
import { 
  Sparkles, 
  Lock, 
  Github, 
  BookOpen, 
  Layers, 
  FileCode,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'vetrina' | 'admin' | 'exporter'>('vetrina');
  const [apps, setApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Fetch apps from local data/apps.json
  const loadApps = async () => {
    setIsLoading(true);
    try {
      // Try local JSON path first
      const response = await fetch('/data/apps.json?t=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        setApps(Array.isArray(data) ? data : []);
      } else {
        // Fallback to initial mock if fetch fails
        throw new Error('Impossibile caricare data/apps.json');
      }
    } catch (err) {
      console.warn('Uso dataset di ripiego:', err);
      // Inline default fallback dataset
      setApps([
        {
          id: '1710000001',
          nome: 'PromptCraft Studio',
          categoria: 'AI Tools',
          tipologia: 'Prompt Interface',
          descrizioneBreve: 'Studio avanzato per l\'ingegneria e l\'ottimizzazione in tempo reale di prompt per modelli LLM.',
          descrizioneDettagliata: 'PromptCraft Studio è una potente workstation web per sviluppatori. Offre un canvas reattivo con supporto per versioning dei prompt e test A/B affiancati.',
          requisiti: 'Browser moderno (Chrome, Firefox, Safari, Edge), API Key Gemini opzionale',
          specifichePiattaforma: 'Web Desktop & Mobile, PWA Ready, Client-Side',
          schermate: [
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
          ],
          linkApp: 'https://promptcraft-demo.example.com',
          tags: ['AI', 'Prompting', 'LLM', 'Developer'],
          dataAggiunta: '2026-03-15'
        },
        {
          id: '1710000002',
          nome: 'TaskFlow Matrix',
          categoria: 'Produttività',
          tipologia: 'SaaS',
          descrizioneBreve: 'Gestione intelligente dei progetti basata sulla matrice Eisenhower e pianificazione automatica.',
          descrizioneDettagliata: 'TaskFlow Matrix rivoluziona la prioritizzazione quotidiana suddividendo gli obiettivi complessi in micro-azioni ad alto impatto con Pomodoro timer.',
          requisiti: 'Browser moderno con supporto LocalStorage',
          specifichePiattaforma: 'Web Responsive, Offline Ready',
          schermate: [
            'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80'
          ],
          linkApp: 'https://taskflow-matrix.example.com',
          tags: ['Task', 'Eisenhower', 'Pomodoro'],
          dataAggiunta: '2026-03-14'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleAppPublished = (newApp: AppItem) => {
    setApps((prev) => [newApp, ...prev.filter((a) => String(a.id) !== String(newApp.id))]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-950/60">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                Portfolio Showroom
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 text-cyan-400 border border-slate-800">
                  GitHub Pages
                </span>
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Architettura Client-Side con Gemini AI & Commit REST API
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('vetrina')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'vetrina'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Vetrina Pubblica</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Pannello Admin</span>
            </button>

            <button
              onClick={() => setActiveTab('exporter')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'exporter'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Codice Standalone</span>
            </button>
          </div>

          {/* Quick Guide Trigger */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Guida GitHub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8">
        {activeTab === 'vetrina' && (
          <VetrinaView
            apps={apps}
            isLoading={isLoading}
            onOpenGuide={() => setIsGuideOpen(true)}
            onGoToAdmin={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView onAppPublished={handleAppPublished} />
        )}

        {activeTab === 'exporter' && <StaticFilesExporter />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sito Vetrina Portfolio 100% Statico — Compatibile con GitHub Pages</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guida Setup Repository</span>
            </button>
            <a
              href="admin.html"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Apri admin.html Standalone</span>
            </a>
          </div>
        </div>
      </footer>

      {/* GitHub Setup Guide Modal */}
      <GitHubGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
