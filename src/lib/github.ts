const GITHUB_API = 'https://api.github.com';
const REPO_OWNER_PLACEHOLDER = 'OWNER';
const REPO_NAME = 'marleine-koula-hair-data';
const DATA_PATH = 'site-data.json';

function getHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export function getRepoName(): string {
  return REPO_NAME;
}

export function getDataRawUrl(owner: string): string {
  return `https://raw.githubusercontent.com/${owner}/${REPO_NAME}/main/${DATA_PATH}`;
}

export async function getAuthenticatedUser(token: string): Promise<{ login: string; id: number } | null> {
  try {
    const res = await fetch(`${GITHUB_API}/user`, { headers: getHeaders(token) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function ensureRepoExists(token: string, owner: string): Promise<boolean> {
  const checkRes = await fetch(`${GITHUB_API}/repos/${owner}/${REPO_NAME}`, {
    headers: getHeaders(token),
  });

  if (checkRes.status === 200) return true;

  // Create repo
  const createRes = await fetch(`${GITHUB_API}/user/repos`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({
      name: REPO_NAME,
      description: 'Données et médias du site Marleine Koula Hair',
      private: false,
      auto_init: true,
    }),
  });

  return createRes.ok;
}

export async function getFileSha(token: string, owner: string, path: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${REPO_NAME}/contents/${path}`, {
      headers: getHeaders(token),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.sha || null;
  } catch {
    return null;
  }
}

export async function uploadFileToGitHub(
  token: string,
  owner: string,
  path: string,
  content: string | ArrayBuffer,
  message: string
): Promise<string> {
  await ensureRepoExists(token, owner);

  const isBase64 = typeof content === 'string';
  const base64Content = isBase64 ? content : arrayBufferToBase64(content);
  const sha = await getFileSha(token, owner, path);

  const body: Record<string, string> = {
    message,
    content: base64Content,
    branch: 'main',
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${GITHUB_API}/repos/${owner}/${REPO_NAME}/contents/${path}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub upload error: ${err}`);
  }

  const data = await res.json();
  return data.content.download_url;
}

export async function uploadBlobFile(
  token: string,
  owner: string,
  file: File,
  folder: string
): Promise<string> {
  await ensureRepoExists(token, owner);
  const path = `${folder}/${Date.now()}-${file.name}`;
  const buffer = await file.arrayBuffer();
  const url = await uploadFileToGitHub(token, owner, path, buffer, `Upload ${file.name}`);
  return url;
}

export async function fetchSiteDataFromGitHub(owner: string): Promise<any | null> {
  try {
    const res = await fetch(getDataRawUrl(owner), { cache: 'no-cache' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveSiteDataToGitHub(token: string, owner: string, data: any): Promise<void> {
  await ensureRepoExists(token, owner);
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
  await uploadFileToGitHub(token, owner, DATA_PATH, content, 'Mise à jour des données du site');
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
