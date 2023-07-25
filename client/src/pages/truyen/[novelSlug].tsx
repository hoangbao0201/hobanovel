import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";
import {
    GetStaticPaths, GetStaticProps
} from "next";

import { useSelector } from "react-redux";
import { useMediaQuery } from "usehooks-ts";
import { ParsedUrlQuery } from "querystring";
import { Tab, Transition } from "@headlessui/react";

import Head from "@/components/Share/Head";
import { REVALIDATE_TIME } from "@/constants";
import ClientOnly from "@/components/Share/ClientOnly";
import Breadcrumb from "@/components/Share/Breadcrumb";
import MainLayout from "@/components/Layout/MainLayout";
import { getAccessToken } from "@/services/cookies.servies";
import { NovelBySlugType, NovelFollowerType } from "@/types";
import { AdsenseForm } from "@/components/Share/AdsenseForm";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { getNovelBySlugHandle } from "@/services/novels.services";
// import ContentNovelDetail from "@/components/Share/ContentNovelDetail";
import { FormCommentReceiver } from "@/components/Share/ContentNovelDetail/FormCommentReceiver";
import { checkFollowNovelHandle, followNovelHandle, unfollowNovelHandle } from "@/services/follow.services";

// import FormIntroduce from "@/components/Share/ContentNovelDetail/FormIntroduce";
// import FormReviews from "@/components/Share/ContentNovelDetail/FormReviews";
// import FormListChapters from "@/components/Share/ContentNovelDetail/FormListChapters";
// import FormComment from "@/components/Share/ContentNovelDetail/FormComment";

const ContentNovelDetail = dynamic(
    () => import("../../components/Share/ContentNovelDetail", {
        ssr: false,
    } as ImportCallOptions)
)
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
    () => import("../../components/Share/FormComment/index", {
        ssr: false,
    } as ImportCallOptions)
)


interface Params extends ParsedUrlQuery {
    novelSlug: string;
}

export interface NovelDetailPageProps {
    tab?: string;
    novel: NovelBySlugType;
}

const NovelDetailPage = ({ novel, tab } : NovelDetailPageProps) => {

    const matchesMobile = useMediaQuery('(max-width: 640px)')

    const { isAuthenticated, currentUser, userLoading } = useSelector((state: any) => state.user);

    const [numberTab, setNumberTab] = useState(0);
    const [isFollow, setIsFollow] = useState<null | boolean>(null)
    
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


    return (
        <>  

            <FormCommentReceiver
                novelId={novel?.novelId}
            />

            <WrapperLayout className="pt-5 max-lg:max-w-3xl min-h-screen">
                {
                    novel && (
                        <>
                            <Head title={`${novel?.title ? novel?.title : ''} [Tới Chap ${novel ? novel?.chapterCount : ''}] Tiếng Việt - HobaNovel`}/>
                            <div className="grid">

                                <Breadcrumb 
                                    path={[
                                        { title: 'Truyện', url: '/' },
                                        { title: `${novel?.title || ''}`, url: `/truyen/${novel?.slug || ''}` },
                                    ]}
                                />

                                <ContentNovelDetail
                                    novel={novel}
                                    isFollow={isFollow}
                                    handleFollowNovel={handleFollowNovel}
                                    handleUnfollowNovel={handleUnfollowNovel}
                                />

                                
                                <div className="mb-5">
                                    <Tab.Group
                                        defaultIndex={0}
                                        selectedIndex={numberTab}
                                        onChange={(index: number) => setNumberTab(index)}
                                    >
                                        <Tab.List className={`border-b mb-4 sm:px-4 sm:text-base text-sm font-semibold max-sm:grid max-sm:grid-cols-4`}>
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
                                            <ClientOnly>
                                                <Tab
                                                    className={`max-sm:hidden outline-none border-b-4 border-transparent hover:text-yellow-600 py-3 sm:mr-8 ${
                                                        numberTab == 4 && "border-yellow-600"
                                                    }`}
                                                >
                                                    <h2>Hâm mộ</h2>
                                                </Tab>
                                            </ClientOnly>
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
                                                    <FormComment novelId={novel?.novelId}/>
                                                </Transition>
                                            </Tab.Panel>
                                            
                                            <Tab.Panel className="max-sm:hidden">
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

                                        </Tab.Panels>
                                    </Tab.Group>
                                </div>

                                

                                <AdsenseForm />


                            </div>
                        </>
                    )
                }
            </WrapperLayout>

        </>
    )

};
export default NovelDetailPage;

//  ----

export const getStaticProps: GetStaticProps = async (context) => {
    const { novelSlug } = context.params as Params;
    const novelResponse = await getNovelBySlugHandle(novelSlug as string);

    return {
        props: {
            novel: novelResponse.novel || null,
            // tab: context.params.hash?.toString() || "intro",
        },
        revalidate: REVALIDATE_TIME,
    };
};
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true,
    };
};

NovelDetailPage.getLayout = (page: ReactNode) => {

    return (
        <MainLayout isBannerPage={false}>
            {page}
        </MainLayout>
    );
};


