import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import cn from "clsx"
import LazyLoad from "react-lazy-load";

import { NovelType } from "@/types";
import { useDebounce } from "@/hook/useDebounce";
import { getNovelsByDataHandle } from "@/services/novels.services";
import { LoadingSearch } from "./LoadingLayout";
import { iconClose, iconList, iconTimes } from "../../../public/icons";
import { PROPERTIES_NOVEL } from "@/constants/data";
import { WithClassName } from "@/types/common";
import BlurImage from "./BlurImage";


interface SearchInputProps extends WithClassName {
}


const SearchInput = (props : SearchInputProps) => {

    const route = useRouter()

    const dropSearchRef = useRef<HTMLDivElement>(null)

    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [valueInputSearch, setValueInputSearch] = useState<string>("");
    const [resultListNovelsSearch, setResultListNovelsSearch] = useState<NovelType[] | null>(null);

    const textDebounce = useDebounce(valueInputSearch, 500);

    // search novels
    const eventSearchNovels = async (value: string) => {
        try {
            // console.log(novelsRes)
            const data = {
                title: value
            }
            setIsLoadingSearch(true);
            const novelsRes = await getNovelsByDataHandle(data as any);


            if (novelsRes?.success) {
                setResultListNovelsSearch(novelsRes?.novels);
            }
            else {
                setResultListNovelsSearch([])
            }
            setIsLoadingSearch(false);
            
        } catch (error) {
            setIsLoadingSearch(false);
            setResultListNovelsSearch([])
            console.log(error);
        }
    };
    useEffect(() => {
        if (textDebounce === "") {
            setResultListNovelsSearch(null);
        } else if (textDebounce) {
            eventSearchNovels(textDebounce);
            setIsLoadingSearch(true);
        }

    }, [textDebounce]);

    // Delete Value Input
    const eventDeleteValueInputSearch = () => {
        setValueInputSearch("");
        setResultListNovelsSearch(null);
        setIsLoadingSearch(false);
    };

    useEffect(() => {
        setValueInputSearch("");
        setResultListNovelsSearch(null);
        setIsLoadingSearch(false);
    }, [route])

    return (
        <div  ref={dropSearchRef} className={cn(
            props.className,
            "flex items-center flex-1 relative h-[50px]"
        )}>
            <div className="flex w-full items-center relative">
                <input
                    value={valueInputSearch}
                    onChange={(e) => setValueInputSearch(e.target.value)}
                    placeholder="Tìm kiếm truyện"
                    className="py-1 pl-3 pr-8 h-10 m-0 flex-1 text-gray-800 text-sm bg-white border-2 border-gray-200 focus:border-gray-600 focus:outline-none rounded"
                />
                <div className="absolute right-2">
                    {valueInputSearch !== "" &&
                        (!isLoadingSearch ? (
                            <button
                                onClick={eventDeleteValueInputSearch}
                                className="hover:bg-gray-200 rounded-full p-2 top-0"
                            >
                                <i className="w-3 h-3 fill-gray-600 block">
                                    {iconClose}
                                </i>
                                
                            </button>
                        ) : (
                            <LoadingSearch className="top-1"/>
                        ))}
                </div>
            </div>

            <div className={`absolute z-20 w-full top-[50px] bg-white ${valueInputSearch ? "block" : "hidden"}`}>
                {
                    valueInputSearch !== "" ? (
                        resultListNovelsSearch && (
                            resultListNovelsSearch.length > 0 ? (
                                <div className="border max-h-96 overflow-y-auto shadow-sm">
                                    <ul>
                                        {resultListNovelsSearch.map((novel) => {
                                            return (
                                                <li key={novel?.novelId}>
                                                    <Link
                                                        href={`/truyen/${novel?.slug}`}
                                                        className="transition-all flex cursor-pointer hover:bg-gray-100 p-3"
                                                    >
                                                        <LazyLoad className="flex-shrink-0 relative w-11 h-16 overflow-hidden shadow">
                                                            <BlurImage
                                                                width={85}
                                                                height={125}
                                                                alt="Image-novel"
                                                                className="object-cover h-full w-full"
                                                                src={novel.thumbnailUrl}
                                                            />
                                                        </LazyLoad>
                                                        <div className="ml-3 flex-1">
                                                            <h3 className="line-clamp-2 mb-2 uppercase font-semibold max-lg:text-xs">{novel.title}</h3>
                                                            <div className="text-base flex align-middle items-center justify-between">
                                                                <span className="flex items-center max-w-[55%] text-sm mr-1">
                                                                    Chapter<span className="ml-1 line-clamp-1 align-middle">{novel.chapterCount}</span>
                                                                </span>
                                                                <span className="px-2 text-xs text-orange-700 line-clamp-1 align-middle text-center border border-orange-700">
                                                                    {PROPERTIES_NOVEL['genres'][novel?.category-1].value || PROPERTIES_NOVEL['genres'][0].value}
                                                                </span>
                                                            </div>
    
                                                        </div>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : (
                                textDebounce ? <div>Không tìm thấy truyện</div> : <div></div>
                            )
                        )
                    ) : (
                        <div>...</div>
                    )
                }
            </div>

        </div>
    )
}

export default SearchInput;