// scripts/main.js — Roadmap script (refreshed)
// - Fully self-contained renderer for the roadmap view
// - Loads `units` from localStorage or window.units, normalizes shape
// - Supports: mark lesson done, theory viewed, pending marks via query/localStorage, storage events
// - Renders unit/topic/lessons with accessible markup and status badges
// - Scroll memory for .mid-section, focus highlight, debug API on window.__SmartChem

/* ============================
   Small helpers
   ============================ */
const $ = (sel, root = document) => (root || document).querySelector(sel);
const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));

function safeGetJSON(key, fallback = null) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { console.warn('safeGetJSON', e); return fallback; }
}
function safeSetJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { console.warn('safeSetJSON', e); return false; }
}

/* ============================
   Load & normalize units data
   Normalized shape: units[].topics[].lessons[]
   lesson: { id, name, type, isDone }
   ============================ */
let rawUnits = safeGetJSON('units', null);
if (!rawUnits && window.units) rawUnits = window.units;
if (!rawUnits) {
  // sample fallback
  rawUnits = [
    { id: 1, name: "Ester", levels: [
        {
            name: "Dạng 1. Khái niệm, Danh pháp, Tính chất vật lí",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Luyện tập dạng 1 (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Luyện tập dạng 1 (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Luyện tập dạng 1 (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            name: "Dạng 2. Tính chất hóa học",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Luyện tập dạng 2 (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Luyện tập dạng 2 (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Luyện tập dạng 2 (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            name: "Dạng 3. Ứng dụng, Điều chế",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Luyện tập dạng 3 (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Luyện tập dạng 3 (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Luyện tập dạng 3 (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            name: "Phần Lipid",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Luyện tập phần Lipid (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Luyện tập phần Lipid (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Luyện tập phần Lipid (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            name: "Lý thuyết xà phòng và chất giặt rửa",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Luyện tập (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Luyện tập (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Luyện tập (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }
    ] },
    { id: 2, name: "Carbonhydrate", levels: [
        {
            name: "Giới thiệu về CARBOHYDRATE. GLUCOSE VÀ FRUCTOSE",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            name: "SACCHAROSE VÀ MALTOSE",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            name: "TINH BỘT VÀ CELLULOSE",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            name: "BÀI TẬP PHẢN ỨNG TRÁNG GƯƠNG GLUCOSE (FRUCTOSE)",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "BÀI TẬP PHẢN ỨNG THỦY PHÂN CARBOHYDRATE",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "BÀI TẬP PHẢN ỨNG THỦY PHÂN - TRÁNG GƯƠNG CARBOHYDRATE",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "BÀI TẬP PHẢN ỨNG LÊN MEN CARBOHYDRATE",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Phương pháp giải",
            isDone: 'done',
            type: "theory",
            partName: "BÀI TẬP PHẢN ỨNG CELLULOSE TÁC DỤNG HNO3"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            name: "ĐỀ ÔN TẬP CHƯƠNG SỐ 02",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }
    ] },
    { id: 3, name: "HỢP CHẤT CHỨA NITROGEN", levels: [
        {
            name: "AMINE",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "AMNO ACID",
            name: "Lí thuyết Amno Acid",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "PEPTIDE",
            name: "Lí thuyết Peptide",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "PROTEIN VÀ ENZYME",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "BÀI TẬP: AMINE TÁC DỤNG VỚI ACID",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: AMINO ACID TÁC DỤNG VỚI ACID",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: AMINO ACID TÁC DỤNG VỚI BASE",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: AMINO ACID TÁC DỤNG VỚI ACID – BASE (TÍNH LƯỠNG TÍNH)",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: HỖN HỢP AMINO ACID VÀ ACID VÔ CƠ TÁC DỤNG VỚI BASE",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: HỖN HỢP AMINO ACID VÀ BASE VÔ CƠ TÁC DỤNG VỚI ACID",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: DẠNG TOÁN ESTER CỦA AMINO ACID",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: THUỶ PHÂN PEPTIDE",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: THUỶ PHÂN PEPTIDE TRONG MÔI TRƯỜNG ACID",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Phương pháp",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }
    ] },
    { id: 4, name: "POLYMER", levels: [
        {
            partName: "ĐẠI CƯƠNG VỀ POLYMER",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "VẬT LIỆU POLYMER",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "BÀI TẬP: XÁC ĐỊNH HỆ SỐ POLYMER HÓA",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: BÀI TẬP CAO SU",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Phương pháp",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 02",
            name: "Phương pháp",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }
    ] },
    { id: 5, name: "PIN ĐIỆN VÀ ĐIỆN PHÂN", levels: [
        {
            partName: "THẾ ĐIỆN CỰC VÀ NGUỒN ĐIỆN HÓA HỌC",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (cặp oxi hóa – khử; thế điện cực)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (ý nghĩa thế điện cực)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (pin điện hóa)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai (cặp oxi hóa – khử; thế điện cực)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm đúng – sai (pin điện hóa)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Tự luận trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "ĐIỆN PHÂN",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "DẠNG 1: XÁC ĐỊNH SỨC ĐIỆN ĐỘNG CHUẨN CỦA PIN ĐIỆN HÓA",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 2: BÀI TẬP TÍNH THẾ ĐIỆN CỰC CHUẨN",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 3: BÀI TẬP 1 KIM LOẠI TÁC DỤNG VỚI 1 DUNG DỊCH MUỐI",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 4: BÀI TẬP 2 KIM LOẠI TÁC DỤNG VỚI 1 DUNG DỊCH MUỐI",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 5: BÀI TẬP 1 KIM LOẠI TÁC DỤNG VỚI 2 DUNG DỊCH MUỐI",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 6: BÀI TẬP ĐIỆN PHÂN 1 CHẤT (NÓNG CHẢY – DUNG DỊCH)",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 7: BÀI TẬP ĐIỆN PHÂN HỖN HỢP 2 CHẤT TRONG DUNG DỊCH",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Phương pháp",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 02",
            name: "Phương pháp",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }
    ] },
    { id: 6, name: "ĐẠI CƯƠNG VỀ KIM LOẠI", levels: [
        {
            partName: "CẤU TẠO VÀ TÍNH CHẤT VẬT LÍ CỦA KIM LOẠI",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (CẤU TẠO KIM LOẠI)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (TÍNH CHẤT VẬT LÍ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "TÍNH CHẤT HÓA HỌC CỦA KIM LOẠI",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "KIM LOẠI TRONG TỰ NHIÊN VÀ PHƯƠNG PHÁP TÁCH KIM LOẠI",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (KIM LOẠI TRONG TỰ NHIÊN)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (PHƯƠNG PHÁP TÁCH KIM LOẠI)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "HỢP KIM – SỰ ĂN MÒN KIM LOẠI",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (HỢP KIM)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (SỰ ĂN MÒN KIM LOẠI)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "DẠNG 1: KIM LOẠI TÁC DỤNG VỚI PHI KIM",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 2: BASIC OXIDE TÁC DỤNG VỚI ACID",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 3: KIM LOẠI TÁC DỤNG VỚI ACID HCl, H2SO4 LOÃNG",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 4: KIM LOẠI TÁC DỤNG VỚI ACID H2SO4 ĐẶC",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 5: KHỬ OXIDE KIM LOẠI BẰNG KHÍ CO",
            name: "Phương pháp",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Phương pháp",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 02",
            name: "Phương pháp",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }
    ] },
    { id: 7, name: "NGUYÊN TỐ NHÓM IA VÀ NHÓM IIA", levels: [
        {
            partName: "NGUYÊN TỐ NHÓM IA",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (ĐƠN CHẤT KIM LOẠI KIỀM)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (HỢP CHẤT KIM LOẠI KIỀM)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "NGUYÊN TỐ NHÓM IIA",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (KIM LOẠI KIỀM THỔ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (HỢP CHẤT KIM LOẠI KIỀM THỔ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (NƯỚC CỨNG)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "DẠNG 1: SƠ ĐỒ - CHUỔI PHẢN ỨNG",
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 2: KIM LOẠI KIỀM, KIỀM THỔ TÁC DỤNG VỚI NƯỚC",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (KIM LOẠI KIỀM THỔ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 3: DẠNG TOÁN CO2 TÁC DỤNG VỚI DUNG DỊCH KIỀM",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (KIM LOẠI KIỀM THỔ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 4: MUỐI CARBONATE TÁC DỤNG VỚI ACID",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (KIM LOẠI KIỀM THỔ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 5: BÀI TOÁN TỔNG HỢP MUỐI CARBONATE",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (KIM LOẠI KIỀM THỔ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Phương pháp",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 02",
            name: "Phương pháp",
            isDone: 'done',
            type: "name"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm đúng sai)",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Bài tập vận dụng (Tự luận trả lời ngắn)",
            isDone: 'notdone',
            type: "ex3"
        }
    ] },
    { id: 8, name: "SƠ LƯỢC VỀ KIM LOẠI CHUYỂN TIẾP THỨ NHẤT VÀ PHỨC CHẤT", levels: [
        {
            partName: "ĐẠI CƯƠNG VỀ KIM LOẠI CHUYỂN TIẾP THỨ NHẤT",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "SƠ LƯỢC VỀ PHỨC CHẤT",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "MỘT SỐ TÍNH CHẤT VÀ ỨNG DỤNG CỦA PHỨC CHẤT",
            name: "Lí thuyết",
            isDone: 'done',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Lí thuyết",
            isDone: 'done',
            type: "name"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 02",
            name: "Lí thuyết",
            isDone: 'done',
            type: "name"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Trắc nghiệm đúng – sai",
            isDone: 'notdone',
            type: "ex2"
        }, {
            name: "Trắc nghiệm trả lời ngắn",
            isDone: 'notdone',
            type: "ex3"
        }
    ] }
];
  safeSetJSON('units', rawUnits);
}

function normalizeUnits(raw) {
  return raw.map((u, ui) => {
    // already topics
    if (Array.isArray(u.topics)) {
      const topics = u.topics.map((t, ti) => ({
        id: t.id ?? `${u.id}-t-${ti}`,
        name: t.name ?? `Chủ đề ${ti + 1}`,
        lessons: (t.lessons || []).map((l, li) => ({
          id: l.id ?? `${u.id}-t-${ti}-l-${li}`,
          name: l.name ?? `Bài ${li + 1}`,
          type: (l.type || '').toLowerCase(),
          isDone: l.isDone === true || l.isDone === 'done'
        }))
      }));
      return { id: u.id ?? (ui + 1), name: u.name ?? `Chương ${ui + 1}`, topics };
    }

    // flattened lessons
    if (Array.isArray(u.lessons)) {
      const lessons = u.lessons.map((l, li) => ({
        id: l.id ?? `${u.id}-l-${li}`,
        name: l.name ?? `Bài ${li + 1}`,
        type: (l.type || '').toLowerCase(),
        isDone: l.isDone === true || l.isDone === 'done'
      }));
      return { id: u.id ?? (ui + 1), name: u.name ?? `Chương ${ui + 1}`, topics: [{ id: `${u.id}-t-0`, name: 'Chủ đề', lessons }] };
    }

    // legacy levels
    if (Array.isArray(u.levels)) {
      const lessons = u.levels.map((lv, li) => ({
        id: lv.id ?? `${u.id}-l-${li}`,
        name: lv.partName ?? lv.name ?? `Bài ${li + 1}`,
        type: (lv.type || '').toLowerCase(),
        isDone: lv.isDone === true || lv.isDone === 'done'
      }));
      return { id: u.id ?? (ui + 1), name: u.name ?? `Chương ${ui + 1}`, topics: [{ id: `${u.id}-t-0`, name: 'Chủ đề', lessons }] };
    }

    // fallback empty
    return { id: u.id ?? (ui + 1), name: u.name ?? `Chương ${ui + 1}`, topics: [{ id: `${u.id}-t-0`, name: 'Chủ đề', lessons: [] }] };
  });
}

let units = normalizeUnits(rawUnits);
// persist normalized so next load is consistent
safeSetJSON('units', units);

/* ============================
   Theory-viewed set
   ============================ */
function loadTheoryViewed() { const arr = safeGetJSON('smartchem_theory_viewed', []); return Array.isArray(arr) ? arr : []; }
function saveTheoryViewed(arr) { return safeSetJSON('smartchem_theory_viewed', arr); }
let theoryViewed = loadTheoryViewed();

/* ============================
   Progress helpers
   ============================ */
function topicProgress(topic) {
  const total = (topic.lessons || []).length;
  const done = (topic.lessons || []).filter(l => l.isDone).length;
  return { total, done, pct: total === 0 ? 0 : Math.round(done / total * 100) };
}
function unitProgress(unit) {
  const totals = (unit.topics || []).reduce((acc, t) => { const p = topicProgress(t); acc.total += p.total; acc.done += p.done; return acc; }, { total: 0, done: 0 });
  return { ...totals, pct: totals.total === 0 ? 0 : Math.round(totals.done / totals.total * 100) };
}

/* ============================
   Locators & mark API
   ============================ */
function resolveUnitIndex(unitIdOrIndex) {
  if (typeof unitIdOrIndex === 'number') return unitIdOrIndex;
  if (typeof unitIdOrIndex === 'string' && /^\d+$/.test(unitIdOrIndex)) return Number(unitIdOrIndex) - 1;
  return units.findIndex(u => String(u.id) === String(unitIdOrIndex));
}
function findLessonLocator(unitIdOrIndex, lessonIdOrIndex) {
  const uIndex = resolveUnitIndex(unitIdOrIndex);
  const unit = units[uIndex];
  if (!unit) return null;

  if (typeof lessonIdOrIndex === 'number') {
    // flattened index
    let count = 0;
    for (let t = 0; t < (unit.topics || []).length; t++) {
      const lessons = unit.topics[t].lessons || [];
      if (lessonIdOrIndex < count + lessons.length) {
        return { unitIndex: uIndex, topicIndex: t, lessonIndex: lessonIdOrIndex - count };
      }
      count += lessons.length;
    }
    return null;
  }

  for (let t = 0; t < (unit.topics || []).length; t++) {
    const lessons = unit.topics[t].lessons || [];
    const li = lessons.findIndex(l => String(l.id) === String(lessonIdOrIndex));
    if (li >= 0) return { unitIndex: uIndex, topicIndex: t, lessonIndex: li };
  }
  return null;
}

function markLessonDone({ unitId, lessonIndex = undefined, lessonId = undefined }) {
  let locator = null;
  if (lessonId !== undefined) locator = findLessonLocator(unitId, lessonId);
  else if (lessonIndex !== undefined) locator = findLessonLocator(unitId, Number(lessonIndex));
  if (!locator) { console.warn('markLessonDone: cannot locate', { unitId, lessonIndex, lessonId }); return false; }
  const { unitIndex, topicIndex, lessonIndex: lIdx } = locator;
  const lesson = units[unitIndex].topics[topicIndex].lessons[lIdx];
  if (!lesson) return false;
  if (lesson.isDone) return false; // already
  lesson.isDone = true;
  safeSetJSON('units', units);
  renderRoadmap();
  focusLanding(units[unitIndex].id);
  return true;
}

/* ============================
   Theory viewed API
   ============================ */
function addTheoryViewed(lessonId) {
  if (!lessonId) return;
  const sId = String(lessonId);
  if (theoryViewed.indexOf(sId) === -1) {
    theoryViewed.push(sId);
    saveTheoryViewed(theoryViewed);
    try { localStorage.setItem('smartchem_theory_viewed', JSON.stringify(theoryViewed)); } catch (e) {}
    renderRoadmap();
  }
}

/* ============================
   Pending marks processing (query/localStorage)
   ============================ */
function processPendingEvents() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mark') === 'true') {
      const unitParam = params.get('unit');
      const levelParam = params.get('level');
      const lessonIdParam = params.get('lessonId');
      if (lessonIdParam) markLessonDone({ unitId: unitParam, lessonId: lessonIdParam });
      else if (levelParam != null) markLessonDone({ unitId: unitParam, lessonIndex: Number(levelParam) });
      // clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('mark'); url.searchParams.delete('unit'); url.searchParams.delete('level'); url.searchParams.delete('lessonId');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }

    if (params.get('theory_viewed') === 'true') {
      const lessonIdParam = params.get('lessonId');
      if (lessonIdParam) addTheoryViewed(lessonIdParam);
      const url = new URL(window.location.href);
      url.searchParams.delete('theory_viewed'); url.searchParams.delete('lessonId');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  } catch (e) { console.warn('processPendingEvents(query) error', e); }

  try {
    const pendingRaw = localStorage.getItem('smartchem_mark_pending');
    if (pendingRaw) {
      const pending = JSON.parse(pendingRaw);
      if (pending) {
        if (pending.lessonId) markLessonDone({ unitId: pending.unit, lessonId: pending.lessonId });
        else if (pending.level != null) markLessonDone({ unitId: pending.unit, lessonIndex: Number(pending.level) });
      }
      localStorage.removeItem('smartchem_mark_pending');
    }
  } catch (e) { /* ignore */ }
}

// storage listener for cross-tab events
window.addEventListener('storage', (ev) => {
  if (!ev.key) return;
  if (ev.key === 'smartchem_mark' || ev.key === 'smartchem_mark_pending') {
    try {
      const payload = JSON.parse(ev.newValue);
      if (!payload) return;
      if (payload.lessonId) markLessonDone({ unitId: payload.unit, lessonId: payload.lessonId });
      else if (payload.level != null) markLessonDone({ unitId: payload.unit, lessonIndex: Number(payload.level) });
    } catch (e) { /* ignore */ }
  }
  if (ev.key === 'smartchem_theory_viewed') {
    try {
      const arr = JSON.parse(ev.newValue) || [];
      theoryViewed = Array.isArray(arr) ? arr : theoryViewed;
      renderRoadmap();
    } catch (e) { /* ignore */ }
  }
});

processPendingEvents();

/* ============================
   UI Rendering (roadmap)
   ============================ */
function renderLayout() {
  const mid = document.querySelector('.mid-section');
  mid.innerHTML = `
    <div class="mid-wrap">
      <div class="header-panel">
        <div class="header-left">
          <h1>Roadmap khoá học</h1>
          <div class="muted">Nhấp vào chương để mở/đóng. Trạng thái hiển thị bên phải.</div>
        </div>
        <div class="global-progress" id="globalProgress">Tổng: 0%</div>
      </div>
      <div class="roadmap" id="roadmapRoot"></div>
    </div>
  `;
}

function createLessonNav(unitId, lessonLocator) {
  const unitIndex = resolveUnitIndex(unitId);
  const unit = units[unitIndex];
  if (!unit) return null;
  let flatIndex = 0;
  for (let t = 0; t < unit.topics.length; t++) {
    const lessons = unit.topics[t].lessons || [];
    if (t < lessonLocator.topicIndex) flatIndex += lessons.length;
    else { flatIndex += lessonLocator.lessonIndex; break; }
  }
  return { unitId: unit.id, flatLevelIndex: flatIndex, lessonId: lessonLocator.lessonId ?? null };
}

function renderRoadmap() {
  renderLayout();
  const root = document.getElementById('roadmapRoot');
  root.innerHTML = '';

  let globalTotal = 0, globalDone = 0;

  units.forEach((unit, uIdx) => {
    const up = unitProgress(unit);
    globalTotal += up.total; globalDone += up.done;

    const chap = document.createElement('div'); chap.className = 'chapter'; chap.id = `unit-${unit.id}`;

    const head = document.createElement('div'); head.className = 'chapter-head'; head.setAttribute('role','button'); head.tabIndex = 0;
    const left = document.createElement('div'); left.className = 'chapter-left';
    const idx = document.createElement('div'); idx.className = 'chapter-index'; idx.textContent = unit.id;
    const title = document.createElement('div'); title.className = 'chapter-title'; title.textContent = unit.name;
    left.appendChild(idx); left.appendChild(title);

    const right = document.createElement('div'); right.className = 'pct-badge'; right.textContent = `${up.pct}%`;
    head.appendChild(left); head.appendChild(right);

    chap.appendChild(head);

    const body = document.createElement('div'); body.className = 'chapter-body'; body.style.display = 'none';

    // topics
    (unit.topics || []).forEach((topic, tIdx) => {
      // topic title
      if (topic.name) {
        const tTitle = document.createElement('div'); tTitle.className = 'topic-title'; tTitle.textContent = topic.name; body.appendChild(tTitle);
      }
      const topicWrap = document.createElement('div'); topicWrap.className = 'topic';

      (topic.lessons || []).forEach((lesson, lIdx) => {
        const locator = { topicIndex: tIdx, lessonIndex: lIdx, lessonId: lesson.id };
        const row = document.createElement('div'); row.className = 'lesson-row';
        row.setAttribute('role','button'); row.tabIndex = 0; row.style.cursor = 'pointer';
        // annotate with type for CSS
        const lType = (lesson.type || '').toLowerCase();
        row.setAttribute('data-type', lType);

        const name = document.createElement('div'); name.className = 'lesson-name'; name.textContent = lesson.name;

        const rightCol = document.createElement('div'); rightCol.className = 'lesson-right';

        // status badge
        const statusSpan = document.createElement('span');
        if (lType === 'theory') {
          const viewed = theoryViewed.indexOf(String(lesson.id)) >= 0;
          statusSpan.className = viewed ? 'status-viewed' : 'status-unviewed';
          statusSpan.textContent = viewed ? 'Đã xem' : 'Chưa xem';
        } else {
          const done = !!lesson.isDone;
          statusSpan.className = done ? 'status-complete' : 'status-pending';
          statusSpan.textContent = done ? 'Hoàn thành' : 'Chưa hoàn thành';
        }

        rightCol.appendChild(statusSpan);

        row.appendChild(name); row.appendChild(rightCol);
        topicWrap.appendChild(row);

        // click / keyboard handlers
        const activate = () => {
          // debounce clicks
          row.style.pointerEvents = 'none';
          setTimeout(() => row.style.pointerEvents = '', 700);

          const loc = findLessonLocator(unit.id, lesson.id);
          const nav = createLessonNav(unit.id, loc || { topicIndex: tIdx, lessonIndex: lIdx, lessonId: lesson.id });
          if (!nav) return console.warn('Cannot navigate to lesson', unit.id, lesson.id);

          if (lType === 'theory') {
            try {
              const viewed = loadTheoryViewed() || [];
              if (viewed.indexOf(String(lesson.id)) === -1) {
                viewed.push(String(lesson.id)); safeSetJSON('smartchem_theory_viewed', viewed); localStorage.setItem('smartchem_theory_viewed', JSON.stringify(viewed)); theoryViewed = viewed;
              }
            } catch (e) {}
            window.location.href = `lesson/lesson.html?unit=${encodeURIComponent(nav.unitId)}&lesson=${encodeURIComponent(lesson.id)}&type=theory`;
          } else {
            window.location.href = `lesson/lesson.html?unit=${encodeURIComponent(nav.unitId)}&level=${encodeURIComponent(nav.flatLevelIndex)}&type=${encodeURIComponent(lType)}`;
          }
        };

        row.addEventListener('click', activate);
        row.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); activate(); } });

      }); // lessons

      body.appendChild(topicWrap);
    }); // topics

    chap.appendChild(body);

    // toggle body on header click/keypress
    const toggle = () => {
      const open = body.style.display === 'flex';
      body.style.display = open ? 'none' : 'flex';
      if (!open) body.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); toggle(); } });

    root.appendChild(chap);
  }); // units

  // global progress
  const gp = document.getElementById('globalProgress');
  const globalPct = globalTotal === 0 ? 0 : Math.round(globalDone / globalTotal * 100);
  if (gp) gp.textContent = `Tổng: ${globalPct}%`;
}

/* ============================
   focusLanding(unitId)
   ============================ */
function focusLanding(unitId) {
  try {
    const el = document.getElementById(`unit-${unitId}`);
    if (!el) return;
    el.classList.add('focus-landing');
    setTimeout(() => el.classList.remove('focus-landing'), 1200);
  } catch (e) { /* ignore */ }
}

/* ============================
   Scroll memory for .mid-section
   ============================ */
(function initScrollMemory() {
  const pageKey = 'scrollY_' + window.location.pathname;
  function debounce(fn, wait = 120) { let t = null; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; }
  function getScrollTarget() { const mid = document.querySelector('.mid-section'); if (mid && mid.scrollHeight > mid.clientHeight) return mid; return window; }
  function savePosition() { const target = getScrollTarget(); const y = (target === window) ? (window.scrollY || window.pageYOffset || 0) : target.scrollTop; try { localStorage.setItem(pageKey, String(Math.floor(y))); } catch (e) {} }
  const savePositionDebounced = debounce(savePosition, 100);
  function attachScrollListeners() { window.addEventListener('scroll', savePositionDebounced, { passive: true }); const mid = document.querySelector('.mid-section'); if (mid) mid.addEventListener('scroll', savePositionDebounced, { passive: true }); }
  function tryRestoreOnce() {
    const saved = localStorage.getItem(pageKey); if (!saved) return true; const val = parseInt(saved, 10) || 0; const mid = document.querySelector('.mid-section');
    if (mid && mid.scrollHeight > mid.clientHeight) { mid.scrollTop = val; return true; }
    if (document.body.scrollHeight > window.innerHeight) { window.scrollTo(0, val); return true; }
    return false;
  }
  function restoreWhenReady({ maxAttempts = 60, intervalMs = 100 } = {}) {
    const saved = localStorage.getItem(pageKey); if (!saved) return; const mid = document.querySelector('.mid-section'); if (mid) {
      const obs = new MutationObserver((mutations, observer) => { const ok = tryRestoreOnce(); if (ok) observer.disconnect(); });
      obs.observe(mid, { childList: true, subtree: true });
    }
    let attempts = 0; const id = setInterval(() => { attempts++; const ok = tryRestoreOnce(); if (ok || attempts >= maxAttempts) clearInterval(id); }, intervalMs);
  }
  function init() { attachScrollListeners(); window.addEventListener('load', () => { restoreWhenReady({ maxAttempts: 80, intervalMs: 80 }); setTimeout(() => restoreWhenReady({ maxAttempts: 40, intervalMs: 120 }), 200); }); setTimeout(() => restoreWhenReady(), 50); }
  init();
})();

/* ============================
   Initial render & expose API
   ============================ */
renderRoadmap();

window.__SmartChem = window.__SmartChem || {};
window.__SmartChem.units = units;
window.__SmartChem.markLessonDone = markLessonDone;
window.__SmartChem.addTheoryViewed = addTheoryViewed;
window.__SmartChem.findLessonLocator = findLessonLocator;
window.__SmartChem.refresh = () => { units = normalizeUnits(safeGetJSON('units', units)); renderRoadmap(); };

/* End of file */
