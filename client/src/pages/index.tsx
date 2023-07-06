import { ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";

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
import ClientOnly from "@/components/Share/ClientOnly";
import { getAccessToken } from "@/services/cookies.servies";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { getReviewsByNovelHandle } from "@/services/review.services";
import PageTitle from "@/components/Share/PageTitle";
import { iconAngleRight } from "../../public/icons";

// import Outstanding from "@/components/Share/ContentHome/Outstanding";
// import Reading from "@/components/Share/ContentHome/Reading";
// import JustUpdated from "@/components/Share/ContentHome/JustUpdated";
// import HighlyRated from "@/components/Share/ContentHome/HighlyRated";
// import JustPosted from "@/components/Share/ContentHome/JustPosted";
// import LatestReviews from "@/components/Share/ContentHome/LatestReviews";
// import JustCompleted from "@/components/Share/ContentHome/JustCompleted";


type NovelHighlyRated = NovelType & { mediumScore: number };
interface HighlyRatedProps {
    novels?: NovelHighlyRated[];
}

export interface PageHomeProps {
    data: any;
    novelsOutstending?: NovelType[];
    novelsJustUpdated?: NovelType[];
    novelsHighlyRated?: NovelHighlyRated[];
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
    const matchesTablet = useMediaQuery("(max-width: 1024px)");

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
            {/* sm:-translate-y-28 */}
            <WrapperLayout className="xs:-translate-y-28">
                <div className="grid">

                    <div className="lg:flex">
                        <div className="lg:w-8/12 mb-8">
                            <PageTitle>Truyện nổi bật</PageTitle>
                            <Outstanding novels={novelsOutstending} />
                        </div>
                        <ClientOnly>
                            {!matchesTablet && (
                                <div className="lg:w-4/12 mb-8">
                                    <PageTitle>Truyện đang đọc</PageTitle>
                                    <Reading readingNovel={novelReading?.novels} />
                                </div>
                            )}
                        </ClientOnly>
                    </div>
                    
                    <div className="max-lg:hidden mb-6">
                        <PageTitle>Truyện mới cập nhật</PageTitle>
                        <JustUpdated novels={novelsJustUpdated} />
                    </div>

                    <div className="lg:flex">
                        <div className="lg:w-8/12 mb-8">
                            <PageTitle>Truyện đánh giá cao</PageTitle>
                            <HighlyRated novels={novelsHighlyRated as NovelHighlyRated[]} />
                        </div>
                        <div className="lg:w-4/12 mb-8">
                            <PageTitle>Mới đánh giá</PageTitle>
                            <LatestReviews reviews={novelsLatestReviews} />
                        </div>
                    </div>

                    <div className="lg:flex relative max-lg:hidden">
                        <>
                            <div className="lg:w-4/12">
                                <PageTitle>Mới đăng</PageTitle>
                                <JustPosted novels={novelsOutstending} />
                            </div>
                            <div className="lg:w-8/12">
                                <h2 className="text-[18px] uppercase font-bold px-4 mb-3 flex items-center">
                                    <span className="">Mới hoàn thành <i className="w-4 h-4 inline-block">{iconAngleRight}</i></span>
                                </h2>
                                <JustCompleted novels={novelsJustCompleted} />
                            </div>
                        </>
                    </div>

                </div>
            </WrapperLayout>
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
    // const novelReading = await getReadingNovelHandle(1);

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

HomePage.getLayout = (page: ReactNode) => {
    return <MainLayout isBannerPage={true}>{page}</MainLayout>;
};

export default HomePage;
