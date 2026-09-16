import { AppItem } from '../types';

// Helper for UTF-8 Base64 encoding
function utf8ToBase64(str: string): string {
  return window.btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(_match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

// Helper for UTF-8 Base64 decoding
function base64ToUtf8(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(window.atob(str), function (c: string) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

export interface GitHubCommitResult {
  success: boolean;
  message: string;
  commitSha?: string;
  updatedAppsCount: number;
}

export async function fetchAppsFromGitHub(
  repoFullName: string,
  token?: string,
  filePath = 'data/apps.json'
): Promise<{ apps: AppItem[]; sha?: string }> {
  const cleanRepo = repoFullName.trim().replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '');
  const [owner, repo] = cleanRepo.split('/');
  
  if (!owner || !repo) {
    throw new Error('Formato repository non valido. Usa "username/repo" (es. octocat/my-portfolio).');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token && token.trim()) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  const res = await fetch(url, { headers });

  if (res.status === 404) {
    // File doesn't exist yet
    return { apps: [], sha: undefined };
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Errore GitHub API (${res.status}) durante il download di ${filePath}`);
  }

  const data = await res.json();
  if (!data.content) {
    return { apps: [], sha: data.sha };
  }

  const rawJson = base64ToUtf8(data.content.replace(/\n/g, ''));
  const parsed = JSON.parse(rawJson);
  const apps: AppItem[] = Array.isArray(parsed) ? parsed : [];

  return { apps, sha: data.sha };
}

export async function publishAppToGitHub(
  repoFullName: string,
  token: string,
  newApp: AppItem,
  filePath = 'data/apps.json'
): Promise<GitHubCommitResult> {
  const cleanRepo = repoFullName.trim().replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '');
  const [owner, repo] = cleanRepo.split('/');

  if (!owner || !repo) {
    throw new Error('Formato repository non valido. Usa "nomeutente/nome-repo".');
  }

  if (!token || !token.trim()) {
    throw new Error('GitHub Personal Access Token (PAT) mancante. Inseriscilo nelle impostazioni admin.');
  }

  // 1. Fetch current file to get SHA and existing data
  const { apps: existingApps, sha } = await fetchAppsFromGitHub(repoFullName, token, filePath);

  // 2. Prepend new app to array (or replace if existing by ID)
  const filtered = existingApps.filter((a) => String(a.id) !== String(newApp.id));
  const updatedApps = [newApp, ...filtered];

  // 3. Encode content to Base64
  const jsonString = JSON.stringify(updatedApps, null, 2);
  const contentBase64 = utf8ToBase64(jsonString);

  // 4. PUT commit to GitHub REST API
  const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const commitMessage = `feat(portfolio): aggiunta nuova app "${newApp.nome}" [skip ci]`;

  const payload: Record<string, any> = {
    message: commitMessage,
    content: contentBase64,
  };

  if (sha) {
    payload.sha = sha;
  }

  const putRes = await fetch(putUrl, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${token.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!putRes.ok) {
    const errObj = await putRes.json().catch(() => ({}));
    throw new Error(errObj.message || `Errore durante il commit su GitHub (${putRes.status}). Verifica i permessi del token.`);
  }

  const commitData = await putRes.json();
  const commitSha = commitData.commit?.sha || commitData.content?.sha;

  return {
    success: true,
    message: 'App pubblicata con successo! GitHub Pages aggiornerà la vetrina entro 1-2 minuti.',
    commitSha,
    updatedAppsCount: updatedApps.length,
  };
}
