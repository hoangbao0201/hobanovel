import Link from "next/link";
import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";
import {
    GetStaticPaths, GetStaticProps, GetStaticPropsContext
} from "next";

import Tippy from "@tippyjs/react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "usehooks-ts";
import { ParsedUrlQuery } from "querystring";
import { Tab, Transition } from "@headlessui/react";

import { NovelBySlugType, NovelFollowerType } from "@/types";
import { REVALIDATE_TIME_DETAILS_PAGE, placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Layout/BlurImage";
import MainLayout from "@/components/Layout/MainLayout";
import { getNovelBySlugHandle } from "@/services/novels.services";
import { iconAuthor, iconClose, iconHeartFull } from "../../../public/icons";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { convertViewsCount } from "@/utils/convertViewsCount";
import { ListStarLayout } from "@/components/Layout/ListStarLayout";
import { getAccessToken } from "@/services/cookies.servies";
import { checkFollowNovelHandle, followNovelHandle, unfollowNovelHandle } from "@/services/follow.services";
import { LoadingButton } from "@/components/Layout/LoadingLayout";
import { PROPERTIES_NOVEL } from "@/constants/data";
import Head from "@/components/Share/Head";

// import FormIntroduce from "@/components/Share/ContentNovelDetail/FormIntroduce";
// import FormReviews from "@/components/Share/ContentNovelDetail/FormReviews";
// import FormListChapters from "@/components/Share/ContentNovelDetail/FormListChapters";
// import FormComment from "@/components/Share/ContentNovelDetail/FormComment";

const FormIntroduce = dynamic(
    () => import("../../components/Share/ContentNovelDetail/FormIntroduce", {
        ssr: false,
    } as ImportCallOptions)
)
const FormReviews = dynamic(
    () => import("../../components/Share/ContentNovelDetail/FormReviews", {
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
    tab?: string;
    novel?: NovelBySlugType;
}

const NovelDetailPage = ({ novel, tab }: NovelDetailPageProps) => {

    const matchesMobile = useMediaQuery('(max-width: 640px)')

    const [numberTab, setNumberTab] = useState(0);
    const [isFollow, setIsFollow] = useState<null | boolean>(null)
    const { isAuthenticated, currentUser, userLoading } = useSelector((state: any) => state.user);

    // Handle Check Follow
    const handleCheckFollowNovel = async () => {
        const token = getAccessToken();
        if(!token || !novel?.novelId) {
            // console.log("Chưa đủ thông tin")
            return
        }
        try {
            const query = `${novel?.novelId}?token=${token}`
            const checkFollowRes = await checkFollowNovelHandle(query);

            // console.log(checkFollowRes)

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

    if (!novel) {
        return <div></div>;
    }
    
    return (
        <>  
            <Head title={`${novel.title} [Tới Chap ${novel.chapterCount}] Tiếng Việt - HobaNovel`}/>
            <>
                <WrapperLayout className="pt-5 max-lg:max-w-3xl">
                    <div className="-mx-4">
                        <article className="mb-6 px-4">
                            <div className="sm:flex -mx-4">
                                <div className={`sm:w-3/12 w-full max-sm:mb-6 px-4 text-center justify-center`}>
                                    <BlurImage
                                        width={208}
                                        height={280}
                                        alt={`${novel.title}`}
                                        blurDataURL={novel.imageBlurHash || placeholderBlurhash}
                                        className="group-hover:scale-105 group-hover:duration-500 mx-auto object-cover shadow"
                                        placeholder="blur"
                                        src={novel.thumbnailUrl}
                                    />
                                </div>
                                <div className="sm:w-9/12 max-sm:mx-auto px-4">
                                    <h1 className="sm:text-xl text-base  line-clamp-2 font-semibold uppercase mb-3 max-sm:text-center">{novel.title}</h1>

                                    <div className="sm:hidden mb-3 flex items-center max-sm:justify-center">
                                        <i className="w-4 h-4 mr-2 block">{iconAuthor}</i>
                                        <p title={`tác giả ${novel.author}`}>{novel.author}</p>
                                    </div>

                                    <ul className="flex items-center flex-wrap gap-2 sm:text-sm text-xs mb-4 max-sm:justify-center">
                                        {novel.author && (
                                            <li className="border-[#666] text-[#666] px-3 py-1 border rounded-full ">
                                                <p title={`tác giả ${novel.author}`}>{novel.author}</p>
                                            </li>
                                        )}
                                        <li className="border-[#bf2c24] text-[#bf2c24] px-3 py-1 border rounded-full ">
                                            {novel.newChapterCount > 0
                                                ? "Đang ra"
                                                : "Chưa ra chương mới"}
                                        </li>
                                        {novel.category && (
                                            <li className="border-[#b78a28] text-[#b78a28] px-3 py-1 border rounded-full ">
                                                {PROPERTIES_NOVEL['genres'][novel.category-1].value}
                                            </li>
                                        )}
                                        {novel.personality && (
                                            <li className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                                                {PROPERTIES_NOVEL['personality'][novel.personality-1].value}
                                            </li>
                                        )}
                                        {novel.scene && (
                                            <li className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                                                {PROPERTIES_NOVEL['scene'][novel.scene-1].value}
                                            </li>
                                        )}
                                        {novel.classify && (
                                            <li className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                                                {PROPERTIES_NOVEL['classify'][novel.classify-1].value}
                                            </li>
                                        )}
                                        {novel.viewFrame && (
                                            <li className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                                                {PROPERTIES_NOVEL['viewFrame'][novel.viewFrame-1].value}
                                            </li>
                                        )}
                                    </ul>

                                    <ul className="max-sm:justify-center flex gap-9 mb-4">
                                        <li className="text-center">
                                            <span className="font-semibold">
                                                {novel.chapterCount || 0}
                                            </span>
                                            <div className="sm:text-base text-xs">Chương</div> 
                                        </li>
                                        <li className="text-center">
                                            <span className="font-semibold">
                                                {novel.newChapterCount || 0}
                                            </span>
                                            <div className="sm:text-base text-xs">Chương/tuần</div>
                                        </li>
                                            <Tippy
                                                theme="light"
                                                arrow={true}
                                                delay={[500,0]}
                                                content={novel.views || 0}
                                            >
                                                <div className="text-center cursor-default">
                                                    <span className="font-semibold">
                                                        {convertViewsCount(novel?.views) || 0}
                                                    </span>
                                                    <div className="sm:text-base text-xs">Lượt đọc</div>
                                                </div>
                                            </Tippy>
                                        <li className="text-center">
                                            <span className="font-semibold">{novel?.followerCount || 0}</span>
                                            <div className="sm:text-base text-xs">Cất giữ</div>
                                        </li>
                                    </ul>

                                    <div className="flex">
                                        <ListStarLayout size={matchesMobile ? 3 : 4} className="mb-4" numb={novel.mediumScore} />
                                        <span className="text-sm">
                                            {novel.mediumScore}
                                            <span className="text-xs ml-2">({10} đánh giá)</span>
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
                                    <ul className="lg:text-base text-sm flex flex-wrap gap-2">
                                        <li>
                                            <Link className="btn bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white" href={`/truyen/${novel.slug}/chuong-1`}>
                                                Đọc từ đầu
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="btn bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white" href={`/truyen/${novel.slug}/chuong-${novel?.chapterRead || 1}`}>
                                                Đọc tiếp
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="btn bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white" href={`/truyen/${novel.slug}/chuong-${novel?.chapterCount || 1}`}>
                                                Đọc mới nhất
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </article>
                            

                        <div className="mb-5">
                            <Tab.Group
                                defaultIndex={0}
                                selectedIndex={numberTab}
                                onChange={(index: number) => setNumberTab(index)}
                            >
                                <Tab.List className={`border-b mb-4 sm:px-4 text-base font-semibold max-sm:grid max-sm:grid-cols-4`}>
                                    <Tab
                                        className={`outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                            numberTab == 0 && "border-yellow-600"
                                        }`}
                                    >
                                        <h2>Giới thiệu</h2>
                                    </Tab>
                                    <Tab
                                        className={`outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                            numberTab == 1 && "border-yellow-600"
                                        }`}
                                    >
                                        <h2>Đánh giá</h2>
                                    </Tab>
                                    <Tab
                                        className={`outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                            numberTab == 2 && "border-yellow-600"
                                        }`}
                                    >
                                        <h2>D.s chương</h2>
                                    </Tab>
                                    <Tab
                                        className={`outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                            numberTab == 3 && "border-yellow-600"
                                        }`}
                                    >
                                        <h2>Bình luận</h2>
                                    </Tab>
                                    {
                                        !matchesMobile && (
                                            <Tab
                                                className={`outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                                    numberTab == 4 && "border-yellow-600"
                                                }`}
                                            >
                                                <h2>Hâm mộ</h2>
                                            </Tab>
                                        )
                                    }
                                </Tab.List>
                                <Tab.Panels className="min-h-[400px]">
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
                                            <FormReviews
                                                tab={numberTab}
                                                novelId={novel.novelId}
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
            </>
        </>
    )
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
            revalidate: REVALIDATE_TIME_DETAILS_PAGE,
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
//     return <MainLayout isBannerPage={true}>{page}</MainLayout>;
// };

export default NovelDetailPage;

