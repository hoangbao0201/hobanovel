import Link from "next/link";

import { placeholderBlurhash } from "@/constants";
import BlurImage from "../Layout/BlurImage";
import { convertFromRaw } from "draft-js";
import { NovelType, ReviewType } from "@/types";

interface LatestReviewsProps {
    reviews?:  ReviewType[]
}

const LatestReviews = ({ reviews } : LatestReviewsProps) => {

    // console.log("reviews: ", reviews)

    return (
        <div className="mb-5">
            <h3 className="px-4 mb-5 text-xl font-semibold">Mới đánh giá</h3>
            <div className="px-4">

                {
                    reviews?.map((review) => {
                        return (
                            <div key={review.reviewId} className="p-4 rounded-lg bg-gray-100 mb-3">
                                <div className="flex mb-4 items-center">
                                    <Link href={`/user/1`} className="w-12 h-12 rounded-full overflow-hidden shadow align-middle inline-block">
                                        <BlurImage
                                            width={48}
                                            height={48}
                                            alt="image-demo"
                                            blurDataURL={placeholderBlurhash}
                                            className="group-hover:scale-105 group-hover:duration-500 object-cover w-12 h-12"
                                            placeholder="blur"
                                            src="/images/avatar-default-2.png"
                                        />
                                    </Link>
                                    <div className="flex-1 ml-4">
                                        <h2 className="line-clamp-1 text-base w-full font-semibold mb-2">
                                            <Link href={``}>
                                                {review.name}
                                            </Link>
                                        </h2>
                                        <div className="flex items-center mb-2">
                                            <div className="py-[3px] lg:px-3 px-2 rounded-full lg:text-base text-sm leading-none text-white font-semibold bg-red-700">{review.mediumScore}</div>
                                            <div className="ml-3 text-green-700 lg:text-base text-sm font-semibold line-clamp-1">83 đánh giá</div>
                                        </div>
                                        <h2 className="line-clamp-2 font-semibold text-sm w-full">
                                            <Link href={`/truyen/${review.slug}`}>
                                                {review.title}
                                            </Link>
                                        </h2>
                                    </div>
                                </div>
                                <div className="line-clamp-3 text-gray-600 text-sm">
                                    {convertFromRaw(
                                        JSON.parse(review?.commentText || "")
                                    ).getPlainText()}
                                </div>  
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default LatestReviews;