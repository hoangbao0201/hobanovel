
import { GetServerSideProps } from "next";

import useSWR from "swr";
import { BannersType } from "@/types";
import BlurImage from "../Layout/BlurImage";
import { placeholderBlurhash } from "@/constants";
// import { getSingleBannersHandle } from "@/services/banners.services";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperButton from "../Buttons/SwiperButton";
import { Pagination } from "swiper";

type ResBannerProps = Pick<BannersType, 'bannersId' | 'bannersUrl' | 'imageBlurHash' | 'slug'>


const getSingleBannersHandle = async (): Promise<{ success: boolean, message: string, banners: ResBannerProps }> => {
    const response = await fetch("http://localhost:4000/api/banners/get/single");
    const data = await response.json();
    return data;
};

const dataFakeBannersMobile = [
    {
        bannersId: "1",
        bannersPublicId: "11",
        bannersUrl: "https://static.cdnno.com/storage/topbox/69ef3e6a1983ea50f8da66c3024ce726.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "111",
        title: "fake title",
        updatedAt: ""
    },
    {
        bannersId: "2",
        bannersPublicId: "22",
        bannersUrl: "https://static.cdnno.com/storage/topbox/f97fc8a67807526399663149a543e5d4.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "222",
        title: "fake title",
        updatedAt: ""
    },
    {
        bannersId: "3",
        bannersPublicId: "33",
        bannersUrl: "https://static.cdnno.com/storage/topbox/38c3db22caeeb3806c7cc4123e67f334.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "333",
        title: "fake title",
        updatedAt: ""
    },
    {
        bannersId: "4",
        bannersPublicId: "44",
        bannersUrl: "https://static.cdnno.com/storage/topbox/f1ec33fbef50029b4177f7a62bcd9287.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "444",
        title: "fake title",
        updatedAt: ""
    },
    {
        bannersId: "5",
        bannersPublicId: "55",
        bannersUrl: "https://static.cdnno.com/storage/topbox/179b2c878f036f49c9419370cdc3b955.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "555",
        title: "fake title",
        updatedAt: ""
    },
    {
        bannersId: "6",
        bannersPublicId: "66",
        bannersUrl: "https://static.cdnno.com/storage/topbox/7586506594143472b1634d8c7a80427d.jpg",
        createdAt: "",
        imageBlurHash: null,
        novelId: "666",
        title: "fake title",
        updatedAt: ""
    },
]
  

const BannerPage = () => {

    const matchesMobile = useMediaQuery('(max-width: 640px)') 

    const { data: BannersRes } = useSWR<{ banners: any }>(
        `${matchesMobile ? "multiple" : "single"}`,
        async (query) => {
            const res = await axios(`http://localhost:4000/api/banners/get/${query}`);
            if(!res.data.success || !res) {
                throw new Error();
            }
            
            return {
                banners: res.data.banners
            }
        },
        {
            onErrorRetry: (error, _, __, revalidate, { retryCount }) => {
                if(error.status === 404) {
                    return
                }
                if(retryCount >= 1) {
                    return
                }
                setTimeout(() => {
                    revalidate({ retryCount })
                }, 2000)
            }
        }
    );

    // console.log("banners: ", BannersRes?.banners)

    return (
        <>
            <div className="w-full relative select-none">
                {
                    matchesMobile ? (
                        <div className="w-full h-[180px]">
                            <Swiper
                                loop={true}
                                spaceBetween={18}
                                slidesPerView={1}
                                navigation={true}
                                pagination={true}
                                className="w-full h-full overflow-hidden"
                                modules={[Pagination]}
                            >
                                <SwiperButton
                                    type="prev"
                                    styleButton="absolute top-1/2 -translate-y-1/2 z-40 p-3 active:bg-opacity-80 bg-slate-50 rounded-sm bg-opacity-50 border left-0"
                                    styleIcon="h-4 w-4 fill-slate-400 stroke-slate-600"   
                                />
                                <SwiperButton
                                    type="next"
                                    styleButton="absolute top-1/2 -translate-y-1/2 z-40 p-3 active:bg-opacity-80 bg-slate-50 rounded-sm bg-opacity-50 border right-0"
                                    styleIcon="h-4 w-4 fill-slate-400 stroke-slate-600"   
                                />
                                {
                                    dataFakeBannersMobile.map((banner : any) => {
                                        return (
                                            <SwiperSlide
                                                className=""
                                                key={banner.bannersId}
                                            >
                                                <Link href={`/truyen/${banner?.slug}`} className="w-full h-[180px] rounded-md overflow-hidden align-middle inline-block">
                                                    <BlurImage
                                                        width={160}
                                                        height={200}
                                                        alt="image-demo"
                                                        blurDataURL={banner?.imageBlurHash || placeholderBlurhash}
                                                        className="block object-cover w-full h-full"
                                                        placeholder="blur"
                                                        src={banner?.bannersUrl ?? "/images/banners-default.jpg"}
                                                    />
                                                </Link>
                                            </SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper>
                        </div>
                    ) : (
                        <>
                            <div className="w-full h-[370px] overflow-hidden align-middle inline-block">
                                {
                                    BannersRes?.banners && (
                                        <Link href={`/truyen/${BannersRes?.banners?.slug}`}>
                                            <BlurImage
                                                width={3000}
                                                height={1000}
                                                alt="image-demo"
                                                blurDataURL={BannersRes?.banners?.imageBlurHash || placeholderBlurhash}
                                                className="group-hover:scale-105 group-hover:duration-500 object-cover w-full h-full"
                                                placeholder="blur"
                                                src={BannersRes?.banners?.bannersUrl ?? "/images/banners-default.jpg"}
                                            />
                                        </Link>
                                    )
                                }
                            </div>
                            <div
                                style={{
                                    background:
                                        "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 70%)",
                                }}
                                className="w-full h-16 absolute bottom-0"
                            ></div>
                        </>
                    )
                }
            </div>
        </>
    );
};

export default BannerPage;
