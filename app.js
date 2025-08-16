
// Coefficients (embedded from CSV via JSON placed by backend)
const COEF = {
  "Intercepto": -0.000000,  // placeholder; will be set dynamically
};

// Load real coefficients from embedded JSON (injected at build step)
fetch('coef.json').then(r=>r.json()).then(data => {
  window.COEF_REAL = data;
  initApp();
});

function logistic(x){ return 1/(1+Math.exp(-x)); }

function i18nApply(lang){
  const STR = window.SSPVA_CONFIG.strings[lang];
  document.getElementById('subtitle').textContent = STR.subtitle;
  document.querySelector('[data-i18n="patientData"]').textContent = STR.patientData;
  document.querySelector('[data-i18n="modelVars"]').textContent = STR.modelVars;
  document.querySelector('[data-i18n="clear"]').textContent = STR.clear;
  document.querySelector('[data-i18n="presetLow"]').textContent = STR.presetLow;
  document.querySelector('[data-i18n="presetHigh"]').textContent = STR.presetHigh;
  document.querySelector('[data-i18n="result"]').textContent = STR.result;
  document.querySelector('[data-i18n="seeContrib"]').textContent = STR.seeContrib;
  document.querySelector('[data-i18n="var"]').textContent = STR.var;
  document.querySelector('[data-i18n="copy"]').textContent = STR.copy;
  document.querySelector('[data-i18n="print"]').textContent = STR.print;
  document.querySelector('[data-i18n="install"]').textContent = STR.install;
  document.querySelector('[data-i18n="aboutTitle"]').textContent = STR.aboutTitle;
  document.getElementById('about1').textContent = STR.about1;
  document.getElementById('about2').textContent = STR.about2;
  document.getElementById('footerTxt').textContent = STR.footer;
}

function buildCards(keys, labels, ultrasoundActive){
  const cards = document.getElementById('cards');
  cards.innerHTML = '';
  keys.forEach(k=>{
    const label = document.createElement('label');
    label.className = 'card';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('data-key', k);

    // Disable ultrasound vars when ultrasoundActive == false
    const isUS = window.SSPVA_CONFIG.usKeys.includes(k);
    input.disabled = (!ultrasoundActive && isUS);
    const span = document.createElement('span');
    span.textContent = labels[k] || k;
    label.appendChild(input);
    label.appendChild(span);
    cards.appendChild(label);
  });
}

function calc(state){
  const coef = window.COEF_REAL;
  const usActive = state.ultrasoundActive;
  const keys = state.keys;
  let eta = coef['Intercepto'] || 0;
  const rows = [];
  keys.forEach(k=>{
    const el = document.querySelector(`[data-key="${k}"]`);
    let xi = el && el.checked ? 1 : 0;
    const isUS = window.SSPVA_CONFIG.usKeys.includes(k);
    if (!usActive && isUS){ xi = 0; } // force zero if US off
    const bi = coef[k] || 0;
    eta += bi*xi;
    rows.push([state.labels[k]||k, bi, xi, bi*xi]);
  });
  const p = logistic(eta);
  document.getElementById('beta0').textContent = (coef['Intercepto']||0).toFixed(6);
  document.getElementById('eta').textContent = eta.toFixed(3);
  document.getElementById('prob').textContent = (p*100).toFixed(1) + '%';

  const STR = window.SSPVA_CONFIG.strings[state.lang];
  const risk = document.getElementById('risk');
  risk.classList.remove('low','mid','high');
  if (p < 0.10) { risk.textContent = STR.low; risk.classList.add('low'); }
  else if (p < 0.30) { risk.textContent = STR.mid; risk.classList.add('mid'); }
  else { risk.textContent = STR.high; risk.classList.add('high'); }

  const tbody = document.getElementById('table-rows');
  tbody.innerHTML = '';
  rows.forEach(r=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${r[0]}</td><td>${r[1].toFixed(4)}</td><td>${r[2]}</td><td>${r[3].toFixed(4)}</td>`;
    tbody.appendChild(tr);
  });

  // Update US label
  document.getElementById('us-label').textContent =
    state.ultrasoundActive ? STR.usOn : STR.usOff;
}

async function initApp(){
  const CFG = window.SSPVA_CONFIG;
  let lang = 'pt';
  let ultrasoundActive = true;

  // inject title/brand
  document.getElementById('title').textContent = CFG.brandName;

  // labels (PT-only; English will reuse English phrases for variables)
  const labelsPT = {
    "TMHT_low": "TMHT ≤ 50 mm",
    "ULBT_III": "ULBT classe III (incapaz)",
    "ULBT_II": "ULBT classe II (parcial)",
    "Open_lt3": "Abertura oral < 3 cm",
    "History_DI": "História de intubação difícil / patologia de VA",
    "Mall_IV": "Mallampati IV",
    "Mall_III": "Mallampati III",
    "TMD_lt6": "TMD < 6 cm",
    "NeckMob_red": "Mobilidade cervical reduzida",
    "NC_TMD_gt5": "Razão NC/TMD > 5",
    "Support_any": "Fatores de suporte (incisivos proeminentes, barba espessa, NC 40–43 cm)",
    "DSE_high": "US: Distância pele–epiglote aumentada",
    "Tongue_thick": "US: Língua espessa",
    "HMDR_abn": "US: HMDR anormal"
  };
  const labelsEN = {
    "TMHT_low": "TMHT ≤ 50 mm",
    "ULBT_III": "ULBT class III (unable)",
    "ULBT_II": "ULBT class II (partial)",
    "Open_lt3": "Mouth opening < 3 cm",
    "History_DI": "Hx difficult intubation / airway pathology",
    "Mall_IV": "Mallampati IV",
    "Mall_III": "Mallampati III",
    "TMD_lt6": "TMD < 6 cm",
    "NeckMob_red": "Reduced neck mobility",
    "NC_TMD_gt5": "NC/TMD ratio > 5",
    "Support_any": "Support factors (buck teeth, beard, NC 40–43 cm)",
    "DSE_high": "US: Increased skin–epiglottis distance",
    "Tongue_thick": "US: Thick tongue",
    "HMDR_abn": "US: HMDR abnormal"
  };

  // variable order
  const keys = ["TMHT_low","ULBT_III","ULBT_II","Open_lt3","History_DI",
         "Mall_IV","Mall_III","TMD_lt6","NeckMob_red","NC_TMD_gt5","Support_any",
         "DSE_high","Tongue_thick","HMDR_abn"];

  // Apply i18n defaults
  i18nApply(lang);

  // Build cards
  buildCards(keys, labelsPT, ultrasoundActive);

  const state = {
    lang, ultrasoundActive, keys,
    labels: labelsPT
  };

  // Bind listeners
  document.getElementById('lang-toggle').addEventListener('click', ()=>{
    state.lang = (state.lang === 'pt') ? 'en' : 'pt';
    const STR = CFG.strings[state.lang];
    document.getElementById('lang-toggle').textContent = (state.lang === 'pt') ? 'EN' : 'PT';
    i18nApply(state.lang);
    state.labels = (state.lang === 'pt') ? labelsPT : labelsEN;
    buildCards(keys, state.labels, state.ultrasoundActive);
    // rebind checkbox listeners
    document.querySelectorAll('input[type="checkbox"]').forEach(ch=> ch.addEventListener('change', ()=>calc(state)));
    calc(state);
  });

  document.getElementById('ultrasound-toggle').checked = true;
  document.getElementById('ultrasound-toggle').addEventListener('change', (e)=>{
    state.ultrasoundActive = e.target.checked;
    buildCards(keys, state.labels, state.ultrasoundActive);
    document.querySelectorAll('input[type="checkbox"]').forEach(ch=> ch.addEventListener('change', ()=>calc(state)));
    calc(state);
  });

  document.getElementById('clear').addEventListener('click', ()=>{
    document.querySelectorAll('input[type="checkbox"]').forEach(ch=> ch.checked = false);
    calc(state);
  });
  document.getElementById('preset-low').addEventListener('click', ()=>{
    document.querySelectorAll('input[type="checkbox"]').forEach(ch=> ch.checked = false);
    calc(state);
  });
  document.getElementById('preset-high').addEventListener('click', ()=>{
    document.querySelectorAll('input[type="checkbox"]').forEach(ch=> ch.checked = true);
    // if US off, US checkboxes are disabled -> stay off automatically
    calc(state);
  });
  document.getElementById('copy').addEventListener('click', ()=>{
    const id = document.getElementById('pid').value || '(sem ID)';
    const notes = document.getElementById('notes').value || '';
    const prob = document.getElementById('prob').textContent;
    const risk = document.getElementById('risk').textContent;
    let txt = `SSP‑VA 3.0\nID: ${id}\nProbabilidade: ${prob}\nRisco: ${risk}`;
    if (notes) txt += `\nObs.: ${notes}`;
    navigator.clipboard.writeText(txt).then(()=>{alert('Resultado copiado!');});
  });
  document.getElementById('print').addEventListener('click', ()=> window.print());

  // First calc
  document.querySelectorAll('input[type="checkbox"]').forEach(ch=> ch.addEventListener('change', ()=>calc(state)));

  // Show coefficients JSON
  document.getElementById('coef-json').textContent = JSON.stringify(window.COEF_REAL, null, 2);

  // initial calc
  calc(state);
}
