import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/pagination';
import "swiper/css/effect-coverflow";

import axios from "axios";
import Link from "next/link";
import { apiUrl, placeholderBlurhash } from "@/constants";
import { BannersType } from "@/types";
import styled from "styled-components";
import BlurImage from "../Layout/BlurImage";
import { useMediaQuery } from "usehooks-ts";
// import SwiperButton from "../features/SwiperButton";
import { ListStarLayout } from "../Layout/ListStarLayout";
import ClientOnly from "../Share/ClientOnly";

type ResBannerProps = Pick<BannersType, "bannersId" | "bannersUrl" | "imageBlurHash" | "slug">;

// const getSingleBannersHandle = async (): Promise<{ success: boolean, message: string, banners: ResBannerProps }> => {
//     const response = await fetch("http://localhost:4000/api/banners/get/single");
//     const data = await response.json();
//     return data;
// };

export const dataFakeBannersMobile = [
    {
        bannersId: "1",
        bannersPublicId: "11",
        bannersUrl:
            "https://static.cdnno.com/storage/topbox/69ef3e6a1983ea50f8da66c3024ce726.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "111",
        title: "fake title",
        updatedAt: "",
    },
    {
        bannersId: "2",
        bannersPublicId: "22",
        bannersUrl:
            "https://static.cdnno.com/storage/topbox/f97fc8a67807526399663149a543e5d4.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "222",
        title: "fake title",
        updatedAt: "",
    },
    {
        bannersId: "3",
        bannersPublicId: "33",
        bannersUrl:
            "https://static.cdnno.com/storage/topbox/38c3db22caeeb3806c7cc4123e67f334.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "333",
        title: "fake title",
        updatedAt: "",
    },
    {
        bannersId: "4",
        bannersPublicId: "44",
        bannersUrl:
            "https://static.cdnno.com/storage/topbox/f1ec33fbef50029b4177f7a62bcd9287.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "444",
        title: "fake title",
        updatedAt: "",
    },
    {
        bannersId: "5",
        bannersPublicId: "55",
        bannersUrl:
            "https://static.cdnno.com/storage/topbox/179b2c878f036f49c9419370cdc3b955.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "555",
        title: "fake title",
        updatedAt: "",
    },
    {
        bannersId: "6",
        bannersPublicId: "66",
        bannersUrl:
            "https://static.cdnno.com/storage/topbox/7586506594143472b1634d8c7a80427d.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "666",
        title: "fake title",
        updatedAt: "",
    },
];

const GridSwiperStyled = styled.div`
    .swiper-slide {
        opacity: 0.5;
        box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
        background-color: #eee;
        transition: all 0.2s ease-in-out;
    }
    .swiper-slide-active {
        opacity: 1;
    }
`;

interface BannersIntroProps {}

const BannersIntro = ({}: BannersIntroProps) => {
    const matchesMobile = useMediaQuery("(max-width: 475px)");

    const [isLoading, setLoading] = useState(true);
    const [banners, setBanners] = useState<null | BannersType>();

    const eventGetBannersNovel = async () => {
        try {
            const res = await axios(`${apiUrl}/api/banners/get/single`);
            if (!res.data.success || !res) {
                throw new Error();
            }

            setBanners(res.data.banners);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        eventGetBannersNovel();
    }, []);

    const handleLoadingComplete = () => {
        setLoading(false);
    };

    // console.log(banners)

    return (
        // style={{ transition: "height 0.2s ease" }}
        <nav className="relative w-full">
            <div className="max-w-7xl lg:h-80 h-56 mx-auto overflow-hidden">
                <ClientOnly>
                    <GridSwiperStyled className="w-full h-full">
                        <Swiper
                            loop={true}
                            centeredSlides
                            slidesPerView={1}
                            autoplay={{
                                delay: 4000
                            }}
                            className="w-full h-full"
                            pagination={{
                                clickable: true,
                                renderBullet: function (index, className) {
                                    return '<div class="pagination-banners-style ' + className + ' "><span></span></div>';
                                },
                            }}
                            modules={[Autoplay, Pagination]}
                        >   
    
                            {
                                matchesMobile ? (
                                    <>
                                        {
                                            dataFakeBannersMobile ? (
                                                dataFakeBannersMobile.map((item) => {
                                                    return (
                                                        <SwiperSlide
                                                            data-banner-id={item.bannersId}
                                                            key={item.bannersId}
                                                            className="border"
                                                        >
                                                            <div className="p-4">
                                                                <Link
                                                                    href="/truyen/truong-sinh-theo-cuoi-vo-bat-dau"
                                                                    className="w-full h-full"
                                                                >
                                                                    <Image
                                                                        width={768}
                                                                        height={360}
                                                                        alt="banners novel"
                                                                        className={`bg-black/70 rounded-md group-hover:scale-105 group-hover:duration-500 object-cover h-full block duration-700 ease-in-out ${isLoading ? "scale-105" : "scale-100"}`}
                                                                        onLoad={handleLoadingComplete}
                                                                        onLoadingComplete={() => setLoading(false)}
                                                                        blurDataURL={placeholderBlurhash}
                                                                        placeholder="blur"
                                                                        src={item?.bannersUrl}
                                                                    />
                                                                </Link>
                                                            </div>
                                                        </SwiperSlide>
                                                    )
                                                })
                                            ) : (
                                                <></>
                                            )
                                        }
                                    </>
                                ) : (
                                    <SwiperSlide data-banner-id={`bannerCp`} key={"bannerCp"} className="">
                                        <Link
                                            href="/truyen/truong-sinh-theo-cuoi-vo-bat-dau"
                                            className="w-full h-full"
                                        >
                                            {
                                                banners ? (
                                                    <Image
                                                        width={3000}
                                                        height={1000}
                                                        alt="banners novel"
                                                        className={`bg-black/70 group-hover:scale-105 group-hover:duration-500 object-cover h-full block duration-700 ease-in-out ${isLoading ? "scale-105" : "scale-100"}`}
                                                        onLoad={handleLoadingComplete}
                                                        onLoadingComplete={() => setLoading(false)}
                                                        blurDataURL={banners?.imageBlurHash}
                                                        placeholder="blur"
                                                        src={banners?.bannersUrl}
                                                    />
                                                ) : (
                                                    <></>
                                                )
                                            }
                                        </Link>
                                    </SwiperSlide>
                                )
                            }
    
                        </Swiper>
                    </GridSwiperStyled>
                </ClientOnly>
            </div>
        </nav>
    )

    // return (
    //     <ClientOnly>
    //         <nav className={`w-full relative select-none`}>
    //             {
    //                 matchesMobile ? (
    //                     <div className="relative overflow-hidden">
    //                         <GridSwiperStyled className="relative">
    //                             <Swiper
    //                                 loop={true}
    //                                 centeredSlides
    //                                 slidesPerView={1}
    //                                 spaceBetween={18}
    //                                 className=""
    //                             >
    //                                 <SwiperButton
    //                                     type="prev"
    //                                     styleButton="absolute top-1/2 -translate-y-1/2 z-40 p-4 active:bg-opacity-80 bg-slate-50 rounded-sm bg-opacity-50 border left-[18px]"
    //                                     styleIcon="h-4 w-4 fill-slate-400 stroke-slate-600"
    //                                 />
    //                                 <SwiperButton
    //                                     type="next"
    //                                     styleButton="absolute top-1/2 -translate-y-1/2 z-40 p-4 active:bg-opacity-80 bg-slate-50 rounded-sm bg-opacity-50 border right-[18px]"
    //                                     styleIcon="h-4 w-4 fill-slate-400 stroke-slate-600"
    //                                 />
    //                             {dataFakeBannersMobile.map((banner, index) => {
    //                                 return (
    //                                         <SwiperSlide
    //                                             data-banner-id={banner.bannersId}
    //                                             key={index}
    //                                             className=""
    //                                         >
    //                                             <div className="bg-white p-3">
    //                                                 <Link className="block relative" href={`/`}>
    //                                                     <Image
    //                                                         width={500}
    //                                                         height={500}
    //                                                         alt="banner thumbnail banner"
    //                                                         className="h-[200px] inset-0 block object-cover rounded-md overflow-hidden mx-auto"
    //                                                         src={banner.bannersUrl}
    //                                                     />
    //                                                 </Link>
    //                                             </div>
    //                                         </SwiperSlide>
    //                             </Swiper>
    //                         </GridSwiperStyled>
    //                     </div>
    //                 ) : (
    //                     <>
    //                         <div className="w-full overflow-hidden align-middle inline-block">
    //                             {banners ? (
    //                                 <Link href={`/truyen/${banners?.slug}`} className="flex justify-center h-[370px]">
    //                                     <Image
    //                                         width={3000}
    //                                         height={1000}
    //                                         alt="banners novel"
    //                                         className={cn(
    //                                             "bg-black/70 group-hover:scale-105 group-hover:duration-500 object-cover h-full block duration-700 ease-in-out",
    //                                             isLoading ? "scale-105" : "scale-100"
    //                                         )}
    //                                         onLoad={handleLoadingComplete}
    //                                         onLoadingComplete={() => setLoading(false)}
    //                                         blurDataURL={banners?.imageBlurHash}
    //                                         placeholder="blur"
    //                                         src={banners?.bannersUrl}
    //                                     />
    //                                 </Link>
    //                             ) : (
    //                                 <div></div>
    //                             )}
    //                         </div>
    //                         <div
    //                             style={{
    //                                 background:
    //                                     "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 70%)",
    //                             }}
    //                             className="w-full h-16 absolute bottom-0"
    //                         ></div>
    //                     </>
    //                 )
    //             }
    //         </nav>
    //     </ClientOnly>
    // );

    // const pagination = {
    //     clickable: true,
    //     renderBullet: function (index : number, className : string) {
    //         return (
    //             `
    //                 <span></span>
    //             `
    //         )
    //     },
    // };

    return (
        <>
            {/* <GridSwiperStyled className="relative transition-all max-w-7xl w-full lg:h-80 h-60 mx-auto bg-gray-400 select-none">
                <Swiper
                    loop={true}
                    centeredSlides
                    slidesPerView={1}
                    spaceBetween={18}
                    className="w-full h-full"
                    // pagination={{
                    //     clickable: true,
                    // }}
                    // modules={[Pagination]}
                >
    
                    <SwiperSlide data-banner-id={1} key={1} className=""> */}
                        <div className="sm:hidden absolute w-full h-full bg-white/5 backdrop-blur-md" />
                        <div
                            className="h-full w-full bg-center"
                            style={{
                                backgroundImage: `URL(https://res.cloudinary.com/djrbd6ftt/image/upload/v1687581947/hobanovel/admin/banners/1687581944703.jpg)`,
                                backgroundPosition: "center",
                                backgroundSize: "auto 100%",
                                backgroundRepeat: "no-repeat",
                            }}
                        ></div>
                        <Link
                            href="/truyen/truong-sinh-theo-cuoi-vo-bat-dau"
                            className="sm:hidden absolute w-full h-full top-0 left-0 flex items-center justify-center"
                        >
                            <div className="flex px-10">
                                <BlurImage
                                    width={80}
                                    height={112}
                                    alt={`truyện TRƯỜNG SINH THEO CƯỚI VỢ BẮT ĐẦU`}
                                    className="group-hover:scale-105 group-hover:duration-500 w-20 h-28 shadow-white shadow-sm"
                                    src="https://res.cloudinary.com/djrbd6ftt/image/upload/v1687593697/hobanovel/novel/thumbnail/300_ytxgyw.jpg"
                                />
                                <div className="ml-3 text-white">
                                    <h3
                                        title={`truyện TRƯỜNG SINH THEO CƯỚI VỢ BẮT ĐẦU`}
                                        className="mb-3 text-base line-clamp-2 font-semibold"
                                    >
                                        TRƯỜNG SINH THEO CƯỚI VỢ BẮT ĐẦU ddddđ ddddđ dddddđ ddddđ
                                        ddddd
                                    </h3>
                                    <div className="mb-2">
                                        bởi <span>Hỉ Ái Cật Hoàng Qua</span>
                                    </div>
                                    <ListStarLayout numb={4.5} />
                                </div>
                            </div>
                        </Link>
                    {/* </SwiperSlide>
                </Swiper>
            </GridSwiperStyled> */}
        </>
    );
};

export default BannersIntro;

// const { data: BannersRes } = useSWR<{ banners: any }>(
//     `${matchesMobile ? "multiple" : "single"}`,
//     async (query) => {
//         const res = await axios(`http://localhost:4000/api/banners/get/${query}`);
//         if(!res.data.success || !res) {
//             throw new Error();
//         }

//         return {
//             banners: res.data.banners
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

// console.log("banners: ", BannersRes?.banners)
