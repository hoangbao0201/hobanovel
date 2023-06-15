import Link from "next/link";

import LazyLoad from "react-lazy-load";

import { placeholderBlurhash } from "@/constants";
import { useSelector } from "react-redux";
import BlurImage from "@/components/Layout/BlurImage";

interface ReadingProps {
    readingNovel?: any
}

const Reading = ({ readingNovel } : ReadingProps) => {
    const { isAuthenticated } = useSelector((state : any) => state.user)

    return (
        <div className="mb-5">
            <h3 className="px-4 mb-5 text-xl font-semibold">Truyện đang đọc</h3>
            <div className="px-4">
                {
                    isAuthenticated ? (
                        readingNovel ? (
                            readingNovel.length > 0 ? (
                                readingNovel?.map((novel : any, index: number) => {
                                    return (
                                        <div key={index} className="flex mb-3">
                                            <Link href={`/truyen/${novel.slug}`}>
                                                <LazyLoad className="relative w-10 h-14 overflow-hidden shadow">
                                                    <BlurImage
                                                        width={38}
                                                        height={54}
                                                        alt="image-demo"
                                                        blurDataURL={novel.imageBlurHash || placeholderBlurhash}
                                                        className="group-hover:scale-105 group-hover:duration-500 object-cover w-full h-full"
                                                        placeholder="blur"
                                                        src={novel.thumbnailUrl}
                                                    />
                                                </LazyLoad>
                                            </Link>
                                            <div className="flex-1 ml-3">
                                                <Link className="block" href={`/truyen/${novel.slug}`}>
                                                    <h2 className="mb-1 text-sm line-clamp-1 font-semibold">
                                                        {novel.title}
                                                    </h2>
                                                </Link>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-slate-600 text-sm">Đã đọc: {novel?.chapterRead || 1}/{novel.chapterCount}</div>
                                                    <Link className="text-sm text-orange-700 p-1 font-semibold" href={`/truyen/${novel.slug}/chuong-${novel?.chapterRead || 1}`}>Đọc tiếp</Link>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <span>Bạn chưa đọc truyện nào, hãy bắt đầu với những bộ đầu tiên nào!</span>
                            )
                        ) : (
                            <span>Loading</span>
                        )
                    ) : (
                        <div>
                            <span>Bạn chưa đăng nhập! </span>
                            <Link href="/auth/login" className="text-blue-800">Đăng nhập ngay</Link>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Reading;