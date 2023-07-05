import Link from "next/link";
import Image from "next/image"
import { ReactNode, useEffect, useState } from "react";

import LazyLoad from "react-lazy-load";
import { useSelector } from "react-redux";

import { NovelResType } from "@/types";
import Head from "@/components/Share/Head";
import MainLayout from "@/components/Layout/MainLayout";
import WrapperLayout from "@/components/Layout/WrapperLayout";
import { getAccessToken } from "@/services/cookies.servies";
import { getFollowNovelHandle } from "@/services/follow.services";
import ClientOnly from "@/components/Share/ClientOnly";
import PageTitle from "@/components/Share/PageTitle";
import ItemNovel from "@/components/Layout/ItemNovel";
import ItemNovelLazy from "@/components/Layout/ItemNovelLazy";
import BlurImage from "@/components/Layout/BlurImage";


interface NovelFollowPageProps {
    page: number;
}
const NovelFollowPage = ({ page }: NovelFollowPageProps) => {

    const { isAuthenticated } = useSelector(
        (state: any) => state.user
    );
    const [novelsFollows, setNovelsFollows] = useState<NovelResType[] | null>(null);

    const handleGetNovelsFollows = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                throw new Error("Bạn chưa đăng nhập");
            }
            const novelsRes = await getFollowNovelHandle(1, token as string);
            if(novelsRes.success) {
                setNovelsFollows(novelsRes.novels)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(isAuthenticated) {
            handleGetNovelsFollows()
        }
    }, [page])

    return (
        <>
            <Head title={`Truyện đang theo dõi - HobaNovel chính thức - HobaNovel`} />
            <WrapperLayout className="bg-[#f9f9f9] my-5">
                
                <ClientOnly>
                    <div className="grid">
                        <PageTitle>Truyện đang theo dõi</PageTitle>
                        <div className="">
                            {isAuthenticated ? (
                                <div className="lg:flex my-5">
    
                                    <div className="lg:w-8/12 px-4 mb-5">
                                        {
                                            novelsFollows ? (
                                                novelsFollows?.length > 0 ? (
                                                    <ul className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                                        {
                                                            novelsFollows?.map(
                                                                (novel : NovelResType) => {
                                                                    return (
                                                                        <li key={novel.novelId} >
                                                                            <ItemNovel novel={novel}/>
                                                                        </li>
                                                                    );
                                                                }
                                                            )
                                                        }
                                                    </ul>
                                                ) : (
                                                    <div>Không có truyện</div>
                                                )
                                            ) : (
                                                <div className="grid gap-6 md:grid-cols-2 grid-cols-1 px-4">
                                                    {[1,2,3,4,5,6,7,8,9,10].map((index) => (
                                                        <ItemNovelLazy key={index} />
                                                    ))}
                                                </div>
                                            )
                                        }
                                    </div>
    
                                    <div className="lg:w-4/12 px-4 mb-5">right</div>
    
                                </div>
                            ) : (
                                <div className="px-4">
                                    <div className="mb-4">
                                        Bạn chưa theo dõi truyện nào cả. Để theo dõi truyện, nhấn vào Theo
                                        dõi như hình bên dưới: Bạn nên{" "}
                                        <Link className="text-blue-600 font-" href="/auth/login"><u>Đăng nhập</u></Link> để truy cập truyện đã
                                        theo dõi của bạn ở bất cứ đâu
                                    </div>
    
                                    <div className="w-full h-[500px]">
                                        <BlurImage
                                            width={500}
                                            height={300}
                                            alt="Hướng dẫn follow novel"
                                            src="https://res.cloudinary.com/djrbd6ftt/image/upload/v1688482246/hobanovel/admin/Captur234e_fnfrhu.png"
                                            className="max-w-[500px] w-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </ClientOnly>

            </WrapperLayout>
        </>
    );
};

export default NovelFollowPage;

export const getServerSideProps = async (context: any) => {
    const { query } = context;

    try {
        return {
            props: {
                page: query.page || 1,
            },
        };
    } catch (error) {
        return { notFound: true };
    }
};

NovelFollowPage.getLayout = (page: ReactNode) => {
    return <MainLayout isBannerPage={false}>{page}</MainLayout>;
};
