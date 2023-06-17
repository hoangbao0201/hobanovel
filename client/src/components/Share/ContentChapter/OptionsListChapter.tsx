import Link from "next/link";
import { useEffect, useRef } from "react";

import PerfectScrollbar from "react-perfect-scrollbar";
import 'react-perfect-scrollbar/dist/css/styles.css';
import styled from "styled-components";

const OptionListStyle = styled.div`
    overflow-y: scroll;
    height: calc(100vh - 200px);
`


interface OptionsListChapterProps {
    chapterNumber: number
    isShow?: boolean
    handle: () => void
    slug: string
    chapterCurrent: number
}

const OptionsListChapter = ({ chapterNumber, isShow = false, handle, slug, chapterCurrent } : OptionsListChapterProps ) => {

    const chapterListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bodyElement = document.querySelector('body');

        if (chapterListRef.current) {
            const chapterElement = chapterListRef.current.querySelector(`[data-chapter="${chapterCurrent}"]`);
    
            if (chapterElement) {
                chapterElement.scrollIntoView({ behavior: 'instant', inline: 'center' });
            }
        }

        if (isShow) {
            bodyElement?.classList.add('overflow-hidden');
        } else {
            bodyElement?.classList.remove('overflow-hidden');
        }
    }, [isShow]);

    return (
        <div className={`${isShow ? 'fixed' : 'hidden'} top-0 left-0 right-0 bottom-0 inset-0 z-[1000]  bg-black/10 overflow-hidden overflow-y-scroll`}>
            <div className="pt-[60px] pb-[40px] px-4 h-screen">
                <div className="mx-auto h-full max-w-lg w-full bg-white relative border drop-shadow-lg rounded-lg">

                    <div className="w-full h-[50px] border-b">

                    </div>
    
                    <OptionListStyle
                        ref={chapterListRef}
                        className="pl-3 py-5"
                    >
                        <div className="flex flex-wrap gap-2 text-[14px]">
                            {
                                Array.from({ length: chapterNumber }, (_, index) => {
                                    return (
                                        <Link 
                                            onClick={() => handle()}
                                            data-chapter={index + 1}
                                            href={`/truyen/${slug}/chuong-${index+1}`} key={index + 1}
                                            className={`min-w-[100px] px-3 py-1 border rounded-sm whitespace-nowrap ${chapterCurrent == index+1 && 'border-red-600 text-red-600'}`}
                                        >
                                            Chapter {index + 1}
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </OptionListStyle>
                    
    
                    <div className="border-t h-[50px] flex items-center">
                        <span onClick={() => handle()} className="py-1 px-3 border rounded-md ml-auto mr-5 cursor-pointer select-none">Đóng</span>
                    </div>
    
                </div>
            </div>
        </div>
    )
}

export default OptionsListChapter;