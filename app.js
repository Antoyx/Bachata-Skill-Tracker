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

const STORAGE_KEY = 'bachata_tracker_v1';

const DEFAULT_DATA = {
  moves: [
    { id: uid(), name: 'Basic Step', notes: '4-count side-to-side base', level: 4 },
    { id: uid(), name: 'Forward & Back Basic', notes: 'Front-back variation of the basic', level: 3 },
    { id: uid(), name: 'Right Turn (Leader)', notes: 'Right-hand lead into full turn', level: 2 },
    { id: uid(), name: 'Left Turn (Leader)', notes: '', level: 1 },
    { id: uid(), name: 'Open Break', notes: '', level: 3 },
    { id: uid(), name: 'Dip', notes: 'Follower supported back dip', level: 1 },
  ],
  combos: [
    { id: uid(), name: 'Basic → Right Turn → Open Break', notes: 'Starter combo for practice', level: 2 },
  ],
  styling: [
    { id: uid(), name: 'Hand Styling (Leader)', notes: 'Free hand sweeps & frames', level: 1 },
    { id: uid(), name: 'Head Rolls', notes: 'Slow controlled head circles', level: 0 },
    { id: uid(), name: 'Shoulder Rolls', notes: '', level: 1 },
  ],
  footwork: [
    { id: uid(), name: 'Tap Syncopation', notes: '&-count taps to accent music', level: 2 },
    { id: uid(), name: 'Pachanga Step', notes: 'Three-step quick footwork pattern', level: 0 },
    { id: uid(), name: 'Pivot Footwork', notes: '', level: 1 },
  ],
  isolations: [
    { id: uid(), name: 'Hip Figure 8', notes: 'Horizontal 8 with hips', level: 3 },
    { id: uid(), name: 'Chest Pop', notes: 'Sharp isolation of chest forward/back', level: 2 },
    { id: uid(), name: 'Body Wave (Full)', notes: 'Floor-to-ceiling wave', level: 1 },
    { id: uid(), name: 'Hip Drop', notes: 'Side hip drops on beat', level: 2 },
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
    // Update active states on all filter btns in this section
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

  // Badge
  const badge = document.createElement('span');
  badge.className = `skill-badge level-${skill.level}`;
  badge.textContent = LEVELS[skill.level].short;

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
  card.appendChild(badge);
  card.appendChild(actions);
  return card;
}

function renderProgressSummary() {
  const el = document.getElementById('progressSummary');
  el.innerHTML = '';

  // Total across all sections
  let total = 0, mastered = 0, inProgress = 0;
  SECTIONS.forEach(sec => {
    data[sec].forEach(s => {
      total++;
      if (s.level === 5) mastered++;
      else if (s.level > 0) inProgress++;
    });
  });

  const pills = [
    { label: `${total} skills`,      bg: 'rgba(255,255,255,0.08)', color: '#c8c4d8' },
    { label: `${inProgress} in progress`, bg: 'rgba(231,126,34,0.2)', color: '#e67e22' },
    { label: `${mastered} mastered`, bg: 'rgba(142,68,173,0.25)', color: '#c39bd3' },
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

function openModal(section, id) {
  modalSection = section;
  editingId = id;
  selectedLevel = 0;

  if (id) {
    const skill = data[section].find(s => s.id === id);
    modalTitle.textContent = 'Edit Skill';
    skillNameEl.value  = skill.name;
    skillNotesEl.value = skill.notes;
    selectedLevel = skill.level;
  } else {
    modalTitle.textContent = 'Add Skill';
    skillNameEl.value  = '';
    skillNotesEl.value = '';
    selectedLevel = 0;
  }

  updateLevelPicker();
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

levelPicker.addEventListener('click', e => {
  const btn = e.target.closest('.level-opt');
  if (!btn) return;
  selectedLevel = parseInt(btn.dataset.level);
  updateLevelPicker();
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
    skill.name  = name;
    skill.notes = skillNotesEl.value.trim();
    skill.level = selectedLevel;
  } else {
    data[modalSection].push({
      id:    uid(),
      name:  name,
      notes: skillNotesEl.value.trim(),
      level: selectedLevel,
    });
  }

  saveData();
  render();
  closeModal();
});

// Close on backdrop click
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// Enter key submits
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
