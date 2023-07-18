import Link from "next/link";

import LazyLoad from "react-lazy-load";

import { placeholderBlurhash } from "@/constants";
import { convertFromRaw } from "draft-js";
import { ReviewType } from "@/types";
import BlurImage from "@/components/Share/BlurImage";

interface LatestReviewsProps {
    reviews?:  ReviewType[]
}

const LatestReviews = ({ reviews } : LatestReviewsProps) => {

    // console.log("reviews: ", reviews)

    // console.log(reviews)

    return (
        <ul className="px-4 mb-4">

            {
                reviews?.map((review) => {
                    return (
                        <li key={review.reviewId} className="p-4 rounded bg-gray-100 mb-3">
                            <div className="flex mb-4 items-center">
                                <Link href={`/user/1`}>
                                    <LazyLoad className="relative w-10 h-10 overflow-hidden shadow rounded-full align-middle">
                                        <BlurImage
                                            width={48}
                                            height={48}
                                            alt="image-demo"
                                            blurDataURL={placeholderBlurhash}
                                            className="group-hover:scale-105 group-hover:duration-500 object-cover w-10 h-10"
                                            placeholder="blur"
                                            src="/images/avatar-default-2.png"
                                        />
                                    </LazyLoad>
                                </Link>
                                <div className="flex-1 ml-4">
                                    <span className="line-clamp-1 text-base w-full font-semibold mb-2">
                                        <Link href={``}>
                                            {review.name}
                                        </Link>
                                    </span>
                                    <div className="flex items-center mb-2">
                                        <span className="py-[3px] lg:px-3 px-2 rounded lg:text-sm text-xs leading-none text-white font-semibold bg-red-700">{review.mediumScore}</span>
                                        <span className="ml-3 text-green-700 lg:text-sm text-xs font-semibold line-clamp-1">83 đánh giá</span>
                                    </div>
                                    <h3 title={`${review.title}`} className="line-clamp-1 font-semibold lg:text-sm text-xs">
                                        <Link href={`/truyen/${review.slug}`}>
                                            {review.title}
                                        </Link>
                                    </h3>
                                </div>
                            </div>
                            <div className="line-clamp-3 text-gray-600 text-sm">
                                {convertFromRaw(
                                    JSON.parse(review?.commentText || "")
                                ).getPlainText()}
                            </div>  
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default LatestReviews;