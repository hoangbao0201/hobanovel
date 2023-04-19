import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { ReviewItemWith, ReviewType, UserType } from "@/types";
import { placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Layout/BlurImage";
import { getAccessToken } from "@/services/cookies.servies";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { replyReviewHandle } from "@/services/review.services";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { iconArrowTurnUp, iconComment, iconSend, iconStar, iconTrash } from "../../../../public/icons";

interface ReviewItemProps {
    novelId?: string
    user?: UserType
    review: ReviewItemWith
    handleDeleteReview: any
}

const ReviewItem = ({ novelId, review, user, handleDeleteReview } : ReviewItemProps) => {
    
    const [isReplyReview, setIsReplyReview] = useState(false);
    const [commentText, setCommentText] = useState(() => EditorState.createEmpty());

    const handlReplyReview = async () => {
        const token = getAccessToken();
        if (!token) {
            console.log("Bạn chưa đăng nhập");
            return;
        }
        if (!commentText || !novelId) {
            console.log("Data not found");
            return;
        }
        try {
            const data = {
                commentText: JSON.stringify(convertToRaw(commentText.getCurrentContent()))
            }
            const reviewResponse = await replyReviewHandle(novelId as string, review?.reviewId as string, data as ReviewType, token as string);

            if(reviewResponse?.data.success) {

            }

            console.log(reviewResponse)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div key={review?.reviewId || ""} className="border-b-2 border-gray-100">
            <div className="p-4 rounded-lg bg-gray-100 border my-4">
                <div className="flex mb-6">
                    <Link
                        href={`/user/1`}
                        className="w-11 h-11 mt-2 rounded-full overflow-hidden shadow align-middle inline-block"
                    >
                        <BlurImage
                            width={500}
                            height={500}
                            alt="image-demo"
                            blurDataURL={placeholderBlurhash}
                            className="group-hover:scale-105 group-hover:duration-500 object-cover w-11 h-11"
                            placeholder="blur"
                            src="/images/avatar-default-2.png"
                        />
                    </Link>
                    <div className="flex-1 ml-4">
                        <h2 className="line-clamp-1 text-base w-full font-semibold mb-2">
                            <Link href={""}>{review?.name || ""}</Link>
                        </h2>
                        <div className="flex items-center mb-4">
                            <div className="gap-1 relative">
                                <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">
                                    {iconStar}
                                </i>
                                <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">
                                    {iconStar}
                                </i>
                                <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">
                                    {iconStar}
                                </i>
                                <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">
                                    {iconStar}
                                </i>
                                <i className="w-4 mx-1 inline-block fill-yellow-400 opacity-40">
                                    {iconStar}
                                </i>

                                <div
                                    style={{
                                        width: `${
                                            review ? review?.mediumScore * 20 ?? 100 : 100
                                        }%`,
                                    }}
                                    className="max-w-full block whitespace-nowrap overflow-hidden absolute gap-1 top-0 left-0 right-0 bottom-0"
                                >
                                    <i className="w-4 mx-1 inline-block fill-yellow-500">
                                        {iconStar}
                                    </i>
                                    <i className="w-4 mx-1 inline-block fill-yellow-500">
                                        {iconStar}
                                    </i>
                                    <i className="w-4 mx-1 inline-block fill-yellow-500">
                                        {iconStar}
                                    </i>
                                    <i className="w-4 mx-1 inline-block fill-yellow-500">
                                        {iconStar}
                                    </i>
                                    <i className="w-4 mx-1 inline-block fill-yellow-500">
                                        {iconStar}
                                    </i>
                                </div>
                            </div>
                        </div>
                        <div className="text-gray-600 text-base">
                            {convertFromRaw(
                                JSON.parse(review?.commentText || "")
                            ).getPlainText()}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsReplyReview(value => !value)}
                            className={`border p-2 group rounded ${isReplyReview && 'bg-gray-400'}`}
                        >
                            <i className={`w-4 h-4 block ${isReplyReview ? 'fill-white' : 'fill-gray-500 group-hover:fill-gray-600'}`}>
                                {iconComment}
                            </i>
                        </button>
                        {user?.userId == review?.userId && (
                            <button
                                onClick={() => handleDeleteReview( review?.userId, review?.reviewId )}
                                className=" border p-2 group rounded"
                            >
                                <i className="w-4 h-4 block fill-gray-500 group-hover:fill-gray-600">
                                    {iconTrash}
                                </i>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* {review?.countReplyReview &&<div>Xem {review?.countReplyReview} câu trả lời</div>} */}
            <div className="ml-20 mb-4">
                {isReplyReview ? (
                    <div className="flex gap-2">
                        <Link
                            href={`/user/1`}
                            className="w-8 h-8 mt-2 rounded-full overflow-hidden shadow align-middle inline-block"
                        >
                            <Image
                                width={500}
                                height={500}
                                alt="image-demo"
                                className="object-cover w-8 h-8"
                                src={`${user?.avatarUrl ?? "/images/50.jpg"}`}
                            />
                        </Link>
                        <div className="flex-1 py-3 pl-4 pr-24 border bg-gray-100 border-opacity-5 rounded-md relative">
                            <EditorStyle
                                name="comment"
                                text={commentText}
                                handleOnchange={setCommentText}
                            />
                            <button onClick={handlReplyReview} className="py-2 px-4 rounded-sm transition-all bg-yellow-600 hover:bg-yellow-700 absolute bottom-4 right-4">
                                <i className="w-6 h-6 fill-white block translate-x-[1px]">{iconSend}</i>
                            </button>
                        </div>
                    </div>
                ) : (
                    review?.countReplyReview && (
                        <button className="p-1 flex items-center cursor-pointer">
                            <i className="w-3 h-3 mr-2 block translate-y-[1px] rotate-90 fill-gray-700">{iconArrowTurnUp}</i>{review?.countReplyReview} phản hồi
                        </button>
                    )
                    
                )}
            </div>
        </div>
    );
};

export default ReviewItem;
