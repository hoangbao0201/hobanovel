import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { VirtuosoGrid } from 'react-virtuoso'

import styled from "styled-components";
import { iconClose } from "../../../../public/icons";


// import 'react-perfect-scrollbar/dist/css/styles.css';
// import styled from "styled-components";



const ListContainer = styled.div`
    display: grid;
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
    height: fit;
    @media (min-width: 768px) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    @media (min-width: 1024px) {
        grid-template-columns: repeat(7, minmax(0, 1fr));
    }
`;

const ItemContainer = styled.div`
    padding: 0.5rem;
    width: full;
    height: full;
`;


interface OptionsListChapterProps {
    chapterNumber: number
    slug: string
    chapterCurrent: number
}

const OptionsListChapter = ({ chapterNumber, slug, chapterCurrent } : OptionsListChapterProps ) => {

    const chapterListRef = useRef<any>(null);

    const [nextPage, setNextPage] = useState(chapterCurrent - 1)
    const [isOptionsListChapter, setIsOptionsListChapter] = useState<boolean>(false)

    // Set Options Chapters
    const handleChangeOntionsListChapter = () => {
        setIsOptionsListChapter(value => !value)
    }

    useEffect(() => {
        const bodyElement = document.querySelector('body');
        
        if (isOptionsListChapter) {
            bodyElement?.classList.add('overflow-hidden');
            bodyElement?.classList.add('pr-4');
        }
        else {
            bodyElement?.classList.remove('overflow-hidden');
            bodyElement?.classList.remove('pr-4');
        }
    }, [isOptionsListChapter]);

    useEffect(() => {
        // chapterListRef.current.scrollToIndex({
        //     index: nextPage,
        // });
    }, [nextPage])

    return (
        <>
            <li className="hover:border-gray-600 leading-9 border cursor-pointer rounded-sm bg-white min-w-[115px] text-center h-9 sm:text-base text-sm" onClick={handleChangeOntionsListChapter}>
                Chapter {chapterCurrent || 1}
            </li>

            <div className={`${ isOptionsListChapter ? 'fixed block overflow-y-scroll' : 'hidden' } transition-all z-50 top-0 right-0 bottom-0 left-0 bg-black/10`}>

                <div className="mx-auto max-w-lg w-full top-0">
                    <div className="bg-white rounded-md shadow-lg mt-[30px] mx-4 relative">

                        <button onClick={() => setIsOptionsListChapter(false)} className="p-2 hover:bg-gray-200 rounded-full absolute right-3 top-3">
                            <i className="w-5 h-5 block">{iconClose}</i>
                        </button>

                        <div className="min-h-[400px]">
                            <div className="w-full px-4 py-3 border-b">
                                <input
                                    type="number"
                                    placeholder="Nhập số  chap, ví dụ: 100"
                                    className="px-3 py-1 w-2/3 border focus:border-blue-500 focus:shadow-blue-50 shadow outline-none rounded-md"
                                />
                            </div>

                            <div className="py-4">
                                <VirtuosoGrid
                                    ref={chapterListRef}
                                    className=""
                                    style={{ height: 'calc(100vh - 200px)' }}
                                    totalCount={chapterNumber}
                                    listClassName="flex flex-wrap gap-2 sm:text-[14px] text-[13px] px-3"
                                    itemContent={(index) => {
                                        return (
                                            <Link
                                                onClick={handleChangeOntionsListChapter}
                                                href={`/truyen/${slug}/chuong-${index+1}`} key={index}
                                                className={`min-w-[100px] block py-1 border rounded-sm whitespace-nowrap text-center overflow-hidden
                                                    ${chapterCurrent == index+1 ? 'border-red-600 text-red-600' : "hover:border-gray-200 hover:bg-gray-100"}`}
                                            >
                                                Chapter {index + 1}
                                            </Link>
                                        )
                                    }}
                                />
                            </div>
                        </div>

                        <div className="border-t h-[50px] flex items-center px-4">
                            <span onClick={() => setIsOptionsListChapter(false)} className="py-1 px-3 border rounded-md ml-auto mr-5 cursor-pointer select-none">Đóng</span>
                        </div>

                    </div>
                </div>

            </div>
        
        </>
    )
}

export default OptionsListChapter;