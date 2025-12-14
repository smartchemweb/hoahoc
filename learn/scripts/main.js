// scripts/main.js — Roadmap renderer (full, fixed + smoke stagger + persistent open chapters + level param)
// NOTE: All links to lesson/lesson.html include &level=<flatLevelIndex>

(() => {
  'use strict';

  /* ===========================
     Small DOM & storage helpers
     =========================== */
  const $ = (sel, root = document) => (root || document).querySelector(sel);
  const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));

  function safeGetJSON(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { console.warn('safeGetJSON', e); return fallback; }
  }
  function safeSetJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { console.warn('safeSetJSON', e); return false; }
  }

  /* ===========================
     Icon helper
     =========================== */
  function iconForType(type) {
    const t = (type || '').toString().trim().toLowerCase();
    console.log(t);
    const map = {
      'video': '../../assets/images/video-logo.svg',
      'other': '../../assets/images/other-logo.svg',
      'ex1': '../../assets/images/ex1-logo.svg',
      'ex2': '../../assets/images/ex2-logo.svg',
      'ex3': '../../assets/images/ex3-logo.svg',
      'name': '../../assets/images/theory-logo.svg'
    };
    return map[t] || '../../assets/images/theory-logo.svg';
  }

  /* ===========================
     Load raw units (from localStorage or window.units fallback)
     =========================== */
  let rawUnits = safeGetJSON('units', null);
  if (!rawUnits && window.units) rawUnits = window.units;

  rawUnits = rawUnits || [
    { id: 1, name: "Ester", levels: [
        {
            name: "Dạng 1. Khái niệm, Danh pháp, Tính chất vật lí",
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
    { id: 2, name: "Carbohydrate", levels: [
        {
            name: "Giới thiệu về CARBOHYDRATE. GLUCOSE VÀ FRUCTOSE",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "THÍ NGHIỆM GLUCOSE VỚI COPPERII HYDROXIDE",
            isDone: 'notdone',
            type: "video"
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "THÍ NGHIỆM SACCHAROSE VỚI COPPER(II) HYDROXIDE",
            isDone: 'notdone',
            type: "video"
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "THÍ NGHIỆM PHẢN ỨNG HỒ TINH BỘT VỚI IODINE",
            isDone: 'notdone',
            type: "video"
        }, {
            name: "THÍ NGHIỆM PHẢN ỨNG THỦY PHÂN TINH BỘT VÀ CELLULOSE",
            isDone: 'notdone',
            type: "video"
        }, {
            name: "THÍ NGHIỆM CELLULOSE TAN TRONG NƯỚC SCHWEIZER",
            isDone: 'notdone',
            type: "video"
        }, {
            name: "THÍ NGHIỆM PHẢN ỨNG CỦA CELLULOSE VỚI NITRIC ACID",
            isDone: 'notdone',
            type: "video"
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "BÀI TẬP PHẢN ỨNG THỦY PHÂN CARBOHYDRATE",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "BÀI TẬP PHẢN ỨNG THỦY PHÂN - TRÁNG GƯƠNG CARBOHYDRATE",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "BÀI TẬP PHẢN ỨNG LÊN MEN CARBOHYDRATE",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "Phương pháp giải",
            isDone: 'notdone',
            type: "theory",
            partName: "BÀI TẬP PHẢN ỨNG CELLULOSE TÁC DỤNG HNO3"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            name: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: AMINO ACID TÁC DỤNG VỚI ACID",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: AMINO ACID TÁC DỤNG VỚI BASE",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: AMINO ACID TÁC DỤNG VỚI ACID – BASE (TÍNH LƯỠNG TÍNH)",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: HỖN HỢP AMINO ACID VÀ ACID VÔ CƠ TÁC DỤNG VỚI BASE",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: HỖN HỢP AMINO ACID VÀ BASE VÔ CƠ TÁC DỤNG VỚI ACID",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: DẠNG TOÁN ESTER CỦA AMINO ACID",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: THUỶ PHÂN PEPTIDE",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: THUỶ PHÂN PEPTIDE TRONG MÔI TRƯỜNG ACID",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Phương pháp",
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "BÀI TẬP: BÀI TẬP CAO SU",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Phương pháp",
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "THẾ ĐIỆN CỰC VÀ NGUỒN ĐIỆN HÓA HỌC",
            isDone: 'notdone',
            type: "other"
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "ĐIỆN PHÂN",
            isDone: 'notdone',
            type: "other"
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 2: BÀI TẬP TÍNH THẾ ĐIỆN CỰC CHUẨN",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 3: BÀI TẬP 1 KIM LOẠI TÁC DỤNG VỚI 1 DUNG DỊCH MUỐI",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 4: BÀI TẬP 2 KIM LOẠI TÁC DỤNG VỚI 1 DUNG DỊCH MUỐI",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 5: BÀI TẬP 1 KIM LOẠI TÁC DỤNG VỚI 2 DUNG DỊCH MUỐI",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 6: BÀI TẬP ĐIỆN PHÂN 1 CHẤT (NÓNG CHẢY – DUNG DỊCH)",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 7: BÀI TẬP ĐIỆN PHÂN HỖN HỢP 2 CHẤT TRONG DUNG DỊCH",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Bài tập vận dụng (Trắc nghiệm lựa chọn)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Phương pháp",
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "THÍ NGHIỆM KIM LOẠI TÁC DỤNG VỚI PHI KIM",
            isDone: 'notdone',
            type: "video"
        }, {
            name: "THÍ NGHIỆM KIM LOẠI TÁC DỤNG VỚI DUNG DỊCH MUỐI",
            isDone: 'notdone',
            type: "video"
        }, {
            name: "THÍ NGHIỆM KIM LOẠI TÁC DỤNG VỚI DUNG DỊCH ACID LOÃNG",
            isDone: 'notdone',
            type: "video"
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 2: BASIC OXIDE TÁC DỤNG VỚI ACID",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 3: KIM LOẠI TÁC DỤNG VỚI ACID HCl, H2SO4 LOÃNG",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 4: KIM LOẠI TÁC DỤNG VỚI ACID H2SO4 ĐẶC",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 5: KHỬ OXIDE KIM LOẠI BẰNG KHÍ CO",
            name: "Phương pháp",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Phương pháp",
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "THÍ NGHIỆM KIM LOẠI KIỀM TÁC DỤNG VỚI KHÍ OXYGEN",
            isDone: 'notdone',
            type: "video"
        }, {
            name: "THÍ NGHIỆM KIM LOẠI KIỀM TÁC DỤNG VỚI KHÍ CHLORINE",
            isDone: 'notdone',
            type: "video"
        }, {
            name: "THÍ NGHIỆM KIM LOẠI KIỀM TÁC DỤNG VỚI NƯỚC",
            isDone: 'notdone',
            type: "video"
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "THÍ NGHIỆM THỬ MÀU NGỌN LỬA KIM LOẠI KIỀM",
            isDone: 'notdone',
            type: "video"
        }, {
            name: "THÍ NGHIỆM SO SÁNH ĐỘ TAN GIỮA CALCIUM SULFATE VÀ BARIUM SULFATE",
            isDone: 'notdone',
            type: "video"
        }, {
            name: "THÍ NGHIỆM NHẬN BIẾT ION CALCIUM, BARIUM, CARBONATE VÀ SULFATE",
            isDone: 'notdone',
            type: "video"
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (KIM LOẠI KIỀM THỔ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 3: DẠNG TOÁN CO2 TÁC DỤNG VỚI DUNG DỊCH KIỀM",
            name: "Lí thuyết",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (KIM LOẠI KIỀM THỔ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 4: MUỐI CARBONATE TÁC DỤNG VỚI ACID",
            name: "Lí thuyết",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (KIM LOẠI KIỀM THỔ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "DẠNG 5: BÀI TOÁN TỔNG HỢP MUỐI CARBONATE",
            name: "Lí thuyết",
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "Trắc nghiệm nhiều phương án lựa chọn (KIM LOẠI KIỀM THỔ)",
            isDone: 'notdone',
            type: "ex1"
        }, {
            partName: "ĐỀ ÔN TẬP CHƯƠNG SỐ 01",
            name: "Phương pháp",
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
            type: "theory"
        }, {
            name: "THÍ NGHIỆM XÁC ĐỊNH HÀM LƯỢNG MUỐI Fe(II) BẰNG DUNG DỊCH THUỐC TÍM",
            isDone: 'notdone',
            type: "video"
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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
            isDone: 'notdone',
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

  // If still falsy, default to empty array (don't override user's data)
  if (!Array.isArray(rawUnits)) rawUnits = [];

  /* ===========================
     Normalize input shapes -> units[].topics[].lessons[]
     each lesson: { id, name, type, isDone }
     =========================== */
  function normalizeUnits(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map((u, ui) => {
      // topics present
      if (Array.isArray(u.topics)) {
        const topics = u.topics.map((t, ti) => ({
          id: t.id ?? `${u.id}-t-${ti}`,
          name: t.name ?? `Chủ đề ${ti + 1}`,
          lessons: Array.isArray(t.lessons) ? t.lessons.map((l, li) => ({
            id: l.id ?? `${u.id}-t-${ti}-l-${li}`,
            name: l.name ?? `Bài ${li + 1}`,
            type: (l.type || '').toString().trim(),
            isDone: (l.isDone === true) || (typeof l.isDone === 'string' && l.isDone.trim().toLowerCase() === 'done')
          })) : []
        }));
        return { id: u.id ?? (ui + 1), name: u.name ?? `Chương ${ui + 1}`, topics };
      }

      // lessons at unit level
      if (Array.isArray(u.lessons)) {
        const lessons = u.lessons.map((l, li) => ({
          id: l.id ?? `${u.id}-l-${li}`,
          name: l.name ?? `Bài ${li + 1}`,
          type: (l.type || '').toString().trim(),
          isDone: (l.isDone === true) || (typeof l.isDone === 'string' && l.isDone.trim().toLowerCase() === 'done')
        }));
        return { id: u.id ?? (ui + 1), name: u.name ?? `Chương ${ui + 1}`, topics: [{ id: `${u.id}-t-0`, name: 'Chủ đề', lessons }] };
      }

      // legacy levels
      if (Array.isArray(u.levels)) {
        const lessons = u.levels.map((lv, li) => ({
          id: lv.id ?? `${u.id}-l-${li}`,
          name: lv.partName ?? lv.name ?? `Bài ${li + 1}`,
          type: (lv.type || '').toString().trim(),
          isDone: (lv.isDone === true) || (typeof lv.isDone === 'string' && lv.isDone.trim().toLowerCase() === 'done')
        }));
        return { id: u.id ?? (ui + 1), name: u.name ?? `Chương ${ui + 1}`, topics: [{ id: `${u.id}-t-0`, name: 'Chủ đề', lessons }] };
      }

      // fallback empty
      return { id: u.id ?? (ui + 1), name: u.name ?? `Chương ${ui + 1}`, topics: [{ id: `${u.id}-t-0`, name: 'Chủ đề', lessons: [] }] };
    });
  }

  let units = normalizeUnits(rawUnits);
  safeSetJSON('units', units);

  /* ===========================
     Viewed sets: theory, video, other
     =========================== */
  function loadTheoryViewed() { const arr = safeGetJSON('smartchem_theory_viewed', []); return Array.isArray(arr) ? arr.map(String) : []; }
  function saveTheoryViewed(arr) { return safeSetJSON('smartchem_theory_viewed', arr); }
  let theoryViewed = loadTheoryViewed();

  function loadVideoViewed() { const arr = safeGetJSON('smartchem_video_viewed', []); return Array.isArray(arr) ? arr.map(String) : []; }
  function saveVideoViewed(arr) { return safeSetJSON('smartchem_video_viewed', arr); }
  let videoViewed = loadVideoViewed();

  function loadOtherViewed() { const arr = safeGetJSON('smartchem_other_viewed', []); return Array.isArray(arr) ? arr.map(String) : []; }
  function saveOtherViewed(arr) { return safeSetJSON('smartchem_other_viewed', arr); }
  let otherViewed = loadOtherViewed();

  /* ===========================
     isLessonDone helper (handles boolean/string)
     =========================== */
  function isLessonDone(lesson) {
    if (!lesson) return false;
    if (lesson === true) return true;
    if (typeof lesson === 'object' && lesson.isDone !== undefined) {
      const v = lesson.isDone;
      if (v === true) return true;
      if (typeof v === 'string') {
        const s = v.trim().toLowerCase();
        return s === 'done';
      }
      return false;
    }
    if (typeof lesson === 'string') {
      const s = lesson.trim().toLowerCase();
      return s === 'done';
    }
    return !!lesson;
  }

  /* ===========================
     isLessonName helper (topic label)
     - not clickable, not counted in progress, no status
     =========================== */
  function isLessonName(lesson) {
    if (!lesson) return false;
    const t = (lesson.type || '').toString().trim().toLowerCase();
    const n = (lesson.name || '').toString().trim().toLowerCase();
    if (t === 'name') return true;
    if (/^name$/i.test(lesson.type || '')) return true;
    if (/chủ ?đề|topic/i.test(n)) return true;
    return false;
  }

  /* ===========================
     Progress helpers (exclude name rows)
     =========================== */
  function topicProgress(topic) {
    const lessons = Array.isArray(topic.lessons) ? topic.lessons : [];
    let total = 0, done = 0;
    lessons.forEach(l => {
      if (isLessonName(l)) return;
      total += 1;
      if (isLessonDone(l)) done += 1;
    });
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }

  function unitProgress(unit) {
    const topics = Array.isArray(unit.topics) ? unit.topics : [];
    const acc = topics.reduce((s, t) => {
      const p = topicProgress(t);
      s.total += p.total; s.done += p.done;
      return s;
    }, { total: 0, done: 0 });
    acc.pct = acc.total === 0 ? 0 : Math.round((acc.done / acc.total) * 100);
    return acc;
  }

  /* ===========================
     Locators & flat index computation
     =========================== */
  function resolveUnitIndex(unitIdOrIndex) {
    if (typeof unitIdOrIndex === 'number') {
      const found = units.findIndex(u => u.id === unitIdOrIndex || String(u.id) === String(unitIdOrIndex));
      if (found >= 0) return found;
      return unitIdOrIndex;
    }
    if (typeof unitIdOrIndex === 'string' && /^\d+$/.test(unitIdOrIndex)) {
      const found = units.findIndex(u => String(u.id) === unitIdOrIndex);
      if (found >= 0) return found;
      return Number(unitIdOrIndex) - 1;
    }
    return units.findIndex(u => String(u.id) === String(unitIdOrIndex));
  }

  function findLessonLocator(unitIdOrIndex, lessonIdOrIndex) {
    const uIndex = resolveUnitIndex(unitIdOrIndex);
    const unit = units[uIndex];
    if (!unit) return null;
    const topics = Array.isArray(unit.topics) ? unit.topics : [];

    if (typeof lessonIdOrIndex === 'number') {
      // flat index -> locate topic & relative index inside topic
      let count = 0;
      for (let t = 0; t < topics.length; t++) {
        const lessons = Array.isArray(topics[t].lessons) ? topics[t].lessons : [];
        if (lessonIdOrIndex < count + lessons.length) {
          return { unitIndex: uIndex, topicIndex: t, lessonIndex: lessonIdOrIndex - count };
        }
        count += lessons.length;
      }
      return null;
    }

    // lessonId (string)
    for (let t = 0; t < topics.length; t++) {
      const lessons = Array.isArray(topics[t].lessons) ? topics[t].lessons : [];
      const li = lessons.findIndex(l => String(l?.id ?? '') === String(lessonIdOrIndex));
      if (li >= 0) return { unitIndex: uIndex, topicIndex: t, lessonIndex: li };
    }
    return null;
  }

  // compute flat index for a lesson (sum lengths of previous topics + lessonIndex)
  function computeFlatIndex(unit, topicIndex, lessonIndex) {
    const topics = Array.isArray(unit.topics) ? unit.topics : [];
    let flat = 0;
    for (let t = 0; t < topicIndex; t++) {
      const lessons = Array.isArray(topics[t].lessons) ? topics[t].lessons : [];
      flat += lessons.length;
    }
    flat += lessonIndex;
    return flat;
  }

  function createLessonNav(unitId, locator) {
    const uIndex = resolveUnitIndex(unitId);
    const unit = units[uIndex];
    if (!unit || !locator) return null;
    const flatIndex = computeFlatIndex(unit, locator.topicIndex, locator.lessonIndex);
    return { unitId: unit.id, flatLevelIndex: flatIndex, lessonId: locator.lessonId ?? null };
  }

  /* ===========================
     Mark done API
     =========================== */
  function markLessonDone({ unitId, lessonIndex = undefined, lessonId = undefined }) {
    let locator = null;
    if (lessonId !== undefined) locator = findLessonLocator(unitId, lessonId);
    else if (lessonIndex !== undefined) locator = findLessonLocator(unitId, Number(lessonIndex));
    if (!locator) { console.warn('markLessonDone: cannot locate', { unitId, lessonIndex, lessonId }); return false; }
    const { unitIndex, topicIndex, lessonIndex: lIdx } = locator;
    const lesson = units[unitIndex] && units[unitIndex].topics && units[unitIndex].topics[topicIndex] && Array.isArray(units[unitIndex].topics[topicIndex].lessons) ? units[unitIndex].topics[topicIndex].lessons[lIdx] : null;
    if (!lesson) return false;
    if (isLessonDone(lesson)) return false;
    lesson.isDone = true;
    safeSetJSON('units', units);
    renderRoadmap();
    focusLanding(units[unitIndex].id);
    return true;
  }

  /* ===========================
     Theory / Video / Other viewed APIs
     =========================== */
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
  function addVideoViewed(lessonId) {
    if (!lessonId) return;
    const sId = String(lessonId);
    if (videoViewed.indexOf(sId) === -1) {
      videoViewed.push(sId);
      saveVideoViewed(videoViewed);
      try { localStorage.setItem('smartchem_video_viewed', JSON.stringify(videoViewed)); } catch (e) {}
      renderRoadmap();
    }
  }
  function addOtherViewed(lessonId) {
    if (!lessonId) return;
    const sId = String(lessonId);
    if (otherViewed.indexOf(sId) === -1) {
      otherViewed.push(sId);
      saveOtherViewed(otherViewed);
      try { localStorage.setItem('smartchem_other_viewed', JSON.stringify(otherViewed)); } catch (e) {}
      renderRoadmap();
    }
  }

  /* ===========================
     Open units persistence (remember which chapters are expanded)
     =========================== */
  const OPEN_UNITS_KEY = 'smartchem_open_units';
  function loadOpenUnits() { const arr = safeGetJSON(OPEN_UNITS_KEY, []); return Array.isArray(arr) ? arr.map(String) : []; }
  function saveOpenUnits(arr) { return safeSetJSON(OPEN_UNITS_KEY, arr); }
  let openUnits = loadOpenUnits(); // store as array of unit ids (string)

  /* ===========================
     Pending events (query params / localStorage)
     =========================== */
  function processPendingEvents() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mark') === 'true') {
        const unitParam = params.get('unit');
        const levelParam = params.get('level');
        const lessonIdParam = params.get('lessonId');
        if (lessonIdParam) markLessonDone({ unitId: unitParam, lessonId: lessonIdParam });
        else if (levelParam != null) markLessonDone({ unitId: unitParam, lessonIndex: Number(levelParam) });
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

      if (params.get('video_viewed') === 'true') {
        const lessonIdParam = params.get('lessonId');
        if (lessonIdParam) addVideoViewed(lessonIdParam);
        const url = new URL(window.location.href);
        url.searchParams.delete('video_viewed'); url.searchParams.delete('lessonId');
        window.history.replaceState({}, document.title, url.pathname + url.search);
      }

      if (params.get('other_viewed') === 'true') {
        const lessonIdParam = params.get('lessonId');
        if (lessonIdParam) addOtherViewed(lessonIdParam);
        const url = new URL(window.location.href);
        url.searchParams.delete('other_viewed'); url.searchParams.delete('lessonId');
        window.history.replaceState({}, document.title, url.pathname + url.search);
      }
    } catch (e) { console.warn('processPendingEvents(query) error', e); }

    // localStorage pending mark (lesson page may set this before redirect)
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

  /* ===========================
     Storage listener for cross-tab events
     =========================== */
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
      try { const arr = JSON.parse(ev.newValue) || []; theoryViewed = Array.isArray(arr) ? arr.map(String) : theoryViewed; renderRoadmap(); } catch(e) {}
    }
    if (ev.key === 'smartchem_video_viewed') {
      try { const arr = JSON.parse(ev.newValue) || []; videoViewed = Array.isArray(arr) ? arr.map(String) : videoViewed; renderRoadmap(); } catch(e) {}
    }
    if (ev.key === 'smartchem_other_viewed') {
      try { const arr = JSON.parse(ev.newValue) || []; otherViewed = Array.isArray(arr) ? arr.map(String) : otherViewed; renderRoadmap(); } catch(e) {}
    }
    if (ev.key === OPEN_UNITS_KEY) {
      try { const arr = JSON.parse(ev.newValue) || []; openUnits = Array.isArray(arr) ? arr.map(String) : openUnits; renderRoadmap(); } catch(e) {}
    }
  });

  // run pending events once
  processPendingEvents();

  /* ===========================
     UI layout render
     =========================== */
  function renderLayout() {
    const mid = document.querySelector('.mid-section');
    if (!mid) return;
    mid.innerHTML = `
      <div class="mid-wrap">
        <div class="header-panel">
          <div class="header-left">
            <h1>Roadmap khoá học</h1>
            <div class="muted">Nhấp vào chương để mở/đóng. Tiến độ tính tất cả loại nội dung (Lý thuyết/Video/Tài nguyên/Bài tập). (Các mục 'Chủ đề' không được tính vào tiến độ.)</div>
          </div>
          <div class="global-progress" id="globalProgress">Tổng: 0%</div>
        </div>
        <div class="roadmap" id="roadmapRoot"></div>
      </div>
    `;
  }

  /* ===========================
     Small animation helper for open/close (returns Promise)
     =========================== */
  function animateToggle(el, open) {
    return new Promise((resolve) => {
      const ANIM_MS = 220;
      el.style.overflow = 'hidden';
      if (open) {
        el.style.display = 'flex';
        el.style.flexDirection = 'column';
        const target = el.scrollHeight;
        el.style.height = '0px';
        requestAnimationFrame(() => {
          el.style.transition = `height ${ANIM_MS}ms cubic-bezier(.2,.9,.2,1)`;
          el.style.height = target + 'px';
        });
        const onEnd = () => { el.style.height = 'auto'; el.style.transition = ''; el.style.overflow = ''; el.removeEventListener('transitionend', onEnd); resolve(); };
        el.addEventListener('transitionend', onEnd);
        // safety fallback
        setTimeout(() => { try { onEnd(); } catch (e) {} }, ANIM_MS + 60);
      } else {
        const start = el.scrollHeight;
        el.style.height = start + 'px';
        el.getBoundingClientRect();
        requestAnimationFrame(() => {
          el.style.transition = `height ${ANIM_MS}ms cubic-bezier(.2,.9,.2,1)`;
          el.style.height = '0px';
        });
        const onEnd = () => { el.style.display = 'none'; el.style.height = ''; el.style.transition = ''; el.style.overflow = ''; el.removeEventListener('transitionend', onEnd); resolve(); };
        el.addEventListener('transitionend', onEnd);
        // safety fallback
        setTimeout(() => { try { onEnd(); } catch (e) {} }, ANIM_MS + 60);
      }
    });
  }

  /* ===========================
     Stagger helpers (apply enter/exit + smoke)
     - rows: array of elements
     - enter: apply stagger-enter + stagger-smoke with increasing delays
     - exit: apply stagger-exit with increasing delays (optional)
     =========================== */
  function staggerEnterRows(rows, baseDelay = 40, increment = 50) {
    rows.forEach((r, i) => {
      // skip "name" rows
      if (r.classList.contains('lesson-name-row')) return;
      const delay = baseDelay + i * increment;
      r.classList.add('stagger-smoke');
      r.classList.add('stagger-enter');
      r.style.animationDelay = `${delay}ms`;
      // remove the classes after animation ends to keep DOM tidy
      const cleanup = () => {
        r.classList.remove('stagger-enter');
        r.classList.remove('stagger-smoke');
        r.style.animationDelay = '';
        r.removeEventListener('animationend', cleanup);
      };
      r.addEventListener('animationend', cleanup);
    });
  }

  function staggerExitRows(rows, baseDelay = 10, increment = 30) {
    rows.forEach((r, i) => {
      if (r.classList.contains('lesson-name-row')) return;
      const delay = baseDelay + i * increment;
      r.classList.add('stagger-exit');
      r.style.animationDelay = `${delay}ms`;
      const cleanup = () => {
        r.classList.remove('stagger-exit');
        r.style.animationDelay = '';
        r.removeEventListener('animationend', cleanup);
      };
      r.addEventListener('animationend', cleanup);
    });
  }

  /* ===========================
     Render roadmap (main)
     =========================== */
  function renderRoadmap() {
    renderLayout();
    const root = document.getElementById('roadmapRoot');
    if (!root) return;
    root.innerHTML = '';

    let globalTotal = 0, globalDone = 0;
    const safeUnits = Array.isArray(units) ? units : [];

    safeUnits.forEach((unit) => {
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

      const topics = Array.isArray(unit.topics) ? unit.topics : [];
      topics.forEach((topic, tIdx) => {
        if (topic && topic.name) {
          const tTitle = document.createElement('div'); tTitle.className = 'topic-title'; tTitle.textContent = topic.name;
          body.appendChild(tTitle);
        }
        const topicWrap = document.createElement('div'); topicWrap.className = 'topic';

        const lessons = Array.isArray(topic && topic.lessons) ? topic.lessons : [];
        lessons.forEach((lesson, lIdx) => {
          const locator = { topicIndex: tIdx, lessonIndex: lIdx, lessonId: lesson && lesson.id };

          // local name detection
          const isNameLocal = isLessonName(lesson);

          const row = document.createElement('div');
          row.className = isNameLocal ? 'lesson-row lesson-name-row' : 'lesson-row';
          if (!isNameLocal) { row.setAttribute('role','button'); row.tabIndex = 0; row.style.cursor = 'pointer'; } else { row.style.cursor = 'default'; }

          // raw type and name
          const rawType = (lesson && lesson.type) ? lesson.type.toString() : '';
          let lType = rawType.trim().toLowerCase();
          const nameText = (lesson && (lesson.name || '')).toString();
          const nameLower = nameText.toLowerCase();

          // permissive classification
          const isVideo = /video/.test(lType) || /video|clip|thí nghiệm/i.test(nameLower);
          const isTheory = /theor/.test(lType) || /lí ?thuyết|lý ?thuyết|líthuyết/.test(lType) || /lí ?thuyết|lý ?thuyết|líthuyết/i.test(nameLower);
          const isOther = /other/.test(lType) || /tài nguyên|resource|tài liệu/i.test(nameLower);
          const isName = isNameLocal || lType === 'name' || /chủ ?đề|topic/i.test(nameLower);
          const isExercise = /^ex\d+/.test(lType) || /bài ?tập|trắc nghiệm|tự luận|đúng sai/i.test(nameLower);

          // canonicalize lType
          if (!lType) {
            if (isName) lType = 'name';
            else if (isTheory) lType = 'theory';
            else if (isVideo) lType = 'video';
            else if (isOther) lType = 'other';
            else if (isExercise) {
              const exMatch = (lesson && lesson.type && lesson.type.toString().match(/^ex\d+/i)) || (nameText.match(/ex[123]/i));
              lType = exMatch ? exMatch[0].toLowerCase() : 'exercise';
            } else {
              lType = '';
            }
          }

          row.setAttribute('data-type', lType || '');
          row.setAttribute('type', lType || '');
          if (lType) row.classList.add(`lesson-${lType.replace(/\s+/g,'-')}`);

          const iconWrap = document.createElement('div'); iconWrap.className = 'lesson-icon';
          const img = document.createElement('img'); img.className = 'lesson-icon-img'; img.alt = '';
          const iconKey = isVideo ? 'video' : (isTheory ? 'theory' : (isOther ? 'other' : (isExercise ? (lType || 'ex') : (lType || 'theory'))));
          img.src = iconForType(iconKey);
          iconWrap.appendChild(img);

          const name = document.createElement('div'); name.className = isName ? 'lesson-name lesson-name-label' : 'lesson-name'; name.textContent = nameText || 'Không có tên';

          const typeBadge = document.createElement('span'); typeBadge.className = 'lesson-type-badge';
          if (isVideo) typeBadge.textContent = 'Video';
          else if (isTheory) typeBadge.textContent = 'Lý thuyết';
          else if (isOther) typeBadge.textContent = 'Tài nguyên';
          else if (isName) typeBadge.textContent = 'Chủ đề';
          else if (isExercise) typeBadge.textContent = 'Bài tập';
          else typeBadge.textContent = lType || '';

          const rightCol = document.createElement('div'); rightCol.className = 'lesson-right';
          const statusSpan = document.createElement('span');

          if (isName) {
            statusSpan.className = 'status-name';
            statusSpan.textContent = '';
          } else if (isTheory) {
            const viewed = theoryViewed.indexOf(String(lesson?.id ?? '')) >= 0;
            statusSpan.className = viewed ? 'status-viewed' : 'status-unviewed';
            statusSpan.textContent = viewed ? 'Đã xem' : 'Chưa xem';
          } else if (isVideo) {
            const viewed = videoViewed.indexOf(String(lesson?.id ?? '')) >= 0;
            statusSpan.className = viewed ? 'status-viewed' : 'status-unviewed';
            statusSpan.textContent = viewed ? 'Đã xem' : 'Chưa xem';
          } else if (isOther) {
            const viewed = otherViewed.indexOf(String(lesson?.id ?? '')) >= 0;
            statusSpan.className = viewed ? 'status-viewed' : 'status-unviewed';
            statusSpan.textContent = viewed ? 'Đã xem' : 'Chưa xem';
          } else {
            const done = isLessonDone(lesson);
            statusSpan.className = done ? 'status-complete' : 'status-pending';
            statusSpan.textContent = done ? 'Hoàn thành' : 'Chưa hoàn thành';
          }

          const leftInner = document.createElement('div'); leftInner.style.display = 'flex'; leftInner.style.alignItems = 'center'; leftInner.style.gap = '12px';
          const nameWrap = document.createElement('div'); nameWrap.style.display = 'flex'; nameWrap.style.alignItems = 'center'; nameWrap.style.gap = '8px';
          nameWrap.appendChild(name);
          if (!isName) nameWrap.appendChild(typeBadge);
          leftInner.appendChild(iconWrap); leftInner.appendChild(nameWrap);

          row.appendChild(leftInner); row.appendChild(rightCol);
          rightCol.appendChild(statusSpan);
          topicWrap.appendChild(row);

          // activation handler (only for non-name)
          if (!isName) {
            const activate = () => {
              row.style.pointerEvents = 'none';
              setTimeout(() => row.style.pointerEvents = '', 600);

              const loc = findLessonLocator(unit.id, lesson && lesson.id);
              const nav = createLessonNav(unit.id, loc || { topicIndex: tIdx, lessonIndex: lIdx, lessonId: lesson && lesson.id });
              if (!nav) return;

              const levelParam = encodeURIComponent(nav.flatLevelIndex);

              if (isTheory) {
                try {
                  const viewed = loadTheoryViewed() || [];
                  const idStr = String(lesson?.id ?? '');
                  if (viewed.indexOf(idStr) === -1) {
                    viewed.push(idStr); saveTheoryViewed(viewed);
                    try { localStorage.setItem('smartchem_theory_viewed', JSON.stringify(viewed)); } catch (e) {}
                    theoryViewed = viewed;
                  }
                } catch (e) {}
                window.location.href = `lesson/lesson.html?unit=${encodeURIComponent(nav.unitId)}&lesson=${encodeURIComponent(String(lesson?.id ?? ''))}&type=theory&level=${levelParam}`;
                return;
              }

              if (isVideo) {
                try {
                  const v = loadVideoViewed() || [];
                  const idStr = String(lesson?.id ?? '');
                  if (v.indexOf(idStr) === -1) {
                    v.push(idStr); saveVideoViewed(v);
                    try { localStorage.setItem('smartchem_video_viewed', JSON.stringify(v)); } catch (e) {}
                    videoViewed = v;
                  }
                } catch (e) {}
                window.location.href = `lesson/lesson.html?unit=${encodeURIComponent(nav.unitId)}&lesson=${encodeURIComponent(String(lesson?.id ?? ''))}&type=video&level=${levelParam}`;
                return;
              }

              if (isOther) {
                try {
                  const arr = loadOtherViewed() || [];
                  const idStr = String(lesson?.id ?? '');
                  if (arr.indexOf(idStr) === -1) {
                    arr.push(idStr); saveOtherViewed(arr);
                    try { localStorage.setItem('smartchem_other_viewed', JSON.stringify(arr)); } catch (e) {}
                    otherViewed = arr;
                  }
                } catch (e) {}
                window.location.href = `lesson/lesson.html?unit=${encodeURIComponent(nav.unitId)}&lesson=${encodeURIComponent(String(lesson?.id ?? ''))}&type=other&level=${levelParam}`;
                return;
              }

              // default: exercise
              window.location.href = `lesson/lesson.html?unit=${encodeURIComponent(nav.unitId)}&level=${encodeURIComponent(nav.flatLevelIndex)}&type=${encodeURIComponent(lType)}`;
            };

            row.addEventListener('click', activate);
            row.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); activate(); } });
          }
        }); // lessons

        body.appendChild(topicWrap);
      }); // topics

      chap.appendChild(body);

      // When rendering, if unit id in openUnits -> show body without running open animation
      const unitIdStr = String(unit.id);
      if (openUnits.indexOf(unitIdStr) >= 0) {
        body.style.display = 'flex';
        body.style.flexDirection = 'column';
        body.classList.add('is-open');
        // no animation to avoid jump on initial restore
      }

      // toggle open/close with preserved scroll position and stagger
      const toggle = async () => {
        const isOpen = body.classList.contains('is-open');
        const prevScrollY = window.scrollY || window.pageYOffset || 0;

        if (!isOpen) {
          // open: make visible, animate height, stagger enter rows + smoke
          body.classList.add('is-open');
          // compute rows to animate
          const rows = Array.from(body.querySelectorAll('.lesson-row'));
          // pre-hide rows slightly (so animation looks solid) - we won't set display:none
          rows.forEach(r => { r.style.willChange = 'transform, opacity'; });

          await animateToggle(body, true);

          // stagger enter
          staggerEnterRows(rows, 40, 50);

          // ensure chapter id saved in openUnits
          openUnits = Array.from(new Set(openUnits.concat([unitIdStr]))).map(String);
          saveOpenUnits(openUnits);

          // restore scroll to previous Y to avoid jump
          try { window.scrollTo(0, prevScrollY); } catch (e) {}
        } else {
          // close: optionally animate exit on rows, then collapse
          const rows = Array.from(body.querySelectorAll('.lesson-row'));
          staggerExitRows(rows, 8, 20);

          // remove from open units list
          openUnits = openUnits.filter(x => String(x) !== unitIdStr);
          saveOpenUnits(openUnits);

          await animateToggle(body, false);
          body.classList.remove('is-open');
          try { window.scrollTo(0, prevScrollY); } catch (e) {}
        }
      };

      head.addEventListener('click', toggle);
      head.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); toggle(); } });

      root.appendChild(chap);
    }); // units loop

    // global progress
    const gp = document.getElementById('globalProgress');
    const globalPct = globalTotal === 0 ? 0 : Math.round(globalDone / globalTotal * 100);
    if (gp) gp.textContent = `Tổng: ${globalPct}%`;
  }

  /* ===========================
     focusLanding highlight
     =========================== */
  function focusLanding(unitId) {
    try {
      const el = document.getElementById(`unit-${unitId}`);
      if (!el) return;
      el.classList.add('focus-landing');
      setTimeout(() => el.classList.remove('focus-landing'), 1200);
    } catch (e) { /* ignore */ }
  }

  /* ===========================
     Scroll memory for .mid-section (persist scrollY)
     =========================== */
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

  /* ===========================
     Reset all progress helper
     =========================== */
  function resetAllProgress() {
    try {
      theoryViewed = []; videoViewed = []; otherViewed = [];
      saveTheoryViewed(theoryViewed); saveVideoViewed(videoViewed); saveOtherViewed(otherViewed);
      try { localStorage.setItem('smartchem_theory_viewed', JSON.stringify(theoryViewed)); } catch (e) {}
      try { localStorage.setItem('smartchem_video_viewed', JSON.stringify(videoViewed)); } catch (e) {}
      try { localStorage.setItem('smartchem_other_viewed', JSON.stringify(otherViewed)); } catch (e) {}

      if (Array.isArray(units)) {
        units.forEach(u => {
          (Array.isArray(u.topics) ? u.topics : []).forEach(t => {
            (Array.isArray(t.lessons) ? t.lessons : []).forEach(les => {
              les.isDone = false;
            });
          });
        });
      }
      safeSetJSON('units', units);
      renderRoadmap();
      console.info('All progress reset.');
      return true;
    } catch (e) {
      console.warn('resetAllProgress error', e);
      return false;
    }
  }

  /* ===========================
     Public debug API & initial render
     =========================== */
  renderRoadmap();

  window.__SmartChem = window.__SmartChem || {};
  window.__SmartChem.units = units;
  window.__SmartChem.markLessonDone = markLessonDone;
  window.__SmartChem.addTheoryViewed = addTheoryViewed;
  window.__SmartChem.addVideoViewed = addVideoViewed;
  window.__SmartChem.addOtherViewed = addOtherViewed;
  window.__SmartChem.findLessonLocator = findLessonLocator;
  window.__SmartChem.refresh = () => { units = normalizeUnits(safeGetJSON('units', units)); safeSetJSON('units', units); renderRoadmap(); };
  window.__SmartChem.theoryViewed = theoryViewed;
  window.__SmartChem.videoViewed = videoViewed;
  window.__SmartChem.otherViewed = otherViewed;
  window.__SmartChem.topicProgress = topicProgress;
  window.__SmartChem.unitProgress = unitProgress;
//   window.__SmartChem.resetAllProgress = resetAllProgress();

})();
