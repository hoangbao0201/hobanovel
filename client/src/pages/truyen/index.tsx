import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps, NextPage } from "next";
import { Fragment, ReactNode, useEffect, useRef, useState } from "react";

import Select from "react-select";

import { NovelType } from "@/types";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { useMediaQuery } from "usehooks-ts";
import MainLayout from "@/components/Layout/MainLayout";
import { PROPERTIES_NOVEL } from "@/constants/data";
import { iconAuthor, iconClose, iconList } from "../../../public/icons";
import { advancedSearchNovelHandle } from "@/services/novels.services";
import BlurImage from "@/components/Layout/BlurImage";
import { placeholderBlurhash } from "@/constants";

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
    novels: any
    test: any
}

const optionsSortByNew = [
    { label: "Mới cập nhật", value: "Mới cập nhật", id: 'novel_new'},
    { label: "Mới đăng", value: "Mới đăng", id: 'chapter_new'},
]
const optionsSortByRating = [
    { label: "Lượt đánh giá", value: "Lượt đánh giá", id: 'review_count'},
    { label: "Điểm đánh giá", value: "Điểm đánh giá", id: 'review_score'},
]

const AdvencedSearchNovelPage = ({ query, novels, sortBy } : AdvencedSearchNovelPageProps) => {
    const router = useRouter()
    // const paginationRef = useRef<HTMLDivElement>(null)
    // const paginationFakeRef = useRef<HTMLDivElement>(null)
    const matchesMobile = useMediaQuery("(max-width: 640px)");

    const [querySearchNovel, setQuerySearchNovel] = useState<querySearchNovelProps>(query)
    const [checkOptionsSortNovel, setCheckOptionsSortNovel] = useState(sortBy)
    // const [isFixed, setIsFixed] = useState(false);

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
    const handleNextPage = () => {
        // const queryString = Object.entries(querySearchNovel)
        //     .filter(([key, value]) => value.length > 0)
        //     .map(([key, value]) => `${key}=${value.map((v, index) => encodeURIComponent(v)).join('%2C')}`)
        //     .join('&');

        const queryString = new URLSearchParams(querySearchNovel as any);

        const query = `/truyen?sort_by=${checkOptionsSortNovel}&${queryString}`

        router.push(query);
    }

    // Change Position
    // useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
    //         if(paginationRef.current && paginationFakeRef.current) {
    //             const targetNavPosition = paginationRef?.current?.offsetTop;
    //             const targetNavFakePosition = paginationFakeRef?.current?.offsetTop;

    //             if(targetNavFakePosition === 0 && scrollPosition>targetNavPosition) {
    //                 setIsFixed(true);
    //             }
    //             else if(targetNavFakePosition !== 0 && scrollPosition<targetNavFakePosition) {
    //                 setIsFixed(false)
    //             }
    //         }
    //     };

    //     window.addEventListener("scroll", handleScroll);

    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };
    // }, []);

    console.log(checkOptionsSortNovel)

    //  -----

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
                    <div>
                        <div className="sm:px-4 lg:flex">
                            <div className="w-3/12">
                                <div>
                                    <h4 className="mb-2 font-semibold">Đã chọn</h4>
                                    <ul className="flex flex-wrap gap-1">
                                        {listCheckQuery}
                                    </ul>
                                </div>
                                <div className="py-4 border-b">
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
                                <div className="py-4 border-b">
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
                                <div className="py-4 border-b">
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
                                <div className="py-4 border-b">
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
                                <div className="py-4 border-b">
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
                                <div className="py-4 border-b">
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
                                <div className="py-4 border-b">
                                    <button className="border bg-green-600 py-2 px-3 text-white rounded-md text-sm" onClick={handleNextPage}>Tìm kiếm</button>
                                </div>
                            </div>
                            <div className="w-9/12">

                                <div className={`flex h-9 gap-2 px-4 items-center top-0 left-0`}>
                                    
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
                                        onChange={(select: any) =>setCheckOptionsSortNovel(select.id)}
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
                                        onChange={(select: any) =>setCheckOptionsSortNovel(select.id)}
                                    />

                                    <button className="p-1 text-sm font-semibold" onClick={() => setCheckOptionsSortNovel('follow_count')}>Theo dõi</button>
                                    {/* <button className="p-1 text-sm font-semibold" onClick={() => setCheckOptionsSortNovel('')}>Yêu thích</button> */}
                                    <button className="p-1 text-sm font-semibold" onClick={() => setCheckOptionsSortNovel('comment_count')}>Bình luận</button>
                                    <button className="p-1 text-sm font-semibold" onClick={() => setCheckOptionsSortNovel('chapter_count')}>Số chương</button>
                                    

                                    <button className="ml-auto border bg-green-600 py-2 px-3 text-white rounded-md text-sm" onClick={handleNextPage}>Tìm kiếm</button>
                                </div>

                                <div className="grid grid-cols-2 mt-5">
                                    {   
                                        novels?.length ? (
                                            novels.map((novel : NovelType) => {
                                                return (
                                                    <div key={novel.novelId} className="px-4">
                                                        <div className="flex py-4 border-b">
                                                            <Link href={`/truyen/${novel.slug}`} className="relative w-20 h-28 overflow-hidden shadow">
                                                                <BlurImage
                                                                    width={85}
                                                                    height={125}
                                                                    alt="image-demo"
                                                                    blurDataURL={novel.imageBlurHash || placeholderBlurhash}
                                                                    className="group-hover:scale-105 group-hover:duration-500 object-cover h-full w-full"
                                                                    placeholder="blur"
                                                                    src={novel.thumbnailUrl || "/images/novel-default.png"}
                                                                />
                                                            </Link>
                                                            <div className="flex-1 ml-3">
                                                                <h2 className="mb-2 text-base line-clamp-1 font-semibold">
                                                                    <Link className="block" href={`/truyen/${novel.slug}`}>{novel.title}</Link>
                                                                </h2>
                                                                <div className="line-clamp-2 text-sm mb-2 text-slate-900">{novel.description.replace(/<[^>]+>/g, '')}</div>
                                                                <div className="text-base flex align-middle items-center justify-between">
                                                                    <span className="flex items-center w-[55%] text-sm mr-3">
                                                                        <i className="w-4 block mr-2">{iconAuthor}</i> <span className="line-clamp-1 align-middle">{novel.author}</span>
                                                                    </span>
                                                                    <span className="px-2 text-xs text-orange-700 line-clamp-1 align-middle text-center border border-orange-700">{PROPERTIES_NOVEL['genres'][novel.category-1].value}</span>
                                                                </div>
                                                                <span className="text-sm flex items-center">
                                                                    <i className="w-3 block mr-2">{iconList}</i> {novel.chapterCount} chương
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <div>Không có truyện</div>
                                        )
                                    }
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
        const { genres, status, personality, scene, classify, viewFrame, sort_by } = context.query;

        const realGenres = genres ? String(genres).split(',').map((genres) => Number(genres)) : []
        const realStatus = status ? String(status).split(',').map((status) => Number(status)) : []
        const realPersonality = personality ? String(personality).split(',').map((personality) => Number(personality)) : []
        const realScene = scene ? String(scene).split(',').map((scene) => Number(scene)) : []
        const realClassify = classify ? String(classify).split(',').map((classify) => Number(classify)) : []
        const realViewFrame = viewFrame ? String(viewFrame).split(',').map((viewFrame) => Number(viewFrame)) : []

        // let query = []
        // if(genres) {
        //     query.push(genres)
        // }
        // if(status) {
        //     query.push(status)
        // }
        // if(personality) {
        //     query.push(personality)
        // }
        // if(scene) {
        //     query.push(scene)
        // }
        // if(classify) {
        //     query.push(classify)
        // }
        // if(viewFrame) {
        //     query.push(viewFrame)
        // }
        // const cv = `${context.query}`
        // const queryParams = new URLSearchParams(context.query);
        // const query = `?sort_by=${sort_by ? sort_by : ''}&${Object(context.query)}`

        if(!sort_by) {
            context.query['sort_by'] = 'novel_new'
        }

        const queryString = Object.entries(context.query)
            .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join(',') : value}`)
            .join('&');

        const getNovels = await advancedSearchNovelHandle(queryString || '')

        if(!getNovels.success) {
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
                    novels: [],
                },
            };
        }
        
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
                novels: getNovels?.novels || [],
                test: queryString
            },
        };
    } catch (error) {
        return { notFound: true };
    }
};

// export const getStaticProps: GetStaticProps<AdvencedSearchNovelPage, Params> = async (
//     context: GetStaticPropsContext<Params>
// ) => {
//     try {
//         const { novelSlug } = context.params as Params;

//         const novelResponse = await getNovelBySlugHandle(novelSlug as string);

//         if (!novelResponse) {
//             return { notFound: true, props: { novel: null, tab: "intro" } };
//         }

//         return {
//             props: {
//                 novel: novelResponse?.data.novel || null,
//                 tab: context.params?.hash?.toString() || "intro",
//             },
//             revalidate: REVALIDATE_TIME,
//         };

//     } catch (error) {
//         return { notFound: true, props: { novel: null, tab: "intro" } };
//     }
// };
// export const getStaticPaths: GetStaticPaths<Params> = () => {
//     return {
//         paths: [],
//         fallback: true,
//     };
// };

export default AdvencedSearchNovelPage;




// {
//     aaa: '1,5,2,2',
//     bbb: '7'
// }

