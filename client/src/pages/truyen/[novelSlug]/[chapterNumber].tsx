import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { GetServerSideProps, GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";

import MainLayout from "@/components/Layout/MainLayout";
import { ParsedUrlQuery } from "querystring";
import { ChapterDetailResType, HistoryReadingType, NovelFollowerType } from "@/types";
import {
    getChapterDetailHandle,
    increaseViewChapterHandle,
} from "@/services/chapter.services";
import {
    iconArrowTop,
    iconAuthor,
    iconBook,
    iconChevronLeft,
    iconChevronRight,
    iconClose,
    iconHeartFull,
    iconHome,
    iconList,
    iconOclock,
    iconT,
} from "../../../../public/icons";
import { convertTime } from "@/utils/convertTime";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { getCountWords } from "@/utils/getCountWords";
import { readingNovelHandle } from "@/services/novels.services";
import { getAccessToken } from "@/services/cookies.servies";
import { useSelector } from "react-redux";
import { LoadingButton } from "@/components/Layout/LoadingLayout";
import { checkFollowNovelHandle, followNovelHandle, unfollowNovelHandle } from "@/services/follow.services";
import Head from "@/components/Share/Head";
import OptionsListChapter from "@/components/Share/ContentChapter/OptionsListChapter";
import { useMediaQuery } from "usehooks-ts";

interface Params extends ParsedUrlQuery {
    slug: string;
}

export interface ChapterDetailPageProps {
    chapter?: ChapterDetailResType;
}

const ChapterDetailPage = ({ chapter }: ChapterDetailPageProps) => {

    const matchesMobile = useMediaQuery("(max-width: 640px)");

    const paginationRef = useRef<HTMLDivElement>(null)
    const paginationFakeRef = useRef<HTMLDivElement>(null)
    const [isFixed, setIsFixed] = useState(false);
    const [isFollow, setIsFollow] = useState<null | boolean>(null)
    const [isOptionsListChapter, setIsOptionsListChapter] = useState<boolean>(false)
    const { isAuthenticated, currentUser, userLoading } = useSelector((state: any) => state.user);

    useEffect(() => {
        if (chapter) {
            const timeoutId = setTimeout(() => {
                increaseViewChapterHandle(`${chapter.chapterId}?userId=${isAuthenticated ? currentUser.userId : ''}`);
            }, 5000);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [chapter]);

    useEffect(() => {
        if (chapter) {
            const token = getAccessToken();
            if (isAuthenticated && token) {
                const timer = setTimeout(() => {
                    const dataReadingNovel = {
                        novelId: String(chapter?.novelId),
                        chapterRead: String(chapter?.chapterNumber),
                        token: token,
                    };
                    console.log("readingNovelHandle");
                    readingNovelHandle(
                        dataReadingNovel as Pick<
                            HistoryReadingType,
                            "novelId" | "chapterRead"
                        > & { token: string }
                    );
                }, 1000);

                return () => {
                    clearTimeout(timer);
                };
            }
        }
    }, [chapter]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            if(paginationRef.current && paginationFakeRef.current) {
                const targetNavPosition = paginationRef?.current?.offsetTop;
                const targetNavFakePosition = paginationFakeRef?.current?.offsetTop;

                if(targetNavFakePosition === 0 && scrollPosition>targetNavPosition) {
                    setIsFixed(true);
                }
                else if(targetNavFakePosition !== 0 && scrollPosition<targetNavFakePosition) {
                    setIsFixed(false)
                }

            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleCheckFollowNovel = async () => {
        const token = getAccessToken();
        if(!token || !chapter?.novelId) {
            console.log("Chưa đủ thông tin")
            return
        }
        try {
            const query = `${chapter?.novelId}?token=${token}`
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
    }, [chapter])

    const handleFollowNovel = async () => {
        const token = getAccessToken()
        if(!token || !chapter?.novelId) {
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
                novelId: chapter.novelId,
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

    const handleUnfollowNovel = async () => {
        const token = getAccessToken()
        if(!token || !chapter?.novelId) {
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
                novelId: chapter.novelId,
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

    const handleChangeOntionsListChapter = () => {
        setIsOptionsListChapter(value => !value)
    }

    if (!chapter) {
        return null;
    }

    return (
        <>
            <Head title={`${chapter.novelName} Chap ${chapter.chapterNumber} Next Chap ${chapter.chapterNumber + 1} - HobaNovel`}/>
            <main>
                {/* <ScrollOnTop /> */}

                <WrapperLayout bg="bg-[#eae4d3]" className="lg:max-w-5xl">
                    <div className="py-4">


                        <OptionsListChapter slug={chapter.novelSlug} isShow={isOptionsListChapter} handle={handleChangeOntionsListChapter} chapterNumber={Number(chapter.chapterCount)} chapterCurrent={chapter?.chapterNumber || 1}/>



                        {/* Pagination */}
                        <div className="border-b pb-3 mb-7 mt-4">
                            <div ref={paginationRef} className={`transition-all top-0 left-0 right-0 py-1 ${isFixed ? 'fixed bg-gray-200' : ''}`}>
                                <div className="lg:max-w-5xl mx-auto flex items-center justify-center gap-1">
                                    <Link href="/" className="h-9 px-1 flex items-center">
                                        <i className="w-5 h-5 fill-[#d9534f] hover:fill-[#ac2925] block">{iconHome}</i>
                                    </Link>
                                    <Link href={`/truyen/${chapter.novelSlug}`} className="h-9 px-1 flex items-center">
                                        <i className="w-5 h-5 fill-[#d9534f] hover:fill-[#ac2925] block">{iconList}</i>
                                    </Link>
                                    <Link
                                        href={`/truyen/${chapter?.novelSlug}/chuong-${
                                            chapter?.chapterNumber - 1
                                        }`}
                                        className={`rounded-l-lg ${
                                            chapter.chapterNumber == 1 ?
                                            "pointer-events-none bg-black/30 " : "bg-[#d9534f] hover:bg-[#ac2925]"
                                        }`}
                                     >
                                        <span className={`flex items-center justify-center px-[10px] h-9 select-none`}>
                                            <i className="w-4 h-4 fill-white block">{iconChevronLeft}</i>
                                        </span>
                                    </Link>
                                    <div className="bg-white px-2 h-9 flex items-center text-sm select-none cursor-pointer border rounded-sm" onClick={handleChangeOntionsListChapter}>
                                        Chapter {chapter?.chapterNumber || 1}
                                    </div>
                                    <Link
                                        href={`/truyen/${chapter?.novelSlug}/chuong-${
                                            chapter?.chapterNumber + 1
                                        }`}
                                        className={`rounded-r-lg ${
                                            chapter?.chapterNumber == chapter?.chapterCount ?
                                            "pointer-events-none bg-black/30 " : "bg-[#d9534f] hover:bg-[#ac2925]"
                                        }`}
                                    >
                                        <span className={`flex items-center justify-center px-[10px] h-9 select-none`}>
                                            <i className="w-4 h-4 fill-white block">{iconChevronRight}</i>
                                        </span>
                                    </Link>
    
                                    <button onClick={isFollow ? handleUnfollowNovel : handleFollowNovel}
                                        className={`select-none flex items-center h-9 px-3 rounded-md max-sm:mr-8 
                                            ${ isFollow === null || (
                                                isFollow ? 'bg-[#d9534f] hover:bg-[#ac2925]' : 'bg-[#5cb85c] hover:bg-[#449d44]'
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
                                            <span className="text-white whitespace-nowrap sm:block hidden">Theo dõi</span>
                                        </>
                                    </button>
    
                                    {/* <span className="">1233481</span> */}
    
    
                                    {/* <div className="w-60">
                                        <span className="w-3"></span>
                                        <span className="w-4"></span>
                                        <span className="w-5"></span>
                                        <span className="w-6"></span>
                                    </div> */}
    
                                </div>
                            </div>
                            <div ref={paginationFakeRef} className={`transition-all top-0 left-0 right-0 py-1 h-9 ${isFixed ? 'block' : 'hidden'}`}></div>
                        </div>


                        <div className="lg:text-3xl sm:text-2xl lg:line-clamp-1 text-xl line-clamp-2 px-3 font-medium mb-6">
                            Chương {chapter.chapterNumber}: {chapter.title}
                        </div>

                        <div className="mb-4 px-3 sm:flex justify-between gap-2">
                            <div className="flex items-center mb-2">
                                <i className="w-4 block">{iconBook}</i>
                                <Link
                                    href={`/truyen/${chapter.novelSlug}`}
                                    className="line-clamp-1"
                                >
                                    <h2 className="ml-2">{chapter.novelName}</h2>
                                </Link>
                            </div>
                            <div className="flex items-center mb-2">
                                <i className="w-4 block">{iconAuthor}</i>
                                <span className="">
                                    <h2 className="line-clamp-1 sm:text-base text-sm ml-2">
                                        {chapter.creator}
                                    </h2>
                                </span>
                            </div>
                            <div className="flex items-center mb-2">
                                <i className="w-3 block">{iconT}</i>
                                <span className="">
                                    <h2 className="line-clamp-1 sm:text-base text-sm ml-2">
                                        {getCountWords(chapter.content)}
                                    </h2>
                                </span>
                            </div>
                            <div className="flex items-center mb-2">
                                <i className="w-4 block">{iconOclock}</i>
                                <span className="">
                                    <h2 className="line-clamp-1 sm:text-base text-sm ml-2">
                                        {convertTime(chapter.updatedAt)}
                                    </h2>
                                </span>
                            </div>
                        </div>

                        {/* <span className="w-36 mx-auto my-5 border-b border-gray-500"></span> */}
                        <div
                            className="sm:text-2xl px-3 text-xl leading-relaxed overflow-hidden"
                            dangerouslySetInnerHTML={{
                                __html: chapter?.content || "Lỗi hiển thị",
                            }}
                        />

                        {/* Pagination */}
                        <div className="flex px-3 justify-between mt-8 mb-5">
                            <Link
                                href={`/truyen/${chapter?.novelSlug}/chuong-${
                                    chapter?.chapterNumber - 1
                                }`}
                                className={`${
                                    chapter.chapterNumber == 1 &&
                                    "pointer-events-none text-gray-400 fill-gray-400"
                                }`}
                            >
                                <span className="sm:py-2 sm:px-7 py-2 px-4 border rounded-full flex items-center bg-white bg-opacity-50 sm:text-base text-sm font-semibold select-none">
                                    <i className="-rotate-90 w-3 mr-2 block">{iconArrowTop}</i>
                                    Chương trước
                                </span>
                            </Link>
                            <Link
                                href={`/truyen/${chapter?.novelSlug}/chuong-${
                                    chapter?.chapterNumber + 1
                                }`}
                                className={``}
                            >
                                <span className="sm:py-2 sm:px-7 py-2 px-4 border rounded-full flex items-center bg-white bg-opacity-50 sm:text-base text-sm font-semibold select-none">
                                    Chương sau
                                    <i className="rotate-90 w-3 ml-2 block">{iconArrowTop}</i>
                                </span>
                            </Link>
                        </div>
                    </div>
                </WrapperLayout>
            </main>
        </>
    );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const novelSlug = context.query.novelSlug as string;
//     const chapterNumber = context.query.chapterNumber as string;

//     const chapterResponse = await getChapterDetailHandle(
//         novelSlug,
//         chapterNumber.split("chuong-")[1],
//     );

//     if (!chapterResponse) {
//         return {
//             props: {
//                 chapter: null,
//             },
//         };
//     }

//     return {
//         props: {
//             chapter: chapterResponse.data?.chapter || null,
//         },
//     };
// };

export const getStaticProps: GetStaticProps<ChapterDetailPageProps, Params> = async (
    context: GetStaticPropsContext<Params>
) => {
    try {
        const { novelSlug = "", chapterNumber = "" } = context.params as Params;

        if (!novelSlug || !chapterNumber) {
            return {
                notFound: true,
                props: {
                    chapter: null,
                },
            };
        }


        const chapterResponse = await getChapterDetailHandle(
            novelSlug as string,
            String(chapterNumber).split("chuong-")[1],
        );

        if (!chapterResponse) {
            return {
                props: {
                    chapter: null,
                },
            };
        }

        return {
            props: {
                chapter: chapterResponse.data?.chapter || null,
            },
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


ChapterDetailPage.getLayout = (page: ReactNode) => {
    return (
        <MainLayout autoHidden={false} bg="#e4dece" isBannerPage={false}>
            {page}
        </MainLayout>
    );
};

export default ChapterDetailPage;
