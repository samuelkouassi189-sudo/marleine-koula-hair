const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || '';
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || '';
const DATA_FILE = 'site-data.json';

export function isGitHubConfigured(): boolean {
  return Boolean(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);
}

export async function loadSiteDataFromGitHub(): Promise<any | null> {
  if (!isGitHubConfigured()) return null;

  try {
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${DATA_FILE}?t=${Date.now()}`;
    const response = await fetch(rawUrl);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error('GitHub load error:', err);
    return null;
  }
}

export async function saveSiteDataToGitHub(data: any): Promise<void> {
  if (!isGitHubConfigured()) {
    throw new Error('GitHub n\'est pas configuré. Vérifiez le fichier .env.');
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_FILE}`;
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

  // Get current file SHA if it exists
  let sha: string | undefined;
  try {
    const getResponse = await fetch(apiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }
  } catch {
    // File might not exist yet
  }

  const body: Record<string, string> = {
    message: 'Mise à jour des données du site via admin',
    content,
  };
  if (sha) body.sha = sha;

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la sauvegarde sur GitHub');
  }
}

export async function uploadFileToGitHub(file: File, folder: string): Promise<string> {
  if (!isGitHubConfigured()) {
    throw new Error('GitHub n\'est pas configuré.');
  }

  // Pour les fichiers, on les encode en base64 et on les stocke dans le repo
  const path = `assets/${folder}/${Date.now()}-${file.name}`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Upload ${file.name}`,
      content: base64,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de l\'upload sur GitHub');
  }

  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${path}`;
}
