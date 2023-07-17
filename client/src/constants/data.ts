export const GENRES_VALUE = [
    {id: 1, value: "Tất cả", path: ""},
    {id: 2, value: "Tiên Hiệp", path: "?genres=1"},
    {id: 3, value: "Huyền Huyễn", path: "?genres=2"},
    {id: 4, value: "Khoa Huyễn", path: "?genres=3"},
    {id: 5, value: "Võng Du", path: "?genres=4"},
    {id: 6, value: "Đô Thị", path: "?genres=5"},
    {id: 7, value: "Đồng Nhân", path: "?genres=6"},
    {id: 8, value: "Dã Sử", path: "?genres=7"},
    {id: 9, value: "Cạnh Kỹ", path: "?genres=8"},
    {id: 10, value: "Huyền Nghi", path: "?genres=9"},
    {id: 11, value: "Kiếm Hiệp", path: "?genres=10"},
    {id: 12, value: "Kỳ Ảo", path: "?genres=11"},
]

export const RANK_VALUE = [
    { id: 13, value: "Thịnh hành", path: "" },
    { id: 14, value: "Đọc nhiều", path: "" },
    { id: 15, value: "Tặng thưởng", path: "" },
    { id: 16, value: "Đề cử", path: "?sort_by=follow_count" },
    { id: 17, value: "Yêu thích", path: "?sort_by=review_score" },
    { id: 18, value: "Thảo luận", path: "?sort_by=comment_count" },
]

export const LEVEL_VALUE = [
    { id: 0, value: "Phàm nhân", color: "" },
    { id: 1, value: "Luyện Khí", color: "#2a72b9" },
    { id: 2, value: "Trúc cơ", color: "#b12d31" },
    { id: 3, value: "Kim Đan", color: "#da772c" },
    { id: 4, value: "Nguyên Anh", color: "#e9d918" },
    { id: 5, value: "Hóa Thần", color: "#5563ad" },
    { id: 6, value: "Luyện Hư", color: "#c0264d" },
    { id: 7, value: "Hợp thể", color: "#1bb24c" },
    { id: 7, value: "Đại thừa", color: "#463e99" },
    { id: 7, value: "Sáng Tạo Đạo Giả", color: "#363076" },
]

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
        { id: 47, value: "Đông Phương Huyền Huyễn" },
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

// --------------------------------------------------

type IconType = {
    id: number
    url: string
}
export interface IconTypeProps {
    iconTrollFace: IconType[]
}
export const iconEmojiData : IconTypeProps = {
    iconTrollFace: [
            { id: 1, url: "https://4.bp.blogspot.com/-slisLqTvF6A/WtuC0aownPI/AAAAAAABiEc/HE_BH0aQLgYeT9QrNLE5B_QoyIYwcJ_swCKgBGAs/h120/01-kyghe.gif" },
            { id: 2, url: "https://3.bp.blogspot.com/-uTp2kw7VMfM/WtuC0ccNKwI/AAAAAAABiEc/6cCUK3cCpEsF-1hMh-fdr1gzLJ0HaOuxgCKgBGAs/h120/02-ahihi.gif" },
            { id: 3, url: "https://3.bp.blogspot.com/-6klqRMX3feI/WtuC0Z8HaOI/AAAAAAABiEc/RvsxMZLHAOovUSl05MOS1uT8frEH_w2uwCKgBGAs/h120/03-trollgif.gif" },
            { id: 4, url: "https://2.bp.blogspot.com/-pcYH7hC7Ftg/WtuC0QdUFXI/AAAAAAABiEc/Ar8xlsOTNKA13600G6gTKGUTHbe_fqQzQCKgBGAs/h120/04-lolol.gif" },
            { id: 5, url: "https://1.bp.blogspot.com/-_Y4X2y1k_2Y/WtuC0a4gxKI/AAAAAAABiEc/QeFXBuxebe4x65_u0o6UaqzUBNkpAnYtwCKgBGAs/h120/05-lolol2.gif" },
            { id: 6, url: "https://2.bp.blogspot.com/-tOZj0cwh1Yk/WtuC0TOnBoI/AAAAAAABiEc/zWrJB0lyb6oqwdSMIG5DLdJjWTXoElNcACKgBGAs/h120/05-lolol3.gif" },
            { id: 7, url: "https://3.bp.blogspot.com/-1Kzidf5jke8/WtuC0e5CkgI/AAAAAAABiEc/amjJCh85Cu8pwvvjkhJx1Wqnw7gkAf_VQCKgBGAs/h120/06-BlackGuyBeaten.gif" },
            { id: 8, url: "https://4.bp.blogspot.com/-1k0KGCGSxkk/WtuC0S1wVFI/AAAAAAABiEc/4fMqhG1zBrED82kSPmzS65DLzPT1KOnGwCKgBGAs/h120/07-ahaha.gif" },
            { id: 9, url: "https://4.bp.blogspot.com/-uH4aeFnSxFA/WtuC0WUtuXI/AAAAAAABiEc/bTjpu-ObsOwxYnoDuH5JUn3E53KZUh-wQCKgBGAs/h120/08-Pfftch.gif" },
            { id: 10, url: "https://3.bp.blogspot.com/-h2lg24wL2oQ/WtuC0RDtvpI/AAAAAAABiEc/FdDrVlNsTCQSazibHcX-_xqghDXFgr19wCKgBGAs/h120/09-dapban.gif" },
            { id: 11, url: "https://4.bp.blogspot.com/-l1OKv-XNKJ0/WtuC0XbCSmI/AAAAAAABiEc/WveGVvknLDszIN6hhjEopa1Ol0s5bok2gCKgBGAs/h120/10-trolldance.gif" },
            { id: 12, url: "https://2.bp.blogspot.com/-S3LfYBVHeGg/WtuC0VxTD-I/AAAAAAABiEc/HcmnXUmtnKkkyiKm8e48vVTerBpVk5VAwCKgBGAs/h120/11-Devil.gif" },
            { id: 13, url: "https://3.bp.blogspot.com/-u07nf_GIRJo/WtuC0YeRc5I/AAAAAAABiEc/cw88uWB44XYXGt_YHK3pCUBWXXwSqPwowCKgBGAs/h120/12-ExcitedTroll.gif" },
            { id: 14, url: "https://3.bp.blogspot.com/-WNUKKK5YeKk/WtuC0WAoksI/AAAAAAABiEc/TevdvRXqUDgJzdR0dqBTKwYr9XUH276CwCKgBGAs/h120/13-Gay.gif" },
            { id: 15, url: "https://2.bp.blogspot.com/-ydGmRnPYvQM/WtuC0VL7NFI/AAAAAAABiEc/QzLrgmdmJvYIhYHxaqAd9A4cz0VcygaJQCKgBGAs/h120/13-slap.gif" },
            { id: 16, url: "https://3.bp.blogspot.com/-Su2mydtLs8s/WtuC0dw04oI/AAAAAAABiEc/igqB7svHe68bFSGl_xyj9GFWtk2_kswlQCKgBGAs/h120/13-troll-typing.gif" },
            { id: 17, url: "https://4.bp.blogspot.com/-cTjPiMh5EiA/WtuC0cWzn9I/AAAAAAABiEc/bWgMjW_snlstdCqJ4T1YBNq8eJ_aO3ojQCKgBGAs/h120/13-u-mad-troll.gif" },
            { id: 18, url: "https://1.bp.blogspot.com/-DFdQ1q2SaUs/WtuC0Utob9I/AAAAAAABiEc/rRQ9PtVAFVwNPT5zcebGqOzsr_jXV8hwACKgBGAs/h120/14-yaoming.gif" },
            { id: 19, url: "https://4.bp.blogspot.com/-Ls8yHAyXA54/WtuC0cdgTLI/AAAAAAABiEc/7SQEwH8YH8wPVRXd6flHCm0zd-6xh6SdQCKgBGAs/h120/15-pff.gif" },
            { id: 20, url: "https://1.bp.blogspot.com/-Scb7BYOitzI/WtuC0VjGy-I/AAAAAAABiEc/t0MkgL_0PYUWQ2yiIw_zCf1qC4jui5LvACKgBGAs/h120/16-yao_ming_heck_no.gif" },
            { id: 21, url: "https://2.bp.blogspot.com/-BVL7KAgWSnY/WtuC0excIoI/AAAAAAABiEc/-KkTqGFRFIEK5PO_J-MnX6HHnxZIf-pCgCKgBGAs/h120/89-wow.gif" },
            { id: 22, url: "https://2.bp.blogspot.com/-19eZG3Qy3Tg/WtuC0f3cz2I/AAAAAAABiEc/PkmQyakcvRsrWYfndHp-ANAa_954TTliACKgBGAs/h120/18-hichic.gif" },
            { id: 23, url: "https://1.bp.blogspot.com/-MC3KPEyOyIU/WtuC0SmvQJI/AAAAAAABiEc/ODw43MsOSYkkKyHK6Q7OSzmg8WV82NHfACKgBGAs/h120/19-hichic2.gif" },
            { id: 24, url: "https://1.bp.blogspot.com/-2xE174g_lE0/WtuC0T5ZEkI/AAAAAAABiEc/iGmcPQJy-8cSRjGU0kG0i6Z34cD2WwaXQCKgBGAs/h120/20-hichic3.gif" },
            { id: 25, url: "https://4.bp.blogspot.com/-752G5kjLptg/WtuC0TY6UII/AAAAAAABiEc/RGMRo6Mzy6cQ84OGOZbMN2nGOiUNiRiPACKgBGAs/h120/21-TheSaddest.gif" },
            { id: 26, url: "https://2.bp.blogspot.com/-q1pGAFyZ8K8/WtuC0e7KUYI/AAAAAAABiEc/gXx9Mk3ieDkJutQ3nyShmKNDsBudWRfDgCKgBGAs/h120/22-Baww.gif" },
            { id: 27, url: "https://4.bp.blogspot.com/-UQmfsc_xW0Y/WtuC0UTGckI/AAAAAAABiEc/bhU8l2msJOIRlBY0ddpGXLajfEztP31FQCKgBGAs/h120/23-SoMuchWin.gif" },
            { id: 28, url: "https://4.bp.blogspot.com/-cVsVDX8P7E8/WtuC0Rfn1VI/AAAAAAABiEc/tBYO1DHFu0AGkOIOmVB1tiqltvv6Dh9swCKgBGAs/h120/24-BigGrin.gif" },
            { id: 29, url: "https://2.bp.blogspot.com/-faTYou0lD8Q/WtuC0bxmvXI/AAAAAAABiEc/o4NpeSBbNxE98BsMFqo1nZSSSEbQVj12QCKgBGAs/h120/25-AwwYeah.gif" },
            { id: 30, url: "https://1.bp.blogspot.com/-6EgjhCgnqIY/WtuC0Xw6sfI/AAAAAAABiEc/b9kj0itjkeoBBxxf3TXgqRoXMDvrsBDzgCKgBGAs/h120/26-ForeverDontCare.gif" },
            { id: 31, url: "https://4.bp.blogspot.com/-9r3rGj5opMk/WtuC0doJyQI/AAAAAAABiEc/ew7TTMLvXWAu49Q6SnSHtltxb6P5HnoUwCKgBGAs/h120/27-ForeverAlone.gif" },
            { id: 32, url: "https://3.bp.blogspot.com/-RVhpxL8c4_g/WtuC0TKKoeI/AAAAAAABiEc/8-eNm5moSDwbCo5CdxKbO5DQxudVQ_kpQCKgBGAs/h120/28-ForeverAlone2.gif" },
            { id: 33, url: "https://3.bp.blogspot.com/-s6a284cnaBI/WtuC0Qq1KTI/AAAAAAABiEc/tep1SZb-iWU35WTUVWFyectwMx59g1AXACKgBGAs/h120/29-ForeverAloneExcited.gif" },
            { id: 34, url: "https://4.bp.blogspot.com/-enq6MXH3NVc/WtuC0bJ9rkI/AAAAAAABiEc/Xlmf7wQyE3EAtH70cZFyNJGQpqPWzftngCKgBGAs/h120/30-SoonComputer.gif" },
            { id: 35, url: "https://2.bp.blogspot.com/-OVXSp5vVpPU/WtuC0eFeozI/AAAAAAABiEc/L6ZjtQL6hg4ynu8oZiJBFZ-9QWJ01t5nACKgBGAs/h120/31-wtf.gif" },
            { id: 36, url: "https://2.bp.blogspot.com/-SO8K_4q7Eq0/WtuC0cL4yTI/AAAAAAABiEc/_sJP48dHU0E4igO44iiEYaYNX6cWuvPYQCKgBGAs/h120/32-Facepalm.gif" },
            { id: 37, url: "https://4.bp.blogspot.com/-r8z-mMpra70/WtuC0UbovEI/AAAAAAABiEc/PZDUNYXkpsQxZNDgj1l5HtL01alTPb22gCKgBGAs/h120/33-Shocked.gif" },
            { id: 38, url: "https://3.bp.blogspot.com/-MavrrOqY5ag/WtuC0b5356I/AAAAAAABiEc/5p7I6RMFrL4YG5-NXhpUv-b1tIuWSgRxQCKgBGAs/h120/34-MotherofGod.gif" },
            { id: 39, url: "https://4.bp.blogspot.com/-cQ56xSTSg2g/WtuC0V_giuI/AAAAAAABiEc/KeNU5cMc68sLAziPLMPzQTBMe5uRlK4sACKgBGAs/h120/35-GreatScott.gif" },
            { id: 40, url: "https://4.bp.blogspot.com/-u-13t1pGZDQ/WtuC0ROnJhI/AAAAAAABiEc/Y2r7TesG9pc28lErlyBAfd-6XqYl8FUAwCKgBGAs/h120/36-Gasp.gif" },
            { id: 41, url: "https://1.bp.blogspot.com/-WUQhxMp1tfs/WtuC0YcYfOI/AAAAAAABiEc/bMR3X0_KqeUQvlh_SLsxKhHJASewxPjLgCKgBGAs/h120/36-panel-NOPE.gif" },
            { id: 42, url: "https://1.bp.blogspot.com/-EiNhq0BuqN4/WtuC0cp7coI/AAAAAAABiEc/t1wKI8Bwug4FjpPML9Zo4UZ-NwBCOvA2ACKgBGAs/h120/37-FullPanel.gif" },
            { id: 43, url: "https://4.bp.blogspot.com/-8w5W146wWEE/WtuC0cODhgI/AAAAAAABiEc/mT3A4VJDyXUz5_6Q3pxvzYFlDImtUHaRwCKgBGAs/h120/37-surprised-oh-fuck-no.jpeg" },
            { id: 44, url: "https://2.bp.blogspot.com/-oDH0MOJChk8/WtuC0SXfKqI/AAAAAAABiEc/U6qRyYTZUnop4jnqiuWBmHzd_GcxCibmgCKgBGAs/h120/38-beerGuy.gif" },
            { id: 45, url: "https://3.bp.blogspot.com/-jCtMNoMf5fg/WtuC0dP5f7I/AAAAAAABiEc/_ATLXfuKntU0YRk3FKanaEBJ7iTLVkOsgCKgBGAs/h120/38-CerealGuy.gif" },
            { id: 46, url: "https://2.bp.blogspot.com/-XkrAfNhfefI/WtuC0e-HKkI/AAAAAAABiEc/Ye5T19Ui5B0t6yTQgSGLVs96lEE3kXtPwCKgBGAs/h120/39-CerealSpitting.gif" },
            { id: 47, url: "https://2.bp.blogspot.com/-ZjTuDQ12vJo/WtuC0WUx6YI/AAAAAAABiEc/1QtNGXemvJ49h3Ka47uVTQMcxqTTXjD5wCKgBGAs/h120/40-NewspaperGuy.gif" },
            { id: 48, url: "https://1.bp.blogspot.com/-LjVtz-0fyu8/WtuC0Rwj9nI/AAAAAAABiEc/Il0QIECA09MNnMvaiGVWAY5XyVzNuRf6QCKgBGAs/h120/41-NewspaperGuyTear.gif" },
            { id: 49, url: "https://1.bp.blogspot.com/-7lQVi6yAYcM/WtuC0dMqhfI/AAAAAAABiEc/LZ1cv2OcqKAWnF6pnYoVzKY1f6jMfQNAACKgBGAs/h120/42-Milk.jpeg" },
            { id: 50, url: "https://3.bp.blogspot.com/-Z69lKowAvM0/WtuC0QFoRQI/AAAAAAABiEc/cvT1rDozp5gY_V6MG4H-akYmsjx6zKu7ACKgBGAs/h120/43-AreYouKiddingMe.gif" },
            
    ]
}