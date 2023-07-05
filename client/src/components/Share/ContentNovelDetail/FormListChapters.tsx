import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ChapterType } from "@/types";
import { getChaptersNovelByUrlHandle } from "@/services/chapter.services";
import React from "react";
import moment from "moment";
import "moment/locale/vi";
// import { VirtuosoGrid } from "react-virtuoso";
import styled from "styled-components";
import { iconSortDown, iconSortUp } from "../../../../public/icons";
import { useDebounce } from "@/hook/useDebounce";

interface FormListChaptersProps {
    tab?: number;
    slug?: string;
}

type ChaptersByNovelType = Pick<
    ChapterType,
    "chapterId" | "novelSlug" | "title" | "chapterNumber" | "createdAt"
>;

const FormListChapters = ({ tab, slug }: FormListChaptersProps) => {
    const virtuosoRef = useRef<any>(null);

    const [bodyContent, setBodyContent] = useState<ChaptersByNovelType[] | null>(null);
    const [listChapter, setListChapter] = useState<ChaptersByNovelType[] | null>(null)
    const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);
    const [valueInputFilter, setValueInputFilter] = useState("");
    const [isSort, setIsSort] = useState(false);
    const [isShowMoreChapters, setIsShowMoreChapters] = useState<number>(42);

    const getListChapters = async () => {
        const chaptersResponse = await getChaptersNovelByUrlHandle(slug as string);
        if (chaptersResponse?.data.success) {
            const chapters = chaptersResponse.data.chapters;
            setBodyContent(chapters);
            setListChapter(chapters)
        }
        setHasLoadedData(true);
    };

    useEffect(() => {
        if (tab === 2 && !hasLoadedData) {
            getListChapters();
            setHasLoadedData(true);
        }
    }, [tab, hasLoadedData]);

    const handlSortListChapter = () => {
        if(bodyContent && bodyContent?.length > 0) {
            setBodyContent([...bodyContent].reverse());
            setIsSort(value => !value)
        }
    }

    const valueInputFilterDebounce = useDebounce(valueInputFilter, 500)

    useEffect(() => {
        const arrChapter = isSort ? listChapter?.reverse() : listChapter
        // console.log(arrChapter[0].chapterNumber)
        const arr = arrChapter?.filter((novel) =>
            novel.title.toLowerCase().includes(valueInputFilterDebounce)
        );

        setBodyContent(arr || [])
    }, [valueInputFilterDebounce])

    return (
        <div>
            <div className="px-4 mb-4 font-semibold text-xl">Danh sách chương</div>
            {
                listChapter && listChapter?.length > 0 && (
                    <div className="px-4 flex justify-between mb-5">
                        <div>
                            <span>Tìm kiếm: </span>
                            <input onChange={(e) => setValueInputFilter(e.target.value.toLowerCase())} value={valueInputFilter} className="border h-11 px-3 py-1 outline-none"/>
                        </div>
                        <button className="border rounded-lg" onClick={handlSortListChapter}>
                            <i className="block w-8 m-2">{isSort ? iconSortDown : iconSortUp}</i>
                        </button>
                    </div>
                )
            }
            <div className="transition-all px-4 mb-4">
                {hasLoadedData ? (
                    listChapter && bodyContent ? (
                        <div className="border py-2 px-1 min-h-[500px]">
                            <ul className="grid gap-x-5 lg:grid-cols-3 grid-cols-1">
                                {bodyContent.slice(0, isShowMoreChapters)?.map((chapter) => {
                                    return (
                                        <li key={chapter.chapterId}>
                                            <Link
                                                href={`/truyen/${chapter.novelSlug}/chuong-${chapter.chapterNumber}`}
                                                className="text-sm item-text flex items-center py-2 px-2 border-b border-gray-200 border-dashed hover:bg-gray-100"
                                            >
                                                <span className="whitespace-nowrap">
                                                    Chương {chapter.chapterNumber}
                                                </span>
                                                :{" "}
                                                <h3 className="line-clamp-1 ml-2 mr-auto">{chapter.title}</h3>
                                                <span className="ml-2 whitespace-nowrap text-xs">
                                                    ({moment(chapter.createdAt).fromNow()})
                                                </span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                            {(isShowMoreChapters !== bodyContent?.length)  && bodyContent.length > 42 && (
                                <div
                                    onClick={() => setIsShowMoreChapters(listChapter?.length)}
                                    className="hover:bg-gray-200 bg-gray-100 border cursor-pointer select-none text-center p-3 mt-3"
                                >
                                    <button>Xem thêm</button>
                                </div>
                            )}
                        </div>
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
 