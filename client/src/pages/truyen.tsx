import { ReactNode, useEffect } from "react";

import ItemNovelLazy from "@/components/Share/ItemNovelLazy";
import MainLayout from "@/components/Layout/MainLayout";
import WrapperLayout from "@/components/Layout/WrapperLayout"
import Head from "@/components/Share/Head";



interface NovelPageProps {
    queryPage: any
}

const NovelPage = ({ queryPage } : NovelPageProps) => {

    // Run
    useEffect(() => {
    }, [queryPage])

    return (
        <>
            <Head />
            <WrapperLayout>

                {/* <div className="mt-5">
                    {
                        !isLoad ? (
                            listNovels.length > 0 ? (
                                <>
                                    <div className="grid gap-6 md:grid-cols-2 grid-cols-1 px-4">
                                        {
                                            listNovels.map((novel) => {
                                                return (
                                                    <Fragment key={novel.novelId}>
                                                        <ItemNovel
                                                            novel={novel}
                                                            isAuthor={true}
                                                            isChapterCount={true}
                                                        />
                                                    </Fragment>

                                                )
                                            })
                                        }
                                    </div>
                                    <div className="flex justify-center my-5">
                                        <PaginationLayout countPage={countPage} currentPage={currentPage} handleChangePage={handleNextPage}/>
                                    </div>
                                </>
                            ) : (
                                <div className="px-4">Không có truyện nào</div>
                            )
                        ) : (
                            // <LoadingForm />
                            <div className="grid gap-6 md:grid-cols-2 grid-cols-1 px-4">
                                {[1,2,3,4,5,6,7,8,9,10,11,12].map((index) => (
                                    <ItemNovelLazy key={index} />
                                ))}
                            </div>
                        )
                        
                    }
                </div> */}
                
            </WrapperLayout>
        </>
    )
}

export default NovelPage;

export const getServerSideProps = async (
    context: any
) => {
    const { query } = context;    

    try {
        return {
            props: {
                queryPage: query
            },
        };
    } catch (error) {
        return { notFound: true };
    }
};

NovelPage.getLayout = (page : ReactNode) => {

    return (
        <MainLayout isBannerPage={false}>
            {page}
        </MainLayout>
    )
}