import Link from "next/link";
import { useEffect, useState } from "react";

import { ChapterType } from "@/types";
import { getChaptersNovelByUrlHandle } from "@/services/chapter.services";
import React from "react";
import moment from "moment";
import "moment/locale/vi";

interface FormListChaptersProps {
    tab?: number;
    slug?: string;
}

type ChaptersByNovelType = Pick<
    ChapterType,
    "chapterId" | "novelSlug" | "title" | "chapterNumber" | "createdAt"
>;

const ListItemChapter = ({ chapters }: { chapters: ChaptersByNovelType[] }) => {
    const [isShowMoreChapters, setIsShowMoreChapters] = useState<number>(42);

    // LENGTH CHAPTERS
    const lengthChapters = chapters.length;

    return (
        <>
            <div
                className={`${
                    isShowMoreChapters && "overflow-hidden"
                } grid gap-x-6 grid-cols-3`}
            >
                {chapters.slice(0, isShowMoreChapters)?.map((chapter, index) => {
                    return (
                        <Link
                            key={index}
                            href={`/truyen/${chapter.novelSlug}/chuong-${chapter.chapterNumber}`}
                            className="text-sm"
                        >
                            <span className="item-text flex items-center py-2 border-b border-gray-200 border-dashed">
                                <span className="whitespace-nowrap">
                                    Chương {chapter.chapterNumber}
                                </span>
                                :{" "}
                                <h2 className="line-clamp-1 ml-2 mr-auto">{chapter.title}</h2>
                                <span className="ml-2 whitespace-nowrap text-xs">
                                    ({moment(chapter.createdAt).fromNow()})
                                </span>
                            </span>
                        </Link>
                    );
                })}
            </div>
            {isShowMoreChapters !== lengthChapters && (
                <div
                    onClick={() => setIsShowMoreChapters(lengthChapters)}
                    className="hover:bg-gray-200 bg-gray-100 border cursor-pointer select-none text-center p-3 mt-3"
                >
                    <button>Xem thêm</button>
                </div>
            )}
        </>
    );
};

const FormListChapters = ({ tab, slug }: FormListChaptersProps) => {
    const [bodyContent, setBodyContent] = useState<ChaptersByNovelType[] | null>(null);
    const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);

    const getListChapters = async () => {
        const chaptersResponse = await getChaptersNovelByUrlHandle(slug as string);
        if (chaptersResponse?.data.success) {
            const chapters = chaptersResponse.data.chapters;
            setBodyContent(chapters);
        }
        setHasLoadedData(true);
    };

    useEffect(() => {
        if (tab === 2 && !hasLoadedData) {
            getListChapters();
            setHasLoadedData(true);
        }
    }, [tab, hasLoadedData]);

    return (
        <div>
            <div className="mb-4 font-semibold text-xl">Danh sách chương</div>
            <div className="transition-all">
                {hasLoadedData ? (
                    bodyContent ? (
                        <>
                            <ListItemChapter chapters={bodyContent} />
                        </>
                    ) : (
                        <div></div>
                    )
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

export default FormListChapters;
