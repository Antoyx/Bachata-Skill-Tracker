'use strict';

// ===== SUPABASE =====
const SUPABASE_URL = 'https://yuhdfsulyslcfqdxbewb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JM0BHIEuBWB_blpmZcJ2vQ_y8ragOP0';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== CONSTANTS =====
const SECTIONS = ['moves', 'combos', 'styling', 'footwork', 'isolations', 'intros'];

const LEVELS = [
  { short: 'Not Started' },
  { short: 'Learning'    },
  { short: 'Developing'  },
  { short: 'Comfortable' },
  { short: 'Solid'       },
  { short: 'Mastered'    },
];

const DIFFICULTIES = [
  { short: 'Beginner'     },
  { short: 'Intermediate' },
  { short: 'Advanced'     },
];

// Flat list — easier to batch-insert into Supabase
const DEFAULT_SKILLS = [
  // Moves – Beginner
  { section:'moves', name:'Basic Step (Side to Side)',  notes:'4-count side-to-side foundation',               level:0, difficulty:0, vars:[] },
  { section:'moves', name:'Forward & Back Basic',       notes:'Front-back variation of the basic',             level:0, difficulty:0, vars:[] },
  { section:'moves', name:'Open Break',                 notes:'Release to open hold on counts 1–4',            level:0, difficulty:0, vars:[] },
  { section:'moves', name:'Cross Body Lead',            notes:'Send follower across the line of dance',        level:0, difficulty:0, vars:[] },
  { section:'moves', name:'Right Turn (Follower)',      notes:'Right-hand lead into clockwise turn',           level:0, difficulty:0, vars:[] },
  { section:'moves', name:'Left Turn (Follower)',       notes:'Left-hand lead into counter-clockwise',         level:0, difficulty:0, vars:[] },
  // Moves – Intermediate
  { section:'moves', name:'Inside Turn',                notes:'Follower turns toward leader',                  level:0, difficulty:1, vars:[] },
  { section:'moves', name:'Outside Turn',               notes:'Follower turns away from leader',               level:0, difficulty:1, vars:[] },
  { section:'moves', name:'Shadow Position',            notes:'Side-by-side parallel hold',                    level:0, difficulty:1, vars:[] },
  { section:'moves', name:'Hip to Hip',                 notes:'Connected side-by-side body roll',              level:0, difficulty:1, vars:[] },
  { section:'moves', name:'Hammerlock',                 notes:'Both arms crossed behind follower',             level:0, difficulty:1, vars:[] },
  { section:'moves', name:'Cradle',                     notes:"Follower cradled in leader's arms",             level:0, difficulty:1, vars:[] },
  { section:'moves', name:'Body Roll (Together)',       notes:'Synchronized chest-to-hip wave in close hold',  level:0, difficulty:1, vars:[] },
  { section:'moves', name:'Dip',                        notes:'Follower supported back dip',                   level:0, difficulty:1, vars:[] },
  { section:'moves', name:'Cuddle / Wrap',              notes:'Wrap follower into side-by-side cuddle',        level:0, difficulty:1, vars:[] },
  // Moves – Advanced
  { section:'moves', name:'Pretzel',                    notes:'Multi-arm wrap combination',                    level:0, difficulty:2,
    vars:[
      { name:'Pretzel Walk',        level:0, difficulty:2 },
      { name:'Pretzel Body Wave',   level:0, difficulty:2 },
      { name:'Pretzel Exit (Turn)', level:0, difficulty:2 },
    ],
  },
  { section:'moves', name:'Double Turn',                notes:'2-rotation turn with controlled spot',          level:0, difficulty:2, vars:[] },
  { section:'moves', name:'Snake / Serpiente',          notes:"Follower slithers under leader's arm",          level:0, difficulty:2, vars:[] },
  { section:'moves', name:'Needle Dip',                 notes:'Deep dip — requires core & trust',              level:0, difficulty:2, vars:[] },
  { section:'moves', name:'Sombrero',                   notes:"Leader's arm over follower's head wrap",        level:0, difficulty:2, vars:[] },
  // Combos
  { section:'combos', name:'Basic → Open Break → Right Turn',       notes:'Entry-level starter combo', level:0, difficulty:0, vars:[] },
  { section:'combos', name:'Cross Body Lead → Inside Turn → Basic', notes:'Smooth flow sequence',      level:0, difficulty:1, vars:[] },
  { section:'combos', name:'Shadow → Hip to Hip → Cuddle Exit',     notes:'Sensual close-work combo',  level:0, difficulty:1, vars:[] },
  // Styling
  { section:'styling', name:'Posture & Frame',        notes:'Upright spine, open chest, soft knees',       level:0, difficulty:0, vars:[] },
  { section:'styling', name:'Shoulder Rolls',         notes:'Forward and back shoulder circles',            level:0, difficulty:0, vars:[] },
  { section:'styling', name:'Soft Hand / Wrist',      notes:'Relaxed, elegant hand shape in hold',          level:0, difficulty:0, vars:[] },
  { section:'styling', name:'Free Hand Styling',      notes:'Sweeps, frames, and shapes with free arm',     level:0, difficulty:1, vars:[] },
  { section:'styling', name:'Arm Waves',              notes:'Fluid wave from shoulder to fingertips',       level:0, difficulty:1, vars:[] },
  { section:'styling', name:'Head Rolls',             notes:'Slow controlled head circles',                 level:0, difficulty:1, vars:[] },
  { section:'styling', name:'Hair Toss',              notes:'Accent movement on strong beats',              level:0, difficulty:1, vars:[] },
  { section:'styling', name:'Sensual Arm Lines',      notes:'Elongated arm lines matching the music',       level:0, difficulty:1, vars:[] },
  { section:'styling', name:'Frame Entry & Exit',     notes:'Styling transitions in and out of hold',       level:0, difficulty:1, vars:[] },
  { section:'styling', name:'Body Styling in Turns',  notes:'Layering arm/head styling through spins',      level:0, difficulty:2, vars:[] },
  { section:'styling', name:'Musicality Accents',     notes:'Hitting specific instruments with styling',    level:0, difficulty:2, vars:[] },
  { section:'styling', name:'Contact Improv Styling', notes:"Responsive styling to partner's energy",       level:0, difficulty:2, vars:[] },
  // Footwork
  { section:'footwork', name:'Tap Syncopation',      notes:'&-count taps to accent the music',              level:0, difficulty:0, vars:[] },
  { section:'footwork', name:'Cuban Motion Walk',    notes:'Hip-driven walk with weight transfer',           level:0, difficulty:0, vars:[] },
  { section:'footwork', name:'Basic Heel-Toe',       notes:'Heel lead into toe press forward/back',          level:0, difficulty:0, vars:[] },
  { section:'footwork', name:'Pachanga Step',        notes:'3-step quick pattern from son cubano',           level:0, difficulty:1, vars:[] },
  { section:'footwork', name:'Pivot Footwork',       notes:'Controlled pivot on the ball of foot',           level:0, difficulty:1, vars:[] },
  { section:'footwork', name:'Cross Step Variation', notes:'Cross-behind or cross-front foot pattern',       level:0, difficulty:1, vars:[] },
  { section:'footwork', name:'Suzy-Q',               notes:'Syncopated slide-tap shine step',                level:0, difficulty:1, vars:[] },
  { section:'footwork', name:'Cha-Cha Footwork',     notes:'Quick-quick-slow triple step insert',            level:0, difficulty:1, vars:[] },
  { section:'footwork', name:'Samba Step',           notes:'Samba bounce with quick directional changes',    level:0, difficulty:2, vars:[] },
  { section:'footwork', name:'Zapateado',            notes:'Flamenco-style rhythmic heel drumming',          level:0, difficulty:2, vars:[] },
  { section:'footwork', name:'Flick Kicks',          notes:'Sharp outward flick on accent beats',            level:0, difficulty:2, vars:[] },
  { section:'footwork', name:'Batucada Footwork',    notes:'Fast layered foot pattern from samba',           level:0, difficulty:2, vars:[] },
  // Body Isolations
  { section:'isolations', name:'Hip Circle',                   notes:'Full 360° horizontal hip rotation',           level:0, difficulty:0, vars:[] },
  { section:'isolations', name:'Hip Drop',                     notes:'Side hip drops on each beat',                 level:0, difficulty:0, vars:[] },
  { section:'isolations', name:'Hip Figure 8 (Horizontal)',    notes:'Infinity loop with hips on a flat plane',     level:0, difficulty:0, vars:[] },
  { section:'isolations', name:'Shoulder Isolation',           notes:'One shoulder forward while other stays',      level:0, difficulty:0, vars:[] },
  { section:'isolations', name:'Hip Figure 8 (Vertical)',      notes:'Figure 8 traced on a vertical plane',         level:0, difficulty:1, vars:[] },
  { section:'isolations', name:'Chest Pop',                    notes:'Sharp chest forward / back isolation',        level:0, difficulty:1, vars:[] },
  { section:'isolations', name:'Rib Cage Isolation',           notes:'Side-to-side rib slide independent of hips',  level:0, difficulty:1, vars:[] },
  { section:'isolations', name:'Hip Shimmy',                   notes:'Rapid alternating hip pulses',                level:0, difficulty:1, vars:[] },
  { section:'isolations', name:'Body Wave (Full)',             notes:'Floor-to-ceiling undulation wave',             level:0, difficulty:1, vars:[] },
  { section:'isolations', name:'Chest Roll',                   notes:'Chest-driven circular roll',                  level:0, difficulty:1, vars:[] },
  { section:'isolations', name:'Head Snake',                   notes:'Side-to-side head slide (no neck roll)',       level:0, difficulty:2, vars:[] },
  { section:'isolations', name:'Belly Roll',                   notes:'Sequential ab contraction wave',              level:0, difficulty:2, vars:[] },
  { section:'isolations', name:'Full Body Wave Sequence',      notes:'Chained head → chest → hip → knee wave',      level:0, difficulty:2, vars:[] },
  { section:'isolations', name:'Hip Twist with Chest Counter', notes:'Opposing hip and chest rotation',             level:0, difficulty:2, vars:[] },
];

// ===== APP STATE =====
let currentUser = null;
let data = { moves:[], combos:[], styling:[], footwork:[], isolations:[], intros:[] };
let activeSection = 'moves';
let activeFilter  = 'all';
const expandedCards = {};

// Skill modal state
let modalSection       = null;
let editingId          = null;
let selectedLevel      = 0;
let selectedDifficulty = 0;

// Variation modal state
let varSection    = null;
let varSkillId    = null;
let varEditingId  = null;
let varLevel      = 0;
let varDifficulty = 0;

// Delete state
let deleteSection = null;
let deleteId      = null;

// ===== LOADING =====
const loadingOverlay = document.getElementById('loadingOverlay');
function showLoading() { loadingOverlay.classList.remove('hidden'); }
function hideLoading() { loadingOverlay.classList.add('hidden'); }

// ===== AUTH UI =====
function showAuthScreen() {
  document.getElementById('authOverlay').classList.remove('hidden');
  document.getElementById('userInfo').style.display = 'none';
}

function showApp() {
  document.getElementById('authOverlay').classList.add('hidden');
  const ui = document.getElementById('userInfo');
  ui.style.display = 'flex';
  document.getElementById('userEmailDisplay').textContent = currentUser.email;
}

// Auth tab switching
let authMode = 'login';
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    authMode = tab.dataset.mode;
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === authMode));
    document.getElementById('authSubmit').textContent = authMode === 'login' ? 'Log In' : 'Create Account';
    document.getElementById('authError').textContent = '';
  });
});

document.getElementById('authSubmit').addEventListener('click', async () => {
  const email    = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const errorEl  = document.getElementById('authError');
  errorEl.textContent = '';

  if (!email || !password) { errorEl.textContent = 'Email and password are required.'; return; }

  showLoading();
  try {
    const fn = authMode === 'login' ? 'signInWithPassword' : 'signUp';
    const { error } = await sb.auth[fn]({ email, password });
    if (error) throw error;
    if (authMode === 'signup') {
      errorEl.style.color = '#27ae60';
      errorEl.textContent = 'Account created! Check your email to confirm, then log in.';
      hideLoading();
    }
  } catch (err) {
    errorEl.style.color = '#e74c3c';
    errorEl.textContent = err.message;
    hideLoading();
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await sb.auth.signOut();
});

// Enter key on auth inputs
['authEmail','authPassword'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('authSubmit').click();
  });
});

// ===== LOCAL CACHE (prevents spinner on Android tab reload) =====
function cacheKey() { return `bachata_cache_${currentUser.id}`; }
function getCachedData() {
  try { return JSON.parse(localStorage.getItem(cacheKey()) || 'null'); } catch { return null; }
}
function setCachedData(d) {
  try { localStorage.setItem(cacheKey(), JSON.stringify(d)); } catch {}
}
function clearCachedData() {
  if (currentUser) localStorage.removeItem(cacheKey());
}

// ===== DATA =====
async function loadUserData() {
  // Show cached data instantly — no blocking spinner
  const cached = getCachedData();
  if (cached) {
    // Ensure all sections exist in case cache is from an older version
    SECTIONS.forEach(sec => { if (!cached[sec]) cached[sec] = []; });
    data = cached;
    try { render(); } catch (_) {}
    hideLoading();
  } else {
    showLoading();
  }

  try {
    const { data: skills, error } = await sb
      .from('skills')
      .select('*, variations(*)')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!skills || skills.length === 0) {
      await seedDefaultData();
      return loadUserData();
    }

    data = { moves:[], combos:[], styling:[], footwork:[], isolations:[], intros:[] };
    skills.forEach(s => {
      if (!data[s.section]) return;
      const vars = (s.variations || [])
        .sort((a,b) => new Date(a.created_at) - new Date(b.created_at))
        .map(v => ({ id:v.id, name:v.name, level:v.level, difficulty:v.difficulty ?? 0 }));
      data[s.section].push({ id:s.id, name:s.name, notes:s.notes, level:s.level, difficulty:s.difficulty ?? 0, variations:vars });
    });

    setCachedData(data); // Keep cache fresh
    render();
  } catch (err) {
    if (!cached) alert('Failed to load data: ' + err.message);
    // If cache exists, silently ignore — user sees last known data
  } finally {
    hideLoading();
  }
}

async function seedDefaultData() {
  const userId = currentUser.id;
  const skillRows = DEFAULT_SKILLS.map(s => ({
    user_id: userId, section: s.section, name: s.name,
    notes: s.notes, level: s.level, difficulty: s.difficulty,
  }));

  const { data: inserted, error } = await sb.from('skills').insert(skillRows).select('id, section, name');
  if (error) throw error;

  const varRows = [];
  inserted.forEach(skill => {
    const orig = DEFAULT_SKILLS.find(s => s.section === skill.section && s.name === skill.name);
    (orig?.vars || []).forEach(v => varRows.push({
      skill_id: skill.id, user_id: userId,
      name: v.name, level: v.level, difficulty: v.difficulty,
    }));
  });
  if (varRows.length) {
    const { error: ve } = await sb.from('variations').insert(varRows);
    if (ve) throw ve;
  }
}

// ===== CRUD – SKILLS =====
async function dbAddSkill(section, name, notes, level, difficulty) {
  const { data: s, error } = await sb.from('skills')
    .insert({ user_id: currentUser.id, section, name, notes, level, difficulty })
    .select().single();
  if (error) throw error;
  data[section].push({ id:s.id, name, notes, level, difficulty, variations:[] });
  setCachedData(data); render();
}

async function dbUpdateSkill(section, id, name, notes, level, difficulty) {
  const { error } = await sb.from('skills').update({ name, notes, level, difficulty }).eq('id', id);
  if (error) throw error;
  Object.assign(data[section].find(s => s.id === id), { name, notes, level, difficulty });
  setCachedData(data); render();
}

async function dbDeleteSkill(section, id) {
  const { error } = await sb.from('skills').delete().eq('id', id);
  if (error) throw error;
  data[section] = data[section].filter(s => s.id !== id);
  setCachedData(data); render();
}

// ===== CRUD – VARIATIONS =====
async function dbAddVariation(section, skillId, name, level, difficulty) {
  const { data: v, error } = await sb.from('variations')
    .insert({ skill_id: skillId, user_id: currentUser.id, name, level, difficulty })
    .select().single();
  if (error) throw error;
  const skill = data[section].find(s => s.id === skillId);
  if (!skill.variations) skill.variations = [];
  skill.variations.push({ id:v.id, name, level, difficulty });
  setCachedData(data); render();
}

async function dbUpdateVariation(section, skillId, varId, name, level, difficulty) {
  const { error } = await sb.from('variations').update({ name, level, difficulty }).eq('id', varId);
  if (error) throw error;
  const skill = data[section].find(s => s.id === skillId);
  Object.assign(skill.variations.find(v => v.id === varId), { name, level, difficulty });
  setCachedData(data); render();
}

async function dbDeleteVariation(section, skillId, varId) {
  const { error } = await sb.from('variations').delete().eq('id', varId);
  if (error) throw error;
  const skill = data[section].find(s => s.id === skillId);
  skill.variations = skill.variations.filter(v => v.id !== varId);
  setCachedData(data); render();
}

// ===== AUTH INIT =====
async function initAuth() {
  showLoading();
  try {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
      currentUser = session.user;
      showApp();
      await loadUserData();
    } else {
      showAuthScreen();
    }
  } catch (err) {
    console.error('Auth init error:', err);
    showAuthScreen();
  } finally {
    hideLoading();
  }

  sb.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      const isNewSignIn = !currentUser;
      currentUser = session.user;
      if (isNewSignIn) {
        showApp();
        await loadUserData();
      }
    } else if (event === 'SIGNED_OUT') {
      clearCachedData();
      currentUser = null;
      data = { moves:[], combos:[], styling:[], footwork:[], isolations:[], intros:[] };
      showAuthScreen();
    }
  });
}

// ===== RENDER =====
function render() {
  SECTIONS.forEach(sec => renderSection(sec));
  renderProgressSummary();
}

function renderSection(section) {
  const listEl = document.getElementById(`${section}-list`);
  listEl.innerHTML = '';

  const filterRow = document.createElement('div');
  filterRow.className = 'filter-row';
  filterRow.appendChild(makeFilterBtn('All', 'all', section));
  for (let i = 0; i <= 5; i++) filterRow.appendChild(makeFilterBtn(LEVELS[i].short, i, section));
  listEl.appendChild(filterRow);

  let items = data[section];
  if (activeSection === section && activeFilter !== 'all') {
    items = items.filter(s => s.level === activeFilter);
  }

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'skill-empty';
    empty.textContent = activeFilter === 'all' ? 'No entries yet — add your first one!' : 'No skills at this level.';
    listEl.appendChild(empty);
    return;
  }

  items.forEach(skill => listEl.appendChild(makeSkillCard(skill, section)));
}

function makeFilterBtn(label, value, section) {
  const btn = document.createElement('button');
  btn.className = 'filter-btn' + (activeFilter === value && activeSection === section ? ' active' : '');
  btn.textContent = label;
  btn.addEventListener('click', () => {
    if (activeSection !== section) return;
    activeFilter = value;
    renderSection(section);
    document.querySelectorAll(`#${section}-list .filter-btn`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
  return btn;
}

function makeSkillCard(skill, section) {
  const card = document.createElement('div');
  card.className = 'skill-card';
  card.setAttribute('data-id', skill.id);

  const main = document.createElement('div');
  main.className = 'skill-card-main';

  const bar = document.createElement('div');
  bar.className = `skill-level-bar bar-${skill.level}`;

  const info = document.createElement('div');
  info.className = 'skill-info';

  const nameEl = document.createElement('div');
  nameEl.className = 'skill-name';
  nameEl.textContent = skill.name;
  info.appendChild(nameEl);

  if (skill.notes) {
    const notesEl = document.createElement('div');
    notesEl.className = 'skill-notes';
    notesEl.textContent = skill.notes;
    info.appendChild(notesEl);
  }

  const badges = document.createElement('div');
  badges.style.cssText = 'display:flex;flex-direction:column;gap:0.3rem;align-items:flex-end;flex-shrink:0;';

  const diffBadge = document.createElement('span');
  diffBadge.className = `diff-badge diff-${skill.difficulty ?? 0}`;
  diffBadge.textContent = DIFFICULTIES[skill.difficulty ?? 0].short;

  const levelBadge = document.createElement('span');
  levelBadge.className = `skill-badge level-${skill.level}`;
  levelBadge.textContent = LEVELS[skill.level].short;

  badges.appendChild(diffBadge);
  badges.appendChild(levelBadge);

  const actions = document.createElement('div');
  actions.className = 'skill-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'icon-btn';
  editBtn.title = 'Edit';
  editBtn.innerHTML = '&#9998;';
  editBtn.addEventListener('click', () => openModal(section, skill.id));

  const delBtn = document.createElement('button');
  delBtn.className = 'icon-btn delete';
  delBtn.title = 'Delete';
  delBtn.innerHTML = '&#128465;';
  delBtn.addEventListener('click', () => openDeleteModal(section, skill.id));

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  main.appendChild(bar);
  main.appendChild(info);
  main.appendChild(badges);
  main.appendChild(actions);
  card.appendChild(main);

  // Variations
  const vars = skill.variations || [];
  const isOpen = !!expandedCards[skill.id];

  const varSecEl = document.createElement('div');
  varSecEl.className = 'variations-section';

  const toggle = document.createElement('button');
  toggle.className = 'variations-toggle' + (isOpen ? ' open' : '');
  toggle.innerHTML = `<i class="var-arrow">▶</i> ${vars.length > 0 ? `${vars.length} variation${vars.length !== 1 ? 's' : ''}` : 'Variations'}`;
  toggle.addEventListener('click', () => {
    expandedCards[skill.id] = !expandedCards[skill.id];
    renderSection(section);
  });

  const varList = document.createElement('div');
  varList.className = 'variations-list' + (isOpen ? ' open' : '');

  vars.forEach(v => varList.appendChild(makeVariationRow(v, skill.id, section)));

  const addVarBtn = document.createElement('button');
  addVarBtn.className = 'add-var-btn';
  addVarBtn.textContent = '+ Add variation';
  addVarBtn.addEventListener('click', () => openVarModal(section, skill.id, null));
  varList.appendChild(addVarBtn);

  varSecEl.appendChild(toggle);
  varSecEl.appendChild(varList);
  card.appendChild(varSecEl);

  return card;
}

function makeVariationRow(variation, skillId, section) {
  const row = document.createElement('div');
  row.className = 'variation-row';

  const nameEl = document.createElement('span');
  nameEl.className = 'var-name';
  nameEl.textContent = variation.name;

  const vdiff = variation.difficulty ?? 0;
  const diffBadge = document.createElement('span');
  diffBadge.className = `diff-badge diff-${vdiff}`;
  diffBadge.textContent = DIFFICULTIES[vdiff].short;

  const badge = document.createElement('span');
  badge.className = `skill-badge level-${variation.level}`;
  badge.style.fontSize = '0.65rem';
  badge.textContent = LEVELS[variation.level].short;

  const actions = document.createElement('div');
  actions.className = 'var-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'icon-btn';
  editBtn.title = 'Edit';
  editBtn.innerHTML = '&#9998;';
  editBtn.addEventListener('click', () => openVarModal(section, skillId, variation.id));

  const delBtn = document.createElement('button');
  delBtn.className = 'icon-btn delete';
  delBtn.title = 'Delete';
  delBtn.innerHTML = '&#128465;';
  delBtn.addEventListener('click', () => dbDeleteVariation(section, skillId, variation.id));

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  row.appendChild(nameEl);
  row.appendChild(diffBadge);
  row.appendChild(badge);
  row.appendChild(actions);
  return row;
}

function renderProgressSummary() {
  const el = document.getElementById('progressSummary');
  el.innerHTML = '';

  let total = 0, mastered = 0, inProgress = 0;
  SECTIONS.forEach(sec => {
    data[sec].forEach(s => {
      total++;
      if (s.level === 5) mastered++;
      else if (s.level > 0) inProgress++;
      (s.variations || []).forEach(v => {
        total++;
        if (v.level === 5) mastered++;
        else if (v.level > 0) inProgress++;
      });
    });
  });

  const pills = [
    { label:`${total} skills`,           bg:'rgba(255,255,255,0.08)', color:'#c8c4d8' },
    { label:`${inProgress} in progress`, bg:'rgba(231,126,34,0.2)',   color:'#e67e22' },
    { label:`${mastered} mastered`,      bg:'rgba(142,68,173,0.25)',  color:'#c39bd3' },
  ];

  pills.forEach(p => {
    const pill = document.createElement('span');
    pill.className = 'prog-pill';
    pill.textContent = p.label;
    pill.style.background = p.bg;
    pill.style.color = p.color;
    el.appendChild(pill);
  });
}

// ===== NAVIGATION =====
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeSection = btn.dataset.section;
    activeFilter  = 'all';
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.skill-section').forEach(s => s.classList.remove('active'));
    document.getElementById(activeSection).classList.add('active');
    renderSection(activeSection);
  });
});

document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.section, null));
});

// ===== SKILL MODAL =====
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle   = document.getElementById('modalTitle');
const skillNameEl  = document.getElementById('skillName');
const skillNotesEl = document.getElementById('skillNotes');
const levelPicker  = document.getElementById('levelPicker');
const diffPicker   = document.getElementById('diffPicker');

function openModal(section, id) {
  modalSection       = section;
  editingId          = id;
  selectedLevel      = 0;
  selectedDifficulty = 0;

  if (id) {
    const skill = data[section].find(s => s.id === id);
    modalTitle.textContent = 'Edit Skill';
    skillNameEl.value      = skill.name;
    skillNotesEl.value     = skill.notes;
    selectedLevel          = skill.level;
    selectedDifficulty     = skill.difficulty ?? 0;
  } else {
    modalTitle.textContent = 'Add Skill';
    skillNameEl.value  = '';
    skillNotesEl.value = '';
  }

  updateLevelPicker();
  updateDiffPicker();
  modalOverlay.classList.add('open');
  setTimeout(() => skillNameEl.focus(), 50);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalSection = null;
  editingId    = null;
}

function updateLevelPicker() {
  levelPicker.querySelectorAll('.level-opt').forEach(b => b.classList.toggle('selected', parseInt(b.dataset.level) === selectedLevel));
}
function updateDiffPicker() {
  diffPicker.querySelectorAll('.diff-opt').forEach(b => b.classList.toggle('selected', parseInt(b.dataset.diff) === selectedDifficulty));
}

levelPicker.addEventListener('click', e => {
  const btn = e.target.closest('.level-opt');
  if (!btn) return;
  selectedLevel = parseInt(btn.dataset.level);
  updateLevelPicker();
});
diffPicker.addEventListener('click', e => {
  const btn = e.target.closest('.diff-opt');
  if (!btn) return;
  selectedDifficulty = parseInt(btn.dataset.diff);
  updateDiffPicker();
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);

document.getElementById('modalSave').addEventListener('click', async () => {
  const name = skillNameEl.value.trim();
  if (!name) {
    skillNameEl.focus();
    skillNameEl.style.borderColor = 'var(--accent)';
    setTimeout(() => skillNameEl.style.borderColor = '', 1200);
    return;
  }
  // Capture before closeModal clears them
  const sec   = modalSection;
  const id    = editingId;
  const notes = skillNotesEl.value.trim();
  const lvl   = selectedLevel;
  const diff  = selectedDifficulty;
  closeModal();
  try {
    if (id) await dbUpdateSkill(sec, id, name, notes, lvl, diff);
    else    await dbAddSkill(sec, name, notes, lvl, diff);
  } catch (err) { alert('Save failed: ' + err.message); }
});

modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
skillNameEl.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('modalSave').click(); });

// ===== VARIATION MODAL =====
const varModalOverlay = document.getElementById('varModalOverlay');
const varModalTitle   = document.getElementById('varModalTitle');
const varNameEl       = document.getElementById('varName');
const varDiffPicker   = document.getElementById('varDiffPicker');
const varLevelPicker  = document.getElementById('varLevelPicker');

function openVarModal(section, skillId, variationId) {
  varSection    = section;
  varSkillId    = skillId;
  varEditingId  = variationId;
  varLevel      = 0;
  varDifficulty = 0;

  expandedCards[skillId] = true;

  if (variationId) {
    const skill = data[section].find(s => s.id === skillId);
    const v     = skill.variations.find(v => v.id === variationId);
    varModalTitle.textContent = 'Edit Variation';
    varNameEl.value = v.name;
    varLevel        = v.level;
    varDifficulty   = v.difficulty ?? 0;
  } else {
    varModalTitle.textContent = 'Add Variation';
    varNameEl.value = '';
  }

  updateVarLevelPicker();
  updateVarDiffPicker();
  varModalOverlay.classList.add('open');
  setTimeout(() => varNameEl.focus(), 50);
}

function closeVarModal() {
  varModalOverlay.classList.remove('open');
  varSection   = null;
  varSkillId   = null;
  varEditingId = null;
}

function updateVarLevelPicker() {
  varLevelPicker.querySelectorAll('.level-opt').forEach(b => b.classList.toggle('selected', parseInt(b.dataset.level) === varLevel));
}
function updateVarDiffPicker() {
  varDiffPicker.querySelectorAll('.diff-opt').forEach(b => b.classList.toggle('selected', parseInt(b.dataset.diff) === varDifficulty));
}

varLevelPicker.addEventListener('click', e => {
  const btn = e.target.closest('.level-opt');
  if (!btn) return;
  varLevel = parseInt(btn.dataset.level);
  updateVarLevelPicker();
});
varDiffPicker.addEventListener('click', e => {
  const btn = e.target.closest('.diff-opt');
  if (!btn) return;
  varDifficulty = parseInt(btn.dataset.diff);
  updateVarDiffPicker();
});

document.getElementById('varModalClose').addEventListener('click', closeVarModal);
document.getElementById('varModalCancel').addEventListener('click', closeVarModal);

document.getElementById('varModalSave').addEventListener('click', async () => {
  const name = varNameEl.value.trim();
  if (!name) {
    varNameEl.focus();
    varNameEl.style.borderColor = 'var(--accent)';
    setTimeout(() => varNameEl.style.borderColor = '', 1200);
    return;
  }
  const sec   = varSection;
  const skId  = varSkillId;
  const vId   = varEditingId;
  const lvl   = varLevel;
  const diff  = varDifficulty;
  closeVarModal();
  try {
    if (vId) await dbUpdateVariation(sec, skId, vId, name, lvl, diff);
    else     await dbAddVariation(sec, skId, name, lvl, diff);
  } catch (err) { alert('Save failed: ' + err.message); }
});

varModalOverlay.addEventListener('click', e => { if (e.target === varModalOverlay) closeVarModal(); });
varNameEl.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('varModalSave').click(); });

// ===== DELETE MODAL =====
const deleteOverlay   = document.getElementById('deleteOverlay');
const deleteSkillName = document.getElementById('deleteSkillName');

function openDeleteModal(section, id) {
  deleteSection = section;
  deleteId      = id;
  deleteSkillName.textContent = data[section].find(s => s.id === id).name;
  deleteOverlay.classList.add('open');
}

function closeDeleteModal() {
  deleteOverlay.classList.remove('open');
  deleteSection = null;
  deleteId      = null;
}

document.getElementById('deleteClose').addEventListener('click', closeDeleteModal);
document.getElementById('deleteCancelBtn').addEventListener('click', closeDeleteModal);

document.getElementById('deleteConfirmBtn').addEventListener('click', async () => {
  const sec = deleteSection;
  const id  = deleteId;
  closeDeleteModal();
  try { await dbDeleteSkill(sec, id); }
  catch (err) { alert('Delete failed: ' + err.message); }
});

deleteOverlay.addEventListener('click', e => { if (e.target === deleteOverlay) closeDeleteModal(); });

// ===== KEYBOARD =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeVarModal(); closeDeleteModal(); }
});

// ===== INIT =====
initAuth();
