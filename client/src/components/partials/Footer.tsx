import Link from "next/link"

const Footer = () => {

    return (
        <>
            <footer style={{ background: "URL('/images/footer-bg.png') no-repeat bottom" }} className={`w-full bg-white border-t border-t-gray-100`}>
                {/* <div  className="absolute w-full h-200px"></div> */}
                <div className="max-w-7xl min-h-[200px] mx-auto flex items-center flex-col h-12 px-3 justify-center">

                    <h1 className="font-semibold text-2xl mb-7">HOBANOVEL</h1>
                    
                    <h1 className="text-sm max-w-4xl w-full text-center line-clamp-2">
                        HobaNovel là nền tảng mở trực tuyến, miễn phí đọc truyện chữ được convert hoặc dịch kỹ lưỡng, do các converter và dịch giả đóng góp, rất nhiều truyện hay và nổi bật được cập nhật nhanh nhất với đủ các thể loại tiên hiệp, kiếm hiệp, huyền ảo ... 
                    </h1>

                    <div className="gap-x-6 text-base mt-7 hidden md:flex">
                        <Link href="/">Điều khoản dịch vụ</Link>
                        <Link href="/">Chính sách bảo mật</Link>
                        <Link href="/">Về bản quyền</Link>
                        <Link href="/">Hướng dẫn sử dụng</Link>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer