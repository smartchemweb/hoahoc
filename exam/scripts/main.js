// scripts/main.js (index) — show "Chưa làm" if not done; live update via storage event
// + added "Thoát" button linking to ../learn/learn.html

import { exam1 as defaultExam1, exam2 as defaultExam2 } from "./exam.js";

const STORAGE_KEY = "examApp.data.v2";

const tocEl = document.querySelector(".toc");
const mainEl = document.getElementById("mainContent");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");

let io = null;
let data = loadData() || { lists: [structuredClone(defaultExam1), structuredClone(defaultExam2)] };

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  } catch(e){
    console.warn('loadData', e);
    return null;
  }
}
function saveData(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch(e){
    console.warn('saveData', e);
  }
}

function makeExamKeyForIndex(listId, exam){
  const examId = (exam && (exam.id !== undefined && exam.id !== null)) ? String(exam.id) : null;
  if (examId) return `${listId}-${examId}`;
  const link = (exam && exam.link) ? exam.link : (exam && exam.link) || 'no-link';
  const short = (typeof btoa === 'function') ? btoa(link).slice(0,12) : String(link).slice(0,12);
  return `${listId}-${short}`;
}
function isExamDoneForIndex(listId, exam){
  try{
    const key = 'exam-done-' + makeExamKeyForIndex(listId, exam);
    return !!localStorage.getItem(key);
  }catch(e){ return false; }
}

// NEW: load high score for homepage display
function loadHighScoreForIndex(listId, exam) {
  try {
    const key = 'exam-high-' + makeExamKeyForIndex(listId, exam);
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) : null;
  } catch (e) { return null; }
}

function renderAll(){ renderTOC(); renderLists(); observeSections(); }

/* ---------------------------
   EXIT BUTTON
   ---------------------------
   Insert a visible "Thoát" button linking to ../learn/learn.html
*/
/* ---------------------------
   EXIT BUTTON + TOC WRAPPER
   - exit button ở bên trái
   - "Mục lục" (title) nằm trong cùng toc với các nút
   --------------------------- */
function insertExitButton() {
  try {
    if (!tocEl) return;
    // nếu đã wrap rồi thì không làm lại
    if (document.querySelector('.toc-wrapper')) return;

    // tạo wrapper chứa exit button (bên trái) và tocEl (bên phải)
    const wrapper = document.createElement('div');
    wrapper.className = 'toc-wrapper';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'flex-start';
    wrapper.style.gap = '12px';
    // đảm bảo responsive: cho toc chiếm hết phần còn lại
    wrapper.style.width = '100%';

    // tạo nút thoát
    const exitBtn = document.createElement('a');
    exitBtn.className = 'exit-btn';
    exitBtn.href = '../learn/learn.html';
    exitBtn.setAttribute('aria-label', 'Thoát về trang học');
    exitBtn.textContent = 'Thoát';
    exitBtn.style.padding = '6px 10px';
    exitBtn.style.borderRadius = '8px';
    exitBtn.style.background = 'linear-gradient(90deg,#fff1f2,#fff7ed)';
    exitBtn.style.border = '1px solid rgba(0,0,0,0.06)';
    exitBtn.style.fontSize = '0.95rem';
    exitBtn.style.color = '#1f2937';
    exitBtn.style.textDecoration = 'none';
    exitBtn.style.flex = '0 0 auto';
    exitBtn.style.alignSelf = 'center';

    // nếu tocEl có parent -> thay tocEl bằng wrapper và append lại tocEl vào wrapper
    const parent = tocEl.parentNode;
    if (parent) {
      parent.replaceChild(wrapper, tocEl);
      wrapper.appendChild(exitBtn);
      wrapper.appendChild(tocEl);
      // make tocEl take remaining width
      tocEl.style.flex = '1 1 auto';
    } else {
      // fallback: insert exitBtn before tocEl
      tocEl.insertAdjacentElement('beforebegin', exitBtn);
    }
  } catch (e) {
    console.warn('insertExitButton', e);
  }
}

function renderTOC(){
  if(!tocEl) return;
  // ensure wrapper + exit button exists
  insertExitButton();

  // build inner content: title + buttons
  tocEl.innerHTML = '';

  // title sits inside toc with the buttons
  let titleEl = tocEl.querySelector('.toc-title');
  if (!titleEl) {
    titleEl = document.createElement('div');
    titleEl.className = 'toc-title';
    titleEl.textContent = 'Mục lục';
    titleEl.style.fontWeight = '600';
    titleEl.style.fontSize = '1rem';
    titleEl.style.marginBottom = '6px';
    titleEl.style.color = 'var(--muted)';
    tocEl.appendChild(titleEl);
  } else {
    tocEl.appendChild(titleEl);
  }

  data.lists.forEach((list, idx)=>{
    const btn=document.createElement('button');
    btn.textContent=list.name;
    btn.dataset.section=`section-${idx}`;
    btn.addEventListener('click', ()=>{
      const target=document.getElementById(btn.dataset.section);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      setActiveTOC(btn);
    });
    tocEl.appendChild(btn);
  });
}

function setActiveTOC(btn){
  if(!tocEl) return;
  tocEl.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

function renderLists(){
  const filter = filterSelect?.value || 'all';
  const sort = sortSelect?.value || 'name-asc';
  if(!mainEl) return;
  mainEl.innerHTML = '';

  data.lists.forEach((list, listIdx) => {
    const section = document.createElement('section');
    section.className='exam-list';
    section.id = `section-${listIdx}`;

    // compute doneCount from localStorage flags (exam-done-...), not from list.exams[*].isDone
    let doneCount = 0;
    for (let e of list.exams) {
      if (isExamDoneForIndex(listIdx, e)) doneCount++;
    }
    const pct = list.exams.length ? Math.round((doneCount / list.exams.length) * 100) : 0;

    const title = document.createElement('div'); title.className='list-title';
    const left = document.createElement('div'); left.textContent = list.name;
    const right = document.createElement('div'); right.className = 'progressWrap';
    const progress = document.createElement('div'); progress.className = 'progress';
    const inner = document.createElement('i'); inner.style.width = pct + '%'; progress.appendChild(inner);
    const pctText = document.createElement('div'); pctText.style.fontSize='0.85rem'; pctText.style.color='var(--muted)'; pctText.textContent = `${pct}%`;
    right.appendChild(progress); right.appendChild(pctText); title.appendChild(left); title.appendChild(right); section.appendChild(title);

    const examsCopy = [...list.exams];
    // pass listIdx so sorting by done/undone can consult localStorage
    sortExamsArray(examsCopy, sort, listIdx);

    const ul = document.createElement('ul');
    for (let i = 0; i < examsCopy.length; i++) {
      const exam = examsCopy[i];
      const doneFlag = isExamDoneForIndex(listIdx, exam);

      if (filter === 'done' && !doneFlag) continue;
      if (filter === 'undone' && doneFlag) continue;
      if (filter === 'fav' && !exam.fav) continue;

      // find the original index in the stored list (needed for the 'ord' param)
      // fall back to i if can't find (defensive)
      let idx = list.exams.findIndex(x => x.id === exam.id);
      if (idx === -1) idx = i;

      const li = document.createElement('li'); li.id = `exam-${listIdx}-${idx}`;

      const examNameWrap = document.createElement('div'); examNameWrap.className = 'exam-name';
      const nameSpan = document.createElement('span'); nameSpan.className = 'name'; nameSpan.textContent = exam.name;

      // show "Đã hoàn thành" / "Chưa làm" driven by localStorage flag
      const stateSpan = document.createElement('span');
      stateSpan.className = 'state ' + (doneFlag ? 'done' : 'pending');
      stateSpan.textContent = doneFlag ? 'Đã hoàn thành' : 'Chưa làm';
      examNameWrap.appendChild(nameSpan);
      examNameWrap.appendChild(stateSpan);

      // show high score if present
      const hs = loadHighScoreForIndex(listIdx, exam);
      if (hs != null) {
        const highSpan = document.createElement('div');
        highSpan.className = 'highscore';
        highSpan.style.fontSize = '0.85rem';
        highSpan.style.color = 'var(--muted)';
        highSpan.style.marginLeft = '8px';
        highSpan.textContent = `Điểm cao nhất: ${hs.toFixed(1)}/10.0`;
        examNameWrap.appendChild(highSpan);
      }

      const startBtn = document.createElement('a'); startBtn.className='start-btn';
      startBtn.href = `do-exam/index.html?list=${listIdx+1}&ord=${idx}`;
      startBtn.setAttribute('aria-label', `Bắt đầu ${exam.name}`);
      startBtn.innerHTML = '&rarr;';

      li.appendChild(examNameWrap); li.appendChild(startBtn); ul.appendChild(li);
    }

    section.appendChild(ul); mainEl.appendChild(section);
  });
}

function sortExamsArray(arr, mode, listIdx){
  if(!mode) return;
  if(mode === 'name-asc') arr.sort((a,b)=> a.name.localeCompare(b.name,'vi'));
  else if(mode === 'name-desc') arr.sort((a,b)=> b.name.localeCompare(a.name,'vi'));
  else if(mode === 'done-first') arr.sort((a,b)=>{
    const aDone = isExamDoneForIndex(listIdx, a) ? 1 : 0;
    const bDone = isExamDoneForIndex(listIdx, b) ? 1 : 0;
    // put done items first, then by name
    return (bDone - aDone) || a.name.localeCompare(b.name,'vi');
  });
  else if(mode === 'undone-first') arr.sort((a,b)=>{
    const aDone = isExamDoneForIndex(listIdx, a) ? 1 : 0;
    const bDone = isExamDoneForIndex(listIdx, b) ? 1 : 0;
    // put undone items first, then by name
    return (aDone - bDone) || a.name.localeCompare(b.name,'vi');
  });
}

function observeSections(){
  if(io && typeof io.disconnect === 'function'){
    try{ io.disconnect(); } catch(e){}
    io = null;
  }
  const sections = Array.from(document.querySelectorAll('.exam-list'));
  const tocButtons = tocEl ? Array.from(tocEl.querySelectorAll('button')) : [];
  if(!sections.length) return;
  io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = entry.target.id;
        const idx = sections.findIndex(s => s.id === id);
        const btn = tocButtons[idx];
        setActiveTOC(btn);
      }
    });
  }, { root: null, threshold: 0.45 });
  sections.forEach(s => io.observe(s));
}

function structuredClone(obj){ return JSON.parse(JSON.stringify(obj)); }

filterSelect?.addEventListener('change', ()=> renderLists());
sortSelect?.addEventListener('change', ()=> renderLists());

/* live update when storage changes in other tabs */
window.addEventListener('storage', (ev) => {
  if (!ev.key) return;
  // if any key that begins with 'exam-done-' changed, re-render lists so state updates
  if (ev.key.startsWith('exam-done-')) {
    renderLists();
  }
  // if any key that begins with 'exam-high-' changed, re-render lists to update highscore shown on homepage
  if (ev.key.startsWith('exam-high-')) {
    renderLists();
  }
  // also if user changed the stored data lists, re-load
  if (ev.key === STORAGE_KEY) {
    data = loadData() || data;
    renderLists();
  }
});

/* init */
renderAll();
