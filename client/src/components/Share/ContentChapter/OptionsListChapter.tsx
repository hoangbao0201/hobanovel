import Link from "next/link";
import { useEffect } from "react";

import PerfectScrollbar from "react-perfect-scrollbar";
import 'react-perfect-scrollbar/dist/css/styles.css';


interface OptionsListChapterProps {
    chapterNumber: number
    isShow?: boolean
    handle: () => void
    slug: string
}

const OptionsListChapter = ({ chapterNumber, isShow = false, handle, slug } : OptionsListChapterProps ) => {

    useEffect(() => {
        const bodyElement = document.querySelector('body');
        if (isShow) {
          bodyElement?.classList.add('overflow-hidden');
        //   bodyElement?.classList.add('overflow-y-auto');
        } else {
          bodyElement?.classList.remove('overflow-hidden');
        }
    }, [isShow]);

    return (
        <div className={`${isShow ? 'fixed' : 'hidden'} top-0 left-0 right-0 bottom-0 inset-0 z-1000  bg-black/5`}>
            <div className="mt-20 mx-auto h-[500px] max-w-lg w-full bg-white">


                <div
                    className="overflow-y-scroll"
                >
                    <div className="flex flex-wrap gap-2">
                        {
                            Array.from({ length: chapterNumber }, (_, index) => {
                                return (
                                    <Link onClick={() => handle()} href={`/truyen/${slug}/chuong-${index+1}`} key={index + 1} className="min-w-[100px] px-3 py-1 border rounded-sm text-sm whitespace-nowrap">
                                        Chapter {index + 1}
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
                

                <span onClick={() => handle()} className="btn ml-auto">Đóng</span>

            </div>
        </div>
    )
}

export default OptionsListChapter;