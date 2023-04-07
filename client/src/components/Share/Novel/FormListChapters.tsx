// import Link from "next/link";
// import { useEffect, useState } from "react";

// import { ChapterType, NovelType } from "@/types";
// import { getChaptersNovelByUrlHandle } from "@/services/chapter.services";


// interface FormListChaptersProps {
//     slug?: string
// }

// const FormListChapters = ({ slug } : FormListChaptersProps) => {

//     const [bodyContent, setBodyContent] = useState<ChapterType[] | null>(null)

//     const getListChapters = async () => {
//         const chaptersResponse = await getChaptersNovelByUrlHandle(slug as string);
//         if (chaptersResponse?.data.success) {
//             console.log(chaptersResponse.data.chapters)
//             setBodyContent(chaptersResponse.data.chapters)
//         }
//     };

//     useEffect(() => {
//         getListChapters();
//     }, []);

//     return (
//         <div>
//             <div className="mb-4 font-semibold text-xl">Danh sách chương</div>
//             <div className="">
//                 {
//                     bodyContent ? (
//                         <div className="grid grid-cols-3">
//                             {
//                                 bodyContent.map((chapter : ChapterType, index) => {
//                                     return (
//                                         <Link key={index} href={`/truyen/${chapter.novelSlug}/chuong-${chapter.chapterNumber}`} className="text-gray-800">
//                                             <span className="item-text flex py-2 border-b border-gray-200 border-dashed">
//                                                 <span className="whitespace-nowrap">Chương {chapter.chapterNumber}</span>: <h2 className="line-clamp-1 ml-2">{chapter.title}</h2>
//                                             </span>
//                                         </Link>
//                                     )
//                                 })
//                             }
//                         </div>
//                     ) : (
//                         <div>Chưa đăng tải chương nào!</div>
//                     )
//                 }
//             </div>
//         </div>
//     )
// }

// export default FormListChapters;



// import Link from "next/link";
// import { useEffect, useState, useMemo } from "react";

// import { ChapterType, NovelType } from "@/types";
// import { getChaptersNovelByUrlHandle } from "@/services/chapter.services";

// interface FormListChaptersProps {
//     slug?: string
// }

// const FormListChapters = ({ slug }: FormListChaptersProps) => {
//     const [bodyContent, setBodyContent] = useState<ChapterType[] | null>(null);

//     const getListChapters = async () => {
//         const chaptersResponse = await getChaptersNovelByUrlHandle(slug as string);
//         if (chaptersResponse?.data.success) {
//             console.log(chaptersResponse.data.chapters)
//             setBodyContent(chaptersResponse.data.chapters)
//         }
//     };

//     // Sử dụng useMemo để lưu trữ kết quả của getListChapters khi nó được gọi lần đầu tiên
//     const memoizedChapters = useMemo(() => {
//         if (!slug) return null;
//         getListChapters();
//     }, [slug]);

//     // Kiểm tra xem kết quả đã được tính toán trước đó chưa. Nếu đã tính toán, sử dụng kết quả đó thay vì gọi getListChapters một lần nữa.
//     useEffect(() => {
//         if (bodyContent === null && memoizedChapters) {
//             setBodyContent(memoizedChapters);
//         }
//     }, [bodyContent, memoizedChapters]);

//     return (
//         <div>
//             <div className="mb-4 font-semibold text-xl">Danh sách chương</div>
//             <div className="">
//                 {bodyContent ? (
//                     <div className="grid grid-cols-3">
//                         {bodyContent.map((chapter: ChapterType, index) => {
//                             return (
//                                 <Link key={index} href={`/truyen/${chapter.novelSlug}/chuong-${chapter.chapterNumber}`} className="text-gray-800">
//                                     <span className="item-text flex py-2 border-b border-gray-200 border-dashed">
//                                         <span className="whitespace-nowrap">Chương {chapter.chapterNumber}</span>: <h2 className="line-clamp-1 ml-2">{chapter.title}</h2>
//                                     </span>
//                                 </Link>
//                             );
//                         })}
//                     </div>
//                 ) : (
//                     <div>Chưa đăng tải chương nào!</div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FormListChapters;




import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

import { ChapterType, NovelType } from "@/types";
import { getChaptersNovelByUrlHandle } from "@/services/chapter.services";
import React from "react";

interface FormListChaptersProps {
    tab?: number
    slug?: string
}

const FormListChapters = ({ tab, slug }: FormListChaptersProps) => {
    const [bodyContent, setBodyContent] = useState<ChapterType[] | null>(null);
    const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);

    const getListChapters = async () => {
        const chaptersResponse = await getChaptersNovelByUrlHandle(slug as string);
        if (chaptersResponse?.data.success) {
            console.log(chaptersResponse.data.chapters)
            setBodyContent(chaptersResponse.data.chapters);
        }
        setHasLoadedData(true);
    };

    useEffect(() => {
        if (tab === 3 && !hasLoadedData) {
          getListChapters();
          setHasLoadedData(true);
        }
      }, [tab, hasLoadedData]);

    return (
        <div>
            <div className="mb-4 font-semibold text-xl">Danh sách chương</div>
            <div className="">
                {
                    hasLoadedData ? (
                        bodyContent ? (
                            <div className="grid gap-2 grid-cols-3">
                                {
                                    bodyContent?.map((chapter : ChapterType, index) => {
                                        return (
                                            <Link key={index} href={`/truyen/${chapter.novelSlug}/chuong-${chapter.chapterNumber}`} className="text-gray-800">
                                                <span className="item-text flex py-2 border-b border-gray-200 border-dashed">
                                                    <span className="whitespace-nowrap">Chương {chapter.chapterNumber}</span>: <h2 className="line-clamp-1 ml-2">{chapter.title}</h2>
                                                </span>
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        ) : (
                            <div></div>
                        )
                    ) : (
                        <div></div>
                    )
                }
            </div>
        </div>
    )
}

export default FormListChapters;
