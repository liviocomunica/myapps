import React from 'react';
import { X, Github, CheckCircle, Terminal, Globe, Key, FileCode } from 'lucide-react';

interface GitHubGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubGuideModal: React.FC<GitHubGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <Github className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">Guida Configurazione GitHub Pages & REST API</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm leading-relaxed text-slate-300">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 text-xs">1</span>
              <span>Creazione del Repository su GitHub</span>
            </div>
            <p>
              Crea un nuovo repository (pubblico o privato) su GitHub dal tuo account (es. <code className="text-cyan-300 font-mono">nomeutente/mio-portfolio</code>).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-950 border border-purple-800 text-xs">2</span>
              <span>Struttura dei File nel Repo</span>
            </div>
            <p>
              Carica i file del sito nella radice (root) del repository, inclusa la cartella dei dati:
            </p>
            <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-slate-400 space-y-1">
              <div>├── index.html <span className="text-slate-500">(Vetrina pubblica)</span></div>
              <div>├── admin.html <span className="text-slate-500">(Pannello Admin)</span></div>
              <div>└── data/</div>
              <div>    └── apps.json <span className="text-slate-500">(File JSON iniziale)</span></div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 text-xs">3</span>
              <span>Generazione del GitHub Personal Access Token (PAT)</span>
            </div>
            <p>
              Per consentire al Pannello Admin di pubblicare le nuove schede aggiornando automaticamente il file <code className="text-emerald-300 font-mono">data/apps.json</code>:
            </p>
            <ol className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
              <li>Vai su GitHub → <strong>Settings</strong> → <strong>Developer Settings</strong> → <strong>Personal access tokens</strong> (Fine-grained o Tokens classic).</li>
              <li>Crea un nuovo Token con scope di scrittura sui contenuti (<code className="text-slate-200">repo</code> o <code className="text-slate-200">contents: read & write</code>).</li>
              <li>Copia il token generato e incollalo nel campo <strong>GitHub Token (PAT)</strong> del Pannello Admin.</li>
            </ol>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-950 border border-amber-800 text-xs">4</span>
              <span>Attivazione di GitHub Pages</span>
            </div>
            <p>
              Vai nelle <strong>Settings</strong> del repository → sezione <strong>Pages</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 pl-2">
              <li>Source: seleziona <strong>Deploy from a branch</strong>.</li>
              <li>Branch: scegli <strong>main</strong> (o master) e cartella <strong>/ (root)</strong>.</li>
              <li>Clicca su <strong>Save</strong>. Il tuo sito sarà visibile su: <code className="text-amber-300 font-mono">https://nomeutente.github.io/mio-portfolio/</code></li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Ho Capito, Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
