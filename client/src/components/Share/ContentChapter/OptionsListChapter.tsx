import Link from "next/link";
import { ComponentType, useEffect, useRef } from "react";

import styled from "styled-components";
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso'
import OverlayLayout from "@/components/Layout/OverlayLayout";
import ClientOnly from "../ClientOnly";


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
    isShow?: boolean
    handle: () => void
    slug: string
    chapterCurrent: number
}

const OptionsListChapter = ({ chapterNumber, isShow = false, handle, slug, chapterCurrent } : OptionsListChapterProps ) => {

    const chapterListRef = useRef<any>(null);

    return (
        <>
        
            <OverlayLayout
                handle={() => handle()}
                isShow={isShow}
            >

                    <div className="w-full px-4 py-3 border-b">
                        <input
                            className="px-3 py-1 w-2/3 border focus:border-blue-500 focus:shadow-blue-50 shadow outline-none rounded-md"
                            placeholder="Nhập số  chap, ví dụ: 100"
                        />
                    </div>

                    <div className="py-4">
                        <VirtuosoGrid
                            ref={chapterListRef}
                            className=""
                            style={{ height: 'calc(100vh - 200px)' }}
                            totalCount={chapterNumber}
                            overscan={80}
                            listClassName="flex flex-wrap gap-2 sm:text-[14px] text-[13px] px-3"
                            itemContent={(index) => {
                                return (
                                    <Link
                                        onClick={() => handle()}
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

            </OverlayLayout>
        
        </>
    )
}

export default OptionsListChapter;