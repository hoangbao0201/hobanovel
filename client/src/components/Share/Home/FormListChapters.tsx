import Link from "next/link";
import { useEffect, useState } from "react";

import { ChapterType, NovelType } from "@/types";
import { getChaptersNovelByUrlHandle } from "@/services/chapter.services";


interface FormListChaptersProps {
    slug?: string
}

const FormListChapters = ({ slug } : FormListChaptersProps) => {

    const [bodyContent, setBodyContent] = useState<ChapterType[] | null>(null)

    const getListChapters = async () => {
        const chaptersResponse = await getChaptersNovelByUrlHandle(slug as string);
        if (chaptersResponse?.data.success) {
            console.log(chaptersResponse.data.chapters)
            setBodyContent(chaptersResponse.data.chapters)
        }
    };

    useEffect(() => {
        getListChapters();
    }, []);

    return (
        <div>
            <div className="mb-4 font-semibold text-xl">Danh sách chương</div>
            <div className="">
                {
                    bodyContent ? (
                        <div className="grid grid-cols-3">
                            {
                                bodyContent.map((chapter : ChapterType, index) => {
                                    return (
                                        <Link key={index} href={`/truyen/${chapter.novelSlug}/chuong-${chapter.chapterNumber}`} className="text-gray-800">
                                            <span className="item-text flex py-4 border-b border-gray-200 border-dashed">
                                                <span className="whitespace-nowrap">Chương {chapter.chapterNumber}</span>: <h2 className="line-clamp-1 ml-2">{chapter.title}</h2>
                                            </span>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <div>Chưa đăng tải chương nào!</div>
                    )
                }
            </div>
        </div>
    )
}

export default FormListChapters;
