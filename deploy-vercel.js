import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_NAME = 'marleine-koula-hair';
const DIST_DIR = './dist';
const API_BASE = 'https://api.vercel.com';

if (!TOKEN) {
  console.error('Erreur : VERCEL_TOKEN n\'est pas défini.');
  console.error('Utilisez : VERCEL_TOKEN=votre_token node deploy-vercel.js');
  process.exit(1);
}

function getAllFiles(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.posix.join(base, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, relPath));
    } else {
      files.push(relPath);
    }
  }
  return files;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...options.headers,
    },
  });
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function uploadFile(filePath, sha, size) {
  const content = fs.readFileSync(path.join(DIST_DIR, filePath));
  const uploadUrl = `${API_BASE}/v2/files`;
  return apiRequest(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(size),
      'x-vercel-digest': sha,
    },
    body: content,
  });
}

async function deploy() {
  const files = getAllFiles(DIST_DIR);
  console.log(`Found ${files.length} files to deploy`);

  const fileList = files.map((file) => {
    const content = fs.readFileSync(path.join(DIST_DIR, file));
    const sha = crypto.createHash('sha1').update(content).digest('hex');
    return { file, sha, size: content.length, content };
  });

  // Upload files
  for (const item of fileList) {
    process.stdout.write(`Uploading ${item.file} (${item.size} bytes)... `);
    await uploadFile(item.file, item.sha, item.size);
    console.log('OK');
  }

  // Create deployment
  const deploymentPayload = {
    name: PROJECT_NAME,
    files: fileList.map(({ file, sha, size }) => ({ file, sha, size })),
    target: 'production',
    projectSettings: {
      framework: null,
      buildCommand: null,
      outputDirectory: '.',
      installCommand: null,
    },
  };

  console.log('Creating deployment...');
  const deployment = await apiRequest(`${API_BASE}/v13/deployments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deploymentPayload),
  });

  console.log('\nDeployment created!');
  console.log('URL:', deployment.url);
  console.log('ID:', deployment.id);
  console.log('State:', deployment.readyState);
}

deploy().catch((err) => {
  console.error('Deployment failed:', err.message);
  process.exit(1);
});
