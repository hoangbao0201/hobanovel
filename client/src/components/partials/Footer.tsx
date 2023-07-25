import Link from "next/link"

const Footer = () => {

    return (
        <>
            <footer style={{ background: "#fff URL('/images/footer-bg.png') no-repeat bottom" }} className={`w-full py-4 border-t border-t-gray-100`}>
                {/* <div  className="absolute w-full h-200px"></div> */}
                <div className="max-lg:max-w-3xl max-w-5xl min-h-[200px] mx-auto px-4 lg:flex">

                    <div itemScope itemType="http://schema.org/Organization" className="lg:w-2/5 mb-4 max-lg:border-b border-gray-600">
                        <h1 className="font-semibold text-2xl mb-3">
                            <Link itemProp="url" href="/">hobanovel</Link>
                        </h1>
                        
                        {/* <h1 className="text-sm max-w-4xl w-full line-clamp-2">
                            hobanovel là nền tảng mở trực tuyến, miễn phí đọc truyện chữ được convert hoặc dịch kỹ lưỡng, do các converter và dịch giả đóng góp, rất nhiều truyện hay và nổi bật được cập nhật nhanh nhất với đủ các thể loại tiên hiệp, kiếm hiệp, huyền ảo ... 
                        </h1> */}
    
                        <div className="mb-2">
                            <Link href="/chinh-sach-bao-mat">
                                Chính sách bảo mật
                            </Link>
                        </div>
    
                        <p className="mb-2">Copyright © 2022 hobanovel</p>
                    </div>

                    <div className="lg:w-3/5">
                        <h4 className="mb-4 text-xl">Từ khóa</h4>
                        <ul className="flex flex-wrap gap-2 text-xs whitespace-nowrap text-center [&>li]:bg-slate-200 [&>li]:border [&>li]:border-gray-500 [&>li]:px-2 [&>li]:text-sm">
                            <li><Link target="_self" href="/">hobanovel</Link></li>
                            <li><Link target="_self" href="/">Truyện chữ</Link></li>
                            <li><Link target="_self" href="/">Truyện chữ online</Link></li>
                            <li><Link target="_self" href="/">Đọc truyện chữ</Link></li>
                            <li><Link target="_self" href="/">Truyện chữ hay</Link></li>

                            <li><Link target="_self" href="/">Truyện tranh</Link></li>
                            <li><Link target="_self" href="/">Truyen tranh online</Link></li>
                            <li><Link target="_self" href="/">Đọc truyện tranh</Link></li>
                            <li><Link target="_self" href="/">Truyện tranh hot</Link></li>
                            <li><Link target="_self" href="/">Truyện tranh hay</Link></li>

                            <li><Link target="_self" href="/h">Truyện ngôn tình</Link></li>
                            <li><Link target="_self" href="/">Manhwa</Link></li>
                            <li><Link target="_self" href="/">Manga</Link></li>
                            <li><Link target="_self" href="/">Manhua</Link></li>

                            <li><Link target="_self" href="/">truyenaudiocv</Link></li>
                            <li><Link target="_self" href="/">metruyenchu</Link></li>
                            <li><Link target="_self" href="/">truyencv</Link></li>
                            <li><Link target="_self" href="/">truyentutien</Link></li>

                            <li><Link target="_self" href="/">nettruyen</Link></li>
                            <li><Link target="_self" href="/">mi2manga</Link></li>
                            <li><Link target="_self" href="/">doctruyen3q</Link></li>
                            <li><Link target="_self" href="/">toptruyen</Link></li>
                            <li><Link target="_self" href="/">cmanga</Link></li>
                            <li><Link target="_self" href="/">vlogtruyen</Link></li>
                            <li><Link target="_self" href="/">blogtruyen</Link></li>
                            <li><Link target="_self" href="/">truyentranhaudio</Link></li>
                            <li><Link target="_self" href="/">vcomi</Link></li>
                        </ul>
                    </div>

                </div>

            </footer>
        </>
    )
}

export default Footer