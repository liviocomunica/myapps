import React, { useState, useEffect } from 'react';
import { AppItem, AdminCredentials } from '../types';
import { generateAppCardWithAI } from '../lib/gemini';
import { publishAppToGitHub } from '../lib/github';
import { 
  Key, 
  Github, 
  Sparkles, 
  Save, 
  Upload, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Layers, 
  Eye, 
  RefreshCw,
  ExternalLink,
  Smartphone,
  Info,
  Edit3
} from 'lucide-react';

interface AdminViewProps {
  onAppPublished?: (newApp: AppItem) => void;
}

const STORAGE_KEY = 'vetrina_admin_credentials_v1';

export const AdminView: React.FC<AdminViewProps> = ({ onAppPublished }) => {
  // Credentials state
  const [credentials, setCredentials] = useState<AdminCredentials>({
    geminiApiKey: '',
    githubToken: '',
    githubRepo: '',
    saveCredentials: true,
  });

  // Main input fields
  const [appUrl, setAppUrl] = useState('');
  const [extraContext, setExtraContext] = useState('');
  const [screen1, setScreen1] = useState('');
  const [screen2, setScreen2] = useState('');
  const [screen3, setScreen3] = useState('');

  // AI & Workflow State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<AppItem | null>(null);

  // Status banners
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Load saved credentials from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCredentials((prev) => ({
          ...prev,
          geminiApiKey: parsed.geminiApiKey || '',
          githubToken: parsed.githubToken || '',
          githubRepo: parsed.githubRepo || '',
          saveCredentials: true,
        }));
      }
    } catch (e) {
      console.error('Impossibile caricare credenziali locali:', e);
    }
  }, []);

  // Save credentials when updated if checkbox is checked
  const handleCredentialChange = (field: keyof AdminCredentials, value: any) => {
    setCredentials((prev) => {
      const updated = { ...prev, [field]: value };
      if (updated.saveCredentials) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            geminiApiKey: updated.geminiApiKey,
            githubToken: updated.githubToken,
            githubRepo: updated.githubRepo,
          })
        );
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      return updated;
    });
  };

  // Trigger AI Card Generation
  const handleGenerateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Inserisci un URL valido per la Web App prima di proseguire.',
      });
      return;
    }

    setIsGenerating(true);
    setStatusMessage({
      type: 'info',
      text: 'Generazione scheda con Gemini AI in corso...',
    });

    try {
      const customScreenshots = [screen1, screen2, screen3].filter((s) => s.trim() !== '');
      const appData = await generateAppCardWithAI(
        appUrl,
        customScreenshots,
        credentials.geminiApiKey,
        extraContext
      );

      setGeneratedApp(appData);
      setStatusMessage({
        type: 'success',
        text: 'Scheda generata con successo! Puoi verificare o modificare i campi sottostanti prima di pubblicare.',
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: `Errore durante la generazione: ${err.message || 'Verifica la tua API Key Gemini o la connessione.'}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle editable preview form fields
  const handleAppFieldChange = (field: keyof AppItem, value: any) => {
    if (!generatedApp) return;
    setGeneratedApp({
      ...generatedApp,
      [field]: value,
    });
  };

  // Publish directly to GitHub repository via REST API commit
  const handlePublishToGitHub = async () => {
    if (!generatedApp) return;

    if (!credentials.githubRepo.trim() || !credentials.githubToken.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Inserisci il GitHub Token (PAT) e il Repository (username/repo) per procedere con la pubblicazione.',
      });
      return;
    }

    setIsPublishing(true);
    setStatusMessage({
      type: 'info',
      text: 'Sincronizzazione e commit automatico su GitHub REST API in corso...',
    });

    try {
      const result = await publishAppToGitHub(
        credentials.githubRepo,
        credentials.githubToken,
        generatedApp
      );

      setStatusMessage({
        type: 'success',
        text: `${result.message} (File data/apps.json aggiornato con ${result.updatedAppsCount} app)`,
      });

      if (onAppPublished) {
        onAppPublished(generatedApp);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: `Errore di pubblicazione GitHub: ${err.message || 'Verifica di avere i permessi di scrittura sul repo.'}`,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Lock className="w-4 h-4" />
            <span>Pannello Amministrazione Integrato</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Generatore Schede & Publish Engine
          </h2>
        </div>
        <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Target Deployment: <span className="text-emerald-400 font-mono font-semibold">GitHub Pages</span>
        </div>
      </div>

      {/* Global Status Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-950/80 border-rose-800 text-rose-200'
              : 'bg-cyan-950/80 border-cyan-800 text-cyan-200'
          }`}
        >
          {statusMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
          {statusMessage.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
          {statusMessage.type === 'info' && <Loader2 className="w-5 h-5 shrink-0 mt-0.5 animate-spin" />}
          <div className="text-sm leading-relaxed">{statusMessage.text}</div>
        </div>
      )}

      {/* SECTION 1: Credentials Form */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            1. Configurazione Credenziali & Token API
          </h3>
          <span className="text-xs text-slate-400">Salvataggio Sicuro Client-Side</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <span>Gemini API Key</span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:underline text-[10px]"
              >
                (Ottieni Key)
              </a>
            </label>
            <input
              type="password"
              value={credentials.geminiApiKey}
              onChange={(e) => handleCredentialChange('geminiApiKey', e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* GitHub PAT */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <span>GitHub Token (PAT)</span>
              <a 
                href="https://github.com/settings/tokens" 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:underline text-[10px]"
              >
                (Crea PAT)
              </a>
            </label>
            <input
              type="password"
              value={credentials.githubToken}
              onChange={(e) => handleCredentialChange('githubToken', e.target.value)}
              placeholder="ghp_..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* GitHub Repository Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Nome Utente / Repo GitHub
            </label>
            <input
              type="text"
              value={credentials.githubRepo}
              onChange={(e) => handleCredentialChange('githubRepo', e.target.value)}
              placeholder="tuonome/tuo-repo"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* LocalStorage save checkbox */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="saveCreds"
            checked={credentials.saveCredentials}
            onChange={(e) => handleCredentialChange('saveCredentials', e.target.checked)}
            className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
          />
          <label htmlFor="saveCreds" className="text-xs text-slate-400 cursor-pointer select-none">
            Ricorda le mie credenziali nel <span className="text-slate-200 font-semibold">localStorage</span> del browser
          </label>
        </div>
      </div>

      {/* SECTION 2: App Submission & AI Generator Form */}
      <form onSubmit={handleGenerateCard} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800/80 pb-3">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            2. Inserimento App & Generazione IA
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Fornisci l'URL della Web App. Gemini analizzerà l'applicativo e genererà titolo, descrizioni, tag e requisiti.
          </p>
        </div>

        <div className="space-y-4">
          {/* Main URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <span>URL della Web App</span> <span className="text-rose-400">*</span>
            </label>
            <input
              type="url"
              required
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              placeholder="https://mia-app.example.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Optional Extra Context */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Note/Contesto Aggiuntivo (Opzionale)
            </label>
            <input
              type="text"
              value={extraContext}
              onChange={(e) => setExtraContext(e.target.value)}
              placeholder="es. Piattaforma per ingegneria di prompt con IA per sviluppatori"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Optional Custom Screenshots */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Link Schermate/Anteprime (Opzionali - verranno usati placeholder se vuoti)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="url"
                value={screen1}
                onChange={(e) => setScreen1(e.target.value)}
                placeholder="https://.../schermata1.jpg"
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600"
              />
              <input
                type="url"
                value={screen2}
                onChange={(e) => setScreen2(e.target.value)}
                placeholder="https://.../schermata2.jpg"
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600"
              />
              <input
                type="url"
                value={screen3}
                onChange={(e) => setScreen3(e.target.value)}
                placeholder="https://.../schermata3.jpg"
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-600"
              />
            </div>
          </div>

          {/* Disabled APK / Native iOS Upload Section with "In Arrivo" badge */}
          <div className="relative p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 opacity-60 pointer-events-none space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-slate-500" />
                Carica file APK Android / Build iOS
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-950 text-amber-400 border border-amber-800">
                In Arrivo
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Supporto per la memorizzazione e distribuzione diretta di eseguibili nativi (modulo di futura release).
            </p>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-950/50 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analisi in corso con Gemini IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Genera Scheda con IA</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* SECTION 3: Preview & Manual Edit + Publish to GitHub */}
      {generatedApp && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-cyan-400" />
              3. Anteprima & Modifica Manuale
            </h3>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
              Dati Pronti per Commit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Nome App</label>
              <input
                type="text"
                value={generatedApp.nome}
                onChange={(e) => handleAppFieldChange('nome', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
              />
            </div>

            {/* Categoria */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Categoria</label>
              <input
                type="text"
                value={generatedApp.categoria}
                onChange={(e) => handleAppFieldChange('categoria', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
              />
            </div>

            {/* Tipologia */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Tipologia</label>
              <input
                type="text"
                value={generatedApp.tipologia}
                onChange={(e) => handleAppFieldChange('tipologia', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
              />
            </div>

            {/* Link App */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Link Web App</label>
              <input
                type="text"
                value={generatedApp.linkApp}
                onChange={(e) => handleAppFieldChange('linkApp', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono"
              />
            </div>

            {/* Descrizione Breve */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-400">Descrizione Breve (max 120 caratteri)</label>
              <input
                type="text"
                maxLength={140}
                value={generatedApp.descrizioneBreve}
                onChange={(e) => handleAppFieldChange('descrizioneBreve', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
              />
            </div>

            {/* Descrizione Dettagliata */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-400">Descrizione Dettagliata</label>
              <textarea
                rows={3}
                value={generatedApp.descrizioneDettagliata}
                onChange={(e) => handleAppFieldChange('descrizioneDettagliata', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
              />
            </div>

            {/* Requisiti */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Requisiti di Sistema</label>
              <input
                type="text"
                value={generatedApp.requisiti}
                onChange={(e) => handleAppFieldChange('requisiti', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
              />
            </div>

            {/* Specifiche Piattaforma */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Specifiche Piattaforma</label>
              <input
                type="text"
                value={generatedApp.specifichePiattaforma}
                onChange={(e) => handleAppFieldChange('specifichePiattaforma', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
              />
            </div>
          </div>

          {/* GitHub Publish Action */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Github className="w-4 h-4 text-slate-300" />
              <span>Commit automatico sul file <code className="text-cyan-400 font-mono">data/apps.json</code></span>
            </div>

            <button
              onClick={handlePublishToGitHub}
              disabled={isPublishing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Invio Commit a GitHub...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Pubblica su GitHub</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
