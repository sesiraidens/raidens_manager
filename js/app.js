// Gestor RAIDENS — projetos, documentação, anexos, evolução e checklist.
(() => {
  const cfg = window.GESTOR_CONFIG;
  const NAME_KEY = 'raidens-gestor-nome';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const main = $('#main');

  // ---------- Utilidades ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const now = () => new Date().toISOString();
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} }
  };
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
  function ago(iso) {
    if (!iso) return '';
    const s = (new Date(iso) - Date.now()) / 1000;
    const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [u, sec] of units) if (Math.abs(s) >= sec) return rtf.format(Math.round(s / sec), u);
    return 'agora';
  }
  const fmtDate = (iso) => iso ? new Date(iso.length === 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  const fmtDateTime = (iso) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtSize = (b) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;
  const ext = (n) => (n.split('.').pop() || '').slice(0, 4);
  const isImage = (n) => /\.(png|jpe?g|gif|webp|svg)$/i.test(n);
  const safeName = (n) => n.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w.\-]+/g, '_').slice(-80);

  const I = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkSq: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    trash: '<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    key: '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    clip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

  const STATUS = {
    planejamento: { label: 'Planejamento', cls: 'badge-gray' },
    andamento: { label: 'Em andamento', cls: 'badge-red' },
    pausado: { label: 'Pausado', cls: 'badge-warning' },
    concluido: { label: 'Concluído', cls: 'badge-success' }
  };
  const DOC_STATUS = { rascunho: 'Rascunho', revisao: 'Em revisão', final: 'Finalizado' };
  const PRIO = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
  const statusBadge = (s) => { const st = STATUS[s] || STATUS.planejamento; return `<span class="badge ${st.cls}">${st.label}</span>`; };

  function ring(pct, size = 64, stroke = 6) {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r;
    return `<div class="ring ${pct === 100 ? 'done' : ''}" style="--size:${size}px" role="img" aria-label="${pct}% concluído">
      <svg viewBox="0 0 ${size} ${size}"><circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}"/>
      <circle class="ring-fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-width="${stroke}" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c * (1 - pct / 100)).toFixed(2)}"/></svg>
      <span>${pct}<small>%</small></span></div>`;
  }

  // ---------- Estado ----------
  const state = {
    db: null,
    name: store.get(NAME_KEY) || (window.GESTOR_LOCAL && window.GESTOR_LOCAL.nome) || '',
    q: '', status: '', sort: 'recent',
    checkFilter: 'pendentes',
    editing: null,       // id do tópico em edição
    saving: false,
    lastLoad: 0,
    branchReady: false
  };
  const canEdit = () => !!GH.getToken();
  const emptyDb = () => ({ version: 1, projects: [], updatedAt: now() });
  const getProject = (id) => state.db.projects.find((p) => p.id === id);
  const progress = (p) => {
    const total = p.checklist.length;
    const done = p.checklist.filter((c) => c.done).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  };
  const normalize = (p) => Object.assign({ description: '', status: 'planejamento', owner: '', due: '', tags: [], topics: [], checklist: [], files: [], timeline: [] }, p);

  // ---------- Feedback ----------
  function toast(msg, err = false) {
    const t = document.createElement('div');
    t.className = 'toast' + (err ? ' err' : '');
    t.innerHTML = icon(err ? 'x' : 'check', 'icon-sm') + `<span>${esc(msg)}</span>`;
    $('#toasts').append(t);
    setTimeout(() => t.remove(), err ? 6000 : 3000);
  }
  function setSync(kind) {
    const el = $('#sync');
    if (kind === 'saving') el.innerHTML = `<span class="spinner" style="width:14px;height:14px"></span><span class="sync-text">Salvando no GitHub…</span>`;
    else if (kind === 'ok') el.innerHTML = `${icon('cloud', 'icon-sm')}<span class="sync-text">Salvo ${ago(state.db?.updatedAt)}</span>`;
    else el.innerHTML = '';
  }

  // ---------- Persistência ----------
  async function load(silent = false) {
    try {
      const { data } = await GH.getJSON(cfg.dbPath);
      state.db = data || emptyDb();
      state.db.projects = (state.db.projects || []).map(normalize);
      state.lastLoad = Date.now();
      if (canEdit()) setSync('ok');
      if (!silent || !state.editing) render();
    } catch (e) {
      if (silent) return;
      main.innerHTML = `<div class="empty" style="margin-top:48px">${icon('x')}<h3>Não foi possível carregar os dados</h3><p>${esc(e.message)}</p>
        <p class="small" style="margin-top:8px">Repositório: <code>${esc(GH.repo.owner)}/${esc(GH.repo.repo)}</code>, branch <code>${esc(GH.repo.branch)}</code></p>
        <button class="btn btn-primary" onclick="location.reload()">${icon('refresh')}Tentar de novo</button></div>`;
    }
  }

  // Aplica uma alteração sobre a versão mais recente do banco e grava. Repete se outra pessoa salvou ao mesmo tempo.
  async function mutate(fn, message) {
    if (!canEdit()) { openSetup(); return false; }
    state.saving = true;
    setSync('saving');
    try {
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data, sha } = await GH.getJSON(cfg.dbPath);
        const db = data || emptyDb();
        db.projects = (db.projects || []).map(normalize);
        const result = fn(db);
        if (result === false) return false;
        db.updatedAt = now();
        try {
          if (!state.branchReady) { await GH.ensureBranch(); state.branchReady = true; }
          await GH.putFile(cfg.dbPath, GH.utf8ToB64(JSON.stringify(db, null, 2)), `${message} (${by()})`, sha);
          state.db = db;
          render();
          return true;
        } catch (e) {
          if (e.status === 409 || (e.status === 422 && /sha/i.test(e.message))) continue;
          if (e.status === 401) { GH.setToken(''); renderName(); throw new Error('O token expirou. Configure o acesso de novo.'); }
          throw e;
        }
      }
      throw new Error('Muitas edições simultâneas. Tente de novo.');
    } catch (e) {
      toast(e.message || 'Erro ao salvar.', true);
      return false;
    } finally {
      state.saving = false;
      setSync(canEdit() ? 'ok' : '');
    }
  }

  const by = () => state.name || 'Equipe';
  function log(p, kind, title, body = '') {
    p.timeline.unshift({ id: uid(), kind, title, body, at: now(), by: by() });
  }
  function touch(p) { p.updatedAt = now(); }

  // ---------- Modal ----------
  const modal = $('#modal');
  let modalHandler = null;
  function openModal({ title, body, submit = 'Salvar', danger = false, onSubmit, onOpen }) {
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = body;
    const btn = $('#modal-submit');
    btn.textContent = submit;
    btn.className = 'btn ' + (danger ? 'btn-danger' : 'btn-primary');
    btn.disabled = false;
    modalHandler = onSubmit;
    modal.showModal();
    onOpen?.($('#modal-body'));
    const first = $('#modal-body input, #modal-body textarea, #modal-body select');
    if (first) first.focus();
  }
  $('#modal-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (!modalHandler) return modal.close();
    const btn = $('#modal-submit');
    const errEl = $('#modal-body .error-text');
    if (errEl) errEl.remove();
    btn.disabled = true;
    const original = btn.textContent;
    btn.innerHTML = `<span class="spinner" style="width:16px;height:16px;border-top-color:currentColor"></span> ${esc(original)}`;
    try {
      const keep = await modalHandler(new FormData(ev.target), ev.target);
      if (keep !== false) modal.close();
    } catch (e) {
      $('#modal-body').insertAdjacentHTML('beforeend', `<p class="error-text">${esc(e.message)}</p>`);
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => modal.close()));
  $('.modal-head [data-close]').innerHTML = icon('x');

  function confirmModal(title, text, onYes, submit = 'Excluir') {
    openModal({ title, body: `<p>${text}</p>`, submit, danger: true, onSubmit: onYes });
  }

  // ---------- Acesso de edição e identificação ----------
  function openSetup() {
    const tokenUrl = 'https://github.com/settings/personal-access-tokens/new';
    openModal({
      title: 'Liberar edição',
      submit: 'Liberar edição',
      body: `<p class="small muted" style="margin-bottom:16px">Qualquer pessoa pode ver os projetos. Para criar e editar, cole uma vez um token do GitHub: ele fica guardado só neste navegador e não é pedido de novo.</p>
        <details class="howto"><summary>Como gerar o token (1 minuto)</summary>
          <ol><li>Abra <a href="${tokenUrl}" target="_blank" rel="noopener">Fine-grained tokens</a> e clique em <b>Generate new token</b>.</li>
          <li>Em <i>Resource owner</i>, escolha <b>sesiraidens</b>.</li>
          <li>Em <i>Repository access</i> → <b>Only select repositories</b> → <b>${esc(GH.repo.repo)}</b>.</li>
          <li>Em <i>Permissions → Repository permissions → Contents</i>, marque <b>Read and write</b>.</li>
          <li>Gere, copie e cole abaixo.</li></ol></details>
        <div class="field"><label for="tk">Token do GitHub <span class="req">*</span></label>
          <input class="input" id="tk" name="token" type="password" autocomplete="off" required placeholder="github_pat_… ou ghp_…"></div>
        <div class="field" style="margin-bottom:0"><label for="nm">Seu nome</label>
          <input class="input" id="nm" name="nome" maxlength="40" value="${esc(state.name)}" placeholder="Aparece no histórico">
          <p class="hint">Se deixar em branco, usamos o seu usuário do GitHub.</p></div>`,
      async onSubmit(fd) {
        const token = String(fd.get('token')).trim();
        const login = await GH.verify(token);
        GH.setToken(token);
        state.name = String(fd.get('nome') || '').trim() || login;
        store.set(NAME_KEY, state.name);
        renderName();
        toast('Edição liberada neste navegador.');
        await load();
      }
    });
  }
  function askName() {
    openModal({
      title: 'Como você quer aparecer?',
      submit: 'Salvar',
      body: `<div class="field"><label for="nm">Seu nome <span class="req">*</span></label><input class="input" id="nm" name="nome" required maxlength="40" value="${esc(state.name)}" placeholder="Ex.: Ana"><p class="hint">Aparece no histórico de evolução e nos itens concluídos. Fica salvo neste navegador.</p></div>`,
      onSubmit(fd) { state.name = String(fd.get('nome')).trim(); store.set(NAME_KEY, state.name); renderName(); }
    });
  }
  function renderName() {
    const b = $('#name-btn');
    if (!canEdit()) {
      b.innerHTML = `${icon('key', 'icon-sm')}<span class="auth-label">Liberar edição</span>`;
      b.classList.add('btn-chip-plain');
      b.onclick = openSetup;
      return;
    }
    b.classList.remove('btn-chip-plain');
    b.innerHTML = `<span class="avatar-initial">${esc((state.name || '?').charAt(0).toUpperCase())}</span><span class="auth-label">${esc(state.name || 'Definir nome')}</span>`;
    b.onclick = askName;
  }

  // ---------- Roteamento ----------
  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    if (parts[0] === 'p' && parts[1]) return { view: 'project', id: parts[1], tab: parts[2] || 'geral', sub: parts[3] };
    return { view: 'home' };
  }
  window.addEventListener('hashchange', () => { state.editing = null; render(); main.focus({ preventScroll: true }); window.scrollTo(0, 0); });

  function render() {
    if (!state.db) return;
    const r = route();
    if (r.view === 'project') {
      const p = getProject(r.id);
      if (!p) { main.innerHTML = `<div class="empty" style="margin-top:48px">${icon('folder')}<h3>Projeto não encontrado</h3><p>Ele pode ter sido excluído.</p><a class="btn btn-primary" href="#/">${icon('back')}Voltar aos projetos</a></div>`; return; }
      renderProject(p, r);
      document.title = `${p.name} · Gestor RAIDENS`;
    } else {
      renderHome();
      document.title = 'Gestor RAIDENS';
    }
  }

  const readonlyNote = () => canEdit() ? '' : `<div class="readonly-note">${icon('eye', 'icon-sm')}<span>Modo leitura. Para criar e editar, libere o acesso uma vez neste navegador.</span><button class="btn btn-sm btn-secondary" data-act="setup">${icon('key', 'icon-sm')}Liberar edição</button></div>`;

  // ---------- Página inicial ----------
  function renderHome() {
    const ps = state.db.projects;
    const active = ps.filter((p) => p.status !== 'concluido');
    const pending = ps.reduce((n, p) => n + p.checklist.filter((c) => !c.done).length, 0);
    const avg = ps.length ? Math.round(ps.reduce((n, p) => n + progress(p).pct, 0) / ps.length) : 0;
    const docs = ps.reduce((n, p) => n + p.topics.length, 0);

    const q = state.q.toLowerCase();
    let list = ps.filter((p) => (!state.status || p.status === state.status) &&
      (!q || [p.name, p.description, p.owner, ...(p.tags || [])].join(' ').toLowerCase().includes(q)));
    const sorters = {
      recent: (a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''),
      name: (a, b) => a.name.localeCompare(b.name, 'pt-BR'),
      progress: (a, b) => progress(b).pct - progress(a).pct,
      due: (a, b) => (a.due || '9999').localeCompare(b.due || '9999')
    };
    list = [...list].sort(sorters[state.sort]);

    main.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <span class="eyebrow"><i>01</i>Painel da equipe</span>
          <h1><span class="line">Cada projeto</span><span class="line"><em>RAIDENS</em> em</span><span class="line">um só lugar.</span></h1>
          <p>Documentação, anexos, evolução e o que falta fazer em cada projeto da equipe.</p>
        </div>
        ${canEdit() ? `<button class="btn btn-primary btn-lg" data-act="new-project">${icon('plus')}Novo projeto</button>` : ''}
      </section>
      <section class="stats" aria-label="Resumo">
        <div class="stat"><span class="stat-ico">${icon('folder')}</span><div><b>${active.length}</b><span>Projetos ativos</span></div></div>
        <div class="stat"><span class="stat-ico">${icon('activity')}</span><div><b>${avg}%</b><span>Progresso médio</span></div></div>
        <div class="stat accent"><span class="stat-ico">${icon('checkSq')}</span><div><b>${pending}</b><span>Tarefas pendentes</span></div></div>
        <div class="stat"><span class="stat-ico">${icon('book')}</span><div><b>${docs}</b><span>Tópicos de documentação</span></div></div>
      </section>
      ${ps.length ? `
      <div class="toolbar" role="search">
        <div class="search">${icon('search')}<input class="input" id="q" type="search" placeholder="Buscar por nome, descrição, responsável ou tag" value="${esc(state.q)}" aria-label="Buscar projetos"></div>
        <select class="input" id="f-status" aria-label="Filtrar por status">
          <option value="">Todos os status</option>
          ${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${state.status === k ? 'selected' : ''}>${v.label}</option>`).join('')}
        </select>
        <select class="input" id="f-sort" aria-label="Ordenar">
          <option value="recent" ${state.sort === 'recent' ? 'selected' : ''}>Atualizados recentemente</option>
          <option value="name" ${state.sort === 'name' ? 'selected' : ''}>Nome (A–Z)</option>
          <option value="progress" ${state.sort === 'progress' ? 'selected' : ''}>Maior progresso</option>
          <option value="due" ${state.sort === 'due' ? 'selected' : ''}>Prazo mais próximo</option>
        </select>
      </div>
      <div class="grid" id="grid">${list.map(projectCard).join('') || `<div class="empty" style="grid-column:1/-1">${icon('search')}<h3>Nenhum projeto encontrado</h3><p>Tente outro termo ou status.</p></div>`}</div>`
      : `<div class="empty">${icon('folder')}<h3>Nenhum projeto ainda</h3><p>Crie o primeiro projeto para começar a organizar documentação, arquivos e tarefas.</p>
          <button class="btn btn-primary" data-act="${canEdit() ? 'new-project' : 'setup'}">${canEdit() ? `${icon('plus')}Criar primeiro projeto` : `${icon('key')}Liberar edição`}</button></div>`}
      ${readonlyNote()}`;

    const qEl = $('#q');
    if (qEl) {
      qEl.addEventListener('input', () => { state.q = qEl.value; const pos = qEl.selectionStart; renderHome(); const n = $('#q'); n.focus(); n.setSelectionRange(pos, pos); });
      $('#f-status').addEventListener('change', (e) => { state.status = e.target.value; renderHome(); });
      $('#f-sort').addEventListener('change', (e) => { state.sort = e.target.value; renderHome(); });
    }
  }

  function projectCard(p) {
    const pr = progress(p);
    const overdue = p.due && p.status !== 'concluido' && p.due < new Date().toISOString().slice(0, 10);
    return `<a class="card card-link st-${p.status}" href="#/p/${encodeURIComponent(p.id)}">
      <div class="card-top">
        <div style="min-width:0">${statusBadge(p.status)}<h3>${esc(p.name)}</h3></div>
        ${ring(pr.pct)}
      </div>
      ${p.description ? `<p class="clamp">${esc(p.description)}</p>` : '<p class="clamp muted-2">Sem descrição.</p>'}
      <div class="chips">
        <span>${icon('checkSq', 'icon-sm')}${pr.done}/${pr.total}</span>
        <span>${icon('book', 'icon-sm')}${p.topics.length}</span>
        <span>${icon('clip', 'icon-sm')}${p.files.length}</span>
        ${p.due ? `<span class="${overdue ? 'late' : ''}">${icon('cal', 'icon-sm')}${fmtDate(p.due)}</span>` : ''}
      </div>
      <div class="card-foot"><span>${p.owner ? `${icon('user', 'icon-sm')}${esc(p.owner)}` : ''}</span><span>Atualizado ${ago(p.updatedAt)}</span></div>
    </a>`;
  }

  // ---------- Projeto ----------
  function renderProject(p, r) {
    const pr = progress(p);
    const pending = pr.total - pr.done;
    const base = `#/p/${encodeURIComponent(p.id)}`;
    const tabs = [
      ['geral', 'Visão geral', 'grid', pending ? `${pending}` : ''],
      ['docs', 'Documentação', 'book', p.topics.length],
      ['arquivos', 'Arquivos', 'clip', p.files.length],
      ['evolucao', 'Evolução', 'activity', p.timeline.length]
    ];
    const tab = tabs.some((t) => t[0] === r.tab) ? r.tab : 'geral';
    main.innerHTML = `
      <section class="proj-hero">
        <a class="crumb" href="#/">${icon('back', 'icon-sm')}Todos os projetos</a>
        <div class="proj-head">
          <div style="flex:1;min-width:0">
            <div class="title-line">${statusBadge(p.status)}${(p.tags || []).map((t) => `<span class="badge badge-outline">${esc(t)}</span>`).join('')}</div>
            <h1>${esc(p.name)}</h1>
            ${p.description ? `<p class="desc">${esc(p.description)}</p>` : ''}
            <div class="meta">
              ${p.owner ? `<span>${icon('user', 'icon-sm')}${esc(p.owner)}</span>` : ''}
              ${p.due ? `<span>${icon('cal', 'icon-sm')}Prazo ${fmtDate(p.due)}</span>` : ''}
              <span>${icon('clock', 'icon-sm')}Atualizado ${ago(p.updatedAt)}</span>
            </div>
            ${canEdit() ? `<div class="actions">
              <button class="btn btn-secondary btn-sm" data-act="edit-project">${icon('edit', 'icon-sm')}Editar projeto</button>
              <button class="btn btn-sm btn-icon btn-danger" data-act="delete-project" aria-label="Excluir projeto" title="Excluir projeto">${icon('trash', 'icon-sm')}</button>
            </div>` : ''}
          </div>
          <div class="proj-ring">${ring(pr.pct, 120, 10)}<span class="caption">${pr.done} de ${pr.total} itens</span></div>
        </div>
      </section>
      <nav class="tabs" aria-label="Seções do projeto">
        ${tabs.map(([k, label, ic, count]) => `<a class="tab" href="${base}/${k}" ${tab === k ? 'aria-current="page"' : ''}>${icon(ic, 'icon-sm')}${label}${count !== '' && count !== 0 ? `<span class="count">${count}</span>` : ''}</a>`).join('')}
      </nav>
      <div id="tab"></div>
      ${readonlyNote()}`;
    const el = $('#tab');
    if (tab === 'geral') renderOverview(p, el, base);
    else if (tab === 'docs') renderDocs(p, el, r.sub, base);
    else if (tab === 'arquivos') renderFiles(p, el);
    else renderTimeline(p, el);
  }

  function renderOverview(p, el, base) {
    const pr = progress(p);
    const f = state.checkFilter;
    const order = { alta: 0, media: 1, baixa: 2 };
    let items = p.checklist.filter((c) => f === 'todos' || (f === 'pendentes' ? !c.done : c.done));
    items = [...items].sort((a, b) => (a.done - b.done) || (order[a.prio || 'media'] - order[b.prio || 'media']));
    const pendingBy = Object.keys(PRIO).map((k) => [k, p.checklist.filter((c) => !c.done && (c.prio || 'media') === k).length]);
    el.innerHTML = `<div class="layout-2">
      <section class="card">
        <div class="section-head"><h3>O que falta</h3>
          <div class="seg" role="group" aria-label="Filtrar checklist">
            ${['pendentes', 'concluidos', 'todos'].map((k) => `<button type="button" data-filter="${k}" aria-pressed="${f === k}">${{ pendentes: 'Pendentes', concluidos: 'Concluídos', todos: 'Todos' }[k]}</button>`).join('')}
          </div>
        </div>
        ${canEdit() ? `<form class="add-row" id="add-check">
          <input class="input" name="text" placeholder="Adicionar item ao checklist…" aria-label="Novo item" required maxlength="300">
          <select class="input" name="prio" style="width:auto" aria-label="Prioridade">${Object.entries(PRIO).map(([k, v]) => `<option value="${k}" ${k === 'media' ? 'selected' : ''}>${v}</option>`).join('')}</select>
          <button class="btn btn-primary btn-icon" aria-label="Adicionar">${icon('plus')}</button>
        </form>` : ''}
        ${items.length ? `<ul class="check-list">${items.map((c) => `
          <li class="check-item ${c.done ? 'done' : ''}">
            <input type="checkbox" ${c.done ? 'checked' : ''} ${canEdit() ? '' : 'disabled'} data-toggle="${c.id}" aria-label="Concluir: ${esc(c.text)}">
            <span class="prio prio-${c.prio || 'media'}" title="Prioridade ${PRIO[c.prio || 'media']}"></span>
            <span class="txt">${esc(c.text)}</span>
            ${c.done && c.doneBy ? `<span class="who">${esc(c.doneBy)} · ${ago(c.doneAt)}</span>` : ''}
            ${canEdit() ? `<span class="row-actions">
              <button class="btn btn-sm btn-icon btn-ghost" data-edit-check="${c.id}" aria-label="Editar item">${icon('edit', 'icon-sm')}</button>
              <button class="btn btn-sm btn-icon btn-ghost" data-del-check="${c.id}" aria-label="Excluir item">${icon('trash', 'icon-sm')}</button>
            </span>` : ''}
          </li>`).join('')}</ul>`
        : `<p class="muted small" style="padding:16px 0">${p.checklist.length ? (f === 'pendentes' ? 'Nada pendente. Tudo concluído!' : 'Nenhum item aqui.') : 'O checklist está vazio. Liste o que falta para o projeto ficar pronto.'}</p>`}
      </section>
      <aside class="stack">
        <section class="card">
          <h4 style="margin-bottom:12px">Progresso</h4>
          <div class="progress"><div class="bar ${pr.pct === 100 ? 'done' : ''}" role="progressbar" aria-valuenow="${pr.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pr.pct}%"></i></div><b>${pr.pct}%</b></div>
          <p class="caption" style="margin-top:8px">${pr.done} de ${pr.total} itens concluídos</p>
          <div class="meta" style="margin-top:16px">${pendingBy.map(([k, n]) => `<span><i class="prio prio-${k}"></i>${n} ${PRIO[k].toLowerCase()}</span>`).join('')}</div>
          <div class="meta" style="margin-top:12px">
            <span>${icon('book', 'icon-sm')}${p.topics.filter((t) => t.status === 'final').length}/${p.topics.length} tópicos finalizados</span>
          </div>
        </section>
        <section class="card">
          <div class="section-head" style="margin-bottom:12px"><h4>Últimas atualizações</h4><a class="small" href="${base}/evolucao">Ver tudo</a></div>
          ${p.timeline.length ? `<ul class="timeline">${p.timeline.slice(0, 5).map(tlItem).join('')}</ul>` : '<p class="muted small">Nenhuma atualização registrada.</p>'}
        </section>
      </aside>
    </div>`;

    $$('[data-filter]', el).forEach((b) => b.addEventListener('click', () => { state.checkFilter = b.dataset.filter; renderOverview(p, el, base); }));
    $('#add-check', el)?.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const fd = new FormData(ev.target);
      const text = String(fd.get('text')).trim();
      if (!text) return;
      const item = { id: uid(), text, prio: fd.get('prio'), done: false, createdAt: now(), by: by() };
      ev.target.querySelector('button').disabled = true;
      const ok = await mutate((db) => { const x = db.projects.find((q) => q.id === p.id); if (!x) return false; x.checklist.push(item); touch(x); }, `Checklist: adiciona "${text}" em ${p.name}`);
      if (ok) $('#add-check input')?.focus();
    });
    $$('[data-toggle]', el).forEach((cb) => cb.addEventListener('change', () => {
      const id = cb.dataset.toggle;
      const done = cb.checked;
      const item = p.checklist.find((c) => c.id === id);
      mutate((db) => {
        const x = db.projects.find((q) => q.id === p.id); const c = x?.checklist.find((i) => i.id === id);
        if (!c) return false;
        c.done = done; c.doneAt = done ? now() : null; c.doneBy = done ? by() : null;
        if (done) log(x, 'check', `Concluído: ${c.text}`);
        touch(x);
      }, `Checklist: ${done ? 'conclui' : 'reabre'} "${item?.text}" em ${p.name}`);
    }));
    $$('[data-edit-check]', el).forEach((b) => b.addEventListener('click', () => {
      const c = p.checklist.find((i) => i.id === b.dataset.editCheck);
      openModal({
        title: 'Editar item',
        body: `<div class="field"><label for="ct">Descrição <span class="req">*</span></label><input class="input" id="ct" name="text" required maxlength="300" value="${esc(c.text)}"></div>
          <div class="field"><label for="cp">Prioridade</label><select class="input" id="cp" name="prio">${Object.entries(PRIO).map(([k, v]) => `<option value="${k}" ${(c.prio || 'media') === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>`,
        onSubmit: (fd) => mutate((db) => { const x = db.projects.find((q) => q.id === p.id); const i = x?.checklist.find((y) => y.id === c.id); if (!i) return false; i.text = String(fd.get('text')).trim(); i.prio = fd.get('prio'); touch(x); }, `Checklist: edita item em ${p.name}`)
      });
    }));
    $$('[data-del-check]', el).forEach((b) => b.addEventListener('click', () => {
      const c = p.checklist.find((i) => i.id === b.dataset.delCheck);
      confirmModal('Excluir item', `Excluir “${esc(c.text)}” do checklist?`, () => mutate((db) => { const x = db.projects.find((q) => q.id === p.id); if (!x) return false; x.checklist = x.checklist.filter((i) => i.id !== c.id); touch(x); }, `Checklist: remove item de ${p.name}`));
    }));
  }

  // ---------- Documentação ----------
  function renderMd(src) {
    const html = window.marked ? marked.parse(src || '', { gfm: true, breaks: true }) : `<pre>${esc(src)}</pre>`;
    return window.DOMPurify ? DOMPurify.sanitize(html) : esc(src);
  }

  function renderDocs(p, el, topicId, base) {
    const topics = p.topics;
    const t = topics.find((x) => x.id === topicId) || topics[0];
    const nav = `<nav class="card topic-nav" aria-label="Tópicos">
      ${topics.length ? `<ol>${topics.map((x) => `<li><a href="${base}/docs/${encodeURIComponent(x.id)}" ${t && x.id === t.id ? 'aria-current="page"' : ''}><span class="t">${esc(x.title)}</span><span class="dot dot-${x.status || 'rascunho'}" title="${DOC_STATUS[x.status || 'rascunho']}"></span></a></li>`).join('')}</ol>` : '<p class="muted small" style="padding:8px">Nenhum tópico ainda.</p>'}
      ${canEdit() ? `<button class="btn btn-ghost" style="width:100%" data-act="new-topic">${icon('plus')}Novo tópico</button>` : ''}
    </nav>`;

    let content;
    if (!t) {
      content = `<div class="empty">${icon('book')}<h3>Sem documentação</h3><p>Crie tópicos como “Visão geral”, “Hardware”, “Como rodar” ou “Resultados”.</p>
        ${canEdit() ? `<button class="btn btn-primary" data-act="new-topic">${icon('plus')}Criar tópico</button>` : ''}</div>`;
    } else if (state.editing === t.id) {
      const imgs = p.files;
      content = `<form class="card" id="topic-form">
        <div class="field-row">
          <div class="field"><label for="tt">Título <span class="req">*</span></label><input class="input" id="tt" name="title" required maxlength="120" value="${esc(t.title)}"></div>
          <div class="field"><label for="ts">Status</label><select class="input" id="ts" name="status">${Object.entries(DOC_STATUS).map(([k, v]) => `<option value="${k}" ${(t.status || 'rascunho') === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
        </div>
        <div class="editor-tabs">
          <div class="seg" role="group" aria-label="Modo do editor"><button type="button" data-mode="write" aria-pressed="true">Escrever</button><button type="button" data-mode="preview" aria-pressed="false">Visualizar</button></div>
          ${imgs.length ? `<select class="input" id="ins-file" style="width:auto;margin-left:auto;min-height:32px;padding:4px 8px;font-size:.875rem" aria-label="Inserir arquivo anexado"><option value="">Inserir arquivo anexado…</option>${imgs.map((f) => `<option value="${esc(f.id)}">${esc(f.name)}</option>`).join('')}</select>` : ''}
        </div>
        <textarea class="input mono" id="tc" name="content" aria-label="Conteúdo em Markdown" placeholder="Escreva em Markdown: # títulos, **negrito**, - listas, - [ ] tarefas, \`código\`…">${esc(t.content)}</textarea>
        <div class="preview md" id="tp" hidden></div>
        <p class="hint">Suporta Markdown. Os rascunhos só são salvos ao clicar em “Salvar tópico”.</p>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
          <button type="button" class="btn btn-secondary" data-act="cancel-edit">Cancelar</button>
          <button class="btn btn-primary">${icon('check', 'icon-sm')}Salvar tópico</button>
        </div>
      </form>`;
    } else {
      const idx = topics.indexOf(t);
      content = `<article class="card">
        <header class="doc-head">
          <div><h2>${esc(t.title)}</h2><p class="caption" style="margin-top:6px"><span class="dot dot-${t.status || 'rascunho'}" style="display:inline-block;margin-right:6px"></span>${DOC_STATUS[t.status || 'rascunho']} · Atualizado ${ago(t.updatedAt)}${t.updatedBy ? ` por ${esc(t.updatedBy)}` : ''}</p></div>
          ${canEdit() ? `<div class="actions">
            <button class="btn btn-sm btn-icon btn-secondary" data-move="-1" ${idx === 0 ? 'disabled' : ''} aria-label="Mover para cima">${icon('up', 'icon-sm')}</button>
            <button class="btn btn-sm btn-icon btn-secondary" data-move="1" ${idx === topics.length - 1 ? 'disabled' : ''} aria-label="Mover para baixo">${icon('down', 'icon-sm')}</button>
            <button class="btn btn-sm btn-secondary" data-act="edit-topic">${icon('edit', 'icon-sm')}Editar</button>
            <button class="btn btn-sm btn-icon btn-danger" data-act="delete-topic" aria-label="Excluir tópico">${icon('trash', 'icon-sm')}</button>
          </div>` : ''}
        </header>
        <div class="md">${t.content ? renderMd(t.content) : '<p class="muted">Este tópico ainda está vazio.</p>'}</div>
      </article>`;
    }
    el.innerHTML = `<div class="docs">${nav}<div>${content}</div></div>`;

    $$('[data-act="new-topic"]', el).forEach((b) => b.addEventListener('click', () => openModal({
      title: 'Novo tópico de documentação',
      submit: 'Criar tópico',
      body: `<div class="field"><label for="nt">Título <span class="req">*</span></label><input class="input" id="nt" name="title" required maxlength="120" placeholder="Ex.: Arquitetura do robô"></div>`,
      async onSubmit(fd) {
        const topic = { id: uid(), title: String(fd.get('title')).trim(), content: '', status: 'rascunho', createdAt: now(), updatedAt: now(), updatedBy: by() };
        const ok = await mutate((db) => { const x = db.projects.find((q) => q.id === p.id); if (!x) return false; x.topics.push(topic); log(x, 'doc', `Novo tópico: ${topic.title}`); touch(x); }, `Docs: cria "${topic.title}" em ${p.name}`);
        if (ok) { state.editing = topic.id; location.hash = `${base}/docs/${encodeURIComponent(topic.id)}`; setTimeout(() => { state.editing = topic.id; render(); }, 0); }
      }
    })));
    if (!t) return;

    $('[data-act="edit-topic"]', el)?.addEventListener('click', () => { state.editing = t.id; renderDocs(p, el, t.id, base); $('#tc')?.focus(); });
    $('[data-act="cancel-edit"]', el)?.addEventListener('click', () => { state.editing = null; renderDocs(p, el, t.id, base); });
    $('[data-act="delete-topic"]', el)?.addEventListener('click', () => confirmModal('Excluir tópico', `Excluir o tópico “${esc(t.title)}”? O conteúdo será perdido.`, async () => {
      const ok = await mutate((db) => { const x = db.projects.find((q) => q.id === p.id); if (!x) return false; x.topics = x.topics.filter((y) => y.id !== t.id); log(x, 'doc', `Tópico excluído: ${t.title}`); touch(x); }, `Docs: exclui "${t.title}" de ${p.name}`);
      if (ok) location.hash = `${base}/docs`;
    }));
    $$('[data-move]', el).forEach((b) => b.addEventListener('click', () => {
      const d = Number(b.dataset.move);
      mutate((db) => {
        const x = db.projects.find((q) => q.id === p.id); if (!x) return false;
        const i = x.topics.findIndex((y) => y.id === t.id); const j = i + d;
        if (i < 0 || j < 0 || j >= x.topics.length) return false;
        [x.topics[i], x.topics[j]] = [x.topics[j], x.topics[i]];
      }, `Docs: reordena tópicos de ${p.name}`);
    }));

    const form = $('#topic-form', el);
    if (form) {
      const ta = $('#tc', form), pv = $('#tp', form);
      $$('[data-mode]', form).forEach((b) => b.addEventListener('click', () => {
        const prev = b.dataset.mode === 'preview';
        $$('[data-mode]', form).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        ta.hidden = prev; pv.hidden = !prev;
        if (prev) pv.innerHTML = ta.value.trim() ? renderMd(ta.value) : '<p class="muted">Nada para visualizar.</p>';
      }));
      $('#ins-file', form)?.addEventListener('change', (e) => {
        const f = p.files.find((x) => x.id === e.target.value);
        e.target.value = '';
        if (!f) return;
        const url = GH.rawUrl(f.path);
        const snippet = isImage(f.name) ? `![${f.name}](${url})` : `[📎 ${f.name}](${url})`;
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + snippet + ta.value.slice(en);
        ta.focus(); ta.setSelectionRange(s + snippet.length, s + snippet.length);
      });
      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const fd = new FormData(form);
        const title = String(fd.get('title')).trim();
        const content = ta.value;
        const status = fd.get('status');
        const btn = form.querySelector('button:not([type])');
        btn.disabled = true;
        const prevStatus = t.status;
        const ok = await mutate((db) => {
          const x = db.projects.find((q) => q.id === p.id); const y = x?.topics.find((z) => z.id === t.id);
          if (!y) return false;
          Object.assign(y, { title, content, status, updatedAt: now(), updatedBy: by() });
          if (status === 'final' && prevStatus !== 'final') log(x, 'doc', `Tópico finalizado: ${title}`);
          touch(x);
        }, `Docs: atualiza "${title}" em ${p.name}`);
        btn.disabled = false;
        if (ok) { state.editing = null; render(); toast('Tópico salvo.'); }
      });
    }
  }

  // ---------- Arquivos ----------
  function renderFiles(p, el) {
    const files = [...p.files].sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''));
    el.innerHTML = `
      ${canEdit() ? `<label class="drop" id="drop" tabindex="0">
        ${icon('upload')}<h4>Arraste arquivos aqui ou clique para escolher</h4>
        <p class="caption" style="margin-top:4px">PDFs, imagens, planilhas, código, CAD… até ${cfg.maxUploadMB} MB por arquivo.</p>
        <input type="file" id="file-in" multiple hidden>
      </label>` : ''}
      ${files.length ? `<ul class="file-list">${files.map((f) => `
        <li class="file">
          <span class="file-ico">${isImage(f.name) ? `<img src="${esc(GH.rawUrl(f.path))}" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode('${esc(ext(f.name))}'))">` : esc(ext(f.name))}</span>
          <div class="info"><div class="name" title="${esc(f.name)}">${esc(f.name)}</div><div class="caption">${fmtSize(f.size)} · ${esc(f.by || '')} · ${fmtDate(f.uploadedAt)}</div></div>
          <div class="actions">
            <button class="btn btn-sm btn-icon btn-secondary" data-dl="${f.id}" aria-label="Baixar ${esc(f.name)}" title="Baixar">${icon('download', 'icon-sm')}</button>
            ${canEdit() ? `<button class="btn btn-sm btn-icon btn-danger" data-rm="${f.id}" aria-label="Excluir ${esc(f.name)}" title="Excluir">${icon('trash', 'icon-sm')}</button>` : ''}
          </div>
        </li>`).join('')}</ul>`
      : `<div class="empty" style="margin-bottom:48px">${icon('clip')}<h3>Nenhum arquivo anexado</h3><p>Anexe relatórios, esquemas, fotos e qualquer material do projeto.</p></div>`}`;

    const drop = $('#drop', el), input = $('#file-in', el);
    if (drop) {
      drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
      ['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('over'); }));
      ['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
      drop.addEventListener('drop', (e) => upload(p, [...e.dataTransfer.files]));
      input.addEventListener('change', () => upload(p, [...input.files]));
    }
    $$('[data-dl]', el).forEach((b) => b.addEventListener('click', () => download(p.files.find((f) => f.id === b.dataset.dl), b)));
    $$('[data-rm]', el).forEach((b) => b.addEventListener('click', () => {
      const f = p.files.find((x) => x.id === b.dataset.rm);
      confirmModal('Excluir arquivo', `Excluir “${esc(f.name)}”? Ele será removido do repositório.`, async () => {
        try { await GH.deleteFile(f.path, `Arquivo: remove ${f.name} de ${p.name}`); } catch (e) { toast(e.message, true); return; }
        await mutate((db) => { const x = db.projects.find((q) => q.id === p.id); if (!x) return false; x.files = x.files.filter((y) => y.id !== f.id); log(x, 'file', `Arquivo removido: ${f.name}`); touch(x); }, `Arquivo: remove ${f.name} de ${p.name}`);
      });
    }));
  }

  async function upload(p, files) {
    if (!files.length) return;
    if (!canEdit()) return openSetup();
    const max = cfg.maxUploadMB * 1048576;
    const ok = files.filter((f) => f.size <= max);
    files.filter((f) => f.size > max).forEach((f) => toast(`${f.name} passa de ${cfg.maxUploadMB} MB.`, true));
    if (!ok.length) return;
    const added = [];
    setSync('saving');
    try {
      if (!state.branchReady) { await GH.ensureBranch(); state.branchReady = true; }
      for (const [i, f] of ok.entries()) {
        $('#sync').innerHTML = `<span class="spinner" style="width:14px;height:14px"></span><span class="sync-text">Enviando ${i + 1}/${ok.length}…</span>`;
        const path = `${cfg.filesDir}/${p.id}/${Date.now().toString(36)}-${safeName(f.name)}`;
        const b64 = GH.bytesToB64(new Uint8Array(await f.arrayBuffer()));
        await GH.putFile(path, b64, `Arquivo: anexa ${f.name} em ${p.name} (${by()})`);
        added.push({ id: uid(), name: f.name, path, size: f.size, type: f.type, uploadedAt: now(), by: by() });
      }
    } catch (e) {
      toast(`Falha no envio: ${e.message}`, true);
    }
    if (added.length) {
      const saved = await mutate((db) => {
        const x = db.projects.find((q) => q.id === p.id); if (!x) return false;
        x.files.push(...added);
        log(x, 'file', added.length === 1 ? `Arquivo anexado: ${added[0].name}` : `${added.length} arquivos anexados`, added.length > 1 ? added.map((a) => a.name).join('\n') : '');
        touch(x);
      }, `Arquivos: registra ${added.length} anexo(s) em ${p.name}`);
      if (saved) toast(added.length === 1 ? 'Arquivo anexado.' : `${added.length} arquivos anexados.`);
    } else setSync(canEdit() ? 'ok' : '');
  }

  async function download(f, btn) {
    if (!f) return;
    btn.disabled = true;
    try {
      const blob = await GH.getBlob(f.path);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = f.name;
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    } catch {
      window.open(GH.rawUrl(f.path), '_blank', 'noopener');
    } finally { btn.disabled = false; }
  }

  // ---------- Evolução ----------
  const KIND = { update: 'Atualização', check: 'Checklist', doc: 'Documentação', file: 'Arquivo', project: 'Projeto' };
  function tlItem(e) {
    return `<li class="tl-item k-${e.kind}">
      <h4>${esc(e.title)}</h4>
      ${e.body ? `<p class="body">${esc(e.body)}</p>` : ''}
      <p class="caption" style="margin-top:4px">${esc(e.by || '')} · <time datetime="${e.at}" title="${fmtDateTime(e.at)}">${ago(e.at)}</time></p>
    </li>`;
  }
  function renderTimeline(p, el) {
    el.innerHTML = `<section class="card" style="margin-bottom:48px">
      <div class="section-head"><div><h3>Evolução do projeto</h3><p class="caption" style="margin-top:4px">Registre marcos e avanços. Itens concluídos, documentos e anexos entram aqui automaticamente.</p></div>
        ${canEdit() ? `<button class="btn btn-primary" data-act="new-update">${icon('plus')}Registrar atualização</button>` : ''}</div>
      ${p.timeline.length ? `<ul class="timeline">${p.timeline.map(tlItem).join('')}</ul>` : '<p class="muted">Nenhum registro ainda.</p>'}
    </section>`;
    $('[data-act="new-update"]', el)?.addEventListener('click', () => openModal({
      title: 'Registrar atualização',
      submit: 'Registrar',
      body: `<div class="field"><label for="ut">Título <span class="req">*</span></label><input class="input" id="ut" name="title" required maxlength="140" placeholder="Ex.: Sensor de cor calibrado"></div>
        <div class="field"><label for="ub">Detalhes</label><textarea class="input" id="ub" name="body" placeholder="O que mudou, resultados, próximos passos…"></textarea></div>`,
      onSubmit: (fd) => mutate((db) => {
        const x = db.projects.find((q) => q.id === p.id); if (!x) return false;
        log(x, 'update', String(fd.get('title')).trim(), String(fd.get('body') || '').trim());
        touch(x);
      }, `Evolução: registra atualização em ${p.name}`)
    }));
  }

  // ---------- Projeto: criar / editar / excluir ----------
  function projectForm(p = {}) {
    return `<div class="field"><label for="pn">Nome <span class="req">*</span></label><input class="input" id="pn" name="name" required maxlength="100" value="${esc(p.name)}" placeholder="Ex.: Robô de Resgate OBR 2026"></div>
      <div class="field"><label for="pd">Descrição</label><textarea class="input" id="pd" name="description" maxlength="2000" placeholder="Objetivo, escopo, contexto…">${esc(p.description)}</textarea></div>
      <div class="field-row">
        <div class="field"><label for="ps">Status</label><select class="input" id="ps" name="status">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${(p.status || 'planejamento') === k ? 'selected' : ''}>${v.label}</option>`).join('')}</select></div>
        <div class="field"><label for="pdue">Prazo</label><input class="input" id="pdue" name="due" type="date" value="${esc(p.due)}"></div>
      </div>
      <div class="field"><label for="po">Responsável</label><input class="input" id="po" name="owner" maxlength="80" value="${esc(p.owner)}" placeholder="Nome ou equipe"></div>
      <div class="field"><label for="pt">Tags</label><input class="input" id="pt" name="tags" maxlength="200" value="${esc((p.tags || []).join(', '))}" placeholder="robótica, OBR, visão computacional"><p class="hint">Separe por vírgulas.</p></div>`;
  }
  const readProject = (fd) => ({
    name: String(fd.get('name')).trim(),
    description: String(fd.get('description') || '').trim(),
    status: fd.get('status'),
    due: fd.get('due') || '',
    owner: String(fd.get('owner') || '').trim(),
    tags: String(fd.get('tags') || '').split(',').map((s) => s.trim()).filter(Boolean)
  });

  function newProject() {
    openModal({
      title: 'Novo projeto', submit: 'Criar projeto', body: projectForm(),
      async onSubmit(fd) {
        const p = normalize({ id: uid(), ...readProject(fd), createdAt: now(), updatedAt: now(), createdBy: by() });
        log(p, 'project', 'Projeto criado');
        const ok = await mutate((db) => { db.projects.push(p); }, `Projeto: cria ${p.name}`);
        if (ok) location.hash = `#/p/${encodeURIComponent(p.id)}`;
      }
    });
  }
  function editProject(p) {
    openModal({
      title: 'Editar projeto', body: projectForm(p),
      onSubmit: (fd) => {
        const data = readProject(fd);
        return mutate((db) => {
          const x = db.projects.find((q) => q.id === p.id); if (!x) return false;
          if (x.status !== data.status) log(x, 'project', `Status: ${STATUS[x.status]?.label || x.status} → ${STATUS[data.status].label}`);
          Object.assign(x, data); touch(x);
        }, `Projeto: edita ${data.name}`);
      }
    });
  }
  function deleteProject(p) {
    openModal({
      title: 'Excluir projeto', submit: 'Excluir definitivamente', danger: true,
      body: `<p>Isso apaga <b>${esc(p.name)}</b>, seus ${p.topics.length} tópicos, ${p.checklist.length} itens de checklist e ${p.files.length} arquivos anexados.</p>
        <div class="field" style="margin-top:16px"><label for="cn">Digite o nome do projeto para confirmar</label><input class="input" id="cn" name="confirm" autocomplete="off" required></div>`,
      async onSubmit(fd) {
        if (String(fd.get('confirm')).trim() !== p.name) throw new Error('O nome não confere.');
        const ok = await mutate((db) => { db.projects = db.projects.filter((q) => q.id !== p.id); }, `Projeto: exclui ${p.name}`);
        if (!ok) return false;
        location.hash = '#/';
        for (const f of p.files) { try { await GH.deleteFile(f.path, `Arquivo: remove ${f.name} (projeto excluído)`); } catch {} }
        toast('Projeto excluído.');
      }
    });
  }

  // ---------- Ações globais ----------
  main.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const r = route();
    const p = r.view === 'project' ? getProject(r.id) : null;
    switch (b.dataset.act) {
      case 'setup': openSetup(); break;
      case 'new-project': newProject(); break;
      case 'edit-project': if (p) editProject(p); break;
      case 'delete-project': if (p) deleteProject(p); break;
    }
  });

  // Atualiza ao voltar para a aba, para ver o que os outros salvaram.
  window.addEventListener('focus', () => {
    if (state.saving || state.editing || modal.open || Date.now() - state.lastLoad < 20000) return;
    load(true);
  });

  // ---------- Início ----------
  const logo = $('#logo');
  logo.src = cfg.logo;
  logo.onerror = () => { logo.style.display = 'none'; };
  $('#repo-label').textContent = `${GH.repo.owner}/${GH.repo.repo}`;
  renderName();
  if (canEdit() && !state.name) setTimeout(askName, 400);
  if (!GH.repo.owner || !GH.repo.repo) {
    main.innerHTML = `<div class="empty" style="margin-top:48px">${icon('x')}<h3>Repositório não configurado</h3><p>Publique no GitHub Pages ou preencha <code>owner</code> e <code>repo</code> em <code>js/config.js</code>.</p></div>`;
  } else {
    load();
  }
})();


