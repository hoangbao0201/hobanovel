import Link from "next/link";

import { NovelType } from "@/types";
import { placeholderBlurhash } from "@/constants";
import BlurImage from "../Layout/BlurImage";

interface LatestReviewsProps {
    comments?: any
}

const LatestReviews = ({ comments } : LatestReviewsProps) => {

    return (
        <div className="mb-5">
            <h3 className="px-4 mb-5 text-xl font-semibold">Mới đánh giá</h3>
            <div className="px-4">


                <div className="p-4 rounded-lg bg-gray-100 mb-3">
                    <div className="flex mb-4 items-center">
                        <Link href={`/user/1`} className="w-10 h-10 rounded-full overflow-hidden shadow align-middle inline-block">
                            <BlurImage
                                width={500}
                                height={500}
                                alt="image-demo"
                                blurDataURL={placeholderBlurhash}
                                className="group-hover:scale-105 group-hover:duration-500 object-cover w-10 h-10"
                                placeholder="blur"
                                src="/images/avatar-default-2.png"
                            />
                        </Link>
                        <div className="flex-1 ml-4">
                            <h2 className="line-clamp-1 text-base w-full font-semibold mb-2">
                                <Link href={""}>
                                    Họ và tên Họ và tên Họ và tên Họ và tên Họ và tên
                                </Link>
                            </h2>
                            <div className="flex items-center mb-2">
                                <div className="py-[4px] px-3 rounded-full text-base leading-none text-white font-semibold bg-red-700">5.00</div>
                                <div className="ml-3 text-green-700 text-base">83 đánh giá</div>
                            </div>
                            <h2 className="line-clamp-1 text-sm w-full">
                                <Link href={""}>
                                    Tên Truyện Tên Truyện Tên Truyện Tên Truyện Tên Truyện Tên Truyện        
                                </Link>
                            </h2>
                        </div>
                    </div>
                    <div className="line-clamp-3 text-gray-600 text-sm">
                        Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content
                        Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content
                        Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content
                    </div>  
                </div>
                <div className="p-4 rounded-lg bg-gray-100 mb-3">
                    <div className="flex mb-4 items-center">
                        <Link href={`/user/1`} className="w-10 h-10 rounded-full overflow-hidden shadow align-middle inline-block">
                            <BlurImage
                                width={500}
                                height={500}
                                alt="image-demo"
                                blurDataURL={placeholderBlurhash}
                                className="group-hover:scale-105 group-hover:duration-500 object-cover w-10 h-10"
                                placeholder="blur"
                                src="/images/avatar-default-2.png"
                            />
                        </Link>
                        <div className="flex-1 ml-4">
                            <h2 className="line-clamp-1 text-base w-full font-semibold mb-2">
                                <Link href={""}>
                                    Họ và tên Họ và tên Họ và tên Họ và tên Họ và tên
                                </Link>
                            </h2>
                            <div className="flex items-center mb-2">
                                <div className="py-[4px] px-3 rounded-full text-base leading-none text-white font-semibold bg-red-700">5.00</div>
                                <div className="ml-3 text-green-700 text-base">83 đánh giá</div>
                            </div>
                            <h2 className="line-clamp-1 text-sm w-full">
                                <Link href={""}>
                                    Tên Truyện Tên Truyện Tên Truyện Tên Truyện Tên Truyện Tên Truyện        
                                </Link>
                            </h2>
                        </div>
                    </div>
                    <div className="line-clamp-3 text-gray-600 text-sm">
                        Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content
                        Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content
                        Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content
                    </div>  
                </div>
                <div className="p-4 rounded-lg bg-gray-100 mb-3">
                    <div className="flex mb-4 items-center">
                        <Link href={`/user/1`} className="w-10 h-10 rounded-full overflow-hidden shadow align-middle inline-block">
                            <BlurImage
                                width={500}
                                height={500}
                                alt="image-demo"
                                blurDataURL={placeholderBlurhash}
                                className="group-hover:scale-105 group-hover:duration-500 object-cover w-10 h-10"
                                placeholder="blur"
                                src="/images/avatar-default-2.png"
                            />
                        </Link>
                        <div className="flex-1 ml-4">
                            <h2 className="line-clamp-1 text-base w-full font-semibold mb-2">
                                <Link href={""}>
                                    Họ và tên Họ và tên Họ và tên Họ và tên Họ và tên
                                </Link>
                            </h2>
                            <div className="flex items-center mb-2">
                                <div className="py-[4px] px-3 rounded-full text-base leading-none text-white font-semibold bg-red-700">5.00</div>
                                <div className="ml-3 text-green-700 text-base">83 đánh giá</div>
                            </div>
                            <h2 className="line-clamp-1 text-sm w-full">
                                <Link href={""}>
                                    Tên Truyện Tên Truyện Tên Truyện Tên Truyện Tên Truyện Tên Truyện        
                                </Link>
                            </h2>
                        </div>
                    </div>
                    <div className="line-clamp-3 text-gray-600 text-sm">
                        Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content
                        Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content
                        Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content Content
                    </div>  
                </div>


                {/* {
                    comments?.map((novel : NovelType, index) => {
                        return (
                            <div key={index} className="flex mb-3">
                                <Link href={`/novel/${novel.slug}`} className="w-10 h-14 overflow-hidden shadow align-middle inline-block">
                                    <BlurImage
                                        width={720}
                                        height={960}
                                        alt="image-demo"
                                        blurDataURL={placeholderBlurhash}
                                        className="group-hover:scale-105 group-hover:duration-500 object-cover w-10 h-14"
                                        placeholder="blur"
                                        src={novel.thumbnailUrl}
                                    />
                                </Link>
                                <div className="flex-1 ml-3">
                                    <Link className="block" href={`/novel/${novel.slug}`}>
                                        <h2 className="mb-1 text-base line-clamp-1 font-semibold">
                                            {novel.title}
                                        </h2>
                                        <div className="text-slate-600">Đã đọc: 0/1466</div>
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                } */}
            </div>
        </div>
    )
}

export default LatestReviews;