import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { NovelType } from "@/types";
import { useDebounce } from "@/hook/useDebounce";
import { getNovelsByDataHandle } from "@/services/novels.services";
import { LoadingSearch } from "./LoadingLayout";
import { iconClose } from "../../../public/icons";
import { useClickOutSide } from "@/hook/useClickOutSide";
import { PROPERTIES_NOVEL } from "@/constants/data";
import LazyLoad from "react-lazy-load";


const SearchInput = () => {

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

    // Check click out side
    // useClickOutSide(dropSearchRef, eventDeleteValueInputSearch)

    // console.log(resultListNovelsSearch)

    return (
        <div  ref={dropSearchRef} className="flex items-center flex-1  max-w-md relative h-[50px]">
            <div className="flex w-full items-center relative">
                <input
                    value={valueInputSearch}
                    onChange={(e) => setValueInputSearch(e.target.value)}
                    placeholder="Tìm kiếm truyện"
                    className="py-1 pl-3 pr-8 h-10 m-0 flex-1 text-gray-800 text-sm bg-white border-2 border-gray-200 focus:border-gray-600 focus:outline-none rounded"
                />
                <span className="absolute right-2">
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
                </span>
            </div>

            <div className={`absolute max-w-lg w-full top-[50px] bg-white ${valueInputSearch ? "block" : "hidden"}`}>
                {
                    valueInputSearch !== "" ? (
                        resultListNovelsSearch && (
                            resultListNovelsSearch.length > 0 ? (
                                <div className="border max-h-96 overflow-y-auto shadow-sm">
                                    <div>
                                        {resultListNovelsSearch.map((novel) => {
                                            return (
                                                <Link
                                                    key={novel?.novelId}
                                                    href={`/truyen/${novel?.slug}`}
                                                    className="transition-all flex cursor-pointer hover:bg-gray-100 p-3"
                                                >
                                                    <LazyLoad className="flex-shrink-0 relative w-11 h-16 overflow-hidden shadow">
                                                        <Image
                                                            width={85}
                                                            height={125}
                                                            alt="Image-novel"
                                                            className="object-cover h-full w-full"
                                                            src={
                                                                novel.thumbnailUrl ||
                                                                "/images/novel-default.png"
                                                            }
                                                        />
                                                    </LazyLoad>
                                                    <div className="ml-3">
                                                        <h3 className="line-clamp-2 uppercase font-semibold">{novel.title}</h3>
                                                        <span>{JSON.stringify(PROPERTIES_NOVEL.genres[novel?.category])}</span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
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