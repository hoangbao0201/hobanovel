import Link from "next/link";
import { useEffect, useState } from "react";

import LazyLoad from "react-lazy-load";
import { useSelector } from "react-redux";

import ClientOnly from "../ClientOnly";
import { placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Share/BlurImage";
import { getAccessToken } from "@/services/cookies.servies";
import { getReadingNovelHandle } from "@/services/novels.services";

interface ReadingProps {
    novels?: any
}

const Reading = ({} : ReadingProps) => {

    const { isAuthenticated } = useSelector((state : any) => state.user);
    const [novels, setNovels] = useState<null | any>(null);

    const handleGetNovelsReading = async () => {
        const token = getAccessToken();
        if (!token || !isAuthenticated) {
            return;
        }

        try {
            
            const novelsRes = await getReadingNovelHandle(1, token);

            if (!novelsRes.success) {
                return
            }


            setNovels(novelsRes.novels)
        } catch (error) {
            
        }
    }

    useEffect(() => {
        handleGetNovelsReading()
    } , [])

    return (
        <div className="px-4">

            <ClientOnly>
                {
                    isAuthenticated ? (
                        novels ? (
                            novels.length > 0 ? (
                                <ul>
                                    {
                                        novels?.map((novel : any, index: number) => {
                                        return (
                                            <li key={index} className="flex mb-4">
                                                <Link className="" href={`/truyen/${novel.slug}`}>
                                                    <LazyLoad className="relative w-10 h-14 overflow-hidden shadow">
                                                        <BlurImage
                                                            width={38}
                                                            height={54}
                                                            alt={`truyện ${novel.title}`}
                                                            blurDataURL={novel.imageBlurHash || placeholderBlurhash}
                                                            className="group-hover:scale-105 group-hover:duration-500 object-cover w-full h-full"
                                                            placeholder="blur"
                                                            src={novel.thumbnailUrl}
                                                        />
                                                    </LazyLoad>
                                                </Link>
                                                <div className="flex-1 ml-3">
                                                    <h3 title={`${novel.title}`}>
                                                        <Link className="mb-1 text-sm line-clamp-1 font-semibold" href={`/truyen/${novel.slug}`}>
                                                            {novel.title}
                                                        </Link>
                                                    </h3>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-600 text-sm">Đã đọc: {novel?.chapterRead || 1}/{novel.chapterCount}</span>
                                                        <Link className="text-sm text-orange-700 p-1 font-semibold" href={`/truyen/${novel.slug}/chuong-${novel?.chapterRead || 1}`}>
                                                            Đọc tiếp
                                                        </Link>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                    }
                                </ul>
                            ) : (
                                <span>Bạn chưa đọc truyện nào, hãy bắt đầu với những bộ đầu tiên nào!</span>
                            )
                        ) : (
                            <span>Loading</span>
                        )
                    ) : (
                        <div>
                            <span>Bạn chưa đăng nhập! </span>
                            <Link href="/auth/login" className="text-blue-800">
                                Đăng nhập ngay
                            </Link>
                        </div>
                    )
                }
            </ClientOnly>

        </div>
    )
}

export default Reading;