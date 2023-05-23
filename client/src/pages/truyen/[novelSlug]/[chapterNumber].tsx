import Head from "next/head";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { GetServerSideProps } from "next";

import MainLayout from "@/components/Layout/MainLayout";
import { ParsedUrlQuery } from "querystring";
import { ChapterDetailResType, HistoryReadingType } from "@/types";
import {
    getChapterDetailHandle,
    increaseViewChapterHandle,
} from "@/services/chapter.services";
import {
    iconArrowTop,
    iconAuthor,
    iconBook,
    iconOclock,
    iconT,
} from "../../../../public/icons";
import { convertTime } from "@/utils/convertTime";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { getCountWords } from "@/utils/getCountWords";
import { readingNovelHandle } from "@/services/novels.services";
import { getAccessToken, getAccessTokenOnServer } from "@/services/cookies.servies";
import { useSelector } from "react-redux";

interface Params extends ParsedUrlQuery {
    slug: string;
}

export interface ChapterDetailPageProps {
    chapter?: ChapterDetailResType;
}

const ChapterDetailPage = ({ chapter }: ChapterDetailPageProps) => {
    const { isAuthenticated, currentUser } = useSelector((state: any) => state.user);

    useEffect(() => {
        if(chapter) {
            const timeoutId = setTimeout(() => {
                increaseViewChapterHandle(chapter.chapterId)
            }, 5000);
    
            return () => {
                clearTimeout(timeoutId);
            };
            
        }
    }, [chapter]);

    useEffect(() => {
        if(chapter) {
            const token = getAccessToken()
            if(isAuthenticated && token) {
                const timer = setTimeout(() => {
                    const dataReadingNovel = {
                        novelId: String(chapter?.novelId),
                        chapterRead: String(chapter?.chapterNumber),
                        token: token
                    }
                    console.log("readingNovelHandle")
                    readingNovelHandle(dataReadingNovel as Pick<HistoryReadingType, 'novelId' | 'chapterRead'> & { token: string })
                }, 1000);
    
                return () => {
                    clearTimeout(timer)
                }
            }
        }
    }, [chapter])

    if (!chapter) {
        return null;
    }


    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {/* <ScrollOnTop /> */}

                <WrapperLayout bg="bg-[#eae4d3]" className="">
                    {/* Navigate */}
                    <div className="flex justify-between mb-12">
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

                    <div className="sm:text-3xl text-xl line-clamp-1 font-medium mb-6">
                        Chương {chapter.chapterNumber}: {chapter.title}
                    </div>
                    <div className="mb-4 flex justify-between">
                        <div className="flex items-center">
                            <i className="w-4 block">{iconBook}</i>
                            <Link
                                href={`/truyen/${chapter.novelSlug}`}
                                className="line-clamp-1"
                            >
                                <h2 className=" ml-2">{chapter.novelName}</h2>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <i className="w-4 block">{iconAuthor}</i>
                            <span className="">
                                <h2 className="line-clamp-1 sm:text-base text-sm ml-2">
                                    {chapter.creator}
                                </h2>
                            </span>
                        </div>
                        <div className="flex items-center">
                            <i className="w-4 block">{iconT}</i>
                            <span className="">
                                <h2 className="line-clamp-1 sm:text-base text-sm ml-2">
                                    {getCountWords(chapter.content)}
                                </h2>
                            </span>
                        </div>
                        <div className="flex items-center">
                            <i className="w-4 block">{iconOclock}</i>
                            <span className="">
                                <h2 className="line-clamp-1 sm:text-base text-sm ml-2">
                                    {convertTime(chapter.updatedAt)}
                                </h2>
                            </span>
                        </div>
                    </div>
                    <span className="w-36 mx-auto my-5 border-b border-gray-500"></span>
                    <div
                        className="sm:text-2xl text-xl leading-relaxed grid"
                        dangerouslySetInnerHTML={{
                            __html: chapter?.content || "Lỗi hiển thị",
                        }}
                    />

                    {/* Navigate */}
                    <div className="flex justify-between mt-8 mb-5">
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
                </WrapperLayout>
            </main>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const novelSlug = context.query.novelSlug as string;
    const chapterNumber = context.query.chapterNumber as string;

    const chapterResponse = await getChapterDetailHandle(
        novelSlug,
        chapterNumber.split("chuong-")[1]
    );

    if (!chapterResponse) {
        return {
            props: {
                chapter: null,
            },
        };
    }

    // const token = getAccessTokenOnServer(context.req.headers.cookie as string)
    // if(token) {
    //     const dataReadingNovel = {
    //         token: token,
    //         novelId: chapterResponse.data.chapter.novelId,
    //         chapterRead: String(chapterResponse.data.chapter.chapterNumber)
    //     }
    //     readingNovelHandle(dataReadingNovel as HistoryReadingType & { token: string })
    // }

    return {
        props: {
            chapter: chapterResponse.data?.chapter || null,
        },
    };
};

ChapterDetailPage.getLayout = (page: ReactNode) => {
    return (
        <MainLayout bg="#e4dece" isBannerPage={false}>
            {page}
        </MainLayout>
    );
};

export default ChapterDetailPage;
