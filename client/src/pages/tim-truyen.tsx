import { useRouter } from "next/router";
import { PROPERTIES_NOVEL } from "@/constants/data";
import { Fragment, ReactNode, useEffect, useId, useState } from "react";

import Select from "react-select";
import { useMediaQuery } from "usehooks-ts";

import { NovelResType } from "@/types";
import Head from "@/components/Share/Head";
import ItemNovel from "@/components/Share/ItemNovel";
import MainLayout from "@/components/Layout/MainLayout";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { iconAngleDouble, iconClose } from "../../public/icons";
import { advancedSearchNovelHandle } from "@/services/novels.services";
import { PaginationLayout } from "@/components/Share/PaginationLayout";
import { AdsenseForm } from "@/components/Layout/AdsLayout/AdSenseForm";
import ItemNovelLazy from "@/components/Share/ItemNovelLazy";
import ClientOnly from "@/components/Share/ClientOnly";


// Data Default
type ValuesOptionsSortType =
    | "novel_new"
    | "chapter_new"
    | "review_count"
    | "review_score"
    | "follow_count"
    | "comment_count"
    | "chapter_count";
type ValuesOptionsSort = {
    label: string;
    value: string;
    id: string;
};
interface OptionsSortProps {
    new: ValuesOptionsSort[];
    rating: ValuesOptionsSort[];
    follow: ValuesOptionsSort[];
    comment: ValuesOptionsSort[];
    chapterCount: ValuesOptionsSort[];
}
const optionsSort: OptionsSortProps = {
    new: [
        { label: "Mới cập nhật", value: "Mới cập nhật", id: "novel_new" },
        { label: "Mới đăng", value: "Mới đăng", id: "chapter_new" },
    ],
    rating: [
        { label: "Lượt đánh giá", value: "Lượt đánh giá", id: "review_count" },
        { label: "Điểm đánh giá", value: "Điểm đánh giá", id: "review_score" },
    ],
    follow: [{ label: "Theo dõi", value: "Theo dõi", id: "follow_count" }],
    comment: [{ label: "Bình luận", value: "Bình luận", id: "comment_count" }],
    chapterCount: [{ label: "Số chương", value: "Số chương", id: "chapter_count" }],
};

// ---------------------------

type querySearchNovelTypes = {
    [key: string]: number[];
};
interface QuerySearchNovelProps extends querySearchNovelTypes {
    genres: number[];
    status: number[];
    personality: number[];
    scene: number[];
    classify: number[];
    viewFrame: number[];
}
interface SearchNovelProps {
    queryPage: string
}

const SearchNovel = ({ queryPage }: SearchNovelProps) => {
    const router = useRouter();
    const matchesMobile = useMediaQuery("(max-width: 640px)");

    // Data
    const [querySearchNovel, setQuerySearchNovel] = useState<QuerySearchNovelProps>({
        genres: [],
        status: [],
        personality: [],
        scene: [],
        classify: [],
        viewFrame: [],
    });
    const [optionSort, setOptionSort] = useState<ValuesOptionsSortType>("novel_new");
    const [isBoxSearch, setIsBoxSearch] = useState<boolean>(false);
    const [listNovels, setListNovels] = useState<NovelResType[]>([])
    const [isLoad, setIsLoad] = useState<boolean>(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [countPage, setCountPage] = useState(1)

    // Handle Change Page
    const handleChangePage = ({
        query,
        page,
        sortBy,
        isBox = false,
    }: {
        query?: string;
        page?: number;
        sortBy?: string;
        isBox?: boolean;
    }) => {
        if (!query) {
            query = new URLSearchParams(querySearchNovel as any).toString();
        }
        const queryR = `tim-truyen?sort_by=${sortBy || optionSort}&page=${
            page || currentPage
        }&${query}&isBox=${isBox == true ? true : false}`;

        router.push(queryR);
    };
    // Next Page
    const handleNextPage = (pageNumber: number) => {
        handleChangePage({ page: pageNumber });
    };
    // Handle Add Query Novel
    const handleAddQuerySearch = (key: keyof QuerySearchNovelProps, data: number) => {
        setQuerySearchNovel((value) => ({
            ...value,
            [key]: [...value[key], data],
        }));
    };
    // Handle Delete Query Novel
    const handleDeleteQuerySearch = (key: keyof QuerySearchNovelProps, data: number) => {
        setQuerySearchNovel((value) => ({
            ...value,
            [key]: value[key].filter((index) => index !== data),
        }));
    }

    // Get Novels By Query
    const handleGetNovelsByQuery = async ({ queryOb, page, sortBy, isBox = false } : { queryOb: QuerySearchNovelProps, page: number, sortBy: string, isBox?: boolean }) => {
        try {
            const cvQueryOb = new URLSearchParams(queryOb as any).toString()

            
            const queryR = `sort_by=${sortBy}&page=${page}&${cvQueryOb}&isBox=${isBox == true ? true : false}`

            
            const getNovelsRes = await advancedSearchNovelHandle(queryR || '')
            if (!getNovelsRes.success || !getNovelsRes) {
                throw new Error();
            }
            
            // console.log(getNovelsRes)

            setListNovels(getNovelsRes.novels);
            setCountPage(getNovelsRes?.countPage || 1);
            setIsLoad(false);
            
            } catch (error) {
                console.log(error)
                setListNovels([])
                setIsLoad(false);
        }
    }

    // Handle CV query
    const handleCvQuery = (query : {
        genres?: string
        status?: string
        personality?: string
        scene?: string
        classify?: string
        viewFrame?: string

        page?: string
        sort_by?: ValuesOptionsSortType
        isBox?: string
    }) => {

        const { genres, status, personality, scene, classify, viewFrame, page = '1', sort_by = "novel_new", isBox = false } = query

        
        const queryOb : QuerySearchNovelProps = {
            genres: genres ? JSON.parse(`[${genres}]`) : [],
            status: status ? JSON.parse(`[${status}]`) : [],
            personality: personality ? JSON.parse(`[${personality}]`) : [],
            scene: scene ? JSON.parse(`[${scene}]`) : [],
            classify: classify ? JSON.parse(`[${classify}]`) : [],
            viewFrame: viewFrame ? JSON.parse(`[${viewFrame}]`) : []
        }
        setQuerySearchNovel(queryOb)
        
        setCurrentPage(Number(page) || 1)
        setOptionSort(sort_by)
        setIsBoxSearch(isBox == 'true' ? true : false)
        handleGetNovelsByQuery({ queryOb: queryOb, sortBy: sort_by, page: Number(page) || 1 });
    }

    // Is Show Box Search
    useEffect(() => {
        const bodyElement = document.querySelector("body");
        if (isBoxSearch && matchesMobile) {
            bodyElement?.classList.add("overflow-hidden");
        } else {
            bodyElement?.classList.remove("overflow-hidden");
        }
    }, [isBoxSearch, matchesMobile]);

    // Call Get Data
    useEffect(() => {
        setIsLoad(true)
        handleCvQuery(router.query)
    }, [router.query])



    // CV html
    // Get List Check Query
    const listCheckQuery = Object.keys(querySearchNovel).map((key, indexParent) => (
        <Fragment key={indexParent}>
            {querySearchNovel[key].map((item, indexChild) => (
                <li
                    onClick={() => handleDeleteQuerySearch(key, item)}
                    key={indexChild}
                    className="flex items-center whitespace-nowrap cursor-pointer text-[12px] px-2 border border-[#666] rounded-[3px] bg-[#666] text-white select-none"
                >
                    {PROPERTIES_NOVEL[key][item - 1].value}
                    <i className="w-3 ml-1 block fill-white">{iconClose}</i>
                </li>
            ))}
        </Fragment>
    ));

    return (
        <>
            <Head title="Tìm truyện nâng cao - Hobanovel" />
            <WrapperLayout className="pt-5 max-lg:max-w-3xl">
                <div className="grid">


                    <div className="mb-4">
                        <button
                            onClick={() => setIsBoxSearch((value) => !value)}
                            className="flex min-w-[200px] items-center justify-center mx-auto border bg-blue-500 py-2 px-3 text-white rounded-md text-sm"
                        >
                            {isBoxSearch ? "Ẩn khung tìm kiếm" : "Hiện khung tìm kiếm"}{" "}
                            <i
                                className={`w-3 h-3 ml-2 block fill-white ${
                                    !isBoxSearch && "rotate-180"
                                }`}
                            >
                                {iconAngleDouble}
                            </i>
                        </button>

                        
                        <div className={`${!isBoxSearch && "hidden"}`}> 
                            <div
                                className={`px-4 max-sm:fixed max-sm:top-0 max-sm:right-0 max-sm:bottom-0 max-sm:left-0 max-sm:overflow-y-auto max-sm:bg-white z-50`}
                            >
                                <div
                                    className={`max-sm:mt-4 max-sm:flex items-center justify-between hidden`}
                                >
                                    <button className="w-3 h-3 p-2 flex-shrink-0"></button>
                                    <h2 className="text-xl font-semibold">
                                        Tìm truyện nâng cao
                                    </h2>
                                    <button
                                        onClick={() => setIsBoxSearch(false)}
                                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                                    >
                                        <i className="w-3 h-3 block">{iconClose}</i>
                                    </button>
                                </div>
                                <div className="-mx-4">
                                    <div className="px-4">
                                        <h4 className="mb-2 font-semibold">Đã chọn</h4>
                                        <ul className="flex flex-wrap gap-1">
                                            {listCheckQuery}
                                        </ul>
                                    </div>
                                    <div className="text-[12px]">
                                        <div className="py-4 mx-4 border-b">
                                            <h4 className="mb-2 font-semibold">Thể loại</h4>
                                            <ul className="flex flex-wrap sm:gap-2 gap-1">
                                                {PROPERTIES_NOVEL.genres.map((item, index) => {
                                                    return (
                                                        <Fragment key={index}>
                                                            {querySearchNovel.genres.includes(
                                                                item.id
                                                            ) ? (
                                                                <li
                                                                    onClick={() =>
                                                                        handleDeleteQuerySearch(
                                                                            "genres",
                                                                            item.id
                                                                        )
                                                                    }
                                                                    className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >
                                                                    {item.value}{" "}
                                                                    <i className="w-3 ml-1 block fill-white">
                                                                        {iconClose}
                                                                    </i>
                                                                </li>
                                                            ) : (
                                                                <li
                                                                    onClick={() =>
                                                                        handleAddQuerySearch(
                                                                            "genres",
                                                                            item.id
                                                                        )
                                                                    }
                                                                    className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >
                                                                    {item.value}
                                                                </li>
                                                            )}
                                                        </Fragment>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <div className="py-4 mx-4 border-b">
                                            <h4 className="mb-2 font-semibold">Tình trạng</h4>
                                            <ul className="flex flex-wrap sm:gap-2 gap-1">
                                                {PROPERTIES_NOVEL.status.map((item, index) => {
                                                    return (
                                                        <Fragment key={index}>
                                                            {querySearchNovel.status.includes(
                                                                item.id
                                                            ) ? (
                                                                <li
                                                                    onClick={() =>
                                                                        handleDeleteQuerySearch(
                                                                            "status",
                                                                            item.id
                                                                        )
                                                                    }
                                                                    className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >
                                                                    {item.value}{" "}
                                                                    <i className="w-3 ml-1 block fill-white">
                                                                        {iconClose}
                                                                    </i>
                                                                </li>
                                                            ) : (
                                                                <li
                                                                    onClick={() =>
                                                                        handleAddQuerySearch(
                                                                            "status",
                                                                            item.id
                                                                        )
                                                                    }
                                                                    className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >
                                                                    {item.value}
                                                                </li>
                                                            )}
                                                        </Fragment>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <div className="py-4 mx-4 border-b">
                                            <h4 className="mb-2 font-semibold">
                                                Tính cách nhân vật chính
                                            </h4>
                                            <ul className="flex flex-wrap sm:gap-2 gap-1">
                                                {PROPERTIES_NOVEL.personality.map(
                                                    (item, index) => {
                                                        return (
                                                            <Fragment key={index}>
                                                                {querySearchNovel.personality.includes(
                                                                    item.id
                                                                ) ? (
                                                                    <li
                                                                        onClick={() =>
                                                                            handleDeleteQuerySearch(
                                                                                "personality",
                                                                                item.id
                                                                            )
                                                                        }
                                                                        className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                    >
                                                                        {item.value}{" "}
                                                                        <i className="w-3 ml-1 block fill-white">
                                                                            {iconClose}
                                                                        </i>
                                                                    </li>
                                                                ) : (
                                                                    <li
                                                                        onClick={() =>
                                                                            handleAddQuerySearch(
                                                                                "personality",
                                                                                item.id
                                                                            )
                                                                        }
                                                                        className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                    >
                                                                        {item.value}
                                                                    </li>
                                                                )}
                                                            </Fragment>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                        <div className="py-4 mx-4 border-b">
                                            <h4 className="mb-2 font-semibold">
                                                Bối cảnh thế giới
                                            </h4>
                                            <ul className="flex flex-wrap sm:gap-2 gap-1">
                                                {PROPERTIES_NOVEL.scene.map((item, index) => {
                                                    return (
                                                        <Fragment key={index}>
                                                            {querySearchNovel.scene.includes(
                                                                item.id
                                                            ) ? (
                                                                <li
                                                                    onClick={() =>
                                                                        handleDeleteQuerySearch(
                                                                            "scene",
                                                                            item.id
                                                                        )
                                                                    }
                                                                    className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >
                                                                    {item.value}{" "}
                                                                    <i className="w-3 ml-1 block fill-white">
                                                                        {iconClose}
                                                                    </i>
                                                                </li>
                                                            ) : (
                                                                <li
                                                                    onClick={() =>
                                                                        handleAddQuerySearch(
                                                                            "scene",
                                                                            item.id
                                                                        )
                                                                    }
                                                                    className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >
                                                                    {item.value}
                                                                </li>
                                                            )}
                                                        </Fragment>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                        <div className="py-4 mx-4 border-b">
                                            <h4 className="mb-2 font-semibold">Lưu phái</h4>
                                            <ul className="flex flex-wrap sm:gap-2 gap-1">
                                                {PROPERTIES_NOVEL.classify.map(
                                                    (item, index) => {
                                                        return (
                                                            <Fragment key={index}>
                                                                {querySearchNovel.classify.includes(
                                                                    item.id
                                                                ) ? (
                                                                    <li
                                                                        onClick={() =>
                                                                            handleDeleteQuerySearch(
                                                                                "classify",
                                                                                item.id
                                                                            )
                                                                        }
                                                                        className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                    >
                                                                        {item.value}{" "}
                                                                        <i className="w-3 ml-1 block fill-white">
                                                                            {iconClose}
                                                                        </i>
                                                                    </li>
                                                                ) : (
                                                                    <li
                                                                        onClick={() =>
                                                                            handleAddQuerySearch(
                                                                                "classify",
                                                                                item.id
                                                                            )
                                                                        }
                                                                        className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                    >
                                                                        {item.value}
                                                                    </li>
                                                                )}
                                                            </Fragment>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                        <div className="py-4 mx-4 border-b">
                                            <h4 className="mb-2 font-semibold">Thị giác</h4>
                                            <ul className="flex flex-wrap sm:gap-2 gap-1">
                                                {PROPERTIES_NOVEL.viewFrame.map(
                                                    (item, index) => {
                                                        return (
                                                            <Fragment key={index}>
                                                                {querySearchNovel.viewFrame.includes(
                                                                    item.id
                                                                ) ? (
                                                                    <li
                                                                        onClick={() =>
                                                                            handleDeleteQuerySearch(
                                                                                "viewFrame",
                                                                                item.id
                                                                            )
                                                                        }
                                                                        className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                    >
                                                                        {item.value}{" "}
                                                                        <i className="w-3 ml-1 block fill-white">
                                                                            {iconClose}
                                                                        </i>
                                                                    </li>
                                                                ) : (
                                                                    <li
                                                                        onClick={() =>
                                                                            handleAddQuerySearch(
                                                                                "viewFrame",
                                                                                item.id
                                                                            )
                                                                        }
                                                                        className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                    >
                                                                        {item.value}
                                                                    </li>
                                                                )}
                                                            </Fragment>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="py-4 mx-4 border-b">
                                        <button
                                            className="border bg-green-600 py-2 px-3 text-white rounded-md text-sm"
                                            onClick={() => handleChangePage({ page: 1 })}
                                        >
                                            Tìm kiếm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        

                    </div>
                    <div>
                        <div className="grid pl-4">
                            {/* <ul className={`[&>li]:inline-block [&>li]:cursor-pointer`}> */}
                            <ul className={`flex items-center [&>li]:cursor-pointer whitespace-nowrap`}>
                                <li>
                                    <Select
                                        isSearchable={false}
                                        defaultValue={optionsSort.new[0]}
                                        className="text-sm font-semibold"
                                        options={optionsSort.new}
                                        instanceId={useId()}
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                outline: "none",
                                                boxShadow: "none",
                                                border: "none",
                                                borderRadius: "0px",
                                                height: "32px",
                                                cursor: "pointer",
                                            }),
                                        }}
                                        onChange={(select: any) =>
                                            handleChangePage({ sortBy: select.id, page: 1 })
                                        }
                                    />
                                </li>
                                <li>
                                    <Select
                                        isSearchable={false}
                                        defaultValue={optionsSort.rating[0]}
                                        className="text-sm font-semibold"
                                        options={optionsSort.rating}
                                        instanceId={useId()}
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                outline: "none",
                                                boxShadow: "none",
                                                border: "none",
                                                borderRadius: "0px",
                                                height: "32px",
                                                cursor: "pointer",
                                            }),
                                        }}
                                        onChange={(select: any) =>
                                            handleChangePage({ sortBy: select.id, page: 1 })
                                        }
                                    />
                                </li>
    
                                <li
                                    className={`p-1 text-sm font-semibold rounded-sm px-2 ${
                                        optionSort === "follow_count" ? "bg-gray-200" : ""
                                    }`}
                                    onClick={() =>
                                        handleChangePage({ sortBy: "follow_count", page: 1 })
                                    }
                                >
                                    Theo dõi
                                </li>
                                <li
                                    className={`p-1 text-sm font-semibold rounded-sm px-2 ${
                                        optionSort === "comment_count" ? "bg-gray-200" : ""
                                    }`}
                                    onClick={() =>
                                        handleChangePage({ sortBy: "comment_count", page: 1 })
                                    }
                                >
                                    Bình luận
                                </li>
                                <li
                                    className={`p-1 text-sm font-semibold rounded-sm px-2 ${
                                        optionSort === "chapter_count" ? "bg-gray-200" : ""
                                    }`}
                                    onClick={() =>
                                        handleChangePage({ sortBy: "chapter_count", page: 1 })
                                    }
                                >
                                    Số chương
                                </li>
    
    
                            </ul>
                        </div>

                        <div className="grid mt-5">
                            {
                                !isLoad ? (
                                    listNovels.length > 0 ? (
                                        <>
                                            <div className="grid gap-6 md:grid-cols-2 grid-cols-1 px-4 mb-4">
                                                {listNovels.map((novel) => {
                                                    return (
                                                        <Fragment key={novel.novelId}>
                                                            <ItemNovel
                                                                novel={novel}
                                                                isAuthor={true}
                                                                isChapterCount={true}
                                                            />
                                                        </Fragment>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex justify-center my-5">
                                                <PaginationLayout
                                                    countPage={countPage}
                                                    currentPage={currentPage}
                                                    handleChangePage={handleNextPage}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="px-4">Không có truyện nào</div>
                                    )   
                                ) : (
                                    <div className="grid gap-6 md:grid-cols-2 grid-cols-1 px-4">
                                        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((index) => (
                                            <ItemNovelLazy key={index} />
                                        ))}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>

                <ClientOnly>
                    <div className="w-full px-4">
    
                        <AdsenseForm />
    
                    </div>
                </ClientOnly>
                
            </WrapperLayout>
        </>
    );
};
export default SearchNovel;

export const getServerSideProps = async (
    context: any
) => {
    const { query } = context;    

    try {
        return {
            props: {
                queryPage: query
            },
        };
    } catch (error) {
        return { notFound: true };
    }
};

SearchNovel.getLayout = (page: ReactNode) => {
    return (
        <MainLayout isBannerPage={false} autoHidden={false}>
            {page}
        </MainLayout>
    );
};
