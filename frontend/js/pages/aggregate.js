/* ===== AGGREGATE CALCULATOR ===== */

const AGG_FORMULAS = {
  nust: {
    id: 'nust',
    label: 'NUST',
    testLabel: 'NET (entry test)',
    testTotalHint: '200',
    weights: { matric: 10, fsc: 15, test: 75 },
    note: 'NET 75% + HSSC/FSc 15% + SSC/Matric 10% (as commonly published for undergraduate admissions).',
  },
  uet: {
    id: 'uet',
    label: 'UET / ECAT',
    testLabel: 'ECAT (entry test)',
    testTotalHint: '400',
    weights: { matric: 17, fsc: 50, test: 33 },
    note: 'Matric 17% + FSc 50% + ECAT 33% (UET Lahore pattern used by several engineering campuses).',
  },
  medical: {
    id: 'medical',
    label: 'Medical (UHS-style)',
    testLabel: 'MDCAT (entry test)',
    testTotalHint: '200',
    weights: { matric: 10, fsc: 40, test: 50 },
    note: 'Typical Matric 10% + FSc 40% + MDCAT 50%. Confirm the latest PMC / provincial merit policy before applying.',
  },
  custom: {
    id: 'custom',
    label: 'Custom',
    testLabel: 'Entry test',
    testTotalHint: '100',
    weights: { matric: 10, fsc: 40, test: 50 },
    note: 'Set your own weights so they add up to 100%. Useful for campus-specific or updated formulas.',
  },
};

function emptyAggMarks() {
  return { obt: '', tot: '' };
}

function ensureAggState() {
  if (!state.aggregate || state.aggregate.matric == null || typeof state.aggregate.matric === 'string') {
    const prev = state.aggregate || {};
    state.aggregate = {
      formula: prev.formula || 'nust',
      matric: emptyAggMarks(),
      fsc: emptyAggMarks(),
      test: emptyAggMarks(),
      wMatric: prev.wMatric != null ? prev.wMatric : 10,
      wFsc: prev.wFsc != null ? prev.wFsc : 15,
      wTest: prev.wTest != null ? prev.wTest : 75,
      prefillsTried: !!prev.prefillsTried,
    };
  }
  return state.aggregate;
}

function profileMarksTotals() {
  const marks = state.academic && state.academic.marks ? state.academic.marks : {};
  let obt = 0;
  let tot = 0;
  let count = 0;
  Object.keys(marks).forEach((subject) => {
    const entry = marks[subject];
    let o;
    let t;
    if (entry && typeof entry === 'object') {
      o = Number(entry.obtained);
      t = Number(entry.total);
    } else {
      o = Number(entry);
      t = 100;
    }
    if (Number.isFinite(o) && Number.isFinite(t) && t > 0 && o >= 0) {
      obt += o;
      tot += t;
      count += 1;
    }
  });
  if (!count || tot <= 0) return null;
  return { obt, tot, pct: (100 * obt) / tot };
}

function maybePrefillAggregate() {
  const agg = ensureAggState();
  if (agg.prefillsTried) return;
  agg.prefillsTried = true;
  const totals = profileMarksTotals();
  if (!totals) return;
  if (agg.fsc.obt === '' && agg.fsc.tot === '') {
    agg.fsc = { obt: String(Number(totals.obt.toFixed(2))), tot: String(Number(totals.tot.toFixed(2))) };
  }
}

function currentAggWeights() {
  const agg = ensureAggState();
  const base = AGG_FORMULAS[agg.formula] || AGG_FORMULAS.nust;
  if (agg.formula === 'custom') {
    return {
      matric: Number(agg.wMatric) || 0,
      fsc: Number(agg.wFsc) || 0,
      test: Number(agg.wTest) || 0,
    };
  }
  return { ...base.weights };
}

function marksToPercent(marks) {
  if (!marks) return null;
  const obt = marks.obt === '' || marks.obt == null ? null : Number(marks.obt);
  const tot = marks.tot === '' || marks.tot == null ? null : Number(marks.tot);
  if (obt == null || tot == null || !Number.isFinite(obt) || !Number.isFinite(tot)) return null;
  if (tot <= 0) return null;
  if (obt < 0 || obt > tot) return null;
  return Math.max(0, Math.min(100, (100 * obt) / tot));
}

function formatAggPct(pct) {
  if (pct == null || !Number.isFinite(pct)) return '—';
  return pct.toFixed(2) + '%';
}

function computeAggregate() {
  const agg = ensureAggState();
  const w = currentAggWeights();
  const matric = marksToPercent(agg.matric);
  const fsc = marksToPercent(agg.fsc);
  const test = marksToPercent(agg.test);
  const weightSum = w.matric + w.fsc + w.test;
  const missing = [];
  if (matric == null && w.matric > 0) missing.push('Matric obtained/total');
  if (fsc == null && w.fsc > 0) missing.push('Intermediate obtained/total');
  if (test == null && w.test > 0) missing.push('Entry test obtained/total');
  if (missing.length || weightSum <= 0) {
    return {
      ok: false,
      missing,
      weightSum,
      aggregate: null,
      parts: null,
      percents: { matric, fsc, test },
    };
  }
  const parts = {
    matric: (matric * w.matric) / 100,
    fsc: (fsc * w.fsc) / 100,
    test: (test * w.test) / 100,
  };
  const aggregate = parts.matric + parts.fsc + parts.test;
  return {
    ok: true,
    missing: [],
    weightSum,
    aggregate,
    parts,
    weights: w,
    percents: { matric, fsc, test },
  };
}

function readMarksPair(prefix) {
  const obtEl = document.getElementById(`agg-${prefix}-obt`);
  const totEl = document.getElementById(`agg-${prefix}-tot`);
  return {
    obt: obtEl ? obtEl.value : '',
    tot: totEl ? totEl.value : '',
  };
}

function captureAggregateDraft() {
  const agg = ensureAggState();
  agg.matric = readMarksPair('matric');
  agg.fsc = readMarksPair('fsc');
  agg.test = readMarksPair('test');
  if (agg.formula === 'custom') {
    const wm = document.getElementById('agg-w-matric');
    const wf = document.getElementById('agg-w-fsc');
    const wt = document.getElementById('agg-w-test');
    if (wm) agg.wMatric = wm.value;
    if (wf) agg.wFsc = wf.value;
    if (wt) agg.wTest = wt.value;
  }
}

function setAggregateFormula(id) {
  captureAggregateDraft();
  const agg = ensureAggState();
  if (!AGG_FORMULAS[id]) return;
  agg.formula = id;
  if (id !== 'custom') {
    const w = AGG_FORMULAS[id].weights;
    agg.wMatric = w.matric;
    agg.wFsc = w.fsc;
    agg.wTest = w.test;
  }
  render();
}

function updateAggPercentLabel(prefix) {
  const obtEl = document.getElementById(`agg-${prefix}-obt`);
  const totEl = document.getElementById(`agg-${prefix}-tot`);
  const pctEl = document.getElementById(`agg-${prefix}-pct`);
  if (!pctEl) return;
  const pct = marksToPercent({
    obt: obtEl ? obtEl.value : '',
    tot: totEl ? totEl.value : '',
  });
  pctEl.textContent = formatAggPct(pct);
}

function renderAggBreakdown(result) {
  if (!result.ok) {
    return result.missing.length
      ? `<p class="agg-muted">Enter ${esc(result.missing.join(', '))} to calculate.</p>`
      : `<p class="agg-muted">Weights must be greater than 0.</p>`;
  }
  return `
    <div class="agg-part"><span>Matric percentage</span><strong>${result.percents.matric.toFixed(2)}%</strong></div>
    <div class="agg-part"><span>Intermediate percentage</span><strong>${result.percents.fsc.toFixed(2)}%</strong></div>
    <div class="agg-part"><span>Entry test percentage</span><strong>${result.percents.test.toFixed(2)}%</strong></div>
    <div class="agg-part"><span>Matric contribution</span><strong>${result.parts.matric.toFixed(2)}</strong></div>
    <div class="agg-part"><span>Intermediate contribution</span><strong>${result.parts.fsc.toFixed(2)}</strong></div>
    <div class="agg-part"><span>Entry test contribution</span><strong>${result.parts.test.toFixed(2)}</strong></div>
    <div class="agg-part agg-part-total"><span>Final aggregate</span><strong>${result.aggregate.toFixed(2)}%</strong></div>`;
}

function onAggregateInput(prefix) {
  captureAggregateDraft();
  if (prefix) updateAggPercentLabel(prefix);
  else {
    updateAggPercentLabel('matric');
    updateAggPercentLabel('fsc');
    updateAggPercentLabel('test');
  }
  const resultEl = document.getElementById('agg-result');
  const breakdownEl = document.getElementById('agg-breakdown');
  const hintEl = document.getElementById('agg-hint');
  if (!resultEl || !breakdownEl) return;
  const result = computeAggregate();
  if (!result.ok) {
    resultEl.textContent = '—';
    breakdownEl.innerHTML = renderAggBreakdown(result);
    if (hintEl && result.weightSum > 0 && Math.abs(result.weightSum - 100) > 0.01) {
      hintEl.textContent = `Weights currently total ${result.weightSum.toFixed(1)}% (should be 100%).`;
    } else if (hintEl) {
      hintEl.textContent = '';
    }
    return;
  }
  resultEl.textContent = result.aggregate.toFixed(2) + '%';
  breakdownEl.innerHTML = renderAggBreakdown(result);
  if (hintEl) {
    hintEl.textContent = Math.abs(result.weightSum - 100) > 0.01
      ? `Note: weights total ${result.weightSum.toFixed(1)}% (usually 100%).`
      : '';
  }
}

function useProfileForFsc() {
  captureAggregateDraft();
  const totals = profileMarksTotals();
  if (!totals) {
    toast('Add subject marks in Academic Profile first');
    return;
  }
  ensureAggState().fsc = {
    obt: String(Number(totals.obt.toFixed(2))),
    tot: String(Number(totals.tot.toFixed(2))),
  };
  render();
  toast('Filled Intermediate marks from your profile', true);
}

function resetAggregate() {
  const formula = ensureAggState().formula;
  const w = currentAggWeights();
  state.aggregate = {
    formula,
    matric: emptyAggMarks(),
    fsc: emptyAggMarks(),
    test: emptyAggMarks(),
    wMatric: w.matric,
    wFsc: w.fsc,
    wTest: w.test,
    prefillsTried: true,
  };
  render();
}

function aggMarksRow(prefix, title, weight, marks, totHint) {
  const pct = marksToPercent(marks);
  return `<div class="agg-marks-row">
    <div class="agg-marks-head">
      <strong>${esc(title)}</strong>
      <em>weight ${weight}%</em>
    </div>
    <div class="agg-marks-inputs">
      <label>
        <span>Obtained</span>
        <input id="agg-${prefix}-obt" type="number" min="0" step="0.01" inputmode="decimal"
          placeholder="e.g. 980" value="${esc(marks.obt)}" oninput="onAggregateInput('${prefix}')">
      </label>
      <span class="agg-slash" aria-hidden="true">/</span>
      <label>
        <span>Total</span>
        <input id="agg-${prefix}-tot" type="number" min="1" step="0.01" inputmode="decimal"
          placeholder="${esc(totHint || '1100')}" value="${esc(marks.tot)}" oninput="onAggregateInput('${prefix}')">
      </label>
      <div class="agg-marks-pct">
        <span>Percentage</span>
        <strong id="agg-${prefix}-pct">${formatAggPct(pct)}</strong>
      </div>
    </div>
  </div>`;
}

function pageAggregate() {
  ensureAggState();
  maybePrefillAggregate();
  const agg = state.aggregate;
  const formula = AGG_FORMULAS[agg.formula] || AGG_FORMULAS.nust;
  const weights = currentAggWeights();
  const result = computeAggregate();
  const profileTotals = profileMarksTotals();

  return `<div class="agg-page">
    <div class="agg-intro">
      <h1>Aggregate Calculator</h1>
      <p>Enter obtained and total marks for Matric, Intermediate, and your entry test. We calculate each percentage, then your final aggregate.</p>
    </div>

    <div class="agg-layout">
      <div class="agg-main">
        <div class="agg-formula-row" role="tablist" aria-label="Aggregate formula">
          ${Object.values(AGG_FORMULAS).map((f) => `
            <button type="button" class="agg-formula-btn ${agg.formula === f.id ? 'active' : ''}"
              onclick="setAggregateFormula('${f.id}')">${esc(f.label)}</button>`).join('')}
        </div>
        <p class="agg-note">${esc(formula.note)}</p>

        <div class="agg-fields">
          ${aggMarksRow('matric', 'Matric / SSC', weights.matric, agg.matric, '1100')}
          ${aggMarksRow('fsc', 'Intermediate / FSc / HSSC', weights.fsc, agg.fsc, '1100')}
          ${profileTotals
            ? `<button type="button" class="agg-link" onclick="useProfileForFsc()">Use Academic Profile marks for Intermediate (${profileTotals.pct.toFixed(2)}%)</button>`
            : `<button type="button" class="agg-link" onclick="nav('academic')">Add subject marks in Academic Profile</button>`}
          ${aggMarksRow('test', formula.testLabel, weights.test, agg.test, formula.testTotalHint)}
        </div>

        ${agg.formula === 'custom' ? `
          <div class="agg-weights">
            <h3>Custom weights</h3>
            <div class="agg-weight-grid">
              <label>Matric weight
                <input id="agg-w-matric" type="number" min="0" max="100" step="1" value="${esc(agg.wMatric)}" oninput="onAggregateInput()">
              </label>
              <label>Intermediate weight
                <input id="agg-w-fsc" type="number" min="0" max="100" step="1" value="${esc(agg.wFsc)}" oninput="onAggregateInput()">
              </label>
              <label>Entry test weight
                <input id="agg-w-test" type="number" min="0" max="100" step="1" value="${esc(agg.wTest)}" oninput="onAggregateInput()">
              </label>
            </div>
          </div>` : ''}

        <div class="agg-actions">
          <button type="button" class="btn btn-outline btn-sm" onclick="resetAggregate()">Clear</button>
          <button type="button" class="btn btn-primary btn-sm" onclick="onAggregateInput()">Calculate</button>
        </div>
        <p class="agg-hint" id="agg-hint">${result.ok && Math.abs(result.weightSum - 100) > 0.01
          ? `Note: weights total ${result.weightSum.toFixed(1)}% (usually 100%).`
          : ''}</p>
      </div>

      <aside class="agg-result-panel">
        <div class="agg-result-label">Your aggregate</div>
        <div class="agg-result-value" id="agg-result">${result.ok ? result.aggregate.toFixed(2) + '%' : '—'}</div>
        <div class="agg-breakdown" id="agg-breakdown">${renderAggBreakdown(result)}</div>
        <p class="agg-disclaimer">Estimates only — official merit lists follow each university’s current policy.</p>
      </aside>
    </div>
  </div>`;
}
