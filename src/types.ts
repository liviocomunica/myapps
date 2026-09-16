export interface AppItem {
  id: string | number;
  nome: string;
  categoria: string;
  tipologia: string;
  descrizioneBreve: string;
  descrizioneDettagliata: string;
  requisiti: string;
  specifichePiattaforma: string;
  schermate: string[];
  linkApp: string;
  tags?: string[];
  dataAggiunta?: string;
}

export interface AdminCredentials {
  geminiApiKey: string;
  githubToken: string;
  githubRepo: string; // formato: "username/repo"
  saveCredentials: boolean;
}
