// let units = JSON.parse(localStorage.getItem('units')) || [
let units = [
    { /*ester*/
        id: 1,
        name: "Ester",
        levels: [
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
            },

        ],
    }, { /*Carbonhydrate*/
        id: 2,
        name: "Carbonhydrate",
        levels: [
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
                type: "name",
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
            },
        ],
    }, { /*HỢP CHẤT CHỨA NITROGEN*/
        id: 3,
        name: "HỢP CHẤT CHỨA NITROGEN",
        levels: [
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
            },
        ]
    }, { /* Polymer */        
        id: 4,
        name: "POLYMER",
        levels: [
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
            },
        ]
    }, { /* PIN ĐIỆN VÀ ĐIỆN PHÂN */
        id: 5,
        name: "PIN ĐIỆN VÀ ĐIỆN PHÂN",
        levels: [
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
            },
        ]
    }, { /* ĐẠI CƯƠNG VỀ KIM LOẠI */
        id: 6,
        name: "ĐẠI CƯƠNG VỀ KIM LOẠI",
        levels: [
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
            },
        ]
    }, { /* NGUYÊN TỐ NHÓM IA VÀ NHÓM IIA */
        id: 7,
        name: "NGUYÊN TỐ NHÓM IA VÀ NHÓM IIA ",
        levels: [
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
            },
        ]
    }, { /* SƠ LƯỢC VỀ KIM LOẠI CHUYỂN TIẾP THỨ NHẤT VÀ PHỨC CHẤT */ 
        id: 8,
        name: "SƠ LƯỢC VỀ KIM LOẠI CHUYỂN TIẾP THỨ NHẤT VÀ PHỨC CHẤT",
        levels: [
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
            },
        ]
    }
];

localStorage.setItem('units', JSON.stringify(units));

const params = new URLSearchParams(window.location.search);
const mark_pr = params.get('mark');
const unit_pr = params.get('unit');
const level_pr = params.get('level');

if (mark_pr === 'true') {
    units[unit_pr - 1].levels[Number(level_pr)].isDone = 'done';
    localStorage.setItem('units', JSON.stringify(units));
}

// --- RENDER MID LAYOUT ONCE ---
// Call this once before rendering units to create columns (content + toc)
function renderMidLayout() {
    const mid = document.querySelector('.mid-section');
    mid.innerHTML = `
      <div class="mid-wrap">
        <main class="mid-content" aria-live="polite"></main>
        <aside class="toc sticky" aria-label="Mục lục chương học">
          <div class="toc-title">Mục lục</div>
          <div class="toc-list" role="list"></div>
        </aside>
      </div>
    `;
    // if mid-section should be scroll container for scroll memory, add class
    // If mid content taller than viewport, we want mid-section to scroll
    // (scroll memory script will auto-detect .mid-section)
    // Optionally: mid.classList.add('has-scroll');
}

// --- DISPLAY UNITS INTO .mid-content (units array is global) ---
function displayUnits() {
    // ensure layout exists
    if (!document.querySelector('.mid-wrap')) renderMidLayout();

    const content = document.querySelector('.mid-content');
    content.innerHTML = ''; // reset

    units.forEach((unit, index) => {
        const { id, name, levels } = unit;
        // create container with id for scrolling target
        const unitEl = document.createElement('section');
        unitEl.className = 'unit';
        unitEl.id = `unit-${id}`;
        unitEl.setAttribute('data-unit-index', index);
        unitEl.setAttribute('tabindex', '-1'); // allow focus on scroll

        // unit header
        const header = document.createElement('div');
        header.className = 'unit-line';
        header.innerHTML = `
            <div class="unit-name">
                ${id}: ${name}
            </div>
        `;

        // levels list
        const levelsWrap = document.createElement('div');
        levelsWrap.className = 'unit-levels';

        levels.forEach((level, idx) => {
            const levelEl = document.createElement('div');
            levelEl.className = 'level';

            // part-name (if theory/name)
            const partHtml = (level.type === "theory" || level.type === "name") ? 
                `<div class="part-name">${level.partName ?? level.name}</div>` : '';

            levelEl.innerHTML = `
                ${partHtml}
                ${level.type !== "name" ? `
                    <div class="level-row" style="display:flex;align-items:center;gap:12px;">
                        <div class="level-btn ${level.isDone}-level" role="button" aria-pressed="false" data-unit="${id}" data-level="${idx}">
                            <img src="../assets/images/${level.type}-logo.svg" class="level-logo" alt="${level.type}">
                        </div>
                        <div class="intro-level" style="display:flex;flex-direction:column;align-items:flex-start;">
                            <span class="level-name">${level.name}</span>
                            <a class="start-btn" href="lesson/lesson.html?unit=${id}&level=${idx}&type=${level.type}">Bắt đầu</a>
                        </div>
                    </div>
                ` : ''
                }
            `;
            levelsWrap.appendChild(levelEl);
        });

        unitEl.appendChild(header);
        unitEl.appendChild(levelsWrap);
        content.appendChild(unitEl);
    });

    // after DOM built, attach existing click behaviors for .level-btn
    attachLevelBtnEvents();
}

// --- attachLevelBtnEvents : reuse existing UI behavior for level-btn click show intro ---
function attachLevelBtnEvents() {
    const levelButtons = document.querySelectorAll('.level-btn');

    levelButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            // hide other intros
            document.querySelectorAll('.intro-level').forEach(intro => {
                intro.classList.remove('show');
                intro.style.display = 'none';
            });

            // show this intro
            const introLevel = btn.parentElement.querySelector('.intro-level') || btn.nextElementSibling;
            if (introLevel) {
                introLevel.style.display = 'flex';
                requestAnimationFrame(() => introLevel.classList.add('show'));
            }
        });
    });
}

// --- CREATE TOC ---
// Build the TOC from units[] and insert into .toc-list
function createTOC() {
    const tocList = document.querySelector('.toc-list');
    if (!tocList) return;

    tocList.innerHTML = ''; // reset
    units.forEach((unit) => {
        const btn = document.createElement('button');
        btn.className = 'toc-item';
        btn.setAttribute('role', 'listitem');
        btn.setAttribute('data-target', `unit-${unit.id}`);
        btn.innerHTML = `<span class="index">${unit.id}</span><span class="title">${unit.name}</span>`;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (!targetEl) return;

            // Determine scroll container (mid-section or window)
            const mid = document.querySelector('.mid-section');
            const isMidScrollable = mid && mid.scrollHeight > mid.clientHeight;

            if (isMidScrollable) {
                // compute position of targetEl relative to mid
                const rect = targetEl.getBoundingClientRect();
                const midRect = mid.getBoundingClientRect();
                const offset = rect.top - midRect.top + mid.scrollTop - 24; // 24px padding offset
                mid.scrollTo({ top: offset, behavior: 'smooth' });
                // focus for accessibility
                targetEl.focus({ preventScroll: true });
            } else {
                // use window scroll, adjust 110px for header/top-section height
                const rect = targetEl.getBoundingClientRect();
                const top = window.scrollY + rect.top - 110;
                window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
                targetEl.focus({ preventScroll: true });
            }
        });
        tocList.appendChild(btn);
    });
}

// --- Highlight active TOC item on scroll using IntersectionObserver ---
function initTocObserver() {
    const mid = document.querySelector('.mid-section');
    const root = (mid && mid.scrollHeight > mid.clientHeight) ? mid : null; // null -> viewport
    const options = {
        root: root,
        rootMargin: '0px 0px -40% 0px', // triggers when element crosses ~60% from top
        threshold: 0.2
    };
    const tocItems = document.querySelectorAll('.toc-item');

    function clearActive() {
        tocItems.forEach(it => it.classList.remove('active'));
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                clearActive();
                const activeBtn = document.querySelector(`.toc-item[data-target="${id}"]`);
                if (activeBtn) activeBtn.classList.add('active');
            }
        });
    }, options);

    // observe each .unit
    document.querySelectorAll('.unit').forEach(unitEl => observer.observe(unitEl));
}

// --- Initialize everything: render, display, toc, observer ---
function initUnitsWithTOC() {
    renderMidLayout();
    displayUnits();
    createTOC();
    initTocObserver();
}

// call this once (instead of previous displayUnits(); addEvent();)
initUnitsWithTOC();



/* ===== Scroll memory: lưu & khôi phục Y liên tục (dùng cho file hiện tại) ===== */
(function () {
    const pageKey = 'scrollY_' + window.location.pathname; // key lưu vào localStorage

    // debounce nhỏ để không spam localStorage
    function debounce(fn, wait = 120) {
        let t = null;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), wait);
        }
    }

    // Tìm element scroll chính: ưu tiên .mid-section nếu có scroll
    function getScrollTarget() {
        const mid = document.querySelector('.mid-section');
        if (mid && mid.scrollHeight > mid.clientHeight) return mid;
        return window;
    }

    // Lưu vị trí (tự phát hiện target)
    function savePosition() {
        const target = getScrollTarget();
        const y = (target === window) ? (window.scrollY || window.pageYOffset || 0) : target.scrollTop;
        try {
            localStorage.setItem(pageKey, String(Math.floor(y)));
        } catch (e) {
            // nếu private mode/localStorage bị chặn, bỏ qua
        }
    }
    const savePositionDebounced = debounce(savePosition, 100);

    // Gắn listeners scroll (window + mid nếu có)
    function attachScrollListeners() {
        window.addEventListener('scroll', savePositionDebounced, { passive: true });
        const mid = document.querySelector('.mid-section');
        if (mid) mid.addEventListener('scroll', savePositionDebounced, { passive: true });
    }

    // Thử restore một lần, trả về true nếu đã restore
    function tryRestoreOnce() {
        const saved = localStorage.getItem(pageKey);
        if (!saved) return true; // không có gì để restore -> coi là xong

        const val = parseInt(saved, 10) || 0;
        const mid = document.querySelector('.mid-section');

        // Nếu mid tồn tại và có thanh cuộn -> restore ở mid
        if (mid && mid.scrollHeight > mid.clientHeight) {
            mid.scrollTop = val;
            return true;
        }

        // Nếu document đủ dài để scroll window -> restore window
        if (document.body.scrollHeight > window.innerHeight) {
            window.scrollTo(0, val);
            return true;
        }

        // Chưa restore được (nội dung chưa render đủ)
        return false;
    }

    // Restore khi sẵn sàng: thử nhiều lần + observer
    function restoreWhenReady({ maxAttempts = 60, intervalMs = 100 } = {}) {
        const saved = localStorage.getItem(pageKey);
        if (!saved) return; // không có dữ liệu -> không cần làm gì

        // 1) MutationObserver trên .mid-section: restore ngay khi children xuất hiện
        const mid = document.querySelector('.mid-section');
        if (mid) {
            const obs = new MutationObserver((mutations, observer) => {
                const ok = tryRestoreOnce();
                if (ok) observer.disconnect();
            });
            obs.observe(mid, { childList: true, subtree: true });
        }

        // 2) Vòng thử lại phòng khi observer không bắt được (ví dụ render chậm)
        let attempts = 0;
        const id = setInterval(() => {
            attempts++;
            const ok = tryRestoreOnce();
            if (ok || attempts >= maxAttempts) {
                clearInterval(id);
            }
        }, intervalMs);
    }

    // Khởi tạo: gắn listener + gọi restore khi load
    function initScrollMemory() {
        attachScrollListeners();

        // restore khi window load (nếu nội dung đã render trước đó)
        window.addEventListener('load', () => {
            // thử restore nhiều lần nếu render muộn
            restoreWhenReady({ maxAttempts: 80, intervalMs: 80 });
            // làm thêm 1 lần sau 200ms để chắc chắn
            setTimeout(() => restoreWhenReady({ maxAttempts: 40, intervalMs: 120 }), 200);
        });

        // Nếu nội dung đã được render (bạn gọi displayUnits() trước khi init) -> thử khôi phục ngay
        // (không bắt buộc; an toàn nếu mid-section đã có nội dung)
        setTimeout(() => restoreWhenReady(), 50);
    }

    // Gọi init (nếu bạn dán khối này ngay sau displayUnits() / addEvent())
    initScrollMemory();
})();
