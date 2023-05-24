import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ChapterType } from "@/types";
import { getChaptersNovelByUrlHandle } from "@/services/chapter.services";
import React from "react";
import moment from "moment";
import "moment/locale/vi";
import { VirtuosoGrid } from "react-virtuoso";
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

// const ListContainerStyle = styled.div`
//     display: grid;
//     scroll-behavior: smooth;
//     scroll-snap-type: y mandatory;
//     height: fit;
//     margin-right: 10px;
//     margin: 10px 0px;
//     column-gap: 24px;

//     scroll-behavior: smooth;
//     scroll-snap-type: y mandatory;

//     ::-webkit-scrollbar {
//         width: 6px;
//     }
//     ::-webkit-scrollbar-thumb {
//         @apply rounded-2xl bg-gray-400;
//     }

//     @media (min-width: 768px) {
//         grid-template-columns: repeat(1, minmax(0, 1fr));
//     }
//     @media (min-width: 1024px) {
//         grid-template-columns: repeat(3, minmax(0, 1fr));
//     }
// `

// const ItemChapterStyle = styled.div`
//     &::before {
//         content: '';
//         position: absolute;
//         height: 60%;
//         width: 1px;
//         background-color: #000;
//         right: 0px;
//         top: 0px;
//     }
// `

// const ListItemChapter = ({ chapters }: { chapters: ChaptersByNovelType[] }) => {
//     const [isShowMoreChapters, setIsShowMoreChapters] = useState<number>(42);

//     // LENGTH CHAPTERS
//     const lengthChapters = chapters.length;

//     return (
//         <>
//             <div
//                 className={`${
//                     isShowMoreChapters && "overflow-hidden"
//                 } `}
//             >
//                 <VirtuosoGrid
//                     ref={virtuoso}
//                     style={{
//                         width: "100%",
//                         height: `${
//                             chapters.length > 50
//                                 ? '750px'
//                                 : '450px'
//                         }`,
//                     }}
//                     overscan={50}
//                     components={{
//                         List: ListContainerStyle,
//                         Item: ItemContainerStyle
//                     }}
//                     totalCount={chapters.length}
//                     itemContent={(index) => {
//                         return (
//                             <Link
//                                 key={chapters[index].chapterId || index}
//                                 href={`/truyen/${chapters[index].novelSlug}/chuong-${chapters[index].chapterNumber}`}
//                                 className="text-sm animate__fadeIn animate__animated"
//                             >
//                                 <span className="item-text flex items-center py-2 border-b border-gray-200 border-dashed">
//                                     <span className="whitespace-nowrap">
//                                         Chương {chapters[index].chapterNumber}
//                                     </span>
//                                     :{" "}
//                                     <h2 className="line-clamp-1 ml-2 mr-auto">{chapters[index].title}</h2>
//                                     <span className="ml-2 whitespace-nowrap text-xs">
//                                         ({moment(chapters[index].createdAt).fromNow()})
//                                     </span>
//                                 </span>
//                             </Link>
//                         )
//                     }}
//                 >

//                 </VirtuosoGrid>

//             </div>
//             {/* {isShowMoreChapters !== lengthChapters && (
//                 <div
//                     onClick={() => setIsShowMoreChapters(lengthChapters)}
//                     className="hover:bg-gray-200 bg-gray-100 border cursor-pointer select-none text-center p-3 mt-3"
//                 >
//                     <button>Xem thêm</button>
//                 </div>
//             )} */}
//         </>
//     );
// };

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
            <div className="mb-4 font-semibold text-xl">Danh sách chương</div>
            {
                listChapter && listChapter?.length > 0 && (
                    <div className="flex justify-between mb-5">
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
            <div className="transition-all">
                {hasLoadedData ? (
                    listChapter && bodyContent ? (
                        <>

                            <div className="border py-2 px-1 min-h-[500px]">
                                <div className="grid gap-x-5 grid-cols-3">
                                    {bodyContent.slice(0, isShowMoreChapters)?.map((chapter) => {
                                        return (
                                            <Link
                                                key={chapter.chapterId}
                                                href={`/truyen/${chapter.novelSlug}/chuong-${chapter.chapterNumber}`}
                                                className="text-sm"
                                            >
                                                <span className="item-text flex items-center py-2 px-2 border-b border-gray-200 border-dashed hover:bg-gray-100">
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
                                        )
                                    })}
                                </div>
                                {(isShowMoreChapters !== bodyContent?.length)  && bodyContent.length > 42 && (
                                    <div
                                        onClick={() => setIsShowMoreChapters(listChapter?.length)}
                                        className="hover:bg-gray-200 bg-gray-100 border cursor-pointer select-none text-center p-3 mt-3"
                                    >
                                        <button>Xem thêm</button>
                                    </div>
                                )}
                            </div>

                            {/* <ListItemChapter chapters={bodyContent} /> */}
                            {/* <VirtuosoGrid
                                ref={virtuosoRef}
                                style={{
                                    width: "100%",
                                    height: `${
                                        bodyContent.length > 50
                                            ? '750px'
                                            : '450px'
                                    }`,
                                }}
                                overscan={50}
                                components={{
                                    List: ListContainerStyle,
                                    Item: ItemContainerStyle
                                }}
                                totalCount={bodyContent.length}
                                itemContent={(index) => {
                                    return (
                                        <Link
                                            key={bodyContent[index].chapterId || index}
                                            href={`/truyen/${bodyContent[index].novelSlug}/chuong-${bodyContent[index].chapterNumber}`}
                                            className="text-sm"
                                        >
                                            <span className="item-text flex items-center py-2 px-1 border-b border-gray-200 border-dashed">
                                                <span className="whitespace-nowrap">
                                                    Chương {bodyContent[index].chapterNumber}
                                                </span>
                                                :{" "}
                                                <h2 className="line-clamp-1 ml-2 mr-auto">{bodyContent[index].title}</h2>
                                                <span className="ml-2 whitespace-nowrap text-xs">
                                                    ({moment(bodyContent[index].createdAt).fromNow()})
                                                </span>
                                            </span>
                                        </Link>
                                    )
                                }}
                            >
                            </VirtuosoGrid> */}
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
 