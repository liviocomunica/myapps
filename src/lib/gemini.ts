import { AppItem } from '../types';

export async function generateAppCardWithAI(
  appUrl: string,
  screenshots: string[],
  apiKey?: string,
  extraContext?: string
): Promise<AppItem> {
  const cleanUrl = appUrl.trim();
  let domain = '';
  try {
    const parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
    domain = parsed.hostname.replace(/^www\./, '');
  } catch {
    domain = cleanUrl;
  }

  // Fallback / default screenshots if empty
  const defaultScreenshots = [
    screenshots[0] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    screenshots[1] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    screenshots[2] || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
  ];

  const systemPrompt = `Sei un esperto Product Manager e Software Architect. 
Dato l'URL di una Web App e un eventuale contesto, genera una scheda dettagliata in formato JSON rigoroso per un portfolio showcase tecnologico.
Il JSON deve avere ESATTAMENTE questa struttura:
{
  "nome": "Nome accattivante e professionale dell'app",
  "categoria": "Una tra: Produttività, AI Tools, Creatività, Developer, SaaS, Utility, Educational, Finance, Health, Entertainment",
  "tipologia": "Una tra: SaaS, Micro-tool, Prompt Interface, Web Utility, PWA, Dashboard, API Client",
  "descrizioneBreve": "Massimo 120 caratteri. Sintetica, chiara, ad alto impatto.",
  "descrizioneDettagliata": "Spiegazione approfondita delle feature principali, casi d'uso e valore per l'utente (2-4 paragrafi scorrevoli).",
  "requisiti": "es. Browser moderno (Chrome, Edge, Safari, Firefox), Connessione Internet, Account opzionale",
  "specifichePiattaforma": "es. Web Desktop & Mobile, 100% Client-Side, PWA Ready, Ottimizzato per schermi touch e desktop",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
}
Rispondi SOLO con il blocco JSON valido, senza markdown superfluo o testo introduttivo.`;

  const userPrompt = `Analizza questa Web App:
URL: ${cleanUrl} (Dominio stimato: ${domain})
${extraContext ? `Note/Contesto aggiuntivo: ${extraContext}` : ''}
Genera i metadati dell'applicazione in italiano professionale.`;

  if (apiKey && apiKey.trim()) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Errore Gemini API (${response.status}): ${errText}`);
      }

      const resData = await response.json();
      const rawJson = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Clean possible markdown wrappers if present
      const cleanedJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);

      return {
        id: Date.now().toString(),
        nome: parsed.nome || domain,
        categoria: parsed.categoria || 'AI Tools',
        tipologia: parsed.tipologia || 'SaaS',
        descrizioneBreve: (parsed.descrizioneBreve || 'Innovativa applicazione web moderna.').slice(0, 140),
        descrizioneDettagliata: parsed.descrizioneDettagliata || 'Applicazione web ad alte prestazioni progettata con standard moderni.',
        requisiti: parsed.requisiti || 'Browser moderno, connessione internet',
        specifichePiattaforma: parsed.specifichePiattaforma || 'Web Responsive Desktop & Mobile',
        schermate: defaultScreenshots,
        linkApp: cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`,
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['Web App', 'Tech'],
        dataAggiunta: new Date().toISOString().split('T')[0],
      };
    } catch (err: any) {
      console.warn('Errore durante la chiamata Gemini API remota, uso fallback euristico:', err);
      throw new Error(err.message || 'Errore generazione con Gemini API');
    }
  }

  // Smart Heuristic Fallback if API Key not provided (or for offline simulation)
  const inferredName = domain.split('.')[0]
    ? domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
    : 'Modern Web App';

  return {
    id: Date.now().toString(),
    nome: inferredName,
    categoria: domain.includes('ai') ? 'AI Tools' : domain.includes('dev') ? 'Developer' : 'Produttività',
    tipologia: 'Web Utility',
    descrizioneBreve: `Piattaforma moderna per ${inferredName} con interfaccia reattiva e strumenti dedicati.`,
    descrizioneDettagliata: `${inferredName} è un'applicazione web moderna accessibile da qualsiasi browser. Offre un'esperienza d'uso fluida, ottimizzata sia per dispositivi mobili che desktop, con architettura leggera e orientata alla massima produttività.`,
    requisiti: 'Browser moderno (Chrome, Edge, Firefox, Safari), Connessione Internet attiva',
    specifichePiattaforma: 'Web Desktop & Mobile, Architettura Client-Side, Responsive UI',
    schermate: defaultScreenshots,
    linkApp: cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`,
    tags: [inferredName, 'Web App', 'Produttività', 'Cloud'],
    dataAggiunta: new Date().toISOString().split('T')[0],
  };
}
