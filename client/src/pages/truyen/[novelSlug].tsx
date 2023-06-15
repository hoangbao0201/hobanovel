import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";
import {
    GetServerSideProps, GetStaticPaths, GetStaticProps, GetStaticPropsContext
} from "next";

import Tippy from "@tippyjs/react";

import { NovelBySlugType, NovelFollowerType } from "@/types";
import { ParsedUrlQuery } from "querystring";
import { REVALIDATE_TIME, placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Layout/BlurImage";
import MainLayout from "@/components/Layout/MainLayout";
import { getNovelBySlugHandle } from "@/services/novels.services";
import { iconAuthor, iconClose, iconHeartFull } from "../../../public/icons";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { Tab, Transition } from "@headlessui/react";
import { convertViewsCount } from "@/utils/convertViewsCount";
import { ListStarLayout } from "@/components/Layout/ListStarLayout";
import { useMediaQuery } from "usehooks-ts";
import { getAccessToken } from "@/services/cookies.servies";
import { checkFollowNovelHandle, followNovelHandle, unfollowNovelHandle } from "@/services/follow.services";
import { useSelector } from "react-redux";
import { convertTime } from "@/utils/convertTime";
import { LoadingButton } from "@/components/Layout/LoadingLayout";
import { PROPERTIES_NOVEL } from "@/constants/data";
import Head from "@/components/Share/Head";

// import FormIntroduce from "@/components/Share/ContentNovelDetail/FormIntroduce";
// import FormFeedback from "@/components/Share/ContentNovelDetail/FormFeedback";
// import FormListChapters from "@/components/Share/ContentNovelDetail/FormListChapters";
// import FormComment from "@/components/Share/ContentNovelDetail/FormComment";

const FormIntroduce = dynamic(
    () => import("../../components/Share/ContentNovelDetail/FormIntroduce", {
        ssr: false,
    } as ImportCallOptions)
)
const FormFeedback = dynamic(
    () => import("../../components/Share/ContentNovelDetail/FormFeedback", {
        ssr: false,
    } as ImportCallOptions)
)
const FormListChapters = dynamic(
    () => import("../../components/Share/ContentNovelDetail/FormListChapters", {
        ssr: false,
    } as ImportCallOptions)
)
const FormComment = dynamic(
    () => import("../../components/Share/ContentNovelDetail/FormComment", {
        ssr: false,
    } as ImportCallOptions)
)


interface Params extends ParsedUrlQuery {
    novelSlug: string;
}

export interface NovelDetailPageProps {
    token?: any
    tab?: string;
    novel?: NovelBySlugType;
}

const NovelDetailPage = ({ token, tab, novel }: NovelDetailPageProps) => {

    const matchesMobile = useMediaQuery('(max-width: 640px)')

    const [numberTab, setNumberTab] = useState(0);
    const [isFollow, setIsFollow] = useState<null | boolean>(null)
    const { isAuthenticated, currentUser, userLoading } = useSelector((state: any) => state.user);

    // Handle Check Follow
    const handleCheckFollowNovel = async () => {
        const token = getAccessToken();
        if(!token || !novel?.novelId) {
            console.log("Chưa đủ thông tin")
            return
        }
        try {
            const query = `${novel?.novelId}?token=${token}`
            const checkFollowRes = await checkFollowNovelHandle(query);

            console.log(checkFollowRes)

            if(checkFollowRes.success) {
                setIsFollow(checkFollowRes.isFollow)

                return
            }

            setIsFollow(false)
        } catch (error) {
            console.log(error)
            setIsFollow(false)
        }
    }

    useEffect(() => {
        if(!userLoading) {
            if(isAuthenticated) {
                handleCheckFollowNovel()
            }
            else {
                setIsFollow(false);
            }
        }
    }, [novel])

    // Handle follow
    const handleFollowNovel = async () => {
        const token = getAccessToken()
        if(!token || !novel?.novelId) {
            console.log("Không có token")
            return
        }
        if(!isAuthenticated) {
            console.log("Chưa đăng nhập")
            return;
        }
        try {
            const dataFollowNovel = {
                userId: currentUser.userId,
                novelId: novel.novelId,
                token: token
            }
            const followNovelRes = await followNovelHandle(dataFollowNovel as Pick<NovelFollowerType , 'novelId'> & { token: string });
            if(followNovelRes?.success) {
                setIsFollow(true)
                return
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    // Handle Unfollow
    const handleUnfollowNovel = async () => {
        const token = getAccessToken()
        if(!token || !novel?.novelId) {
            console.log("Không có token")
            return
        }
        if(!isAuthenticated) {
            console.log("Chưa đăng nhập")
            return;
        }
        try {
            const dataFollowNovel = {
                userId: currentUser.userId,
                novelId: novel.novelId,
                token: token
            }
            const followNovelRes = await unfollowNovelHandle(dataFollowNovel as Pick<NovelFollowerType , 'novelId'> & { token: string });
            if(followNovelRes?.success) {
                setIsFollow(false)
                return
            }

        } catch (error) {
            console.log(error)
        }
    }


    const getLayout = (page : ReactNode) => {
        return <MainLayout isBannerPage={!matchesMobile}>{page}</MainLayout>;
    };

    if (!novel) {
        return <div></div>;
    }
    
    return (
        getLayout(
            <>
                <Head title={`${novel.title} [Tới Chap ${novel.chapterCount}] Tiếng Việt - HobaNovel`}/>
                <main>
                    <WrapperLayout className="pt-5 max-lg:max-w-3xl">
                        <div className="-mx-4">
                            <article className="mb-6 px-4">
                                {/* <h1 className="lg:mb-6 sm:text-xl sm:hidden text-xl sm:line-clamp-2 font-semibold mb-1 uppercase text-center">{novel.title}</h1>
                                <time className="sm:hidden block text-center align-middle mb-4 italic text-gray-600 font-normal text-sm">[Tạo lúc {convertTime(novel.createdAt)}]</time> */}

                                <div className="sm:flex -mx-4">
                                    <div className={`sm:w-3/12 w-full max-sm:mb-6 px-4 text-center justify-center`}>
                                        <BlurImage
                                            width={208}
                                            height={280}
                                            alt="image-demo"
                                            blurDataURL={novel.imageBlurHash || placeholderBlurhash}
                                            className="group-hover:scale-105 group-hover:duration-500 max-sm:mx-auto object-cover shadow"
                                            placeholder="blur"
                                            src={novel.thumbnailUrl}
                                        />
                                    </div>
                                    <div className="sm:w-9/12 max-sm:mx-auto px-4">
                                        <h1 className="sm:text-xl text-base  line-clamp-2 font-semibold uppercase mb-3 max-sm:text-center">{novel.title}</h1>

                                        <div className="sm:hidden mb-3 flex items-center max-sm:justify-center">
                                            <i className="w-4 h-4 mr-2 block">{iconAuthor}</i>
                                            <h1>{novel.author}</h1>
                                        </div>

                                        {/* <ul className="sm:hidden">
                                            <li className="flex mb-2">
                                                <p className="w-4/12">Tác giả:</p>
                                                <h2 className="w-8/12">{novel.author}</h2>
                                            </li>
                                            <li className="flex mb-2">
                                                <p className="w-4/12">Chương:</p>
                                                <h2 className="w-8/12">{novel.chapterCount}</h2>
                                            </li>
                                            <li className="flex mb-2">
                                                <p className="w-4/12">Theo dõi:</p>
                                                <h2 className="w-8/12">Đang cập nhập</h2>
                                            </li>
                                            <li className="flex mb-2">
                                                <p className="w-4/12">Chương/tuần:</p>
                                                <h2 className="w-8/12">{novel.newChapterCount}</h2>
                                            </li>
                                            <li className="flex mb-2">
                                                <p className="w-4/12">Lượt xem:</p>
                                                <h2 className="w-8/12">{convertViewsCount(novel.views)}</h2>
                                            </li>
                                            <li className="flex mb-2">
                                                <p className="w-4/12">Thế loại:</p>
                                                <div className="w-8/12 flex items-center flex-wrap gap-2 text-sm mb-4">
                                                    <h2 className="border-[#bf2c24] text-[#bf2c24] px-2 text-sm border rounded-md">
                                                        {novel.newChapterCount > 0
                                                            ? "Đang ra"
                                                            : "Chưa ra chương mới"}
                                                    </h2>
                                                    {novel.category && (
                                                        <h2 className="border-[#b78a28] text-[#b78a28] px-2 text-sm border rounded-md">
                                                            {PROPERTIES_NOVEL['genres'][novel.category-1].value}
                                                        </h2>
                                                    )}
                                                    {novel.personality && (
                                                        <h2 className="border-[#088860] text-[#088860] px-2 text-sm border rounded-md">
                                                            {PROPERTIES_NOVEL['personality'][novel.personality-1].value}
                                                        </h2>
                                                    )}
                                                    {novel.scene && (
                                                        <h2 className="border-[#088860] text-[#088860] px-2 text-sm border rounded-md">
                                                            {PROPERTIES_NOVEL['scene'][novel.scene-1].value}
                                                        </h2>
                                                    )}
                                                    {novel.classify && (
                                                        <h2 className="border-[#088860] text-[#088860] px-2 text-sm border rounded-md">
                                                            {PROPERTIES_NOVEL['classify'][novel.classify-1].value}
                                                        </h2>
                                                    )}
                                                    {novel.viewFrame && (
                                                        <h2 className="border-[#088860] text-[#088860] px-2 text-sm border rounded-md">
                                                            {PROPERTIES_NOVEL['viewFrame'][novel.viewFrame-1].value}
                                                        </h2>
                                                    )}
                                                </div>
                                            </li>
                                        </ul> */}

                                        <div className="flex items-center flex-wrap gap-2 sm:text-sm text-xs mb-4 max-sm:justify-center">
                                            {novel.author && (
                                                <div className="border-[#666] text-[#666] px-3 py-1 border rounded-full ">
                                                    {novel.author}
                                                </div>
                                            )}
                                            <div className="border-[#bf2c24] text-[#bf2c24] px-3 py-1 border rounded-full ">
                                                {novel.newChapterCount > 0
                                                    ? "Đang ra"
                                                    : "Chưa ra chương mới"}
                                            </div>
                                            {novel.category && (
                                                <div className="border-[#b78a28] text-[#b78a28] px-3 py-1 border rounded-full ">
                                                    {PROPERTIES_NOVEL['genres'][novel.category-1].value}
                                                </div>
                                            )}
                                            {novel.personality && (
                                                <div className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                                                    {PROPERTIES_NOVEL['personality'][novel.personality-1].value}
                                                </div>
                                            )}
                                            {novel.scene && (
                                                <div className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                                                    {PROPERTIES_NOVEL['scene'][novel.scene-1].value}
                                                </div>
                                            )}
                                            {novel.classify && (
                                                <div className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                                                    {PROPERTIES_NOVEL['classify'][novel.classify-1].value}
                                                </div>
                                            )}
                                            {novel.viewFrame && (
                                                <div className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                                                    {PROPERTIES_NOVEL['viewFrame'][novel.viewFrame-1].value}
                                                </div>
                                            )}
                                        </div>

                                        <div className="max-sm:hidden flex gap-9 mb-4">
                                            <div className="text-center">
                                                <span className="font-semibold">
                                                    {novel.chapterCount || 0}
                                                </span>
                                                <div className="text-base">Chương</div> 
                                            </div>
                                            <div className="text-center">
                                                <span className="font-semibold">
                                                    {novel.newChapterCount || 0}
                                                </span>
                                                <div className="text-base">Chương/tuần</div>
                                            </div>
                                                <Tippy
                                                    theme="light"
                                                    arrow={true}
                                                    delay={[500,0]}
                                                    content={novel.views}
                                                >
                                                    <div className="text-center cursor-default">
                                                        <span className="font-semibold">
                                                            {convertViewsCount(novel.views)}
                                                        </span>
                                                        <div className="text-base">Lượt đọc</div>
                                                    </div>
                                                </Tippy>
                                            <div className="text-center">
                                                <span className="font-semibold">818</span>
                                                <div className="text-base">Cất giữ</div>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <ListStarLayout size={matchesMobile ? 3 : 4} className="mb-4" numb={novel.mediumScore} />
                                            <span className="text-sm">
                                                {novel.mediumScore}
                                                <span className="text-xs">({10} đánh giá)</span>
                                            </span>
                                        </div>
                                        
                                        <button onClick={isFollow ? handleUnfollowNovel : handleFollowNovel}
                                            className={`btn text-white mb-2
                                                ${ isFollow === null || (
                                                    isFollow ? 'bg-[#d9534f] border-[#d9534f]  hover:bg-[#ac2925]' : 'bg-[#5cb85c] border-[#449d44] hover:bg-[#449d44]'
                                                )}
                                            `}
                                        >
                                            
                                            <>
                                                <i className="w-3 block fill-white sm:mr-1">
                                                    {isFollow === null ? (
                                                        <LoadingButton className="text-white"/>
                                                    ) : (
                                                        isFollow ? iconClose : iconHeartFull
                                                    )}
                                                </i>
                                                <span className="text-white text-sm whitespace-nowrap">Theo dõi</span>
                                            </>
                                        </button>
                                        <div className="lg:text-base text-sm flex gap-2">
                                            <Link className="btn bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white" href={`/truyen/${novel.slug}/chuong-1`}>
                                                Đọc từ đầu
                                            </Link>

                                            <Link className="btn bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white" href={`/truyen/${novel.slug}/chuong-${novel?.chapterRead || 1}`}>
                                                Đọc tiếp
                                            </Link>

                                            <Link className="btn bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white" href={`/truyen/${novel.slug}/chuong-${novel?.chapterCount || 1}`}>
                                                Đọc mới nhất
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </article>
                                
    
                            <div className="mb-5">
                                <Tab.Group
                                    defaultIndex={0}
                                    selectedIndex={numberTab}
                                    onChange={(index: number) => setNumberTab(index)}
                                >
                                    <Tab.List className={`border-b mb-3 text-base font-semibold sm:px-4 max-sm:grid max-sm:grid-cols-4`}>
                                        <Tab
                                            className={`outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                                numberTab == 0 && "border-yellow-600"
                                            }`}
                                        >
                                            Giới thiệu
                                        </Tab>
                                        <Tab
                                            className={`outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                                numberTab == 1 && "border-yellow-600"
                                            }`}
                                        >
                                            Đánh giá
                                        </Tab>
                                        <Tab
                                            className={`outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                                numberTab == 2 && "border-yellow-600"
                                            }`}
                                        >
                                            D.s chương
                                        </Tab>
                                        <Tab
                                            className={`outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                                numberTab == 3 && "border-yellow-600"
                                            }`}
                                        >
                                            Bình luận
                                        </Tab>
                                        {
                                            !matchesMobile && (
                                                <Tab
                                                    className={`outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                                        numberTab == 4 && "border-yellow-600"
                                                    }`}
                                                >
                                                    Hâm mộ
                                                </Tab>
                                            )
                                        }
                                    </Tab.List>
                                    <Tab.Panels className="min-h-[400px] px-4">
                                        <Tab.Panel>
                                            <Transition
                                                appear
                                                show={numberTab == 0}
                                                enter="transition-opacity duration-500"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="transition-opacity duration-500"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <FormIntroduce
                                                    description={novel?.description || ""}
                                                />
                                            </Transition>
                                        </Tab.Panel>
                                        <Tab.Panel>
                                            <Transition
                                                appear
                                                show={numberTab == 1}
                                                enter="transition-opacity duration-500"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="transition-opacity duration-500"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <FormFeedback
                                                    tab={numberTab}
                                                    novelId={novel?.novelId}
                                                />
                                            </Transition>
                                        </Tab.Panel>
                                        <Tab.Panel>
                                            <Transition
                                                appear
                                                show={numberTab == 2}
                                                enter="transition-opacity duration-500"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="transition-opacity duration-500"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <FormListChapters tab={numberTab} slug={novel?.slug} />
                                            </Transition>
                                        </Tab.Panel>
                                        <Tab.Panel>
                                            <Transition
                                                appear
                                                show={numberTab == 3}
                                                enter="transition-opacity duration-500"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="transition-opacity duration-500"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <FormComment
                                                    tab={numberTab}
                                                    novelId={novel?.novelId}
                                                />
                                            </Transition>
                                        </Tab.Panel>
                                        {
                                            !matchesMobile && (
                                                <Tab.Panel>
                                                    <Transition
                                                        appear
                                                        show={numberTab == 4}
                                                        enter="transition-opacity duration-500"
                                                        enterFrom="opacity-0"
                                                        enterTo="opacity-100"
                                                        leave="transition-opacity duration-500"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <div>Hâm mộ</div>
                                                    </Transition>
                                                </Tab.Panel>
                                            ) 
                                        }
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>

                        </div>
                    </WrapperLayout>
                </main>
            </>
        )
    );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     try {
//         const { novelSlug } = context.params as Params;
//         // const token = getAccessTokenOnServer(context.req.headers.cookie as string)

//         const novelResponse = await getNovelBySlugHandle(novelSlug as string);

//         if(!novelResponse) {
//             return { notFound: true };
//         }

//         return {
//             props: {
//                 novel: JSON.parse(JSON.stringify(novelResponse.data?.novel)),
//                 tab: context.params?.hash?.toString() || "intro",
//             },
//         };
//     } catch (error) {
//         return { notFound: true };
//     }
// };

export const getStaticProps: GetStaticProps<NovelDetailPageProps, Params> = async (
    context: GetStaticPropsContext<Params>
) => {
    try {
        const { novelSlug } = context.params as Params;

        const novelResponse = await getNovelBySlugHandle(novelSlug as string);

        if (!novelResponse) {
            return { notFound: true, props: { novel: null, tab: "intro" } };
        }


        return {
            props: {
                novel: novelResponse?.data.novel || null,
                tab: context.params?.hash?.toString() || "intro",
            },
            revalidate: REVALIDATE_TIME,
        };

    } catch (error) {
        return { notFound: true, props: { novel: null, tab: "intro" } };
    }
};
export const getStaticPaths: GetStaticPaths<Params> = () => {
    return {
        paths: [],
        fallback: true,
    };
};

// NovelDetailPage.getLayout = (page: ReactNode) => {
//     // const matchesMobile = useMediaQuery('(max-width: 640px)')

//     return <MainLayout isBannerPage={true}>{page}</MainLayout>;
// };

export default NovelDetailPage;

