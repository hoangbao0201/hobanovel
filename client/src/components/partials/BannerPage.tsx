
import BlurImage from "../Layout/BlurImage";
import { placeholderBlurhash } from "@/constants";

const BannerPage = () => {

    return (
        <>
            <div className="w-full relative">
                <div className="w-full h-[370px] overflow-hidden align-middle inline-block">
                    <BlurImage
                        width={3000}
                        height={1000}
                        alt="image-demo"
                        blurDataURL={placeholderBlurhash}
                        className="group-hover:scale-105 group-hover:duration-500 object-cover w-full h-[370px]"
                        placeholder="blur"
                        src={`/images/banners/banner-${
                            Math.floor(Math.random() * 10) + 1
                        }.jpg`}
                    />
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
