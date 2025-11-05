// do-exam/scripts/main.js
// Updated: mark-as-done feature + skip confirm on exit after submit
// Compatible with embedded `exams` or external ../scripts/exam.js exports

/* ---------------------------
   Config / LocalStorage keys
   --------------------------- */
const LS_REPEAT_KEY_PREFIX = 'repeat-exam-';
const LS_ANS_KEY_PREFIX = 'exam-answers-';
const LS_RESULT_PREFIX = 'exam-result-';
const LS_START_PREFIX = 'exam-start-';
const LS_DONE_KEY_PREFIX = 'exam-done-';

let embeddedExams = typeof exams !== 'undefined' ? exams : null; // legacy
let externalLists = null; // loaded dynamically if present

let currentListIndex = null; // 'fixed' or 0-based index for external lists
let currentExamIndex = null; // index within chosen list
let currentExam = null;
let userAnswers = { ans1: [], ans2: [], ans3: [] };
let timerInterval = null;
let startTimestamp = null;
let isSubmitted = false;

/* ---------------------------
   DOM helpers
   --------------------------- */
const el = (sel, ctx = document) => (ctx || document).querySelector(sel);
const elAll = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

/* ---------------------------
   Stable exam key for localStorage
   --------------------------- */
function makeExamKey(listId, exam) {
  try {
    const examId = (exam && (exam.id !== undefined && exam.id !== null)) ? String(exam.id) : null;
    if (examId) return `${listId}-${examId}`;
    const link = (exam && exam.link) ? exam.link : 'no-link';
    const short = (typeof btoa === 'function') ? btoa(link).slice(0, 12) : String(link).slice(0, 12);
    return `${listId}-${short}`;
  } catch (e) {
    console.warn('makeExamKey fallback', e);
    return `${listId}-unknown`;
  }
}

/* ---------------------------
   localStorage helpers
   --------------------------- */
function saveRepeat(listId, repeatArr) { try { localStorage.setItem(LS_REPEAT_KEY_PREFIX + listId, JSON.stringify(repeatArr)); } catch (e) {} }
function loadRepeat(listId) { try { return JSON.parse(localStorage.getItem(LS_REPEAT_KEY_PREFIX + listId)) || []; } catch (e) { return []; } }

function saveUserAnswers() {
  if (!currentExam) return;
  try { const key = LS_ANS_KEY_PREFIX + makeExamKey(currentListIndex, currentExam); localStorage.setItem(key, JSON.stringify(userAnswers)); } catch (e) { console.warn('saveUserAnswers', e); }
}
function loadUserAnswers() {
  if (!currentExam) return null;
  try { const raw = localStorage.getItem(LS_ANS_KEY_PREFIX + makeExamKey(currentListIndex, currentExam)); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
}

function saveResult(resultObj) {
  if (!currentExam) return;
  try { localStorage.setItem(LS_RESULT_PREFIX + makeExamKey(currentListIndex, currentExam), JSON.stringify(resultObj)); } catch (e) { console.warn('saveResult', e); }
}
function loadStart() {
  if (!currentExam) return null;
  try { const raw = localStorage.getItem(LS_START_PREFIX + makeExamKey(currentListIndex, currentExam)); return raw ? Number(raw) : null; } catch (e) { return null; }
}
function saveStart(ts) {
  if (!currentExam) return;
  try { localStorage.setItem(LS_START_PREFIX + makeExamKey(currentListIndex, currentExam), String(ts)); } catch (e) {}
}
function clearStart() { if (!currentExam) return; try { localStorage.removeItem(LS_START_PREFIX + makeExamKey(currentListIndex, currentExam)); } catch (e) {} }
function clearSavedAnswers() { if (!currentExam) return; try { localStorage.removeItem(LS_ANS_KEY_PREFIX + makeExamKey(currentListIndex, currentExam)); } catch (e) {} }
function clearResult() { if (!currentExam) return; try { localStorage.removeItem(LS_RESULT_PREFIX + makeExamKey(currentListIndex, currentExam)); } catch (e) {} }

/* ---------------------------
   NEW: mark-done helpers
   --------------------------- */
function saveDone() {
  if (!currentExam) return;
  try {
    const key = LS_DONE_KEY_PREFIX + makeExamKey(currentListIndex, currentExam);
    const ts = String(Date.now());
    // set timestamp value so index can show completion time if desired
    localStorage.setItem(key, ts);
    // small extra flag to make storage key distinct for listeners (optional)
    localStorage.setItem(key + ':flag', '1');
    // NOTE: other tabs will receive storage event for these keys
  } catch (e) { console.warn('saveDone failed', e); }
}
function loadDone() {
  if (!currentExam) return false;
  try {
    const key = LS_DONE_KEY_PREFIX + makeExamKey(currentListIndex, currentExam);
    return !!localStorage.getItem(key);
  } catch (e) { return false; }
}
function clearDone() {
  if (!currentExam) return;
  try {
    const key = LS_DONE_KEY_PREFIX + makeExamKey(currentListIndex, currentExam);
    localStorage.removeItem(key);
    localStorage.removeItem(key + ':flag');
  } catch (e) { console.warn('clearDone failed', e); }
}

/* ---------------------------
   URL params utility
   --------------------------- */
function getUrlParams() {
  const params = new URLSearchParams(location.search);
  return {
    list: params.has('list') ? (isNaN(Number(params.get('list'))) ? null : Number(params.get('list'))) : null,
    ord: params.has('ord') ? (isNaN(Number(params.get('ord'))) ? null : Number(params.get('ord'))) : null
  };
}

/* ---------------------------
   Dynamic load of external lists (exam.js)
   --------------------------- */
async function tryLoadExternalLists() {
  try {
    const mod = await import('../scripts/exam.js');
    const lists = [];
    if (mod.exam1 && Array.isArray(mod.exam1.exams)) lists.push(mod.exam1);
    if (mod.exam2 && Array.isArray(mod.exam2.exams)) lists.push(mod.exam2);
    for (const k of Object.keys(mod)) {
      if ((k.startsWith('exam') || k.startsWith('list')) && mod[k] && Array.isArray(mod[k].exams) && !lists.includes(mod[k])) {
        lists.push(mod[k]);
      }
    }
    if (lists.length) return lists;
  } catch (e) {
    // ignore - fallback to embedded
  }
  return null;
}

/* ---------------------------
   Random non-repeat selection
   --------------------------- */
function pickRandomIndexFromList(listId, arrLength) {
  let repeat = loadRepeat(listId);
  if (repeat.length === arrLength) repeat = [];
  let available = Array.from({ length: arrLength }, (_, i) => i).filter(i => !repeat.includes(i));
  if (available.length === 0) { available = Array.from({ length: arrLength }, (_, i) => i); repeat = []; }
  const chosen = available[Math.floor(Math.random() * available.length)];
  repeat.push(chosen);
  saveRepeat(listId, repeat);
  return chosen;
}

/* ---------------------------
   Rendering UI (main)
   --------------------------- */
function renderAll() {
  if (!currentExam) {
    console.error('renderAll: currentExam not set');
    const iframe = el('#main-iframe'); if (iframe) iframe.src = '';
    return;
  }

  currentExam.ans1 = Array.isArray(currentExam.ans1) ? currentExam.ans1 : [];
  currentExam.ans2 = Array.isArray(currentExam.ans2) ? currentExam.ans2 : [];
  currentExam.ans3 = Array.isArray(currentExam.ans3) ? currentExam.ans3 : [];

  const iframe = el('#main-iframe');
  if (currentExam && iframe && currentExam.link) iframe.src = currentExam.link;

  try {
    renderMCQ();
    renderTrueFalse();
    renderShortAnswers();
  } catch (err) {
    console.error('renderAll: error while rendering sections', err);
    return;
  }

  const saved = loadUserAnswers();
  if (saved) {
    userAnswers = saved;
    applyAnswersToUI();
  } else {
    userAnswers = {
      ans1: new Array(currentExam.ans1.length).fill(null),
      ans2: currentExam.ans2.map(sub => new Array(sub.length).fill(null)),
      ans3: new Array(currentExam.ans3.length).fill('')
    };
    saveUserAnswers();
  }

  startOrResumeTimer();
  showDoneBadgeIfNeeded();
}

/* ---------------------------
   MCQ rendering
   --------------------------- */
function renderMCQ() {
  const container = el('.ex1-answer'); if (!container) return; container.innerHTML = '';
  const arr = Array.isArray(currentExam.ans1) ? currentExam.ans1 : [];
  if (!arr.length) {
    const msg = document.createElement('div'); msg.className = 'no-questions'; msg.textContent = 'Không có câu hỏi trắc nghiệm (MCQ) trong đề này.'; container.appendChild(msg); return;
  }
  for (let idx = 0; idx < arr.length; idx++) {
    const qWrap = document.createElement('div'); qWrap.className = 'question-ex1'; qWrap.dataset.qidx = String(idx);
    const label = document.createElement('div'); label.className = 'q-label'; label.textContent = `Câu ${idx + 1}:`; qWrap.appendChild(label);
    ['A','B','C','D'].forEach(choice => {
      const d = document.createElement('div'); d.className = 'choice ' + choice; d.tabIndex = 0; d.textContent = choice; d.dataset.choice = choice;
      d.addEventListener('click', onMCQChoiceClick);
      d.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); d.click(); } });
      qWrap.appendChild(d);
    });
    container.appendChild(qWrap);
  }
}

function onMCQChoiceClick(e) {
  if (isSubmitted) return;
  const target = e.currentTarget;
  const qWrap = target.closest('.question-ex1');
  if (!qWrap) return;
  const qidx = Number(qWrap.dataset.qidx);
  const choice = target.dataset.choice;
  elAll('.choice', qWrap).forEach(ch => ch.classList.remove('selected'));
  target.classList.add('selected');
  userAnswers.ans1[qidx] = choice;
  saveUserAnswers();
}

/* ---------------------------
   True/False rendering
   --------------------------- */
function renderTrueFalse() {
  const container = el('.ex2-answer'); if (!container) return; container.innerHTML = '';
  const arr = Array.isArray(currentExam.ans2) ? currentExam.ans2 : [];
  arr.forEach((subQ, qIndex) => {
    const qDiv = document.createElement('div'); qDiv.className = 'question-ex2'; qDiv.dataset.qidx = String(qIndex);
    const h2 = document.createElement('h2'); h2.textContent = `Câu ${qIndex + 1}:`; qDiv.appendChild(h2);
    subQ.forEach((_, ideaIdx) => {
      const idea = document.createElement('div'); idea.className = 'idea-container'; idea.dataset.ideaIdx = String(ideaIdx);
      const span = document.createElement('span'); span.textContent = `${String.fromCharCode(97 + ideaIdx)})`; idea.appendChild(span);
      const trueBtn = document.createElement('div'); trueBtn.className = 'true-choice'; trueBtn.tabIndex = 0; trueBtn.textContent = 'Đ'; trueBtn.dataset.value = 'Đ';
      const falseBtn = document.createElement('div'); falseBtn.className = 'false-choice'; falseBtn.tabIndex = 0; falseBtn.textContent = 'S'; falseBtn.dataset.value = 'S';
      trueBtn.addEventListener('click', onTFChoiceClick); trueBtn.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); trueBtn.click(); } });
      falseBtn.addEventListener('click', onTFChoiceClick); falseBtn.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); falseBtn.click(); } });
      idea.appendChild(trueBtn); idea.appendChild(falseBtn); qDiv.appendChild(idea);
    });
    container.appendChild(qDiv);
  });
}

function onTFChoiceClick(e) {
  if (isSubmitted) return;
  const btn = e.currentTarget;
  const idea = btn.closest('.idea-container'); if (!idea) return;
  const qDiv = btn.closest('.question-ex2'); if (!qDiv) return;
  const qIndex = Number(qDiv.dataset.qidx);
  const ideaIdx = Number(idea.dataset.ideaIdx);
  const val = btn.dataset.value;
  const [trueBtn, falseBtn] = elAll('.true-choice, .false-choice', idea);
  if (trueBtn) trueBtn.classList.remove('selected');
  if (falseBtn) falseBtn.classList.remove('selected');
  btn.classList.add('selected');
  if (!Array.isArray(userAnswers.ans2)) userAnswers.ans2 = [];
  if (!Array.isArray(userAnswers.ans2[qIndex])) userAnswers.ans2[qIndex] = new Array(currentExam.ans2[qIndex].length).fill(null);
  userAnswers.ans2[qIndex][ideaIdx] = val;
  saveUserAnswers();
}

/* ---------------------------
   Short-answer rendering
   --------------------------- */
function renderShortAnswers() {
  const container = el('.ex3-answer'); if (!container) return; container.innerHTML = '';
  const inner = document.createElement('div'); inner.className = 'question-ex3';
  const arr = Array.isArray(currentExam.ans3) ? currentExam.ans3 : [];
  arr.forEach((_, idx) => {
    const shortItem = document.createElement('div'); shortItem.className = 'short-item'; shortItem.style.marginBottom = '12px';
    const h2 = document.createElement('h2'); h2.textContent = `Câu ${idx + 1}`; shortItem.appendChild(h2);
    const input = document.createElement('input'); input.type = 'text'; input.placeholder = 'Trả lời:'; input.dataset.idx = String(idx);
    input.addEventListener('input', (ev) => { userAnswers.ans3[idx] = ev.target.value; saveUserAnswers(); });
    input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ev.preventDefault(); });
    shortItem.appendChild(input); inner.appendChild(shortItem);
  });
  container.appendChild(inner);
}

/* ---------------------------
   Apply saved answers to UI
   --------------------------- */
function applyAnswersToUI() {
  elAll('.question-ex1').forEach(qWrap => {
    const qidx = Number(qWrap.dataset.qidx);
    const ans = (userAnswers.ans1 && userAnswers.ans1[qidx]) ? userAnswers.ans1[qidx] : null;
    elAll('.choice', qWrap).forEach(ch => ch.classList.toggle('selected', ch.dataset.choice === ans));
  });
  elAll('.question-ex2').forEach(qDiv => {
    const qIndex = Number(qDiv.dataset.qidx);
    elAll('.idea-container', qDiv).forEach(idea => {
      const ideaIdx = Number(idea.dataset.ideaIdx);
      const saved = (userAnswers.ans2 && userAnswers.ans2[qIndex]) ? userAnswers.ans2[qIndex][ideaIdx] : null;
      const [trueBtn, falseBtn] = elAll('.true-choice, .false-choice', idea);
      if (trueBtn) trueBtn.classList.toggle('selected', saved === 'Đ');
      if (falseBtn) falseBtn.classList.toggle('selected', saved === 'S');
    });
  });
  elAll('.ex3-answer input[type="text"]').forEach(inp => { const idx = Number(inp.dataset.idx); if (userAnswers.ans3 && userAnswers.ans3[idx] != null) inp.value = userAnswers.ans3[idx]; });
}

/* ---------------------------
   Timer
   --------------------------- */
function fmtTimeElapsed(ms) { const s = Math.floor(ms / 1000); const mm = Math.floor(s / 60).toString().padStart(2, '0'); const ss = (s % 60).toString().padStart(2, '0'); return `${mm}:${ss}`; }

function startOrResumeTimer() {
  const timeEl = el('.point.time'); if (!timeEl) return;
  const savedStart = loadStart();
  if (savedStart) startTimestamp = savedStart; else { startTimestamp = Date.now(); saveStart(startTimestamp); }
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => { const elapsed = Date.now() - startTimestamp; timeEl.textContent = `Thời gian: ${fmtTimeElapsed(elapsed)}`; }, 500);
}

/* ---------------------------
   Grading & submit
   --------------------------- */
function normalizeNumberAnswer(s) { if (s === null || s === undefined) return ''; return String(s).trim().replace(/\./g, ','); }

function submitExam() {
  if (isSubmitted) return;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  const elapsed = Date.now() - startTimestamp;

  userAnswers.ans1 = Array.isArray(userAnswers.ans1) ? userAnswers.ans1 : [];
  userAnswers.ans2 = Array.isArray(userAnswers.ans2) ? userAnswers.ans2 : [];
  userAnswers.ans3 = Array.isArray(userAnswers.ans3) ? userAnswers.ans3 : [];

  const mcqCount = Array.isArray(currentExam.ans1) ? currentExam.ans1.length : 0;
  const tfQuestions = Array.isArray(currentExam.ans2) ? currentExam.ans2.length : 0;
  const shortCount = Array.isArray(currentExam.ans3) ? currentExam.ans3.length : 0;

  if (userAnswers.ans1.length < mcqCount) userAnswers.ans1.length = mcqCount;
  if (userAnswers.ans3.length < shortCount) userAnswers.ans3.length = shortCount;
  for (let q = 0; q < tfQuestions; q++) {
    if (!Array.isArray(userAnswers.ans2[q])) userAnswers.ans2[q] = new Array(currentExam.ans2[q].length).fill(null);
    else if (userAnswers.ans2[q].length < currentExam.ans2[q].length) userAnswers.ans2[q].length = currentExam.ans2[q].length;
  }

  // grading
  let scoreValue = 0;

  // MCQ
  for (let i = 0; i < mcqCount; i++) {
    const correct = (currentExam.ans1[i] || '').toString().trim().toUpperCase();
    const userRaw = (userAnswers.ans1 && userAnswers.ans1[i] != null) ? userAnswers.ans1[i] : null;
    const user = userRaw ? userRaw.toString().trim().toUpperCase() : null;
    if (user && user === correct) scoreValue += 0.25;
  }

  // True/False groups (kept bucket scoring for backward compatibility)
  for (let qIndex = 0; qIndex < tfQuestions; qIndex++) {
    const subQ = currentExam.ans2[qIndex] || [];
    let correctCountForThisQ = 0;
    for (let ideaIdx = 0; ideaIdx < subQ.length; ideaIdx++) {
      const correctVal = subQ[ideaIdx];
      const userVal = (userAnswers.ans2 && userAnswers.ans2[qIndex]) ? userAnswers.ans2[qIndex][ideaIdx] : null;
      const usr = userVal ? String(userVal).trim().toUpperCase() : null;
      if (usr === correctVal) correctCountForThisQ++;
    }
    switch (correctCountForThisQ) {
      case 1: scoreValue += 0.1; break;
      case 2: scoreValue += 0.25; break;
      case 3: scoreValue += 0.5; break;
      case 4: scoreValue += 1; break;
      default: break;
    }
  }

  // Short answers
  for (let i = 0; i < shortCount; i++) {
    const corrNorm = normalizeNumberAnswer(currentExam.ans3[i]);
    const userNorm = normalizeNumberAnswer((userAnswers.ans3 && userAnswers.ans3[i]) ? userAnswers.ans3[i] : '');
    if (userNorm !== '' && userNorm === corrNorm) scoreValue += 0.25;
  }

  const maxMcq = mcqCount * 0.25;
  const maxTf = tfQuestions * 1.0;
  const maxShort = shortCount * 0.25;
  const maxScore = +(maxMcq + maxTf + maxShort).toFixed(2);

  const scoreObj = {
    score: +(Math.round(scoreValue * 100) / 100).toFixed(2),
    maxScore,
    elapsedMs: elapsed,
    timestamp: Date.now()
  };

  // persist result and mark done
  saveResult(scoreObj);
  saveDone();

  // clear resume data so exam doesn't auto-resume
  clearStart();
  clearSavedAnswers();

  // update UI
  showResultsUI(scoreObj);
  isSubmitted = true;

  // notify other tabs (storage event will only fire in other tabs)
  try {
    // update a dedicated flag (already done inside saveDone) but set another transient key to bump storage events if needed
    const bumpKey = LS_DONE_KEY_PREFIX + makeExamKey(currentListIndex, currentExam) + ':bump';
    localStorage.setItem(bumpKey, String(Date.now()));
  } catch (e) {}
}

/* ---------------------------
   Show results UI (mark correct/wrong & disable interactions)
   --------------------------- */
function showResultsUI(scoreObj) {
  const timeEl = el('.point.time');
  if (timeEl) timeEl.textContent = `Điểm: ${scoreObj.score.toFixed(2)} / ${scoreObj.maxScore.toFixed(2)} • ${fmtTimeElapsed(scoreObj.elapsedMs)}`;

  // MCQ results
  elAll('.question-ex1').forEach(qWrap => {
    const qidx = Number(qWrap.dataset.qidx);
    const correct = (currentExam.ans1[qidx] || '').toString().trim().toUpperCase();
    const user = (userAnswers.ans1 && userAnswers.ans1[qidx]) ? userAnswers.ans1[qidx] : null;
    const oldBadge = qWrap.querySelector('.status-badge'); if (oldBadge) oldBadge.remove();
    elAll('.chosen-arrow', qWrap).forEach(a => a.remove());
    qWrap.classList.remove('unanswered');
    elAll('.choice', qWrap).forEach(ch => { ch.classList.remove('correct','wrong','user-choice'); ch.style.cursor = 'default'; ch.tabIndex = -1; });
    const correctEl = qWrap.querySelector(`.choice.${correct}`);
    if (correctEl) correctEl.classList.add('correct');
    let resultRow = qWrap.querySelector('.result-row'); if (resultRow) resultRow.remove();
    resultRow = document.createElement('div'); resultRow.className = 'result-row'; resultRow.style.marginTop = '8px';
    if (!user) {
      qWrap.classList.add('unanswered');
      const badge = document.createElement('span'); badge.className = 'status-badge unanswered'; badge.textContent = 'Chưa chọn';
      resultRow.appendChild(badge); qWrap.appendChild(resultRow);
    } else {
      const userEl = qWrap.querySelector(`.choice.${user}`);
      if (userEl) {
        userEl.classList.add('user-choice','selected');
        const arrow = document.createElement('span'); arrow.className = 'chosen-arrow'; arrow.textContent = '▴';
        const prevA = userEl.querySelector('.chosen-arrow'); if (prevA) prevA.remove();
        userEl.appendChild(arrow);
        const badge = document.createElement('span');
        if (user === correct) { userEl.classList.add('correct'); badge.className = 'status-badge correct'; badge.textContent = 'Kết quả đúng'; }
        else { userEl.classList.add('wrong'); badge.className = 'status-badge wrong'; badge.textContent = 'Kết quả sai'; }
        resultRow.appendChild(badge); qWrap.appendChild(resultRow);
      } else {
        const badge = document.createElement('span'); badge.className = 'status-badge unanswered'; badge.textContent = 'Chưa chọn';
        resultRow.appendChild(badge); qWrap.appendChild(resultRow);
      }
    }
  });

  // True/False results
  elAll('.question-ex2').forEach(qDiv => {
    const qIndex = Number(qDiv.dataset.qidx);
    elAll('.idea-container', qDiv).forEach(idea => {
      const ideaIdx = Number(idea.dataset.ideaIdx);
      const trueBtn = idea.querySelector('.true-choice'); const falseBtn = idea.querySelector('.false-choice');
      idea.classList.remove('unanswered');
      [trueBtn, falseBtn].forEach(b => { if (b) { b.classList.remove('selected','correct','wrong','user-choice'); b.style.cursor='default'; b.tabIndex = -1; }});
      const correctVal = (currentExam.ans2[qIndex] || [])[ideaIdx];
      if (correctVal === 'Đ') { if (trueBtn) trueBtn.classList.add('correct'); }
      else { if (falseBtn) falseBtn.classList.add('correct'); }
      const userVal = (userAnswers.ans2 && userAnswers.ans2[qIndex]) ? userAnswers.ans2[qIndex][ideaIdx] : null;
      const existingBadge = idea.querySelector('.status-badge'); if (existingBadge) existingBadge.remove();
      if (!userVal) {
        idea.classList.add('unanswered');
        const b = document.createElement('span'); b.className = 'status-badge unanswered'; b.textContent = 'Chưa chọn'; idea.appendChild(b);
      } else {
        const chosenBtn = (userVal === 'Đ') ? trueBtn : falseBtn;
        if (chosenBtn) chosenBtn.classList.add('user-choice','selected');
        if (userVal !== correctVal) { if (chosenBtn) chosenBtn.classList.add('wrong'); }
        else { if (chosenBtn) chosenBtn.classList.add('correct'); }
        const b = document.createElement('span'); b.className = 'status-badge ' + (userVal === correctVal ? 'correct' : 'wrong');
        b.textContent = userVal === correctVal ? 'Kết quả đúng' : 'Kết quả sai'; idea.appendChild(b);
      }
    });
  });

  // Short answers
  elAll('.ex3-answer .short-item').forEach(shortItem => {
    const inp = shortItem.querySelector('input[type="text"]');
    if (!inp) return;
    const idx = Number(inp.dataset.idx);
    const userRaw = (userAnswers.ans3 && userAnswers.ans3[idx]) ? userAnswers.ans3[idx] : '';
    const corrRaw = currentExam.ans3[idx];
    const userNorm = normalizeNumberAnswer(userRaw);
    const corrNorm = normalizeNumberAnswer(corrRaw);
    inp.classList.remove('correct','wrong','unanswered');
    inp.readOnly = true;
    const prevBadge = shortItem.querySelector('.status-badge'); if (prevBadge) prevBadge.remove();
    const prevCorr = shortItem.querySelector('.correct-answer'); if (prevCorr) prevCorr.remove();
    const corrBox = document.createElement('div'); corrBox.className = 'correct-answer'; corrBox.textContent = `Đáp án đúng: ${corrRaw}`;
    if (!userRaw || userNorm === '') {
      inp.classList.add('unanswered'); inp.placeholder = 'Chưa trả lời';
      const b = document.createElement('span'); b.className = 'status-badge unanswered'; b.textContent = 'Chưa trả lời';
      shortItem.appendChild(b); shortItem.appendChild(corrBox);
    } else if (userNorm === corrNorm) {
      inp.classList.add('correct'); const b = document.createElement('span'); b.className = 'status-badge correct'; b.textContent = 'Kết quả đúng';
      shortItem.appendChild(b); shortItem.appendChild(corrBox);
    } else {
      inp.classList.add('wrong'); inp.placeholder = `Đáp án: ${corrRaw}`; const b = document.createElement('span'); b.className = 'status-badge wrong'; b.textContent = 'Kết quả sai';
      shortItem.appendChild(b); shortItem.appendChild(corrBox);
    }
  });

  // disable interactions globally
  disableInteractions();

  // toggle answer button handling
  const toggleBtn = el('#toggle-ans-btn');
  if (toggleBtn) {
    toggleBtn.classList.remove('hide'); toggleBtn.dataset.state = 'ans'; toggleBtn.textContent = 'Xem đề';
    const iframe = el('#main-iframe'); if (iframe && currentExam && currentExam.ansLink) iframe.src = currentExam.ansLink;
  }

  // show done badge
  showDoneBadgeIfNeeded(true);
}

/* ---------------------------
   Disable further interactions after submit
   --------------------------- */
function disableInteractions() {
  elAll('.choice').forEach(ch => { ch.style.cursor = 'default'; ch.removeEventListener('click', onMCQChoiceClick); ch.tabIndex = -1; });
  elAll('.true-choice, .false-choice').forEach(btn => { btn.style.cursor = 'default'; btn.removeEventListener('click', onTFChoiceClick); btn.tabIndex = -1; });
  elAll('.ex3-answer input').forEach(inp => { inp.readOnly = true; });
}

/* ---------------------------
   Toggle between exam/answer in iframe
   --------------------------- */
function toggleExamAnswer() {
  const iframe = el('#main-iframe'); const btn = el('#toggle-ans-btn'); if (!iframe || !btn || !currentExam) return;
  if (btn.dataset.state === 'ans') { iframe.src = currentExam.link; btn.dataset.state = 'exam'; btn.textContent = 'Xem đáp án'; }
  else { iframe.src = currentExam.ansLink; btn.dataset.state = 'ans'; btn.textContent = 'Xem đề'; }
}

/* ---------------------------
   Reset helpers
   --------------------------- */
function resetCurrentExamState() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  try { clearStart(); clearSavedAnswers(); clearResult(); clearDone(); } catch (e) { console.warn('resetCurrentExamState:', e); }
  isSubmitted = false; startTimestamp = null;
  userAnswers = {
    ans1: new Array(currentExam.ans1.length).fill(null),
    ans2: currentExam.ans2.map(sub => new Array(sub.length).fill(null)),
    ans3: new Array(currentExam.ans3.length).fill('')
  };
  elAll('.choice').forEach(ch => ch.classList.remove('selected','correct','wrong','user-choice'));
  elAll('.true-choice, .false-choice').forEach(b => b.classList.remove('selected','correct','wrong','user-choice'));
  elAll('.ex3-answer input').forEach(inp => { inp.value = ''; inp.readOnly = false; inp.classList.remove('correct','wrong','unanswered'); });
  const timeEl = el('.point.time'); if (timeEl) timeEl.textContent = 'Thời gian: 00:00';
  const old = el('#done-badge'); if (old) old.remove();
}

/* ---------------------------
   Visual: done badge next to time
   --------------------------- */
function showDoneBadgeIfNeeded(force = false) {
  const wasDone = loadDone();
  const timeEl = el('.point.time');
  if (!timeEl) return;
  let badge = el('#done-badge');
  if (wasDone && !badge) {
    badge = document.createElement('span'); badge.id = 'done-badge'; badge.textContent = 'Đã hoàn thành ✓';
    badge.style.marginLeft = '12px'; badge.style.padding = '6px 8px'; badge.style.borderRadius = '999px';
    badge.style.fontSize = '0.85rem'; badge.style.background = 'linear-gradient(90deg,#e6fffa,#ecfdf5)';
    badge.style.color = '#065f46'; badge.style.border = '1px solid rgba(16,185,129,0.12)';
    timeEl.parentNode && timeEl.parentNode.insertBefore(badge, timeEl.nextSibling);
  } else if (!wasDone && badge) {
    if (!force) badge.remove();
  } else if (force && wasDone && badge) {
    if (!badge.parentNode) timeEl.parentNode && timeEl.parentNode.insertBefore(badge, timeEl.nextSibling);
  }
}

/* ---------------------------
   UI bindings & handlers
   --------------------------- */
window.showAskForSubmit = function() { const elx = el('.ask-for-submit'); if (elx) elx.classList.remove('hide'); };
window.hideAskForSubmit = function() { const elx = el('.ask-for-submit'); if (elx) elx.classList.add('hide'); };
window.showCancelExam = function() { const elx = el('.cancel-exam'); if (elx) elx.classList.remove('hide'); };
window.hideCancelExam = function() { const elx = el('.cancel-exam'); if (elx) elx.classList.add('hide'); };

function attachUiHandlers() {
  const turnBack = el('.turn-back');
  if (turnBack) {
    turnBack.addEventListener('click', () => {
      // If exam already submitted -> skip confirm, go back immediately
      if (isSubmitted) {
        document.location.href = '../index.html';
      } else {
        showCancelExam();
      }
    });
  }

  elAll('.ask-for-submit .background, .cancel-exam .background').forEach(bg => {
    bg.addEventListener('click', () => { const a = el('.ask-for-submit'); if (a) a.classList.add('hide'); const b = el('.cancel-exam'); if (b) b.classList.add('hide'); });
  });

  window.submitExam = submitExam;
  window.toggleExamAnswer = toggleExamAnswer;

  const cancelExitBtn = el('.cancel-exam .submit');
  if (cancelExitBtn) {
    cancelExitBtn.onclick = function(e) {
      e && e.preventDefault && e.preventDefault();
      resetCurrentExamState(); hideCancelExam(); document.location.href = '../index.html';
    };
  }
}

/* ---------------------------
   Initialization
   --------------------------- */
async function init() {
  externalLists = await tryLoadExternalLists();

  const params = getUrlParams();
  if (externalLists && Array.isArray(externalLists) && externalLists.length) {
    if (params.list && params.list >= 1 && params.list <= externalLists.length) {
      currentListIndex = params.list - 1;
      const thisList = externalLists[currentListIndex];
      if (params.ord !== null && params.ord >= 0 && params.ord < thisList.exams.length) {
        currentExamIndex = params.ord;
      } else {
        currentExamIndex = pickRandomIndexFromList(`external-${currentListIndex}`, thisList.exams.length);
      }
      currentExam = thisList.exams[currentExamIndex];
    } else {
      currentListIndex = 0;
      const thisList = externalLists[0];
      currentExamIndex = pickRandomIndexFromList(`external-0`, thisList.exams.length);
      currentExam = thisList.exams[currentExamIndex];
    }
  } else if (embeddedExams && Array.isArray(embeddedExams) && embeddedExams.length) {
    currentListIndex = 'fixed';
    currentExamIndex = pickRandomIndexFromList('fixed', embeddedExams.length);
    currentExam = embeddedExams[currentExamIndex];
  } else {
    console.error('No exam data found (neither external exam.js nor embedded exams array).');
    return;
  }

  // ensure arrays present
  currentExam.ans1 = currentExam.ans1 || [];
  currentExam.ans2 = currentExam.ans2 || [];
  currentExam.ans3 = currentExam.ans3 || [];

  // prepare default answers (will be replaced by loadUserAnswers if present)
  userAnswers = {
    ans1: new Array(currentExam.ans1.length).fill(null),
    ans2: currentExam.ans2.map(sub => new Array(sub.length).fill(null)),
    ans3: new Array(currentExam.ans3.length).fill('')
  };

  renderAll();
  attachUiHandlers();
}

// auto-init
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
