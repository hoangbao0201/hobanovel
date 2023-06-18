import Link from "next/link";
import { useEffect, useRef } from "react";

import 'react-virtualized/styles.css';
import {AutoSizer, Grid, GridCellProps} from 'react-virtualized';

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

    const chapterListRef = useRef<any>(null);

    useEffect(() => {
        // chapterListRef.current?.scrollToIndex({ index: chapterCurrent, behavior: "smooth", align: "center" });

        // Hidden scroll body
        const bodyElement = document.querySelector('body');

        if (isShow) {
            bodyElement?.classList.add('overflow-hidden');
        } else {
            bodyElement?.classList.remove('overflow-hidden');
        }
    }, [isShow]);

    

    const gridRef = useRef<Grid>(null);

    useEffect(() => {
    if (gridRef.current) {
        gridRef.current.scrollToCell({
            columnIndex: 0,
            rowIndex: chapterCurrent,
        });
    }
    }, []);



    return (
        <div className={`${isShow ? 'fixed block' : 'hidden'} top-0 left-0 right-0 bottom-0 inset-0 z-[1000]  bg-black/10 overflow-hidden overflow-y-scroll`}>
            <div className="pt-[60px] pb-[40px] px-4 h-screen">
                <div className="mx-auto h-full max-w-lg w-full bg-white relative border drop-shadow-lg rounded-lg">

                    <div className="w-full h-[50px] border-b">

                    </div>

                    {/* <VirtuosoGrid
                        ref={chapterListRef}
                        className=""
                        style={{ height: 'calc(100vh - 200px)' }}
                        totalCount={chapterNumber}
                        listClassName="flex flex-wrap gap-2 sm:text-[14px] text-[13px] px-3 my-3"
                        itemContent={(index) => {
                            return (
                                <Link
                                    onClick={() => handle()}
                                    href={`/truyen/${slug}/chuong-${index+1}`} key={index}
                                    className={`min-w-[100px] block py-1 px-3 border rounded-sm whitespace-nowrap text-center ${chapterCurrent == index+1 && 'border-red-600 text-red-600'}`}
                                >
                                    Chapter {index + 1}
                                </Link>
                            )
                        }}
                    /> */}


                    <AutoSizer>
                        {({ height, width }) => (
                            <Grid
                                ref={gridRef}
                                className=""
                                height={height - 200}
                                width={width}
                                rowCount={chapterNumber}
                                columnCount={1}
                                rowHeight={30} // Adjust the row height as needed
                                columnWidth={width}
                                cellRenderer={({ columnIndex, key, rowIndex, style }: GridCellProps) => (
                                    <div key={key} style={style}>
                                    <Link
                                        onClick={() => handle()}
                                        href={`/truyen/${slug}/chuong-${rowIndex + 1}`}
                                        className={`min-w-[100px] block py-1 px-3 border rounded-sm whitespace-nowrap text-center ${
                                        chapterCurrent === rowIndex + 1 ? 'border-red-600 text-red-600' : ''
                                        }`}
                                    >
                                        Chapter {rowIndex + 1}
                                    </Link>
                                    </div>
                                )}
                            />
                        )}
                    </AutoSizer>

                    
    
                    <div className="border-t h-[50px] flex items-center">
                        <span onClick={() => handle()} className="py-1 px-3 border rounded-md ml-auto mr-5 cursor-pointer select-none">Đóng</span>
                    </div>
    
                </div>
            </div>
        </div>
    )
}

export default OptionsListChapter;