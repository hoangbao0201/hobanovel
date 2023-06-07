type PROPERTIES_NOVEL_TYPES = {
    [key: string]: { id: number; value: string }[]
};
interface PROPERTIES_NOVEL_PROPS extends PROPERTIES_NOVEL_TYPES {
    genres: { id: number; value: string }[];
    status: { id: number; value: string }[];
    personality: { id: number; value: string }[];
    scene: { id: number; value: string }[];
    classify: { id: number; value: string }[];
    viewFrame: { id: number; value: string }[];
}
export const PROPERTIES_NOVEL : PROPERTIES_NOVEL_PROPS = {
    genres: [
        { id: 1, value: "Tiên Hiệp" },
        { id: 2, value: "Huyền Huyễn" },
        { id: 3, value: "Khoa Huyễn" },
        { id: 4, value: "Võng Du" },
        { id: 5, value: "Đô Thị" },
        { id: 6, value: "Đồng Nhân" },
        { id: 7, value: "Dã Sử" },
        { id: 8, value: "Cạnh Kỹ" },
        { id: 9, value: "Huyền Nghi" },
        { id: 10, value: "Kiếm Hiệp" },
        { id: 11, value: "Kỳ Ảo" },
    ],
    status: [
        { id: 1, value: "Đang ra" },
        { id: 2, value: "Hoành thành" },
    ],
    personality: [
        { id: 1, value: "Điềm Đạm" },
        { id: 2, value: "Nhiệt Huyết" },
        { id: 3, value: "Vô Sỉ" },
        { id: 4, value: "Thiết Huyết" },
        { id: 5, value: "Nhẹ Nhàng" },
        { id: 6, value: "Cơ Trí" },
        { id: 7, value: "Lãnh Khốc" },
        { id: 8, value: "Kiêu Ngạo" },
        { id: 9, value: "Ngu Ngốc" },
        { id: 10, value: "Giảo Hoạt" },
    ],
    scene: [
        { id: 1, value: "Dị Thế Đại Lục" },
        { id: 2, value: "Vương Triều Tranh Bá" },
        { id: 3, value: "Cao Võ Thế Giới" },
        { id: 4, value: "Tây Phương Kỳ Huyễn" },
        { id: 5, value: "Hiện Đại Ma Pháp" },
        { id: 6, value: "Hắc Ám Huyễn Tưởng" },
        { id: 7, value: "Lịch Sử Thần Thoại" },
        { id: 8, value: "Võ Hiệp Huyễn Tưởng" },
        { id: 9, value: "Cổ Võ Tương Lai" },
        { id: 10, value: "Tu Chân Văn Minh" },
        { id: 11, value: "Huyễn Tưởng Tu Tiên" },
        { id: 12, value: "Hiện Đại Tu Chân" },
        { id: 13, value: "Thần Thoại Tu Chân" },
        { id: 14, value: "Cổ Điển Tiên Hiệp" },
        { id: 15, value: "Viễn Cổ Hồng Hoang" },
        { id: 16, value: "Đô Thị Sinh Hoạt" },
        { id: 17, value: "Đô Thị Dị Năng" },
        { id: 18, value: "Thanh Xuân Vườn Trường" },
        { id: 19, value: "Ngu Nhạc Minh Tinh" },
        { id: 20, value: "Thương Chiến Chức Tràng" },
        { id: 21, value: "Giá Không Lịch Sử" },
        { id: 22, value: "Lịch Sử Quân Sự" },
        { id: 23, value: "Dân Gian Truyền Thuyết" },
        { id: 24, value: "Lịch Sử Quan Trường" },
        { id: 25, value: "Hư Nghĩ Võng Du" },
        { id: 26, value: "Du Hí Dị Giới" },
        { id: 27, value: "Điện Tử Cạnh Kỹ" },
        { id: 28, value: "Thể Dục Cạnh Kỹ" },
        { id: 29, value: "Cổ Võ Cơ Giáp" },
        { id: 30, value: "Thế Giới Tương Lai" },
        { id: 31, value: "Tinh Tế Văn Minh" },
        { id: 32, value: "Tiến Hóa Biến Dị" },
        { id: 33, value: "Mạt Thế Nguy Cơ" },
        { id: 34, value: "Thời Không Xuyên Toa" },
        { id: 35, value: "Quỷ Bí Huyền Nghi" },
        { id: 36, value: "Kỳ Diệu Thế Giới" },
        { id: 37, value: "Trinh Tham Thôi Lý" },
        { id: 38, value: "Thám Hiểm Sinh Tồn" },
        { id: 39, value: "Cung Vi Trạch Đấu" },
        { id: 40, value: "Kinh Thương Chủng Điền" },
        { id: 41, value: "Tiên Lữ Kỳ Duyên" },
        { id: 42, value: "Hào Môn Thế Gia" },
        { id: 43, value: "Dị Tộc Luyến Tình" },
        { id: 44, value: "Ma Pháp Huyễn Tình" },
        { id: 45, value: "Tinh Tế Luyến Ca" },
        { id: 46, value: "Linh Khí Khôi Phục" },
        { id: 47, value: "Chư Thiên Vạn Giới" },
        { id: 48, value: "Đông Phương Huyền Huyễn" },
    ],
    classify: [
        { id: 1, value: "Hệ Thống" },
        { id: 2, value: "Lão Gia" },
        { id: 3, value: "Bàn Thờ" },
        { id: 4, value: "Tùy Thân" },
        { id: 5, value: "Phàm Nhân" },
        { id: 6, value: "Vô Địch" },
        { id: 7, value: "Xuyên Qua" },
        { id: 8, value: "Nữ Cường" },
        { id: 9, value: "Khế Ước" },
        { id: 10, value: "Trọng Sinh" },
        { id: 11, value: "Hồng Lâu" },
        { id: 12, value: "Học Viện" },
        { id: 13, value: "Biến Thân" },
        { id: 14, value: "Cổ Ngu" },
        { id: 15, value: "Chuyển Thế" },
        { id: 16, value: "Xuyên Sách" },
        { id: 17, value: "Đàn Xuyên" },
        { id: 18, value: "Phế Tài" },
        { id: 19, value: "Dưỡng Thành" },
        { id: 20, value: "Cơm Mềm" },
        { id: 21, value: "Vô Hạn" },
        { id: 22, value: "Mary Sue" },
        { id: 23, value: "Cá Mặn" },
        { id: 24, value: "Xây Dựng Thế Lực" },
        { id: 25, value: "Xuyên Nhanh" },
        { id: 26, value: "Nữ Phụ" },
        { id: 27, value: "Vả Mặt" },
        { id: 28, value: "Sảng Văn" },
        { id: 29, value: "Xuyên Không" },
        { id: 30, value: "Ngọt Sủng" },
        { id: 31, value: "Ngự Thú" },
        { id: 32, value: "Điền Viên" },
        { id: 33, value: "Toàn Dân" },
        { id: 34, value: "Mỹ Thực" },
        { id: 35, value: "Phản Phái" },
        { id: 36, value: "Sau Màn" },
    ],
    viewFrame: [
        { id: 1, value: "Góc Nhìn Nam" },
        { id: 2, value: "Góc Nhìn Nữ" },
        { id: 3, value: "Ngôi Thứ Nhất" },
    ]
}

/*

UPDATE novels
SET classify = 
    CASE 
        WHEN classify = 'Hệ Thống' THEN 1 
        WHEN classify = 'Lão Gia' THEN 2 
        WHEN classify = 'Bàn Thờ' THEN 3 
        WHEN classify = 'Tùy Thân' THEN 4 
        WHEN classify = 'Phàm Nhân' THEN 5 
        WHEN classify = 'Vô Địch' THEN 6 
        WHEN classify = 'Xuyên Qua' THEN 7 
        WHEN classify = 'Nữ Cường' THEN 8 
        WHEN classify = 'Khế Ước' THEN 9 
        WHEN classify = 'Trọng Sinh' THEN 10
        WHEN classify = 'Hồng Lâu' THEN 11 
        WHEN classify = 'Học Viện' THEN 12 
        WHEN classify = 'Biến Thân' THEN 13 
        WHEN classify = 'Cổ Ngu' THEN 14 
        WHEN classify = 'Chuyển Thế' THEN 15 
        WHEN classify = 'Xuyên Sách' THEN 16 
        WHEN classify = 'Đàn Xuyên' THEN 17 
        WHEN classify = 'Phế Tài' THEN 18 
        WHEN classify = 'Dưỡng Thành' THEN 19 
        WHEN classify = 'Cơm Mềm' THEN 20
        WHEN classify = 'Vô Hạn' THEN 21 
        WHEN classify = 'Mary Sue' THEN 22 
        WHEN classify = 'Cá Mặn' THEN 23 
        WHEN classify = 'Xây Dựng Thế Lực' THEN 24 
        WHEN classify = 'Xuyên Nhanh' THEN 25 
        WHEN classify = 'Nữ Phụ' THEN 26 
        WHEN classify = 'Vả Mặt' THEN 27 
        WHEN classify = 'Sảng Văn' THEN 28 
        WHEN classify = 'Xuyên Không' THEN 29 
        WHEN classify = 'Ngọt Sủng' THEN 30
        WHEN classify = 'Ngự Thú' THEN 31 
        WHEN classify = 'Điền Viên' THEN 32 
        WHEN classify = 'Toàn Dân' THEN 33 
        WHEN classify = 'Mỹ Thực' THEN 34 
        WHEN classify = 'Phản Phái' THEN 35 
        WHEN classify = 'Sau Màn' THEN 36


        ELSE classify
    END

*/