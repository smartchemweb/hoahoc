function submitData() {
    // Lấy giá trị từ input
    const timeValue = document.querySelector('.timeInput').value;
    // Xây dựng URL với dữ liệu
    const targetUrl = `fixed/index.html?time=${encodeURIComponent(timeValue)}`;
    // Điều hướng đến trang mới
    window.location.href = targetUrl;
}

function openHistoryExam(index) {
    const targetUrl = `history/history.html?index=${encodeURIComponent(index)}`;
    window.location.href = targetUrl;
}

// Lấy input
const timeInput = document.querySelector('.timeInput');

// Lắng nghe sự kiện khi người dùng thay đổi giá trị
timeInput.addEventListener('input', () => {
    const value = timeInput.value.trim(); // Lấy giá trị và loại bỏ khoảng trắng

    // Kiểm tra nếu không phải số nguyên hoặc nằm ngoài khoảng [1, 359]
    if (!Number.isInteger(Number(value)) || value < 1 || value > 359) {
        timeInput.value = 50;
    } else {
        timeInput.style.border = ''; // Bỏ viền đỏ khi hợp lệ
    }
});

// Chặn các ký tự không hợp lệ (chỉ cho nhập số)
timeInput.addEventListener('keypress', (event) => {
    // Kiểm tra nếu phím không phải là số (0-9)
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault(); // Ngăn không cho nhập
    }
});

function renderHistoryExams() {
    let exams = JSON.parse(localStorage.getItem('history-exam-data')) || [];
    console.log(exams);
    let html = '';
    exams.forEach((exam, index) => {
        let name = exam.name;
        html += `
            <div class="exam-container">
                <div class="exam-name">${name}</div>
                <div class="delete-exam">Delete</div>
                <div class="access-exam">Xem lại</div>
            </div>
        `;
    });

    if (!html)
        html = `<div class="empty-list">Trống</div>`;

    document.querySelector('.storage-exams')
        .innerHTML = html;

    document.querySelectorAll('.delete-exam').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            exams.splice(index, 1);
            localStorage.setItem('history-exam-data', JSON.stringify(exams));
            renderHistoryExams();
        })
    });

    document.querySelectorAll('.access-exam').forEach((btn, index, arr) => {
        btn.addEventListener('click', () => {
            openHistoryExam(exams.length - index - 1);
        })
    })
}
renderHistoryExams();