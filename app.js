'use strict';

// ===== DATA =====

const SECTIONS = ['moves', 'combos', 'styling', 'footwork', 'isolations'];

const LEVELS = [
  { label: 'Not Started', short: 'Not Started' },
  { label: 'Learning',    short: 'Learning'    },
  { label: 'Developing',  short: 'Developing'  },
  { label: 'Comfortable', short: 'Comfortable' },
  { label: 'Solid',       short: 'Solid'       },
  { label: 'Mastered',    short: 'Mastered'    },
];

const DIFFICULTIES = [
  { label: 'Beginner',     short: 'Beginner'     },
  { label: 'Intermediate', short: 'Intermediate' },
  { label: 'Advanced',     short: 'Advanced'     },
];

const STORAGE_KEY = 'bachata_tracker_v2';

const DEFAULT_DATA = {
  moves: [
    // Beginner
    { id: uid(), name: 'Basic Step (Side to Side)',     notes: '4-count side-to-side foundation',          level: 0, difficulty: 0 },
    { id: uid(), name: 'Forward & Back Basic',          notes: 'Front-back variation of the basic',        level: 0, difficulty: 0 },
    { id: uid(), name: 'Open Break',                    notes: 'Release to open hold on counts 1–4',       level: 0, difficulty: 0 },
    { id: uid(), name: 'Cross Body Lead',               notes: 'Send follower across the line of dance',   level: 0, difficulty: 0 },
    { id: uid(), name: 'Right Turn (Follower)',         notes: 'Right-hand lead into clockwise turn',      level: 0, difficulty: 0 },
    { id: uid(), name: 'Left Turn (Follower)',          notes: 'Left-hand lead into counter-clockwise',    level: 0, difficulty: 0 },
    // Intermediate
    { id: uid(), name: 'Inside Turn',                   notes: 'Follower turns toward leader',             level: 0, difficulty: 1 },
    { id: uid(), name: 'Outside Turn',                  notes: 'Follower turns away from leader',          level: 0, difficulty: 1 },
    { id: uid(), name: 'Shadow Position',               notes: 'Side-by-side parallel hold',               level: 0, difficulty: 1 },
    { id: uid(), name: 'Hip to Hip',                    notes: 'Connected side-by-side body roll',         level: 0, difficulty: 1 },
    { id: uid(), name: 'Hammerlock',                    notes: 'Both arms crossed behind follower',        level: 0, difficulty: 1 },
    { id: uid(), name: 'Cradle',                        notes: 'Follower cradled in leader\'s arms',       level: 0, difficulty: 1 },
    { id: uid(), name: 'Body Roll (Together)',          notes: 'Synchronized chest-to-hip wave in close hold', level: 0, difficulty: 1 },
    { id: uid(), name: 'Dip',                           notes: 'Follower supported back dip',              level: 0, difficulty: 1 },
    { id: uid(), name: 'Cuddle / Wrap',                 notes: 'Wrap follower into side-by-side cuddle',   level: 0, difficulty: 1 },
    // Advanced
    { id: uid(), name: 'Double Turn',                   notes: '2-rotation turn with controlled spot',     level: 0, difficulty: 2 },
    { id: uid(), name: 'Snake / Serpiente',             notes: 'Follower slithers under leader\'s arm',    level: 0, difficulty: 2 },
    { id: uid(), name: 'Needle Dip',                    notes: 'Deep dip — requires core & trust',         level: 0, difficulty: 2 },
    { id: uid(), name: 'Pretzel',                       notes: 'Multi-arm wrap combination',               level: 0, difficulty: 2 },
    { id: uid(), name: 'Sombrero',                      notes: 'Leader\'s arm over follower\'s head wrap', level: 0, difficulty: 2 },
  ],
  combos: [
    { id: uid(), name: 'Basic → Open Break → Right Turn',       notes: 'Entry-level starter combo',        level: 0, difficulty: 0 },
    { id: uid(), name: 'Cross Body Lead → Inside Turn → Basic', notes: 'Smooth flow sequence',             level: 0, difficulty: 1 },
    { id: uid(), name: 'Shadow → Hip to Hip → Cuddle Exit',     notes: 'Sensual close-work combo',         level: 0, difficulty: 1 },
  ],
  styling: [
    // Beginner
    { id: uid(), name: 'Posture & Frame',               notes: 'Upright spine, open chest, soft knees',   level: 0, difficulty: 0 },
    { id: uid(), name: 'Shoulder Rolls',                notes: 'Forward and back shoulder circles',        level: 0, difficulty: 0 },
    { id: uid(), name: 'Soft Hand / Wrist',             notes: 'Relaxed, elegant hand shape in hold',     level: 0, difficulty: 0 },
    // Intermediate
    { id: uid(), name: 'Free Hand Styling',             notes: 'Sweeps, frames, and shapes with free arm', level: 0, difficulty: 1 },
    { id: uid(), name: 'Arm Waves',                     notes: 'Fluid wave from shoulder to fingertips',  level: 0, difficulty: 1 },
    { id: uid(), name: 'Head Rolls',                    notes: 'Slow controlled head circles',            level: 0, difficulty: 1 },
    { id: uid(), name: 'Hair Toss',                     notes: 'Accent movement on strong beats',         level: 0, difficulty: 1 },
    { id: uid(), name: 'Sensual Arm Lines',             notes: 'Elongated arm lines matching the music',  level: 0, difficulty: 1 },
    { id: uid(), name: 'Frame Entry & Exit',            notes: 'Styling transitions in and out of hold',  level: 0, difficulty: 1 },
    // Advanced
    { id: uid(), name: 'Body Styling in Turns',         notes: 'Layering arm/head styling through spins', level: 0, difficulty: 2 },
    { id: uid(), name: 'Musicality Accents',            notes: 'Hitting specific instruments with styling', level: 0, difficulty: 2 },
    { id: uid(), name: 'Contact Improv Styling',        notes: 'Responsive styling to partner\'s energy',  level: 0, difficulty: 2 },
  ],
  footwork: [
    // Beginner
    { id: uid(), name: 'Tap Syncopation',               notes: '&-count taps to accent the music',        level: 0, difficulty: 0 },
    { id: uid(), name: 'Cuban Motion Walk',             notes: 'Hip-driven walk with weight transfer',    level: 0, difficulty: 0 },
    { id: uid(), name: 'Basic Heel-Toe',                notes: 'Heel lead into toe press forward/back',   level: 0, difficulty: 0 },
    // Intermediate
    { id: uid(), name: 'Pachanga Step',                 notes: '3-step quick pattern from son cubano',    level: 0, difficulty: 1 },
    { id: uid(), name: 'Pivot Footwork',                notes: 'Controlled pivot on the ball of foot',    level: 0, difficulty: 1 },
    { id: uid(), name: 'Cross Step Variation',          notes: 'Cross-behind or cross-front foot pattern', level: 0, difficulty: 1 },
    { id: uid(), name: 'Suzy-Q',                        notes: 'Syncopated slide-tap shine step',         level: 0, difficulty: 1 },
    { id: uid(), name: 'Cha-Cha Footwork',              notes: 'Quick-quick-slow triple step insert',     level: 0, difficulty: 1 },
    // Advanced
    { id: uid(), name: 'Samba Step',                    notes: 'Samba bounce with quick directional changes', level: 0, difficulty: 2 },
    { id: uid(), name: 'Zapateado',                     notes: 'Flamenco-style rhythmic heel drumming',   level: 0, difficulty: 2 },
    { id: uid(), name: 'Flick Kicks',                   notes: 'Sharp outward flick on accent beats',     level: 0, difficulty: 2 },
    { id: uid(), name: 'Batucada Footwork',             notes: 'Fast layered foot pattern from samba',    level: 0, difficulty: 2 },
  ],
  isolations: [
    // Beginner
    { id: uid(), name: 'Hip Circle',                    notes: 'Full 360° horizontal hip rotation',       level: 0, difficulty: 0 },
    { id: uid(), name: 'Hip Drop',                      notes: 'Side hip drops on each beat',             level: 0, difficulty: 0 },
    { id: uid(), name: 'Hip Figure 8 (Horizontal)',     notes: 'Infinity loop with hips on a flat plane', level: 0, difficulty: 0 },
    { id: uid(), name: 'Shoulder Isolation',            notes: 'One shoulder forward while other stays',  level: 0, difficulty: 0 },
    // Intermediate
    { id: uid(), name: 'Hip Figure 8 (Vertical)',       notes: 'Figure 8 traced on a vertical plane',     level: 0, difficulty: 1 },
    { id: uid(), name: 'Chest Pop',                     notes: 'Sharp chest forward / back isolation',    level: 0, difficulty: 1 },
    { id: uid(), name: 'Rib Cage Isolation',            notes: 'Side-to-side rib slide independent of hips', level: 0, difficulty: 1 },
    { id: uid(), name: 'Hip Shimmy',                    notes: 'Rapid alternating hip pulses',            level: 0, difficulty: 1 },
    { id: uid(), name: 'Body Wave (Full)',               notes: 'Floor-to-ceiling undulation wave',        level: 0, difficulty: 1 },
    { id: uid(), name: 'Chest Roll',                    notes: 'Chest-driven circular roll',              level: 0, difficulty: 1 },
    // Advanced
    { id: uid(), name: 'Head Snake',                    notes: 'Side-to-side head slide (no neck roll)',  level: 0, difficulty: 2 },
    { id: uid(), name: 'Belly Roll',                    notes: 'Sequential ab contraction wave',          level: 0, difficulty: 2 },
    { id: uid(), name: 'Full Body Wave Sequence',       notes: 'Chained head → chest → hip → knee wave', level: 0, difficulty: 2 },
    { id: uid(), name: 'Hip Twist with Chest Counter',  notes: 'Opposing hip and chest rotation',         level: 0, difficulty: 2 },
  ],
};

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ===== STATE =====
let data = loadData();
let activeSection = 'moves';
let activeFilter = 'all'; // 'all' | 0-5

// Modal state
let modalSection = null;
let editingId = null;
let selectedLevel = 0;
let selectedDifficulty = 0;

// Delete state
let deleteSection = null;
let deleteId = null;

// ===== LOAD / SAVE =====
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ===== RENDER =====
function render() {
  SECTIONS.forEach(sec => renderSection(sec));
  renderProgressSummary();
}

function renderSection(section) {
  const listEl = document.getElementById(`${section}-list`);
  listEl.innerHTML = '';

  // Filter row
  const filterRow = document.createElement('div');
  filterRow.className = 'filter-row';

  const allBtn = makeFilterBtn('All', 'all', section);
  filterRow.appendChild(allBtn);
  for (let i = 0; i <= 5; i++) {
    filterRow.appendChild(makeFilterBtn(LEVELS[i].short, i, section));
  }
  listEl.appendChild(filterRow);

  let items = data[section];
  if (activeSection === section && activeFilter !== 'all') {
    items = items.filter(s => s.level === activeFilter);
  }

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'skill-empty';
    empty.textContent = activeFilter === 'all'
      ? 'No entries yet — add your first one!'
      : 'No skills at this level.';
    listEl.appendChild(empty);
    return;
  }

  items.forEach(skill => {
    listEl.appendChild(makeSkillCard(skill, section));
  });
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

  // Coloured left bar
  const bar = document.createElement('div');
  bar.className = `skill-level-bar bar-${skill.level}`;

  // Info
  const info = document.createElement('div');
  info.className = 'skill-info';
  const name = document.createElement('div');
  name.className = 'skill-name';
  name.textContent = skill.name;
  info.appendChild(name);
  if (skill.notes) {
    const notes = document.createElement('div');
    notes.className = 'skill-notes';
    notes.textContent = skill.notes;
    info.appendChild(notes);
  }

  // Badges group
  const badges = document.createElement('div');
  badges.style.cssText = 'display:flex;flex-direction:column;gap:0.3rem;align-items:flex-end;flex-shrink:0;';

  const diff = skill.difficulty ?? 0;
  const diffBadge = document.createElement('span');
  diffBadge.className = `diff-badge diff-${diff}`;
  diffBadge.textContent = DIFFICULTIES[diff].short;

  const levelBadge = document.createElement('span');
  levelBadge.className = `skill-badge level-${skill.level}`;
  levelBadge.textContent = LEVELS[skill.level].short;

  badges.appendChild(diffBadge);
  badges.appendChild(levelBadge);

  // Actions
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

  card.appendChild(bar);
  card.appendChild(info);
  card.appendChild(badges);
  card.appendChild(actions);
  return card;
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
    });
  });

  const pills = [
    { label: `${total} skills`,           bg: 'rgba(255,255,255,0.08)', color: '#c8c4d8' },
    { label: `${inProgress} in progress`, bg: 'rgba(231,126,34,0.2)',   color: '#e67e22' },
    { label: `${mastered} mastered`,      bg: 'rgba(142,68,173,0.25)',  color: '#c39bd3' },
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
    activeFilter = 'all';

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.skill-section').forEach(s => s.classList.remove('active'));
    document.getElementById(activeSection).classList.add('active');

    renderSection(activeSection);
  });
});

// ===== ADD BUTTONS =====
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.section, null));
});

// ===== MODAL =====
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle   = document.getElementById('modalTitle');
const skillNameEl  = document.getElementById('skillName');
const skillNotesEl = document.getElementById('skillNotes');
const levelPicker  = document.getElementById('levelPicker');
const diffPicker   = document.getElementById('diffPicker');

function openModal(section, id) {
  modalSection = section;
  editingId = id;
  selectedLevel = 0;
  selectedDifficulty = 0;

  if (id) {
    const skill = data[section].find(s => s.id === id);
    modalTitle.textContent = 'Edit Skill';
    skillNameEl.value  = skill.name;
    skillNotesEl.value = skill.notes;
    selectedLevel      = skill.level;
    selectedDifficulty = skill.difficulty ?? 0;
  } else {
    modalTitle.textContent = 'Add Skill';
    skillNameEl.value  = '';
    skillNotesEl.value = '';
    selectedLevel      = 0;
    selectedDifficulty = 0;
  }

  updateLevelPicker();
  updateDiffPicker();
  modalOverlay.classList.add('open');
  setTimeout(() => skillNameEl.focus(), 50);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalSection = null;
  editingId = null;
}

function updateLevelPicker() {
  document.querySelectorAll('.level-opt').forEach(btn => {
    btn.classList.toggle('selected', parseInt(btn.dataset.level) === selectedLevel);
  });
}

function updateDiffPicker() {
  document.querySelectorAll('.diff-opt').forEach(btn => {
    btn.classList.toggle('selected', parseInt(btn.dataset.diff) === selectedDifficulty);
  });
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

document.getElementById('modalSave').addEventListener('click', () => {
  const name = skillNameEl.value.trim();
  if (!name) {
    skillNameEl.focus();
    skillNameEl.style.borderColor = 'var(--accent)';
    setTimeout(() => skillNameEl.style.borderColor = '', 1200);
    return;
  }

  if (editingId) {
    const skill = data[modalSection].find(s => s.id === editingId);
    skill.name       = name;
    skill.notes      = skillNotesEl.value.trim();
    skill.level      = selectedLevel;
    skill.difficulty = selectedDifficulty;
  } else {
    data[modalSection].push({
      id:         uid(),
      name:       name,
      notes:      skillNotesEl.value.trim(),
      level:      selectedLevel,
      difficulty: selectedDifficulty,
    });
  }

  saveData();
  render();
  closeModal();
});

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

skillNameEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('modalSave').click();
});

// ===== DELETE MODAL =====
const deleteOverlay   = document.getElementById('deleteOverlay');
const deleteSkillName = document.getElementById('deleteSkillName');

function openDeleteModal(section, id) {
  deleteSection = section;
  deleteId      = id;
  const skill   = data[section].find(s => s.id === id);
  deleteSkillName.textContent = skill.name;
  deleteOverlay.classList.add('open');
}

function closeDeleteModal() {
  deleteOverlay.classList.remove('open');
  deleteSection = null;
  deleteId      = null;
}

document.getElementById('deleteClose').addEventListener('click', closeDeleteModal);
document.getElementById('deleteCancelBtn').addEventListener('click', closeDeleteModal);

document.getElementById('deleteConfirmBtn').addEventListener('click', () => {
  data[deleteSection] = data[deleteSection].filter(s => s.id !== deleteId);
  saveData();
  render();
  closeDeleteModal();
});

deleteOverlay.addEventListener('click', e => {
  if (e.target === deleteOverlay) closeDeleteModal();
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeDeleteModal();
  }
});

// ===== INIT =====
render();
