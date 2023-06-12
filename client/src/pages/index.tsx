import { ReactNode } from "react";
import { GetServerSideProps, GetStaticProps, NextPage } from "next";

import { REVALIDATE_TIME, apiUrl } from "@/constants";
import MainLayout from "@/components/Layout/MainLayout";
import {
    getNovelsByHighlyRatedHandle,
    getNovelsByOutstandingHandle,
    getNovelsByPageHandle,
    getReadingNovelHandle,
} from "@/services/novels.services";
import { NovelType, ReviewType } from "@/types";
import { getReviewsByNovelHandle } from "@/services/review.services";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import dynamic from "next/dynamic";
import { getAccessToken } from "@/services/cookies.servies";
import useSWR from "swr";
import axios from "axios";
import { useMediaQuery } from "usehooks-ts";
import LazyLoad from "react-lazy-load";
import Head from '@/components/Share/Head';


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
            <main>
                <WrapperLayout className="pt-5">
                    <div className="block -mx-4">
                        <div className="">
                            <div className="lg:flex">
                                <div className="lg:w-8/12 w-full px-4">
                                    <Outstanding novels={novelsOutstending} />
                                </div>
                                {!matchesTablet && (
                                    <div className="lg:w-4/12">
                                        <Reading readingNovel={novelReading?.novels} />
                                    </div>
                                )}
                            </div>
                        </div>
    
                        {!matchesTablet && (
                            <div className="">
                                <JustUpdated novels={novelsJustUpdated} />
                            </div>
                        )}
    
                        <div className="my-6">
                            <div className="lg:flex">
                                <div className="lg:w-8/12 w-full px-4">
                                    <HighlyRated novels={novelsHighlyRated as NovelHighlyRated[]} />
                                </div>
                                <div className="lg:w-4/12 w-full px-4">
                                    <LatestReviews reviews={novelsLatestReviews} />
                                </div>
                            </div>
                        </div>
    
                        <div className="hidden lg:flex flex-col lg:flex-row my-6">
                            {!matchesTablet && (
                                <div className="lg:w-4/12">
                                    <JustPosted novels={novelsOutstending} />
                                </div>
                            )}
                            <div className="lg:w-8/12">
                                <JustCompleted novels={novelsJustCompleted} />
                            </div>
                        </div>
                    </div>
                </WrapperLayout>
            </main>
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

            // data: JSON.stringify(query.params) || null
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

//             // data: JSON.stringify(query.params) || null
//         },
//         // revalidate: REVALIDATE_TIME,
//     };

// }

HomePage.getLayout = (page: ReactNode) => {
    return <MainLayout isBannerPage={true}>{page}</MainLayout>;
};

export default HomePage;
