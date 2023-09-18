import Image from "next/image";
import { useEffect, useState } from "react";

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
import { useMediaQuery } from "usehooks-ts";
import ClientOnly from "../Share/ClientOnly";
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

    return (
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
                                            href={`/truyen/${banners?.slug}`}
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
};

export default BannersIntro;
