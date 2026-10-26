// Camada de persistência: tudo fica no próprio repositório GitHub (API REST de contents).
// Leitura é pública; escrita usa o token pessoal que cada membro informa (salvo só no navegador dele).
const GH = (() => {
  const API = 'https://api.github.com';
  const cfg = window.GESTOR_CONFIG || {};
  const TOKEN_KEY = 'raidens-gestor-token';

  function detectRepo() {
    if (cfg.owner && cfg.repo) return { owner: cfg.owner, repo: cfg.repo };
    const host = location.hostname;
    const m = host.match(/^([^.]+)\.github\.io$/i);
    if (!m) return { owner: cfg.owner || '', repo: cfg.repo || '' };
    const seg = location.pathname.split('/').filter(Boolean)[0];
    return { owner: m[1], repo: seg || host };
  }

  const repo = { ...detectRepo(), branch: cfg.dataBranch || 'dados' };

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
  }
  function setToken(t) {
    try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {}
  }

  async function req(path, { method = 'GET', body, accept, auth = true } = {}) {
    const headers = { Accept: accept || 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    const token = getToken();
    if (auth && token) headers.Authorization = `Bearer ${token}`;
    if (body) headers['Content-Type'] = 'application/json';
    const res = await fetch(path.startsWith('http') ? path : API + path, {
      method, headers, body: body ? JSON.stringify(body) : undefined, cache: 'no-store'
    });
    if (!res.ok) {
      let msg = res.statusText;
      try { msg = (await res.json()).message || msg; } catch {}
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return res;
  }

  const contentsUrl = (p) => `/repos/${repo.owner}/${repo.repo}/contents/${p.split('/').map(encodeURIComponent).join('/')}`;

  function utf8ToB64(str) {
    const bytes = new TextEncoder().encode(str);
    return bytesToB64(bytes);
  }
  function bytesToB64(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function b64ToUtf8(b64) {
    const bin = atob(b64.replace(/\n/g, ''));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  // Lê um JSON do branch de dados. Retorna { data, sha } (data = null se não existir).
  async function getJSON(path) {
    try {
      const res = await req(`${contentsUrl(path)}?ref=${encodeURIComponent(repo.branch)}`);
      const meta = await res.json();
      let text;
      if (meta.content && meta.encoding === 'base64') text = b64ToUtf8(meta.content);
      else text = await (await req(`${contentsUrl(path)}?ref=${encodeURIComponent(repo.branch)}`, { accept: 'application/vnd.github.raw+json' })).text();
      return { data: JSON.parse(text), sha: meta.sha };
    } catch (e) {
      if (e.status === 404) return { data: null, sha: null };
      // Sem token e sem cota da API: cai para o raw (cache de alguns minutos).
      if (!getToken() && (e.status === 403 || e.status === 429)) {
        const r = await fetch(rawUrl(path) + `?t=${Date.now()}`);
        if (r.status === 404) return { data: null, sha: null };
        if (!r.ok) throw e;
        return { data: await r.json(), sha: null };
      }
      throw e;
    }
  }

  async function putFile(path, base64, message, sha) {
    const body = { message, content: base64, branch: repo.branch };
    if (sha) body.sha = sha;
    const res = await req(contentsUrl(path), { method: 'PUT', body });
    return res.json();
  }

  async function getSha(path) {
    const res = await req(`${contentsUrl(path)}?ref=${encodeURIComponent(repo.branch)}`);
    return (await res.json()).sha;
  }

  async function deleteFile(path, message) {
    let sha;
    try { sha = await getSha(path); } catch (e) { if (e.status === 404) return; throw e; }
    await req(contentsUrl(path), { method: 'DELETE', body: { message, sha, branch: repo.branch } });
  }

  async function getBlob(path) {
    const res = await req(`${contentsUrl(path)}?ref=${encodeURIComponent(repo.branch)}`, { accept: 'application/vnd.github.raw+json' });
    return res.blob();
  }

  function rawUrl(path) {
    return `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${encodeURIComponent(repo.branch)}/${path.split('/').map(encodeURIComponent).join('/')}`;
  }

  // Cria o branch de dados a partir do branch padrão, se ainda não existir.
  async function ensureBranch() {
    try {
      await req(`/repos/${repo.owner}/${repo.repo}/branches/${encodeURIComponent(repo.branch)}`);
      return;
    } catch (e) { if (e.status !== 404) throw e; }
    const info = await (await req(`/repos/${repo.owner}/${repo.repo}`)).json();
    const base = await (await req(`/repos/${repo.owner}/${repo.repo}/git/ref/heads/${encodeURIComponent(info.default_branch)}`)).json();
    await req(`/repos/${repo.owner}/${repo.repo}/git/refs`, { method: 'POST', body: { ref: `refs/heads/${repo.branch}`, sha: base.object.sha } });
  }

  // Valida o token: retorna o usuário e se ele pode escrever no repositório.
  async function verify(token) {
    const headers = { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}` };
    const u = await fetch(`${API}/user`, { headers, cache: 'no-store' });
    if (!u.ok) throw new Error('Token inválido ou expirado.');
    const user = await u.json();
    const r = await fetch(`${API}/repos/${repo.owner}/${repo.repo}`, { headers, cache: 'no-store' });
    if (!r.ok) throw new Error(`Este token não tem acesso a ${repo.owner}/${repo.repo}.`);
    const info = await r.json();
    if (!info.permissions || !info.permissions.push) throw new Error('Este token só tem leitura. Ele precisa de permissão de escrita (Contents: Read and write).');
    return { login: user.login, name: user.name || user.login, avatar: user.avatar_url };
  }

  return { repo, getToken, setToken, getJSON, putFile, deleteFile, getBlob, rawUrl, ensureBranch, verify, utf8ToB64, bytesToB64 };
})();
