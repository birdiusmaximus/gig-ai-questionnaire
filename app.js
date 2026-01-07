const SUPABASE_URL = "https://frtoudvswokiiqcgrpbg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydG91ZHZzd29raWlxY2dycGJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzA1OTksImV4cCI6MjA4MTY0NjU5OX0.G6cSwOjOjbRoaWQfGSfXc78AjohVPDXPz9oqAPFiaw4";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const spec = window.QUESTIONNAIRE_SPEC;
const questions = spec.questions;

const el = (id) => document.getElementById(id);
const qTitle = el("qTitle");
const qHelp = el("qHelp");
const control = el("control");
const backBtn = el("backBtn");
const nextBtn = el("nextBtn");
const stepTop = el("stepTop");
const errorEl = el("error");
const progressFill = el("progressFill");
const progressDots = el("progressDots");

let state = {
  startedAtMs: Date.now(),
  responseId: null,
  waveId: null,
  answers: {},
  index: -1
};

function setError(msg=""){ errorEl.textContent = msg || ""; }

function setStepIndicator(){
  if (state.index < 0){ stepTop.textContent = ""; return; }
  stepTop.textContent = `Step ${state.index + 1} of ${questions.length}`;
}

function setProgress(){
  const total = questions.length;
  const current = Math.max(0, state.index);
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);
  progressFill.style.width = `${pct}%`;

  const dotsCount = 5;
  progressDots.innerHTML = "";
  const active = Math.round((current/(total-1 || 1))*(dotsCount-1));
  for (let i=0;i<dotsCount;i++) {
    const d = document.createElement("div");
    d.className = "dot" + (active === i ? " active" : "");
    progressDots.appendChild(d);
  }
}

function saveLocalAnswer(qid, payload){ state.answers[qid] = payload; }
function loadLocalAnswer(qid){ return state.answers[qid]; }
function getQuestion(){ return state.index >= 0 ? questions[state.index] : null; }

async function fetchActiveWaveId(){
  const { data, error } = await supabase
    .from("waves")
    .select("wave_id")
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data?.wave_id || spec.waveDefault;
}

async function insertResponseRow(){
  const response_id = crypto.randomUUID();
  const started_at = new Date().toISOString();
  const { error } = await supabase
    .from("responses")
    .insert({
      response_id,
      wave_id: state.waveId,
      started_at,
      client_metadata: {
        userAgent: navigator.userAgent,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || null
      }
    });
  if (error) throw error;
  state.responseId = response_id;
}

async function upsertAnswer(q, payload){
  const row = {
    response_id: state.responseId,
    question_id: q.id,
    value_number: payload.value_number ?? null,
    value_text: payload.value_text ?? null,
    value_array: payload.value_array ?? null
  };
  const { error } = await supabase
    .from("answers")
    .upsert(row, { onConflict: "response_id,question_id" });
  if (error) throw error;
}

async function markSubmitted(){
  const completion_time_sec = Math.round((Date.now() - state.startedAtMs) / 1000);
  const submitted_at = new Date().toISOString();
  const { error } = await supabase
    .from("responses")
    .update({ submitted_at, completion_time_sec })
    .eq("response_id", state.responseId);
  if (error) throw error;
}

function renderIntro(){
  qTitle.textContent = spec.intro.title;
  qHelp.textContent = spec.intro.help;
  control.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "pills";

  const btn = document.createElement("button");
  btn.className = "pill active";
  btn.type = "button";
  btn.textContent = spec.intro.beginLabel || "Begin";

  btn.addEventListener("click", async () => {
    setError("");
    btn.disabled = true;
    try {
      state.waveId = await fetchActiveWaveId();
      await insertResponseRow();
      state.index = 0;
      render();
    } catch(e) {
      console.error(e);
      setError("Could not start the survey. Please refresh and try again.");
      btn.disabled = false;
    }
  });

  wrap.appendChild(btn);
  control.appendChild(wrap);

  backBtn.disabled = true;
  nextBtn.disabled = true;
  nextBtn.textContent = "Next";
  setStepIndicator();
  setProgress();
}

function seatPulse(bubble){
  bubble.classList.add("seat");
  window.setTimeout(() => bubble.classList.remove("seat"), 110);
}

function buildTicks(min, max, every) {
  const ticks = [];
  ticks.push(min);
  if (every && every > 0) {
    let v = min;
    while (v + every < max) {
      v += every;
      ticks.push(v);
    }
  }
  if (ticks[ticks.length - 1] !== max) ticks.push(max);
  return ticks;
}

function renderSlider(q){
  control.innerHTML = "";
  const saved = loadLocalAnswer(q.id);
  const s = q.slider;

  const wrap = document.createElement("div");
  wrap.className = "slider-wrap";

  const bubble = document.createElement("div");
  bubble.className = "slider-bubble";
  wrap.appendChild(bubble);

  const input = document.createElement("input");
  input.type = "range";
  input.min = String(s.min);
  input.max = String(s.max);
  input.step = String(s.step || 1);

  let startVal = saved?.value_number;
  if (typeof startVal !== "number") startVal = Math.round((s.min + s.max) / 2);
  input.value = String(startVal);

  function formatValue(v){
    const n = Number(v);
    if (q.id === "Q01_YEARS_EXPERIENCE" && n === 15) return "15+";
    return String(n);
  }

  let lastVal = input.value;
  function update(){
    bubble.textContent = formatValue(input.value);
  }
  input.addEventListener("input", () => {
    if (input.value !== lastVal){
      lastVal = input.value;
      seatPulse(bubble);
    }
    update();
    saveLocalAnswer(q.id, { value_number: Number(input.value) });
  });
  input.addEventListener("change", () => {
    seatPulse(bubble);
    saveLocalAnswer(q.id, { value_number: Number(input.value) });
  });

  wrap.appendChild(input);

  // Tick labels under bar (can be coarser than step=1)
  const ticks = buildTicks(s.min, s.max, s.tickEvery || null);
  const tickRow = document.createElement("div");
  tickRow.className = "slider-ticks";
  ticks.forEach((t, i) => {
    const d = document.createElement("div");
    d.textContent = (q.id === "Q01_YEARS_EXPERIENCE" && t === 15) ? "15+" : String(t);
    tickRow.appendChild(d);
  });
  wrap.appendChild(tickRow);

  const labels = document.createElement("div");
  labels.className = "slider-labels";
  const left = document.createElement("div");
  left.textContent = s.labels?.left ?? String(s.min);
  const right = document.createElement("div");
  right.textContent = s.labels?.right ?? String(s.max);
  labels.appendChild(left);
  labels.appendChild(right);
  wrap.appendChild(labels);

  if (s.labels?.mid){
    const mid = document.createElement("div");
    mid.className = "slider-mid";
    mid.textContent = s.labels.mid;
    wrap.appendChild(mid);
  }

  control.appendChild(wrap);
  update();
}

function renderSingle(q){
  control.innerHTML = "";
  const saved = loadLocalAnswer(q.id);
  let current = saved?.value_text ?? null;

  const wrap = document.createElement("div");
  wrap.className = "pills";

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pill" + (current === opt ? " active" : "");
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      current = opt;
      [...wrap.children].forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      saveLocalAnswer(q.id, { value_text: opt });
    });
    wrap.appendChild(btn);
  });

  control.appendChild(wrap);
}

function checkboxRow(label, checked, onToggle){
  const row = document.createElement("div");
  row.className = "option";

  const left = document.createElement("div");
  left.className = "left";

  const box = document.createElement("span");
  box.className = "chk" + (checked ? " checked" : "");
  box.innerHTML = checked
    ? "<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 6L9 17l-5-5' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/></svg>"
    : "";

  const t = document.createElement("div");
  t.textContent = label;

  left.appendChild(box);
  left.appendChild(t);

  row.appendChild(left);
  row.appendChild(document.createElement("div"));

  row.addEventListener("click", () => onToggle());

  return { row, box };
}

function renderMulti(q){
  control.innerHTML = "";
  const saved = loadLocalAnswer(q.id);
  const selected = new Set(saved?.value_array?.selections ?? []);

  const list = document.createElement("div");
  list.className = "list";

  q.options.forEach((opt) => {
    const checked = selected.has(opt);
    const { row, box } = checkboxRow(opt, checked, () => {
      if (selected.has(opt)) selected.delete(opt);
      else selected.add(opt);

      const isChecked = selected.has(opt);
      box.className = "chk" + (isChecked ? " checked" : "");
      box.innerHTML = isChecked
        ? "<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 6L9 17l-5-5' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/></svg>"
        : "";

      saveLocalAnswer(q.id, { value_array: { selections: [...selected] } });
    });

    list.appendChild(row);
  });

  control.appendChild(list);
}

function renderMultiGrouped(q, expandable){
  control.innerHTML = "";
  const saved = loadLocalAnswer(q.id);
  const selections = new Set(saved?.value_array?.selections ?? []);
  const other = Object.assign({}, saved?.value_array?.other ?? {});

  const container = document.createElement("div");
  container.style.width = "100%";

  q.groups.forEach((g, idx) => {
    const section = document.createElement("div");
    section.className = "section" + (expandable ? " collapsed" : "");
    if (!expandable) section.classList.remove("collapsed");

    const header = document.createElement("div");
    header.className = "section-header";

    const title = document.createElement("div");
    title.className = "section-title";
    title.textContent = g.key;

    const toggle = document.createElement("div");
    toggle.className = "section-toggle";
    toggle.textContent = expandable ? "Show" : "";

    header.appendChild(title);
    header.appendChild(toggle);

    if (expandable){
      header.addEventListener("click", () => {
        section.classList.toggle("collapsed");
        toggle.textContent = section.classList.contains("collapsed") ? "Show" : "Hide";
      });
    }

    const body = document.createElement("div");
    body.className = "section-body";

    g.items.forEach((item) => {
      const key = `${g.key}::${item}`;
      const checked = selections.has(key);

      const { row, box } = checkboxRow(item, checked, () => {
        if (selections.has(key)) selections.delete(key);
        else selections.add(key);

        const isChecked = selections.has(key);
        box.className = "chk" + (isChecked ? " checked" : "");
        box.innerHTML = isChecked
          ? "<svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20 6L9 17l-5-5' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/></svg>"
          : "";

        saveLocalAnswer(q.id, { value_array: { selections: [...selections], other } });
      });

      body.appendChild(row);
    });

    if (g.allowOther){
      const otherWrap = document.createElement("div");
      otherWrap.className = "other-input";
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Other (optional)…";
      input.value = other[g.key] || "";
      input.addEventListener("input", () => {
        other[g.key] = input.value;
        saveLocalAnswer(q.id, { value_array: { selections: [...selections], other } });
      });
      otherWrap.appendChild(input);
      body.appendChild(otherWrap);
    }

    section.appendChild(header);
    section.appendChild(body);
    container.appendChild(section);

    if (expandable && idx === 0){
      section.classList.remove("collapsed");
      toggle.textContent = "Hide";
    }
  });

  control.appendChild(container);
}

function renderTimeline(q){
  control.innerHTML = "";
  const saved = loadLocalAnswer(q.id);
  const selected = new Set(saved?.value_array?.selections ?? []);

  const wrap = document.createElement("div");
  wrap.className = "timeline";

  q.nodes.forEach((label) => {
    const pill = document.createElement("div");
    pill.className = "node-pill" + (selected.has(label) ? " active" : "");
    pill.textContent = label;

    pill.addEventListener("click", () => {
      if (selected.has(label)) selected.delete(label);
      else selected.add(label);
      pill.className = "node-pill" + (selected.has(label) ? " active" : "");
      saveLocalAnswer(q.id, { value_array: { selections: [...selected] } });
    });

    const node = document.createElement("div");
    node.className = "node";
    node.appendChild(pill);
    wrap.appendChild(node);
  });

  control.appendChild(wrap);
}

function renderText(q){
  control.innerHTML = "";
  const saved = loadLocalAnswer(q.id);

  const wrap = document.createElement("div");
  wrap.className = "textarea";

  const ta = document.createElement("textarea");
  ta.maxLength = q.text?.maxChars ?? 240;
  ta.placeholder = q.text?.placeholder ?? "Write your response…";
  ta.value = saved?.value_text ?? "";

  const charline = document.createElement("div");
  charline.className = "charline";

  function update(){
    charline.textContent = `${ta.value.length}/${ta.maxLength}`;
    saveLocalAnswer(q.id, { value_text: ta.value });
  }
  ta.addEventListener("input", update);

  wrap.appendChild(ta);
  wrap.appendChild(charline);
  control.appendChild(wrap);
  update();
}

function renderQuestion(){
  const q = getQuestion();
  qTitle.textContent = q.title;
  qHelp.textContent = q.help;
  setError("");

  if (q.type === "slider") renderSlider(q);
  else if (q.type === "single") renderSingle(q);
  else if (q.type === "multi") renderMulti(q);
  else if (q.type === "multi_grouped") renderMultiGrouped(q, false);
  else if (q.type === "multi_grouped_expand") renderMultiGrouped(q, true);
  else if (q.type === "timeline_multi") renderTimeline(q);
  else if (q.type === "text") renderText(q);

  backBtn.disabled = state.index <= 0;
  nextBtn.disabled = false;
  nextBtn.textContent = state.index === questions.length - 1 ? "Submit" : "Next";

  setStepIndicator();
  setProgress();
}

function validateCurrent(){
  const q = getQuestion();
  const a = loadLocalAnswer(q.id);

  if (!q.required) return { ok: true };

  if (q.type === "slider"){
    if (typeof a?.value_number !== "number") return { ok: false, msg: "Please select a value to continue." };
    return { ok: true };
  }
  if (q.type === "single"){
    if (!a?.value_text) return { ok: false, msg: "Please choose one option to continue." };
    return { ok: true };
  }
  if (q.type === "multi" || q.type === "timeline_multi"){
    const sel = a?.value_array?.selections ?? [];
    if (!Array.isArray(sel) || sel.length === 0) return { ok: false, msg: "Please select at least one option to continue." };
    return { ok: true };
  }
  if (q.type === "text"){
    const t = (a?.value_text ?? "").trim();
    if (t.length < 3) return { ok: false, msg: "Please write a brief response to continue." };
    return { ok: true };
  }
  return { ok: true };
}

function toSupabasePayload(q){
  const a = loadLocalAnswer(q.id) || {};
  if (q.type === "slider") return { value_number: a.value_number };
  if (q.type === "single") return { value_text: a.value_text };
  if (q.type === "text") return { value_text: a.value_text };
  if (q.type === "multi" || q.type === "timeline_multi") return { value_array: { selections: (a.value_array?.selections ?? []) } };
  if (q.type === "multi_grouped" || q.type === "multi_grouped_expand"){
    return { value_array: { selections: (a.value_array?.selections ?? []), other: (a.value_array?.other ?? {}) } };
  }
  return { value_text: JSON.stringify(a) };
}

async function onNext(){
  setError("");
  const q = getQuestion();
  if (state.index < 0) return;

  const v = validateCurrent();
  if (!v.ok){ setError(v.msg); return; }

  nextBtn.disabled = true;
  backBtn.disabled = true;

  try {
    await upsertAnswer(q, toSupabasePayload(q));

    if (state.index === questions.length - 1){
      await markSubmitted();
      renderComplete();
      return;
    }
    state.index += 1;
    render();
  } catch(e) {
    console.error(e);
    setError("Could not save your answer. Please check your connection and try again.");
    nextBtn.disabled = false;
    backBtn.disabled = state.index <= 0;
  }
}

function onBack(){
  if (state.index <= 0) return;
  state.index -= 1;
  render();
}

function renderComplete(){
  stepTop.textContent = "";
  qTitle.textContent = "Thank you.";
  qHelp.textContent = "Your response has been recorded. You may now close this window.";
  control.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "pills";

  const done = document.createElement("div");
  done.className = "pill active";
  done.style.cursor = "default";
  done.textContent = "Completed";
  wrap.appendChild(done);

  control.appendChild(wrap);

  backBtn.disabled = true;
  nextBtn.disabled = true;
  progressFill.style.width = "100%";
}

function render(){
  if (state.index < 0) renderIntro();
  else renderQuestion();
}

backBtn.addEventListener("click", onBack);
nextBtn.addEventListener("click", onNext);

(function init(){
  renderIntro();
})();
