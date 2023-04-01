import { useState } from "react";
import Image from "next/image"

import BlurImage from "../Layout/BlurImage";
import { placeholderBlurhash } from "@/constants";

const BannerPage = () => {
    const [isLoading, setLoading] = useState(true);

    return (
        <>
            <div className="max-w-full w-full relative">
                <div className="w-full h-[370px] overflow-hidden align-middle inline-block">
                    {/* <BlurImage
                        width={3000}
                        height={1000}
                        alt="image-demo"
                        blurDataURL={placeholderBlurhash}
                        className="group-hover:scale-105 group-hover:duration-75 object-cover w-full h-[370px]"
                        placeholder="blur"
                        src={`/images/slider-thumbnail-${
                            Math.floor(Math.random() * 7) + 1
                        }.png`}
                    /> */}
                    <Image
                        width={3000}
                        height={1000}
                        alt="image-demo"
                        src={`/images/slider-thumbnail-${
                            Math.floor(Math.random() * 7) + 1
                        }.png`}
                    />
                </div>
                <div style={{background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 70%);" }} className="w-full h-16 absolute bottom-0"></div>
            </div>
        </>
    );
};

export default BannerPage;
