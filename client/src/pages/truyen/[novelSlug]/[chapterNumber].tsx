import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";

import MainLayout from "@/components/Layout/MainLayout";
import { ParsedUrlQuery } from "querystring";
import { ChapterDetailResType, HistoryReadingType, NovelFollowerType } from "@/types";

import { useSelector } from "react-redux";

import {
    getChapterDetailHandle,
    increaseViewChapterHandle,
} from "@/services/chapter.services";
import {
    iconAngleDouble,
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
import { LoadingButton, LoadingForm } from "@/components/Layout/LoadingLayout";
import { checkFollowNovelHandle, followNovelHandle, unfollowNovelHandle } from "@/services/follow.services";
import OptionsListChapter from "@/components/Share/ContentChapter/OptionsListChapter";
import Head from "@/components/Share/Head";
import { REVALIDATE_TIME_DETAILS_PAGE } from "@/constants";
import Breadcrumb from "@/components/Share/Breadcrumb";
import BlurImage from "@/components/Layout/BlurImage";

interface Params extends ParsedUrlQuery {
    slug: string;
}

export interface ChapterDetailPageProps {
    chapter?: ChapterDetailResType;
}

const ChapterDetailPage = ({ chapter }: ChapterDetailPageProps) => {

    const paginationRef = useRef<HTMLDivElement>(null)
    const paginationFakeRef = useRef<HTMLDivElement>(null)
    const [isFixed, setIsFixed] = useState(false);
    const [commentsChapter, setCommentsChapter] = useState([])
    const [isFollow, setIsFollow] = useState<null | boolean>(null)
    const [isOptionsListChapter, setIsOptionsListChapter] = useState<boolean>(false)
    const { isAuthenticated, currentUser, userLoading } = useSelector((state: any) => state.user);


    // Handle Follow Novel
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

    // Handle Unfollow Novel
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

    // Set Options Chapters
    const handleChangeOntionsListChapter = () => {
        setIsOptionsListChapter(value => !value)
    }
    // Handle Get Comments Chapter
    // const handleGetCommentsChapter = async () => {
    //     try {
    //         const commentsRes = await getCommentsHandle({ novelId: chapter?.novelId, chapterId: chapter?.chapterId, page: 1 })

    //         if(commentsRes.success) {
    //             setCommentsChapter(commentsRes.comments)
    //         }

    //     } catch (error) {
            
    //     }
    // }
    // const handleAddCommentChapter = async () => {
    //     const token = getAccessToken();
    //     if(!token) {
    //         return
    //     }
    //     try {
    //         const commentRes = await addCommentHandle({
    //             token: token,
    //             commentText: "",
    //             novelId: chapter?.novelId,
    //             chapterId: chapter?.chapterId
    //         })
    //     } catch (error) {
            
    //     }
    // }

    // console.log(commentsChapter)


    // Increase view chapter
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

    // Mark read
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

    // Scroll Show/Hidden row options chapter
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

    // Handle check follow novel
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

    // Call funciton "handleCheckFollowNovel" for the first time
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

    // Call funciton "handleGetCommentsChapter" for the first time
    // useEffect(() => {
    //     if(chapter?.chapterId) {
    //         handleGetCommentsChapter()
    //     }
    // }, [])

    return (
        <>
            <Head title={`${chapter ? chapter?.novelName : ''} Chap ${chapter ? chapter?.chapterNumber : ''} Next Chap ${chapter ? chapter?.chapterNumber + 1 : ''} - HobaNovel`}/>
            <WrapperLayout bg="bg-[#eae4d3]" className="lg:max-w-5xl">
                <div className="grid">

                    <Breadcrumb 
                        path={[
                            { title: 'Truyện', url: '/' },
                            { title: `${chapter?.novelName}`, url: `/truyen/${chapter?.novelSlug}` },
                            { title: `Chapter ${chapter?.chapterNumber}`, url: `/truyen/${chapter?.novelSlug}/chuong-${chapter?.chapterNumber}`}
                        ]}
                    />

                    {
                        chapter && (
                            <div>
                                <OptionsListChapter slug={chapter?.novelSlug} isShow={isOptionsListChapter} handle={handleChangeOntionsListChapter} chapterNumber={Number(chapter?.chapterCount)} chapterCurrent={chapter?.chapterNumber}/>
            
                                {/* Pagination */}
                                <div className="border-b pb-3 mb-7 mt-4">
                                    <div ref={paginationRef} className={`transition-all top-0 left-0 right-0 py-1 ${isFixed ? 'fixed bg-gray-200' : ''}`}>
                                        <ul className="lg:max-w-5xl mx-auto flex items-center justify-center gap-1">
            
                                            <li>
                                                <Link href="/" className="h-9 px-1 flex items-center">
                                                    <i className="w-5 h-5 fill-[#d9534f] hover:fill-[#ac2925] block">{iconHome}</i>
                                                </Link>
                                            </li>
            
                                            <li>
                                                <Link href={`/truyen/${chapter?.novelSlug}`} className="h-9 px-1 flex items-center">
                                                    <i className="w-5 h-5 fill-[#d9534f] hover:fill-[#ac2925] block">{iconList}</i>
                                                </Link>
                                            </li>
            
                                            <li>
                                                <Link
                                                    href={`/truyen/${chapter?.novelSlug}/chuong-${
                                                        chapter?.chapterNumber - 1
                                                    }`}
                                                    className={`rounded-l-lg flex items-center justify-center px-[10px] h-9 select-none ${
                                                        chapter?.chapterNumber == 1 ?
                                                        "pointer-events-none bg-black/30 " : "bg-[#d9534f] hover:bg-[#ac2925]"
                                                    }`}
                                                >
                                                    <i className="w-4 h-4 fill-white block">{iconChevronLeft}</i>
                                                </Link>
                                            </li>
            
                                            <li className="bg-white px-2 h-9 flex items-center text-sm select-none cursor-pointer border rounded-sm" onClick={handleChangeOntionsListChapter}>
                                                Chapter {chapter?.chapterNumber || 1}
                                            </li>
            
                                            <li>
                                                <Link
                                                    href={`/truyen/${chapter?.novelSlug}/chuong-${
                                                        chapter?.chapterNumber + 1
                                                    }`}
                                                    className={`rounded-r-lg flex items-center justify-center px-[10px] h-9 select-none ${
                                                        chapter?.chapterNumber == chapter?.chapterCount ?
                                                        "pointer-events-none bg-black/30 " : "bg-[#d9534f] hover:bg-[#ac2925]"
                                                    }`}
                                                >
                                                    <i className="w-4 h-4 fill-white block">{iconChevronRight}</i>
                                                </Link>
                                            </li>
            
                                            <li>
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
                                            </li>
            
                                        </ul>
                                    </div>
                                    <div ref={paginationFakeRef} className={`transition-all top-0 left-0 right-0 py-1 h-9 ${isFixed ? 'block' : 'hidden'}`}></div>
                                </div>
            
            
                                <h1 title={`chương ${chapter?.chapterNumber}: ${chapter?.title}`} className="sm:text-2xl lg:line-clamp-1 text-xl line-clamp-2 px-4 font-semibold mb-4">
                                    Chương {chapter?.chapterNumber}: {chapter?.title}
                                </h1>
            
                                <ul className="mb-4 px-4 sm:flex justify-between gap-2">
                                    <li className="flex items-center mb-2">
                                        <i className="w-4 block">{iconBook}</i>
                                        <h2 title={`truyện ${chapter?.novelName}`} className="ml-2">
                                            <Link
                                                href={`/truyen/${chapter?.novelSlug}`}
                                                className="line-clamp-1"
                                            >
                                                {chapter?.novelName}
                                            </Link>
                                        </h2>
                                    </li>
                                    <li className="flex items-center mb-2">
                                        <i className="w-4 block">{iconAuthor}</i>
                                        <time className="line-clamp-1 sm:text-base text-sm ml-2">
                                            {chapter?.creator}
                                        </time>
                                    </li>
                                    <li className="flex items-center mb-2">
                                        <i className="w-3 block">{iconT}</i>
                                        <span className="line-clamp-1 sm:text-base text-sm ml-2">
                                            {getCountWords(chapter?.content) || ""}
                                        </span>
                                    </li>
                                    <li className="flex items-center mb-2">
                                        <i className="w-4 block">{iconOclock}</i>
                                        <span className="line-clamp-1 sm:text-base text-sm ml-2">
                                            {convertTime(chapter?.updatedAt) || ""}
                                        </span>
                                    </li>
                                </ul>

                                <div className="flex justify-center my-5">
                                    <div className="max-w-[500px] border border-gray-200">
                                        <BlurImage
                                            alt="image head"
                                            width={500}
                                            height={500}
                                            className="w-full h-full object-cover block"
                                            src="https://res.cloudinary.com/djrbd6ftt/image/upload/v1689146231/hobanovel/admin/image-head_x5c1um.jpg"
                                        />
                                    </div>
                                </div>
            
                                <div
                                    className="sm:text-2xl px-6 text-xl leading-relaxed overflow-hidden"
                                    dangerouslySetInnerHTML={{
                                        __html: chapter?.content || "Lỗi hiển thị",
                                    }}
                                />


                                
                               {/* <div className="bg-gray-100 my-10 py-10 ">
                                    <div className="flex items-center justify-center gap-4 px-6 text-2xl py-10  font-bold uppercase">
                                        <TextRank rank={0} />
                                        <i className="w-4 h-4 block rotate-90">{iconAngleDouble}</i>
                                        <TextRank rank={1} />
                                        <i className="w-4 h-4 block rotate-90">{iconAngleDouble}</i>
                                        <TextRank rank={2} />
                                        <i className="w-4 h-4 block rotate-90">{iconAngleDouble}</i>
                                        <TextRank rank={3} />
                                        <i className="w-4 h-4 block rotate-90">{iconAngleDouble}</i>
                                        <TextRank rank={4} />
                                        <i className="w-4 h-4 block rotate-90">{iconAngleDouble}</i>
                                        <TextRank rank={5} />
                                        <i className="w-4 h-4 block rotate-90">{iconAngleDouble}</i>
                                        <TextRank rank={6} />
                                    </div>
                                    <div className="flex justify-center"><TextRank rank={7} /></div>
                               </div> */}
            
                                {/* Pagination */}
                                <ul className="flex px-4 justify-between mt-8 mb-5">
                                    <li>
                                        <Link
                                            href={`/truyen/${chapter?.novelSlug}/chuong-${
                                                chapter?.chapterNumber - 1
                                            }`}
                                            className={`sm:py-2 sm:px-7 py-2 px-4 border rounded-full flex items-center bg-white bg-opacity-50 sm:text-base text-sm font-semibold select-none ${
                                                chapter?.chapterNumber == 1 &&
                                                "pointer-events-none text-gray-400 fill-gray-400"
                                            }`}
                                        >
                                            <i className="-rotate-90 w-3 mr-2 block">{iconArrowTop}</i>
                                            Chương trước
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={`/truyen/${chapter?.novelSlug}/chuong-${
                                                chapter?.chapterNumber + 1
                                            }`}
                                            className={`sm:py-2 sm:px-7 py-2 px-4 border rounded-full flex items-center bg-white bg-opacity-50 sm:text-base text-sm font-semibold select-none`}
                                        >
                                            Chương sau
                                            <i className="rotate-90 w-3 ml-2 block">{iconArrowTop}</i>
                                        </Link>
                                    </li>
                                </ul>

                                <div className="flex justify-center">
                                    <div className="w-full">
                                        <BlurImage
                                            alt="image head"
                                            width={1200}
                                            height={1200}
                                            className="w-full h-full object-cover block"
                                            src="https://res.cloudinary.com/djrbd6ftt/image/upload/v1689167556/hobanovel/admin/image-footer-01_rvlidd.jpg"
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    <div className="">

                        <ul className="transition-all ease-linear">
                            {/* {
                                 ? (
                                    <LoadingForm theme="dark"/>
                                ) : (
                                    comments.length === 0 ? (
                                        <li>Hãy là người đầu tiên bình luận</li>
                                    ) : (
                                        comments?.map((comment) => {
                                            return (
                                                <li key={comment.commentId}>
                                                    <CommentItem key={comment?.commentId} comment={comment} user={currentUser} handleDeleteComment={handleDestroyComment}/>
                                                </li>
                                            );
                                        })
                                    )
                                )
                            } */}
                        </ul>
                        
                    </div>

                </div>
            </WrapperLayout>
        </>
    );
};

export const getStaticProps: GetStaticProps<ChapterDetailPageProps> = async (
    context: GetStaticPropsContext
) => {
    try {
        const { novelSlug = "", chapterNumber = "" } = context.params as Params;

        const chapterResponse = await getChapterDetailHandle(
            novelSlug as string,
            String(chapterNumber).split("chuong-")[1],
        );

        if (!chapterResponse.success) {
            return { notFound: true };
        }

        return {
            props: {
                chapter: chapterResponse.chapter,
            },
            revalidate: REVALIDATE_TIME_DETAILS_PAGE,
        };

    } catch (error) {
        return { notFound: true };
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
