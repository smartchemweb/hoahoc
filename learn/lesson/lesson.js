import { lessons } from "../scripts/unit.js";

const params = new URLSearchParams(window.location.search);
const unit = params.get('unit');
const level = Number(params.get('level'));

// allow overriding from query, but fallback to lesson[level].type if missing
let type = params.get('type');

var lesson = lessons[unit - 1].content;

// fallback: nếu url không có type, lấy type từ lesson[level].type (nếu có)


/* -------------------------
   Helper: convert <sup>/<sub> HTML to unicode text
   ------------------------- */
const SUP_MAP = {
  '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
  '+':'⁺','-':'⁻','=':'⁼','(':'⁽',')':'⁾','n':'ⁿ','i':'ⁱ'
};
const SUB_MAP = {
  '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
  '+':'₊','-':'₋','=':'₌','(':'₍',')':'₎'
};

function toUnicodeString(text, map) {
  let out = '';
  for (let ch of text) {
    out += (map[ch] !== undefined) ? map[ch] : ch;
  }
  return out;
}

function convertHtmlSupSubToText(html) {
  if (!html) return '';

  // replace <sup>...</sup>
  html = html.replace(/<sup>([\s\S]*?)<\/sup>/gi, (m, inner) => {
    return toUnicodeString(inner, SUP_MAP);
  });

  // replace <sub>...</sub>
  html = html.replace(/<sub>([\s\S]*?)<\/sub>/gi, (m, inner) => {
    return toUnicodeString(inner, SUB_MAP);
  });

  // strip any remaining tags
  html = html.replace(/<\/?[^>]+(>|$)/g, '');

  // trim
  return html.trim();
}

/* -------------------------
   Shared progress animation helper
   - updates .progress-bar width
   - toggles .pulse
   - spawns .progress-hit at the progress edge which expands & fades
   ------------------------- */
function animateProgressBar(current, total) {
    const progressBar = document.querySelector('.progress-bar');
    const container = document.querySelector('.progress-container');

    if (!progressBar || !container) return;

    const pct = total === 0 ? 0 : Math.round((current / total) * 100);
    // update width
    progressBar.style.width = `${pct}%`;

    // pulse effect (reflow trick to retrigger animation)
    progressBar.classList.remove('pulse');
    void progressBar.offsetWidth;
    progressBar.classList.add('pulse');

    // create expanding hit circle if pct > 0
    if (pct > 0) {
        // compute position inside container (clamp within boundaries)
        const rect = container.getBoundingClientRect();
        let x = (pct / 100) * rect.width;
        // clamp so the circle stays visible near edges
        const pad = 8;
        if (x < pad) x = pad;
        if (x > rect.width - pad) x = rect.width - pad;

        const hit = document.createElement('div');
        hit.className = 'progress-hit';
        // if full, give it .full for a bigger effect
        if (pct >= 100) hit.classList.add('full');

        // left position relative to container
        hit.style.left = `${x}px`;

        container.appendChild(hit);

        // remove after animation ends to keep DOM clean
        hit.addEventListener('animationend', () => {
            if (hit && hit.parentNode) hit.parentNode.removeChild(hit);
        });

        // safety: remove after 1s if animationend not fired for any reason
        setTimeout(() => {
            if (hit && hit.parentNode) hit.parentNode.removeChild(hit);
        }, 1200);
    }
}

/* -------------------------
   THEORETICAL (iframe) VIEW
   ------------------------- */
if (type === 'theory') {
    let html = `
        <div class="header">
            <h1 class="title">Lí thuyết trọng tâm</h1>
            <div class="footer">
                <div class="done-btn">Đánh dấu là đã đọc</div>
            </div>
        </div>
        <div class="theory-doc">
            <div class="theory-frame">
                <iframe src="${lesson[level].filename}"></iframe>
            </div>
        </div>
    `;

    document.querySelector('.screen').innerHTML = html;

    // done-btn
    document.querySelector('.done-btn').addEventListener('click', () => {
        window.location.href = `../learn.html?mark=true&unit=${unit}&level=${level}`
    });

/* -------------------------
   EX1: Multiple choice
   ------------------------- */
} else if (type === 'ex1') {
    const screen = document.querySelector('.screen');

    screen.innerHTML = `
        <div class="header">
            <h1 class="title">Luyện tập - Trắc nghiệm lựa chọn</h1>
        </div>
        <div class="top-section">
            <a class="exit-btn" href="../learn.html">
                <img src="../../assets/images/home-btn.svg">
            </a>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
        </div>
        <div class="content">
            <div class="question"></div>
            <div class="img"></div>
            <div class="options-container"></div>
            <div class="explain"></div>
        </div>
        <div class="bottom-section">
            <div class="check-btn">Kiểm tra</div>
            <div class="continue-btn hide">Tiếp tục</div>
        </div>
    `;

    // Dữ liệu câu hỏi
    const questions = lesson[level].questions;
    const maxPoint = questions.length;
    let point = 0;
    let lessonQueue = [...questions];

    // Hiển thị câu hỏi
    function displayQuestion() {
        if (lessonQueue.length === 0) {
            alert("Bạn đã hoàn thành tất cả câu hỏi!");
            document.location.href = `../learn.html?mark=true&unit=${unit}&level=${level}`;
            return;
        }

        const { question, answers, img, explain } = lessonQueue[0];
        const correctAnswerRaw = answers[0]; // original (may contain <sup>/<sub>)
        const normalizedCorrect = convertHtmlSupSubToText(correctAnswerRaw);
        const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);

        // DOM elements
        const questionElement = document.querySelector('.question');
        const imgElement = document.querySelector('.img');
        const optionsContainer = document.querySelector('.options-container');
        const explainElement = document.querySelector('.explain');
        const continueButton = document.querySelector('.continue-btn');
        const checkBtn = document.querySelector('.check-btn');

        // Reset UI
        questionElement.innerHTML = question; // question may contain HTML tags — keep it
        explainElement.innerHTML = '';
        optionsContainer.innerHTML = '';
        continueButton.classList.add('hide');

        // Reset and enable the check button (important)
        checkBtn.removeAttribute('style');
        checkBtn.style.pointerEvents = 'auto';
        checkBtn.style.opacity = '1';

        // Ảnh (nếu có)
        if (img && img !== 'none') {
            imgElement.innerHTML = `<img src="../../assets/learn-assets/ques-img/${img}" alt="Question image" class="question-img">`;
        } else {
            imgElement.innerHTML = '';
        }

        // Track selected option
        let selectedOption = null;

        // Render các đáp án — convert sup/sub -> unicode text and store normalized value in dataset
        shuffledAnswers.forEach(answerRaw => {
            const option = document.createElement('div');
            option.className = 'option';

            const normalized = convertHtmlSupSubToText(answerRaw);
            option.textContent = normalized;
            option.dataset.value = normalized;
            option.dataset.raw = answerRaw;

            option.addEventListener('click', () => {
                if (selectedOption) selectedOption.classList.remove('selected');
                option.classList.add('selected');
                selectedOption = option;
            });

            optionsContainer.appendChild(option);
        });

        // Attach handler to check button by assigning onclick (overwrite any previous)
        checkBtn.onclick = () => {
            if (!selectedOption) {
                alert("Vui lòng chọn một đáp án!");
                return;
            }

            const userVal = selectedOption.dataset.value;
            const isCorrect = userVal === normalizedCorrect;
            selectedOption.classList.add(isCorrect ? 'correct' : 'wrong');

            if (isCorrect) {
                point++;
                lessonQueue.shift();
                animateProgressBar(point, maxPoint);
                explainElement.innerHTML = explain;
            } else {
                const currentQuestion = lessonQueue.shift();
                lessonQueue.push(currentQuestion);
                animateProgressBar(point, maxPoint); // progress unchanged, but still visual update
                explainElement.innerHTML = `<p class="highlight red">Đáp án sai, thử lại sau nhé!</p>`;
            }

            // Sound
            try {
                const audio = new Audio(`../../assets/sounds/${isCorrect}.mp3`);
                audio.play();
            } catch (e) { /* ignore */ }

            // Disable interaction on options and disable the check button
            optionsContainer.querySelectorAll('.option').forEach(o => o.style.pointerEvents = 'none');
            checkBtn.style.pointerEvents = 'none';
            checkBtn.style.opacity = '0.6';

            // Show continue
            continueButton.classList.remove('hide');
        };
    }

    // Nút tiếp tục
    function setContinueButton() {
        const continueButton = document.querySelector('.continue-btn');
        continueButton.addEventListener('click', displayQuestion);
    }

    // Khởi tạo quiz: initial progress render
    animateProgressBar(0, maxPoint);
    setContinueButton();
    displayQuestion();

/* -------------------------
   EX2: True / False
   ------------------------- */
} else if (type === 'ex2') {
    const screen = document.querySelector('.screen');

    // Giao diện tổng thể
    screen.innerHTML = `
        <div class="header">
            <h1 class="title">Luyện tập - Đúng / Sai</h1>
        </div>
        <div class="top-section">
            <a class="exit-btn" href="../learn.html">
                <img src="../../assets/images/home-btn.svg">
            </a>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
        </div>
        <div class="content">
            <div class="question-block"></div>
            <div class="explain"></div>
        </div>
        <div class="bottom-section">
            <div class="check-btn">Kiểm tra</div>
            <div class="continue-btn hide">Tiếp tục</div>
        </div>
    `;

    // Dữ liệu câu hỏi
    const questions = lesson[level].questions;
    const maxPoint = questions.length;
    let point = 0;
    let lessonQueue = [...questions]; // queue để xoay các câu sai

    // Hiển thị từng câu hỏi
    function displayQuestion() {
        if (lessonQueue.length === 0) {
            alert("Bạn đã hoàn thành tất cả câu hỏi!");
            document.location.href = `../learn.html?mark=true&unit=${unit}&level=${level}`;
            return;
        }

        const q = lessonQueue[0];
        const block = document.querySelector('.question-block');
        const explain = document.querySelector('.explain');
        const checkButton = document.querySelector('.check-btn');
        const continueButton = document.querySelector('.continue-btn');

        explain.innerHTML = '';
        continueButton.classList.add('hide');

        // Reset and enable the check button
        checkButton.removeAttribute('style');
        checkButton.style.pointerEvents = 'auto';
        checkButton.style.opacity = '1';

        // Ảnh minh họa (nếu có)
        const imgHTML = q.img && q.img !== 'none'
            ? `<img src="../../assets/learn-assets/ques-img/${q.img}" alt="image" class="question-img">`
            : '';

        // Tạo bảng đúng/sai (q.ideas may contain HTML, keep it)
        let rows = '';
        q.ideas.forEach((idea, i) => {
            rows += `
                <tr>
                    <td class="idea-text">${idea}</td>
                    <td><button class="btn-tf" data-choice="Đúng">✔</button></td>
                    <td><button class="btn-tf" data-choice="Sai">✖</button></td>
                </tr>
            `;
        });

        block.innerHTML = `
            <div class="question-title">${q.question}</div>
            ${imgHTML}
            <table class="tf-table">
                <thead>
                    <tr>
                        <th>Phát biểu</th>
                        <th>Đúng</th>
                        <th>Sai</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;

        // Lắng nghe chọn nút đúng/sai
        const rowsEl = block.querySelectorAll('tbody tr');
        rowsEl.forEach(row => {
            const buttons = row.querySelectorAll('.btn-tf');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                });
            });
        });

        // Gán handler trực tiếp cho nút kiểm tra (ghi đè handler cũ)
        checkButton.onclick = () => {
            let allAnswered = true;
            let isAllCorrect = true;

            rowsEl.forEach((row, i) => {
                const selected = row.querySelector('.btn-tf.selected');
                const correctAnswer = q.answers[i];

                // Nếu người dùng chưa chọn
                if (!selected) {
                    allAnswered = false;
                    return;
                }

                // Kiểm tra chính xác
                const isCorrect = selected.dataset.choice === correctAnswer;
                selected.classList.add(isCorrect ? 'correct' : 'wrong');

                // Nếu sai, tô màu đáp án đúng (có kiểm tra null)
                if (!isCorrect) {
                    isAllCorrect = false;
                    const correctBtn = row.querySelector(`[data-choice="${correctAnswer}"]`);
                    if (correctBtn) {
                        correctBtn.classList.add('highlight-correct');
                    } else {
                        console.warn("⚠️ Không tìm thấy nút đúng/sai tương ứng cho:", correctAnswer);
                    }
                }
            });

            if (!allAnswered) {
                alert("Vui lòng chọn đáp án cho tất cả các phát biểu!");
                return;
            }

            // Nếu tất cả đúng → cộng điểm và bỏ khỏi queue
            // Nếu không → đẩy về cuối queue
            if (isAllCorrect) {
                point++;
                lessonQueue.shift();
            } else {
                const wrongQ = lessonQueue.shift();
                lessonQueue.push(wrongQ);
            }

            animateProgressBar(maxPoint - lessonQueue.length, maxPoint);

            // Hiển thị giải thích
            explain.innerHTML = `<div class="explain-text">${q.explain}</div>`;

            // Âm thanh đúng/sai tổng thể
            try {
                const audio = new Audio(`../../assets/sounds/${isAllCorrect ? 'true' : 'false'}.mp3`);
                audio.play();
            } catch (e) {
                // ignore audio errors
            }

            // Disable the check button after checking
            checkButton.style.pointerEvents = 'none';
            checkButton.style.opacity = '0.6';

            // Mở nút tiếp tục
            continueButton.classList.remove('hide');
        };
    }

    // Nút tiếp tục
    const continueButton = document.querySelector('.continue-btn');
    continueButton.addEventListener('click', displayQuestion);

    // initial render
    animateProgressBar(0, maxPoint);
    // Bắt đầu
    displayQuestion();

/* -------------------------
   EX3: Short answer
   ------------------------- */
} else if (type === 'ex3') {
    const screen = document.querySelector('.screen');

    screen.innerHTML = `
        <div class="header">
            <h1 class="title">Luyện tập - Tự luận trả lời ngắn</h1>
        </div>
        <div class="top-section">
            <a class="exit-btn" href="../learn.html">
                <img src="../../assets/images/home-btn.svg">
            </a>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
        </div>
        <div class="content">
            <div class="question-block"></div>
            <div class="explain"></div>
        </div>
        <div class="bottom-section">
            <div class="check-btn">Kiểm tra</div>
            <div class="continue-btn hide">Tiếp tục</div>
        </div>
    `;

    const questions = lesson[level].questions;
    const maxPoint = questions.length;
    let point = 0;
    let lessonQueue = [...questions];

    // NOTE: don't cache these here — re-query inside displayQuestion to avoid stale refs
    function displayQuestion() {
        // re-query buttons each time (safer)
        const checkButton = document.querySelector('.check-btn');
        const continueButton = document.querySelector('.continue-btn');
        if (!checkButton || !continueButton) {
            console.warn('Cannot find check/continue buttons');
            return;
        }

        if (lessonQueue.length === 0) {
            alert("Bạn đã hoàn thành tất cả câu hỏi!");
            document.location.href = `../learn.html?mark=true&unit=${unit}&level=${level}`;
            return;
        }

        const q = lessonQueue[0];
        const block = document.querySelector('.question-block');
        const explain = document.querySelector('.explain');

        explain.innerHTML = '';
        // đảm bảo ẩn lại mỗi lần hiện câu mới
        continueButton.classList.add('hide');
        // as fallback (in case CSS .hide not be removed properly), reset inline display
        continueButton.style.display = 'none';

        // Ảnh minh họa
        const imgHTML = q.img && q.img !== 'none' ?
            `<img src="${q.img}" alt="image" class="question-img">` : '';

        block.innerHTML = `
            <div class="question-title">${q.question}</div>
            ${imgHTML}
            <div class="answer-input">
                <input type="text" placeholder="Nhập số" class="short-answer">
            </div>
        `;

        const inputEl = block.querySelector('.short-answer');

        // Reset trạng thái nút kiểm tra
        checkButton.style.pointerEvents = 'auto';
        checkButton.style.opacity = 1;

        checkButton.onclick = () => {
            const userAnswer = inputEl.value.trim();
            if (userAnswer === '') {
                alert("Vui lòng nhập câu trả lời!");
                return;
            }

            const correctAnswer = q.answers[0].toString().trim();
            const isCorrect = userAnswer === correctAnswer;

            // Phát âm thanh đúng / sai
            try {
                const audio = new Audio(`../../assets/sounds/${isCorrect ? 'true' : 'false'}.mp3`);
                audio.play();
            } catch (e) {}

            // Hiệu ứng màu input
            inputEl.style.backgroundColor = isCorrect ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)';
            inputEl.style.borderColor = isCorrect ? '#4caf50' : '#f44336';
            inputEl.style.color = 'black';

            // Disable nút kiểm tra
            checkButton.style.pointerEvents = 'none';
            checkButton.style.opacity = 0.6;

            // Cập nhật queue và điểm
            if (isCorrect) {
                point++;
                lessonQueue.shift();
            } else {
                lessonQueue.push(lessonQueue.shift());
            }

            animateProgressBar(maxPoint - lessonQueue.length, maxPoint);

            // Hiển thị giải thích
            explain.innerHTML = `<div class="explain-text">${q.explain}</div>`;

            // Debug: kiểm tra object continueButton trước khi hiển thị
            console.log('About to show continue button, isCorrect=', isCorrect, 'continueButton=', continueButton);

            // Hiện nút tiếp tục — remove class + force inline display
            continueButton.classList.remove('hide');
            continueButton.style.display = ''; // reset inline style (fallback)
            // nếu CSS đặt opacity/visibility, đảm bảo visible
            continueButton.style.opacity = 1;
        };
    }

    // Nút tiếp tục: bind once (vì chúng ta vẫn re-query và remove/hide class)
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('continue-btn')) {
            // gọi displayQuestion để load câu kế
            displayQuestion();
        }
    });

    // initial render
    animateProgressBar(0, maxPoint);
    displayQuestion();
} else if (type === 'video') {
    // VIDEO: simple extractor — lấy id bằng cách cắt phần sau "v=" (không normalize, theo đúng yêu cầu)
    const screen = document.querySelector('.screen');

    // Lấy object video từ lesson[level]
    const videoEntry = lesson[level];
    console.log(videoEntry);
    const rawUrl = videoEntry && videoEntry.url ? videoEntry.url : '';
    const title = videoEntry && videoEntry.name ? videoEntry.name : 'Bài học video';

    console.log(rawUrl);

    // Simple extraction: lấy phần sau "v=" rồi cắt bỏ phần &... nếu có
    let id = null;
    if (rawUrl && rawUrl.indexOf('v=') !== -1) {
      const afterV = rawUrl.split('v=')[1];
      id = afterV ? afterV.split('&')[0] : null;
    }

    // Tạo embed URL nếu có id
    const embedUrl = id ? `https://www.youtube.com/embed/${id}` : '';

    // Render: nếu có embedUrl -> iframe, else -> show raw link
    if (screen) {
      if (embedUrl) {
        screen.innerHTML = `
          <div class="header">
            <h1 class="title">${title}</h1>
            <div class="footer">
              <div class="done-btn">Đánh dấu là đã xem</div>
            </div>
          </div>
          <div class="theory-doc">
            <div class="theory-frame">
              <iframe
                src="${embedUrl}"
                width="100%"
                height="480"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>
          </div>
        `;
      } else {
        screen.innerHTML = `
          <div class="header">
            <h1 class="title">${title}</h1>
            <div class="footer">
              <div class="done-btn">Đánh dấu là đã xem</div>
            </div>
          </div>
          <div class="theory-doc">
            <div style="padding:16px;">
              <p>Không tìm thấy phần "v=" trong URL. Mở video trực tiếp trên YouTube:</p>
              <p><a href="${rawUrl}" target="_blank" rel="noopener">${rawUrl || '—'}</a></p>
            </div>
          </div>
        `;
      }

      // done-btn behavior (giống theory)
      const doneBtn = document.querySelector('.done-btn');
      if (doneBtn) {
        doneBtn.addEventListener('click', () => {
          window.location.href = `../learn.html?mark=true&unit=${unit}&level=${level}&type=video`;
        });
      }
    }

    // (Optional) expose debug object for inspection
    try { window.__LAST_VIDEO_DEBUG = { rawUrl, id, embedUrl, videoEntry, unit, level, type }; } catch(e){}
} else if (type === 'other') {
    // OTHER: giao diện giống video nhưng dùng nguyên url làm iframe.src (không lấy id)
    const screen = document.querySelector('.screen');

    // Lấy object từ lesson[level]
    const entry = lesson[level];
    const rawUrl = entry && entry.url ? entry.url : '';
    const title = entry && entry.name ? entry.name : 'Tài nguyên';

    console.log(entry);

    if (screen) {
      if (rawUrl) {
        // thử dùng rawUrl thẳng vào iframe
        screen.innerHTML = `
          <div class="header">
            <h1 class="title">${title}</h1>
            <div class="footer">
              <div class="done-btn">Đánh dấu là đã xem</div>
            </div>
          </div>
          <div class="theory-doc">
            <div class="theory-frame">
              <iframe
                src="${rawUrl}"
                width="100%"
                height="480"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </div>
          </div>
        `;
      } else {
        screen.innerHTML = `
          <div class="header">
            <h1 class="title">${title}</h1>
            <div class="footer">
              <div class="done-btn">Đánh dấu là đã xem</div>
            </div>
          </div>
          <div class="theory-doc">
            <div style="padding:16px;">
              <p>Không tìm thấy đường dẫn. Mở tài nguyên trực tiếp:</p>
              <p><a href="${rawUrl}" target="_blank" rel="noopener">${rawUrl || '—'}</a></p>
            </div>
          </div>
        `;
      }

      // done-btn behavior (giống theory)
      const doneBtn = document.querySelector('.done-btn');
      if (doneBtn) {
        doneBtn.addEventListener('click', () => {
          window.location.href = `../learn.html?mark=true&unit=${unit}&level=${level}&type=other`;
        });
      }
    }

    // (Optional) expose debug object for inspection
    try { window.__LAST_VIDEO_DEBUG = { rawUrl, entry, unit, level, type: 'other' }; } catch(e){}
}


