
import { GetServerSideProps } from "next";

import useSWR from "swr";
import { BannersType } from "@/types";
import BlurImage from "../Layout/BlurImage";
import { placeholderBlurhash } from "@/constants";
// import { getSingleBannersHandle } from "@/services/banners.services";
import { useEffect, useState } from "react";

interface BannerPageProps {
    banners?: BannersType
}

const getSingleBannersHandle = async (): Promise<{ success: boolean, message: string, banners: BannersType }> => {
    const response = await fetch("http://localhost:4000/api/banners/get/single");
    const data = await response.json();
    return data;
};
  

const BannerPage = () => {
    const { data, error } = useSWR<{ success: boolean, message: string, banners: BannersType }>(
        "http://localhost:4000/api/banners/get/single",
        getSingleBannersHandle
    );

    console.log(data?.banners)

    return (
        <>
            <div className="w-full relative">
                <div className="w-full h-[370px] overflow-hidden align-middle inline-block">
                    {
                        data && (
                            <BlurImage
                                width={3000}
                                height={1000}
                                alt="image-demo"
                                blurDataURL={data?.banners?.imageBlurHash || placeholderBlurhash}
                                className="group-hover:scale-105 group-hover:duration-500 object-cover w-full h-[370px]"
                                placeholder="blur"
                                src={data?.banners?.bannersUrl ?? "/images/banners-default.jpg"}
                            />
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
            </div>
        </>
    );
};

export default BannerPage;
