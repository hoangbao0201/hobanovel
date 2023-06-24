import { ReactNode } from "react"

import useSWR from "swr";
import Head from "@/components/Share/Head";
import MainLayout from "@/components/Layout/MainLayout"
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { getAccessToken } from "@/services/cookies.servies";
import { getFollowNovelHandle } from "@/services/follow.services";
import Link from "next/link";
import BlurImage from "@/components/Layout/BlurImage";
import { placeholderBlurhash } from "@/constants";
import { NovelBySlugType } from "@/types";
import { PROPERTIES_NOVEL } from "@/constants/data";


const NovelFollowPage = () => {

    const { data: getFollowsNovel } = useSWR<{ follows: any }>(
        `?page=1`,
        async (query) => {
            const token = getAccessToken();
            if (!token) {
                throw new Error();
            }
            const res = await getFollowNovelHandle(1, token as string)

            if (!res.success) {
                throw new Error();
            }

            return {
                follows: res.follows,
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

    console.log("getFollowsNovel: ", getFollowsNovel)

    return (
        <>
            <Head title={`Truyện đang theo dõi - HobaNovel chính thức - HobaNovel`}/>
            <main>
                <WrapperLayout>
                    <div className="flex my-5">
                        <div className="w-8/12">
                            <div className="px-4 mb-4 grid md:grid-cols-2 grid-cols-1 gap-6">
                                {   
                                    getFollowsNovel && getFollowsNovel?.follows.length ? (
                                        getFollowsNovel?.follows.map((novel : NovelBySlugType) => {
                                            return (
                                                <div key={novel.novelId} className="flex">
                                                    <Link href={`/truyen/${novel.slug}`} className="relative w-20 h-28 overflow-hidden shadow">
                                                        <BlurImage
                                                            width={85}
                                                            height={125}
                                                            alt="image-demo"
                                                            blurDataURL={novel.imageBlurHash || placeholderBlurhash}
                                                            className="group-hover:scale-105 group-hover:duration-500 object-cover h-full w-full"
                                                            placeholder="blur"
                                                            src={novel.thumbnailUrl}
                                                        />
                                                    </Link>
                                                    <div className="flex-1 ml-3">
                                                        <h2 className="mb-2 text-base line-clamp-1 font-semibold">
                                                            <Link className="block" href={`/truyen/${novel.slug}`}>{novel.title}</Link>
                                                        </h2>
                                                        <div className="line-clamp-2 text-sm mb-2 text-slate-900">{novel.description.replace(/<[^>]+>/g, '')}</div>
                                                        <div className="text-base flex align-middle items-center justify-between">
                                                            <span className="w-[55%] text-base mr-3 line-clamp-1 align-middle">{novel.author}</span>
                                                            <span className="px-2 text-xs text-orange-700 line-clamp-1 align-middle text-center border border-orange-700">{PROPERTIES_NOVEL['genres'][novel.category-1].value}</span>
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
                        <div className="w-4/12">
                            right
                        </div>
                    </div>
                </WrapperLayout>
            </main>
        </>
    )
}

export default NovelFollowPage;

NovelFollowPage.getLayout = (page: ReactNode) => {
    return (
        <MainLayout isBannerPage={false}>
            {page}
        </MainLayout>
    )
}