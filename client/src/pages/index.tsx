import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { GetServerSideProps, GetStaticProps } from "next";

import useSWR from "swr";
import axios from "axios";
import { useMediaQuery } from "usehooks-ts";

import { REVALIDATE_TIME, apiUrl } from "@/constants";
import MainLayout from "@/components/Layout/MainLayout";
import {
    getNovelsByHighlyRatedHandle,
    getNovelsByOutstandingHandle,
    getNovelsByPageHandle,
    getReadingNovelHandle,
} from "@/services/novels.services";
import Head from '@/components/Share/Head';
import { NovelType, ReviewType } from "@/types";
import { getReviewsByNovelHandle } from "@/services/review.services";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { getAccessToken } from "@/services/cookies.servies";


type NovelHighlyRated = NovelType & { mediumScore: number };
interface HighlyRatedProps {
    novels?: NovelHighlyRated[];
}

export interface PageHomeProps {
    data: any;
    novelsOutstending?: NovelType[];
    novelsJustUpdated?: NovelType[];
    novelsHighlyRated?: HighlyRatedProps[];
    novelsLatestReviews?: ReviewType[];
    novelsJustCompleted?: NovelType[];
}

const Outstanding = dynamic(
    () =>
        import("@/components/Share/ContentHome/Outstanding", {
            ssr: false,
        } as ImportCallOptions)
);
const JustUpdated = dynamic(
    () =>
        import("@/components/Share/ContentHome/JustUpdated", {
            ssr: false,
        } as ImportCallOptions)
);

const Reading = dynamic(
    () =>
        import("@/components/Share/ContentHome/Reading", {
            ssr: false,
        } as ImportCallOptions)
);
const HighlyRated = dynamic(
    () =>
        import("@/components/Share/ContentHome/HighlyRated", {
            ssr: false,
        } as ImportCallOptions)
);
const LatestReviews = dynamic(
    () =>
        import("@/components/Share/ContentHome/LatestReviews", {
            ssr: false,
        } as ImportCallOptions)
);
const JustPosted = dynamic(
    () =>
        import("@/components/Share/ContentHome/JustPosted", {
            ssr: false,
        } as ImportCallOptions)
);
const JustCompleted = dynamic(
    () =>
        import("@/components/Share/ContentHome/JustCompleted", {
            ssr: false,
        } as ImportCallOptions)
);

const HomePage = ({
    data = [],
    novelsOutstending = [],
    novelsJustUpdated = [],
    novelsHighlyRated = [],
    novelsLatestReviews = [],
    novelsJustCompleted = [],
}: PageHomeProps) => {
    const matchesMobile = useMediaQuery("(max-width: 640px)");
    const matchesTablet = useMediaQuery("(max-width: 1024px)");

    // const { data: novelReviews } = useSWR<{ reviews: any }>(
    //     `?page=1`,
    //     async (query) => {
    //         const token = getAccessToken();
    //         if(!token) {
    //             throw new Error();
    //         }
    //         const res = await axios.get(`http://localhost:4000/api/reviews/get/${query}`);

    //         if(!res.data.success || !res) {
    //             throw new Error();
    //         }

    //         return {
    //             reviews: res.data.reviews
    //         }
    //     },
    //     {
    //         onErrorRetry: (error, _, __, revalidate, { retryCount }) => {
    //             if(error.status === 404) {
    //                 return
    //             }
    //             if(retryCount >= 1) {
    //                 return
    //             }
    //             setTimeout(() => {
    //                 revalidate({ retryCount })
    //             }, 2000)
    //         }
    //     }
    // );

    const { data: novelReading } = useSWR<{ novels: any }>(
        `?page=1`,
        async (query) => {
            const token = getAccessToken();
            if (!token) {
                throw new Error();
            }
            const res = await axios.get(`${apiUrl}/api/novels/reading${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.data.success || !res) {
                throw new Error();
            }

            return {
                novels: res.data.novels,
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

    return (
        <>
            <Head />
            <>
                <WrapperLayout className="pt-5">
                    <div className="block -mx-4">

                        {/* <AdsenseForm /> */}

                        <div className="lg:flex mb-5">
                            <div className="lg:w-8/12">
                                <h2 className="px-4 mb-4 text-xl font-semibold">Truyện nổi bật</h2>
                                <Outstanding novels={novelsOutstending} />
                            </div>
                            {!matchesTablet && (
                                <div className="lg:w-4/12">
                                    <h2 className="px-4 mb-5 text-xl font-semibold">Truyện đang đọc</h2>
                                    <Reading readingNovel={novelReading?.novels} />
                                </div>
                            )}
                        </div>
    
                        {!matchesTablet && (
                            <div className="mb-5">
                                <h2 className="px-4 mb-4 text-xl font-semibold">Truyện mới cập nhật</h2>
                                <JustUpdated novels={novelsJustUpdated} />
                            </div>
                        )}
    
                        <div className="lg:flex">
                            <div className="lg:w-8/12">
                                <h2 className="px-4 mb-4 text-xl font-semibold">Truyện đánh giá cao</h2>
                                <HighlyRated novels={novelsHighlyRated as NovelHighlyRated[]} />
                            </div>
                            <div className="lg:w-4/12">
                                <h2 className="px-4 mb-4 text-xl font-semibold">Mới đánh giá</h2>
                                <LatestReviews reviews={novelsLatestReviews} />
                            </div>
                        </div>
    
                        <div className="lg:flex">
                            {!matchesTablet && (
                                <div className="lg:w-4/12">
                                    <h2 className="px-4 mb-4 text-xl font-semibold">Mới đăng</h2>
                                    <JustPosted novels={novelsOutstending} />
                                </div>
                            )}
                            <div className="lg:w-8/12">
                                <h2 className="px-4 mb-4 text-xl font-semibold">Mới hoàn thành</h2>
                                <JustCompleted novels={novelsJustCompleted} />
                            </div>
                        </div>
                    </div>
                </WrapperLayout>
            </>
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const query = context;
    const data = { page: 1 };

    const novelsResponse = await getNovelsByPageHandle("1");
    const novelsOutstandingResponse = await getNovelsByOutstandingHandle(1);
    const novelsHighlyRatedResponse = await getNovelsByHighlyRatedHandle(1);
    const reviewsResponse = await getReviewsByNovelHandle(`?page=1`);
    const novelReading = await getReadingNovelHandle(1);

    return {
        props: {
            novelsOutstending: novelsOutstandingResponse?.data.novels || null,
            novelsJustUpdated: novelsResponse?.data.novels || null,
            novelsReading: context.locale || null,
            novelsHighlyRated: novelsHighlyRatedResponse?.data.novels || null,

            novelsJustCompleted: novelsResponse?.data.novels || null,

            novelsLatestReviews: reviewsResponse?.data.reviews || null,
        },
        revalidate: REVALIDATE_TIME,
    };
};


// export const getServerSideProps : GetServerSideProps = async (context) => {

//     const query = context;
//     const data = { page: 1 }

//     const novelsResponse = await getNovelsByPageHandle("1");
//     const novelsOutstandingResponse = await getNovelsByOutstandingHandle(1);
//     const novelsHighlyRatedResponse = await getNovelsByHighlyRatedHandle(1);
//     const reviewsResponse = await getReviewsByNovelHandle(`?page=1`);
//     const novelReading = await getReadingNovelHandle(1);

//     return {
//         props: {
//             novelsOutstending: novelsOutstandingResponse?.data.novels || null,
//             novelsJustUpdated: novelsResponse?.data.novels || null,
//             novelsReading: context.locale || null,
//             novelsHighlyRated: novelsHighlyRatedResponse?.data.novels || null,

//             novelsJustCompleted: novelsResponse?.data.novels || null,

//             novelsLatestReviews: reviewsResponse?.data.reviews || null,

//         },
//     };
// }

HomePage.getLayout = (page: ReactNode) => {
    return <MainLayout isBannerPage={true}>{page}</MainLayout>;
};

export default HomePage;
