import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";

import { REVALIDATE_TIME } from "@/constants";
import MainLayout from "@/components/Layout/MainLayout";
import {
    getNovelsByHighlyRatedHandle,
    getNovelsByOutstandingHandle,
    getNovelsByPageHandle,
} from "@/services/novels.services";
import Head from '@/components/Share/Head';
import { NovelType, ReviewType } from "@/types";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { getReviewsByNovelHandle } from "@/services/review.services";
import PageTitle from "@/components/Share/PageTitle";
import { iconAngleRight } from "../../public/icons";
import FormComment from "@/components/Share/FormComment";
import { AdsenseForm } from "@/components/Share/AdsenseForm";


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

    return (
        <>
            <Head />
            <WrapperLayout className="xs:-translate-y-28">
                <div className="grid">

                    <div className="lg:flex">
                        <div className="lg:w-8/12 mb-8">
                            <PageTitle>Truyện nổi bật</PageTitle>
                            <Outstanding novels={novelsOutstending} />
                        </div>
                        <div className="lg:w-4/12 lg:block hidden mb-8">
                            <PageTitle>Truyện đang đọc</PageTitle>
                            <Reading />
                        </div>
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
                    </div>

                    <AdsenseForm />

                    <div className="mt-8">
                        <PageTitle>Bình luận mới</PageTitle>
                        <FormComment />
                    </div>

                </div>
            </WrapperLayout>
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    // const query = context;
    // const data = { page: 1 };

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
