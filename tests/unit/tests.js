'use strict';

// ── Constants (mirrored from app.js — update here if they change there) ───
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

// ── collapsePendingOps — copied verbatim from app.js ─────────────────────
// If this function changes in app.js, update this copy to match.
function collapsePendingOps(ops) {
  const deletedSkillIds = new Set(ops.filter(o => o.op === 'deleteSkill').map(o => o.payload.id));
  const deletedVarIds   = new Set(ops.filter(o => o.op === 'deleteVariation').map(o => o.payload.varId));

  ops = ops.filter(o => {
    if (o.op === 'addSkill'     && deletedSkillIds.has(o.payload.id))    return false;
    if (o.op === 'addVariation' && deletedVarIds.has(o.payload.varId))   return false;
    if (['updateSkill', 'toggleSkillFocus'].includes(o.op)         && deletedSkillIds.has(o.payload.id))    return false;
    if (['updateVariation', 'toggleVariationFocus'].includes(o.op) && deletedVarIds.has(o.payload.varId))   return false;
    return true;
  });

  const lastUpdate = {};
  ops.forEach((o, i) => {
    if (o.op === 'updateSkill')      lastUpdate[`skill_${o.payload.id}`]    = i;
    if (o.op === 'updateVariation')  lastUpdate[`var_${o.payload.varId}`]   = i;
  });
  return ops.filter((o, i) => {
    if (o.op === 'updateSkill')     return lastUpdate[`skill_${o.payload.id}`]   === i;
    if (o.op === 'updateVariation') return lastUpdate[`var_${o.payload.varId}`]  === i;
    return true;
  });
}

// ── Tests: LEVELS ─────────────────────────────────────────────────────────
QUnit.module('LEVELS', () => {
  QUnit.test('has 6 entries', assert => {
    assert.strictEqual(LEVELS.length, 6);
  });

  QUnit.test('index 0 is Not Started', assert => {
    assert.strictEqual(LEVELS[0].short, 'Not Started');
  });

  QUnit.test('index 5 is Mastered', assert => {
    assert.strictEqual(LEVELS[5].short, 'Mastered');
  });

  QUnit.test('every entry has a short label', assert => {
    LEVELS.forEach((l, i) => {
      assert.ok(l.short && l.short.length > 0, `level ${i} has a short label`);
    });
  });
});

// ── Tests: DIFFICULTIES ───────────────────────────────────────────────────
QUnit.module('DIFFICULTIES', () => {
  QUnit.test('has 3 entries', assert => {
    assert.strictEqual(DIFFICULTIES.length, 3);
  });

  QUnit.test('index 0 is Beginner', assert => {
    assert.strictEqual(DIFFICULTIES[0].short, 'Beginner');
  });

  QUnit.test('index 1 is Intermediate', assert => {
    assert.strictEqual(DIFFICULTIES[1].short, 'Intermediate');
  });

  QUnit.test('index 2 is Advanced', assert => {
    assert.strictEqual(DIFFICULTIES[2].short, 'Advanced');
  });
});

// ── Tests: collapsePendingOps ─────────────────────────────────────────────
QUnit.module('collapsePendingOps', () => {
  QUnit.test('returns empty array unchanged', assert => {
    assert.deepEqual(collapsePendingOps([]), []);
  });

  QUnit.test('passes through unrelated ops', assert => {
    const ops = [
      { op: 'addSkill',      payload: { id: 'a' } },
      { op: 'addVariation',  payload: { varId: 'v1', id: 'v1' } },
    ];
    assert.deepEqual(collapsePendingOps(ops), ops);
  });

  QUnit.test('removes addSkill when skill is later deleted', assert => {
    const ops = [
      { op: 'addSkill',    payload: { id: 'a' } },
      { op: 'deleteSkill', payload: { id: 'a' } },
    ];
    assert.deepEqual(collapsePendingOps(ops), []);
  });

  QUnit.test('removes updateSkill when skill is later deleted', assert => {
    const ops = [
      { op: 'updateSkill', payload: { id: 'a', name: 'x' } },
      { op: 'deleteSkill', payload: { id: 'a' } },
    ];
    const result = collapsePendingOps(ops);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].op, 'deleteSkill');
  });

  QUnit.test('removes toggleSkillFocus when skill is later deleted', assert => {
    const ops = [
      { op: 'toggleSkillFocus', payload: { id: 'a', newVal: true } },
      { op: 'deleteSkill',      payload: { id: 'a' } },
    ];
    const result = collapsePendingOps(ops);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].op, 'deleteSkill');
  });

  QUnit.test('deduplicates multiple updateSkill — keeps only last', assert => {
    const ops = [
      { op: 'updateSkill', payload: { id: 'a', name: 'first'  } },
      { op: 'updateSkill', payload: { id: 'a', name: 'second' } },
      { op: 'updateSkill', payload: { id: 'a', name: 'third'  } },
    ];
    const result = collapsePendingOps(ops);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].payload.name, 'third');
  });

  QUnit.test('deduplicates updateSkill independently per skill id', assert => {
    const ops = [
      { op: 'updateSkill', payload: { id: 'a', name: 'a-first'  } },
      { op: 'updateSkill', payload: { id: 'b', name: 'b-first'  } },
      { op: 'updateSkill', payload: { id: 'a', name: 'a-second' } },
    ];
    const result = collapsePendingOps(ops);
    assert.strictEqual(result.length, 2);
    const ids = result.map(o => o.payload.id);
    assert.ok(ids.includes('a') && ids.includes('b'));
    assert.strictEqual(result.find(o => o.payload.id === 'a').payload.name, 'a-second');
  });

  QUnit.test('removes addVariation when variation is later deleted', assert => {
    const ops = [
      { op: 'addVariation',    payload: { varId: 'v1', id: 'v1' } },
      { op: 'deleteVariation', payload: { varId: 'v1' } },
    ];
    assert.deepEqual(collapsePendingOps(ops), []);
  });

  QUnit.test('removes updateVariation when variation is later deleted', assert => {
    const ops = [
      { op: 'updateVariation', payload: { varId: 'v1', name: 'x' } },
      { op: 'deleteVariation', payload: { varId: 'v1' } },
    ];
    const result = collapsePendingOps(ops);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].op, 'deleteVariation');
  });

  QUnit.test('deduplicates multiple updateVariation — keeps only last', assert => {
    const ops = [
      { op: 'updateVariation', payload: { varId: 'v1', name: 'first'  } },
      { op: 'updateVariation', payload: { varId: 'v1', name: 'second' } },
    ];
    const result = collapsePendingOps(ops);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].payload.name, 'second');
  });

  QUnit.test('removes toggleVariationFocus when variation is later deleted', assert => {
    const ops = [
      { op: 'toggleVariationFocus', payload: { varId: 'v1', newVal: true } },
      { op: 'deleteVariation',      payload: { varId: 'v1' } },
    ];
    const result = collapsePendingOps(ops);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].op, 'deleteVariation');
  });

  QUnit.test('does not remove ops for different skill ids', assert => {
    const ops = [
      { op: 'addSkill',    payload: { id: 'a' } },
      { op: 'deleteSkill', payload: { id: 'b' } },
    ];
    const result = collapsePendingOps(ops);
    assert.strictEqual(result.length, 2);
  });
});
