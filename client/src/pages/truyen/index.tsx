import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Fragment, ReactNode, useEffect, useRef, useState } from "react";

import useSWR from "swr";
import Select from "react-select";
import LazyLoad from "react-lazy-load";
import { ParsedUrlQuery } from "querystring";

import { NovelResType, NovelType } from "@/types";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { useMediaQuery } from "usehooks-ts";
import MainLayout from "@/components/Layout/MainLayout";
import { PROPERTIES_NOVEL } from "@/constants/data";
import { iconAuthor, iconClose, iconList } from "../../../public/icons";
import { advancedSearchNovelHandle } from "@/services/novels.services";
import BlurImage from "@/components/Layout/BlurImage";
import { placeholderBlurhash } from "@/constants";
import { PaginationLayout } from "@/components/Layout/PaginationLayout";
import { LoadingForm } from "@/components/Layout/LoadingLayout";

type querySearchNovelTypes = {
    [key: string]: number[]
};

interface querySearchNovelProps extends querySearchNovelTypes {
    genres: number[]
    status: number[]
    personality: number[]
    scene: number[]
    classify: number[]
    viewFrame: number[]
}

interface AdvencedSearchNovelPageProps {
    query: querySearchNovelProps
    sortBy: string
    novels?: NovelResType[]
    test?: any
    currentPage: number
    countPage: number
}

const optionsSortByNew = [
    { label: "Mới cập nhật", value: "Mới cập nhật", id: 'novel_new'},
    { label: "Mới đăng", value: "Mới đăng", id: 'chapter_new'},
]
const optionsSortByRating = [
    { label: "Lượt đánh giá", value: "Lượt đánh giá", id: 'review_count'},
    { label: "Điểm đánh giá", value: "Điểm đánh giá", id: 'review_score'},
]

const AdvencedSearchNovelPage = ({ query, novels, sortBy, currentPage, countPage } : AdvencedSearchNovelPageProps) => {
    const router = useRouter()
    const matchesMobile = useMediaQuery("(max-width: 640px)");

    const [querySearchNovel, setQuerySearchNovel] = useState<querySearchNovelProps>(query)

    // Handle Add Query Novel
    const handleAddQuerySearch = (key: keyof querySearchNovelProps, data: number) => {
        setQuerySearchNovel(value => ({
            ...value,
            [key]: [...value[key], data]
        }));
    }
    // Handle Delete Query Novel
    const handleDeleteQuerySearch = (key: keyof querySearchNovelProps, data: number) => {
        setQuerySearchNovel(value => ({
            ...value,
            [key]: value[key].filter(index => index !== data) 
        }));
    }

    // Get List Check Query
    const listCheckQuery = Object.keys(querySearchNovel).map((key, indexParent) => (
        <Fragment key={indexParent}>
            {querySearchNovel[key].map((item, indexChild) => (
                <li
                    onClick={() => handleDeleteQuerySearch(key, item)}
                    key={indexChild}
                    className="flex items-center whitespace-nowrap cursor-pointer text-[12px] px-2 border border-[#666] rounded-[3px] bg-[#666] text-white select-none"
                >
                    {PROPERTIES_NOVEL[key][item-1].value}
                    <i className="w-3 ml-1 block fill-white">{iconClose}</i>
                </li>
            ))}
        </Fragment>
    ));

    // Next Page
    const handleNextPage = ({ optionSort, page } :  { optionSort?: string, page?: string }) => {

        const queryString = new URLSearchParams(querySearchNovel as any);

        
        const queryR = `/truyen?sort_by=${optionSort || sortBy}&page=${page || currentPage}&${queryString}`
        
        router.push(queryR);
    }

    useEffect(() => {
        setQuerySearchNovel(query)
    }, [query])

    // Change Page
    const handlePageChange = (page : number) => {
        handleNextPage({ page: String(page) })
    };


    const { data: novelsQuery } = useSWR<{ novels: NovelResType[], countPage: number }>(
        `?page=1`,
        async (queryH) => {

            const queryString = new URLSearchParams(querySearchNovel as any);
            const queryR = `sort_by=${sortBy}&page=${currentPage}&${queryString}`
            
            const getNovels = await advancedSearchNovelHandle(queryR || '')

            if (!getNovels.success || !getNovels) {
                throw new Error();
            }

            return {
                novels: getNovels.novels,
                countPage: getNovels.countPage
            };
        },
        {
            onErrorRetry: (error, _, __, revalidate, { retryCount }) => {
                if (error.status === 404) {
                    return;
                }
                if (retryCount >= 1) {
                    return;
                }
                setTimeout(() => {
                    revalidate({ retryCount });
                }, 2000);
            },
        }
    );

    console.log(novelsQuery?.novels)

    const getLayout = (page: ReactNode) => {
        return <MainLayout autoHidden={false} isBannerPage={!matchesMobile}>{page}</MainLayout>;
    };
    return getLayout(
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <WrapperLayout className="pt-5 max-lg:max-w-3xl">
                    <div className="-mx-4">
                        <div className="lg:flex">
                            <div className="w-3/12 px-4 max-lg:hidden">
                                <div className="-mx-4">
                                    <div className="px-4">
                                        <h4 className="mb-2 font-semibold">Đã chọn</h4>
                                        <ul className="flex flex-wrap gap-1">
                                            {listCheckQuery}
                                        </ul>
                                    </div>
                                    <div className="py-4 px-4 border-b">
                                        <h4 className="mb-2 font-semibold">Thể loại</h4>
                                        <ul className="flex flex-wrap gap-2">
                                            {PROPERTIES_NOVEL.genres.map((item, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        {
                                                            querySearchNovel.genres.includes(item.id) ? (
                                                                <li onClick={() => handleDeleteQuerySearch('genres', item.id)} 
                                                                    className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value} <i className="w-3 ml-1 block fill-white">{iconClose}</i></li>
                                                            ) : (
                                                                <li onClick={() => handleAddQuerySearch('genres', item.id)} 
                                                                    className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value}</li>
                                                            )
                                                        }
                                                    </Fragment>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div className="py-4 px-4 border-b">
                                        <h4 className="mb-2 font-semibold">Tình trạng</h4>
                                        <ul className="flex flex-wrap gap-2">
                                            {PROPERTIES_NOVEL.status.map((item, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        {
                                                            querySearchNovel.status.includes(item.id) ? (
                                                                <li onClick={() => handleDeleteQuerySearch('status', item.id)} 
                                                                    className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value} <i className="w-3 ml-1 block fill-white">{iconClose}</i></li>
                                                            ) : (
                                                                <li onClick={() => handleAddQuerySearch('status', item.id)} 
                                                                    className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value}</li>
                                                            )
                                                        }
                                                    </Fragment>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div className="py-4 px-4 border-b">
                                        <h4 className="mb-2 font-semibold">Tính cách nhân vật chính</h4>
                                        <ul className="flex flex-wrap gap-2">
                                            {PROPERTIES_NOVEL.personality.map((item, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        {
                                                            querySearchNovel.personality.includes(item.id) ? (
                                                                <li onClick={() => handleDeleteQuerySearch('personality', item.id)} 
                                                                    className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value} <i className="w-3 ml-1 block fill-white">{iconClose}</i></li>
                                                            ) : (
                                                                <li onClick={() => handleAddQuerySearch('personality', item.id)} 
                                                                    className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value}</li>
                                                            )
                                                        }
                                                    </Fragment>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div className="py-4 px-4 border-b">
                                        <h4 className="mb-2 font-semibold">Bối cảnh thế giới</h4>
                                        <ul className="flex flex-wrap gap-2">
                                            {PROPERTIES_NOVEL.scene.map((item, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        {
                                                            querySearchNovel.scene.includes(item.id) ? (
                                                                <li onClick={() => handleDeleteQuerySearch('scene', item.id)} 
                                                                    className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value} <i className="w-3 ml-1 block fill-white">{iconClose}</i></li>
                                                            ) : (
                                                                <li onClick={() => handleAddQuerySearch('scene', item.id)} 
                                                                    className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value}</li>
                                                            )
                                                        }
                                                    </Fragment>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div className="py-4 px-4 border-b">
                                        <h4 className="mb-2 font-semibold">Lưu phái</h4>
                                        <ul className="flex flex-wrap gap-2">
                                            {PROPERTIES_NOVEL.classify.map((item, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        {
                                                            querySearchNovel.classify.includes(item.id) ? (
                                                                <li onClick={() => handleDeleteQuerySearch('classify', item.id)} 
                                                                    className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value} <i className="w-3 ml-1 block fill-white">{iconClose}</i></li>
                                                            ) : (
                                                                <li onClick={() => handleAddQuerySearch('classify', item.id)} 
                                                                    className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value}</li>
                                                            )
                                                        }
                                                    </Fragment>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div className="py-4 px-4 border-b">
                                        <h4 className="mb-2 font-semibold">Thị giác</h4>
                                        <ul className="flex flex-wrap gap-2">
                                            {PROPERTIES_NOVEL.viewFrame.map((item, index) => {
                                                return (
                                                    <Fragment key={index}>
                                                        {
                                                            querySearchNovel.viewFrame.includes(item.id) ? (
                                                                <li onClick={() => handleDeleteQuerySearch('viewFrame', item.id)} 
                                                                    className={`bg-[#666] text-white flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value} <i className="w-3 ml-1 block fill-white">{iconClose}</i></li>
                                                            ) : (
                                                                <li onClick={() => handleAddQuerySearch('viewFrame', item.id)} 
                                                                    className={`hover:bg-gray-800/25 flex items-center whitespace-nowrap cursor-pointer text-[12px] py-1 px-2 border border-[#666] rounded-[3px] select-none`}
                                                                >{item.value}</li>
                                                            )
                                                        }
                                                    </Fragment>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div className="py-4 px-4 border-b">
                                        <button className="border bg-green-600 py-2 px-3 text-white rounded-md text-sm" onClick={() => handleNextPage({})}>Tìm kiếm</button>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-9/12 px-4">

                                <div className="-mx-4">
                                    <div className={`flex h-9 gap-2 ml-2 items-center top-0 left-0`}>
                                        
                                        <Select
                                            isSearchable={false}
                                            defaultValue={optionsSortByNew[0]}
                                            className="text-sm font-semibold"
                                            options={optionsSortByNew}
                                            
                                            styles={{
                                                control: (provided, state) => ({
                                                    ...provided,
                                                    outline: "none",
                                                    boxShadow: "none",
                                                    border: "none",
                                                    borderRadius: "0px",
                                                    height: "32px",
                                                    cursor: "pointer"
                                                }),
                                            }}
                                            onChange={(select: any) =>handleNextPage(select.id)}
                                        />
                                        <Select
                                            isSearchable={false}
                                            defaultValue={optionsSortByRating[0]}
                                            className="text-sm font-semibold"
                                            options={optionsSortByRating}
                                            styles={{
                                                control: (provided, state) => ({
                                                    ...provided,
                                                    outline: "none",
                                                    boxShadow: "none",
                                                    border: "none",
                                                    borderRadius: "0px",
                                                    height: "32px",
                                                    cursor: "pointer"
                                                }),
                                            }}
                                            onChange={(select: any) =>handleNextPage(select.id)}
                                        />
    
                                        <button className={`p-1 text-sm font-semibold rounded-sm px-2 ${sortBy === 'follow_count' ? 'bg-gray-200' : ''}`} onClick={() => handleNextPage({ optionSort: 'follow_count' })}>Theo dõi</button>
                                        <button className={`p-1 text-sm font-semibold rounded-sm px-2 ${sortBy === 'comment_count' ? 'bg-gray-200' : ''}`} onClick={() => handleNextPage({ optionSort: 'comment_count' })}>Bình luận</button>
                                        <button className={`p-1 text-sm font-semibold rounded-sm px-2 ${sortBy === 'chapter_count' ? 'bg-gray-200' : ''}`} onClick={() => handleNextPage({ optionSort: 'chapter_count' })}>Số chương</button>
                                        
    
                                    </div>
                                    
                                    <div className="mt-5">

                                        {
                                            novelsQuery ? (
                                                novelsQuery.novels.length > 0 ? (
                                                    <>
                                                        <div className="grid md:grid-cols-2 grid-cols-1">
                                                            {
                                                                novelsQuery.novels.map((novel) => {
                                                                    return (
                                                                        
                                                                        <div key={novel.novelId} className="px-4">
                                                                            <div className="flex py-4 border-b">
                                                                                <Link href={`/truyen/${novel.slug}`} className="">
                                                                                    <LazyLoad className="relative w-20 h-28 overflow-hidden shadow">
                                                                                        <BlurImage
                                                                                            width={85}
                                                                                            height={125}
                                                                                            alt="image-demo"
                                                                                            blurDataURL={novel.imageBlurHash || placeholderBlurhash}
                                                                                            className="group-hover:scale-105 group-hover:duration-500 object-cover h-full w-full"
                                                                                            placeholder="blur"
                                                                                            src={novel.thumbnailUrl}
                                                                                        />
                                                                                    </LazyLoad>
                                                                                </Link>
                                                                                <div className="flex-1 ml-3">
                                                                                    <h2 className="mb-2 text-base line-clamp-1 font-semibold">
                                                                                        <Link className="block" href={`/truyen/${novel.slug}`}>{novel.title}</Link>
                                                                                    </h2>
                                                                                    <div className="line-clamp-2 text-sm mb-2 text-slate-900">
                                                                                        {novel.description && novel?.description.replace(/<[^>]+>/g, '')}
                                                                                    </div>
                                                                                    <div className="text-base flex align-middle items-center justify-between">
                                                                                        <span className="flex items-center max-w-[55%] text-sm mr-1">
                                                                                            <i className="w-4 h-4 block mr-1 mb-1">{iconAuthor}</i> <span className="line-clamp-1 align-middle">{novel.author}</span>
                                                                                        </span>
                                                                                        <span className="px-2 text-xs text-orange-700 line-clamp-1 align-middle text-center border border-orange-700">
                                                                                            {(novel.category >=1 && novel.category <=11) ? PROPERTIES_NOVEL['genres'][novel?.category-1].value : PROPERTIES_NOVEL['genres'][0].value}
                                                                                        </span>
                                                                                    </div>
                                                                                    <span className="text-sm flex items-center">
                                                                                        <i className="w-3 block mr-2">{iconList}</i> {novel.chapterCount} chương
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
            
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <div className="flex justify-center my-5">
                                                            <PaginationLayout countPage={novelsQuery.countPage} currentPage={currentPage} handleChangePage={handlePageChange}/>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div>Không có truyện</div>
                                                )
                                            ) : (
                                                <LoadingForm />
                                            )
                                            
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </WrapperLayout>
            </main>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { genres, status, personality, scene, classify, viewFrame, sort_by = 'novel_new', page = '1' } = context.query;

        const realGenres = genres ? String(genres).split(',').map((genres) => Number(genres)) : []
        const realStatus = status ? String(status).split(',').map((status) => Number(status)) : []
        const realPersonality = personality ? String(personality).split(',').map((personality) => Number(personality)) : []
        const realScene = scene ? String(scene).split(',').map((scene) => Number(scene)) : []
        const realClassify = classify ? String(classify).split(',').map((classify) => Number(classify)) : []
        const realViewFrame = viewFrame ? String(viewFrame).split(',').map((viewFrame) => Number(viewFrame)) : []

        if(!sort_by) {
            context.query['sort_by'] = 'novel_new'
        }

        // const query = context.query as Record<string, string>;
        // const queryString = new URLSearchParams(query).toString();
        // const getNovels = await advancedSearchNovelHandle(queryString || '')

        // if(!getNovels.success) {
        //     return {
        //         props: {
        //             query: {
        //                 genres: realGenres,
        //                 status: realStatus,
        //                 personality: realPersonality,
        //                 scene: realScene,
        //                 classify: realClassify,
        //                 viewFrame: realViewFrame,
        //             },
        //             novels: [],
        //             sortBy: sort_by || 'novel_new',
        //             currentPage: String(page) || '1',
        //         },
        //     };
        // }
        
        return {
            props: {
                query: {
                    genres: realGenres,
                    status: realStatus,
                    personality: realPersonality,
                    scene: realScene,
                    classify: realClassify,
                    viewFrame: realViewFrame,
                },
                sortBy: sort_by || 'novel_new',
                // novels: getNovels?.novels || [],
                currentPage: Number(page) || 1,
                // countPage: getNovels.countPage
            },
        };
    } catch (error) {
        return { notFound: true };
    }
};



export default AdvencedSearchNovelPage;




// {
//     aaa: '1,5,2,2',
//     bbb: '7'
// }

