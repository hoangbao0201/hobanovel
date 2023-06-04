import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import moment from "moment";
import "moment/locale/vi";
import 'tippy.js/themes/light-border.css';
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

import { placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Layout/BlurImage";
import { getAccessToken } from "@/services/cookies.servies";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { ReviewItemWith, ReviewType, UserType } from "@/types";
import { addReplyReviewHandle, destroyReplyReviewsByNovelHandle, getReplyReviewsHandle } from "@/services/review.services";
import {
    iconArrowTurnUp,
    iconComment,
    iconEllipsis,
    iconOclock,
    iconSend,
    iconStar,
    iconTrash,
} from "../../../../public/icons";

interface ReviewItemProps {
    novelId?: string;
    user?: UserType;
    review: ReviewType;
    handleDeleteReview: any;
}

const ReviewItem = ({ novelId, review, user, handleDeleteReview }: ReviewItemProps) => {
    const [isFormSend, setIsFormSend] = useState<boolean>(false);
    const [isReplyReview, setIsReplyReview] = useState<boolean>(false);
    const [replyReviews, setReplyReviews] = useState<ReviewType[]>([]);
    const [commentText, setCommentText] = useState(() => EditorState.createEmpty());

    const handleAddReplyReview = async () => {
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
                commentText: JSON.stringify(convertToRaw(commentText.getCurrentContent())),
            };

            const reviewResponse = await addReplyReviewHandle(
                novelId as string,
                review?.reviewId as string,
                data as ReviewType,
                token as string
            );

            console.log(reviewResponse?.data?.review?.reviewId)
            
            if (reviewResponse?.data.success) {
                setCommentText(() => EditorState.createEmpty())
                const dataReplyReview : any = {
                    receiverName: review.name,
                    receiverId: review.userId,
                    senderName: user?.name,
                    senderId: user?.userId,
                    commentText: data.commentText,
                    reviewId: reviewResponse?.data?.review?.reviewId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
                setReplyReviews([
                    ...replyReviews,
                    dataReplyReview
                ])
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleGetReplyReviews = async () => {
        setIsReplyReview(true)
        setIsFormSend(true)
        try {
            const reviewResponse = await getReplyReviewsHandle(review?.reviewId);
            if (reviewResponse?.data.success) {
                setReplyReviews(value => [
                    ...reviewResponse?.data?.reviews,
                    // ...value
                ]);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleDestroyReplyReview = async (reviewId: string | undefined) => {
        if(!user?.userId || !review.reviewId) {
            return;
        }
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }
            const reviewResponse = await destroyReplyReviewsByNovelHandle(reviewId as string, token);
            if(reviewResponse?.data.success) {
                const filterReplyReviews = replyReviews.filter((replyReview) => replyReview?.reviewId !== reviewId)
                setReplyReviews(filterReplyReviews);
            }

            console.log(reviewResponse);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex mb-4">
            <Link
                href={`/user/1`}
                className="w-10 h-10 mt-2 rounded-full overflow-hidden shadow align-middle inline-block"
            >
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
            <div className="ml-3 flex-1 relative">

                <span
                    className="
                    absolute
                    w-0 h-0 left-0 top-5
                    -translate-x-[6px]
                    border-t-[6px] border-t-transparent
                    border-r-[6px] border-gray-300
                    border-b-[6px] border-b-transparent
                "
                ></span>

                <div>
                    <div className="bg-gray-100 border p-2">
                        <div className="flex items-center gap-2 pb-2 mb-2 border-b text-sm">
                            <h2 className="line-clamp-1 text-base leading-tight font-semibold">
                                <Link href={""}>{review?.name || ""}</Link>
                            </h2>
                        </div>
                        <div className="text-gray-600 text-base">
                            {convertFromRaw(
                                JSON.parse(review?.commentText || "")
                            ).getPlainText()}
                        </div>
                    </div>
                    <div className="flex text-sm gap-2 text-[#3f94d5] fill-[#3f94d5] font-semibold">
                        <button
                            onClick={() => setIsFormSend((value) => !value)}
                            className="flex items-center gap-1"
                        >
                            <i className="w-3 h-3 block">{iconComment}</i>
                            <span>Phản hồi</span>
                        </button>

                        <Tippy
                            trigger="click"
                            arrow={true}
                            animation="fade"
                            interactive={true}
                            theme="light-border"
                            appendTo="parent"
                            placement="bottom-start"
                            className="p-0"
                            content={
                                <div className="-mx-[9px]">
                                    <div
                                        onClick={() =>
                                            handleDeleteReview(
                                                review?.userId,
                                                review?.reviewId
                                            )
                                        }
                                        className="py-2 px-3 cursor-pointer hover:bg-gray-300"
                                    >Xóa</div>
                                    <div
                                        className="py-2 px-3 cursor-pointer hover:bg-gray-300"
                                    >Báo cáo vi phạm</div>
                                </div>
                            }
                        >
                            <button className="p-2 rounded-full">
                                <i className="w-3 h-3 block">{iconEllipsis}</i>
                            </button>
                        </Tippy>

                        <div className="ml-auto text-xs flex gap-1 items-center text-gray-500 fill-gray-500 font-normal">
                            <i className="w-3 h-3 block =">
                                {iconOclock}
                            </i>
                            <span className="whitespace-nowrap">
                                {moment(review.createdAt).fromNow()}
                            </span>
                        </div>
                    </div>
                </div>

                {!!review.countReplyReview && !isReplyReview && (
                    <button
                        onClick={handleGetReplyReviews}
                        className="p-1 text-sm flex items-center cursor-pointer"
                    >
                        <i className="w-3 h-3 mr-2 block translate-y-[1px] rotate-90 fill-gray-700">
                            {iconArrowTurnUp}
                        </i>
                        {review?.countReplyReview} phản hồi
                    </button>
                )}


                <div>
                    {replyReviews.length > 0 && (
                        <div>
                            {replyReviews.map((replyReview, index) => {
                                return (
                                    <div
                                        key={replyReview?.reviewId}
                                        className="my-2"
                                    >
                                        <div className="flex mb-3">
                                            <Link
                                                href={`/user/1`}
                                                className="w-8 h-8 rounded-full overflow-hidden shadow align-middle inline-block"
                                            >
                                                <BlurImage
                                                    width={500}
                                                    height={500}
                                                    alt="image-demo"
                                                    blurDataURL={placeholderBlurhash}
                                                    className="group-hover:scale-105 group-hover:duration-500 object-cover w-8 h-8"
                                                    placeholder="blur"
                                                    src={
                                                        replyReview?.avatarUrl ??
                                                        "/images/50.jpg"
                                                    }
                                                />
                                            </Link>
                                            <div className="ml-3 flex-1 relative">
                                                <span
                                                    className="
                                                        absolute
                                                        w-0 h-0 left-0 top-3
                                                        -translate-x-[6px]
                                                        border-t-[6px] border-t-transparent
                                                        border-r-[6px] border-gray-300
                                                        border-b-[6px] border-b-transparent
                                                    "
                                                ></span>
                                                <div>
                                                    <div className="bg-gray-100 border p-2">
                                                        <div className="flex items-center pb-2 mb-2 border-b gap-2 text-sm">
                                                            <h2 className="line-clamp-1 leading-tight text-base font-semibold">
                                                                <Link
                                                                    href={`/user/${replyReview?.senderId}`}
                                                                >
                                                                    {replyReview?.senderName ||
                                                                        ""}
                                                                </Link>
                                                            </h2>
                                                        </div>
                                                        <div className="flex flex-wrap text-gray-600 text-base">
                                                            <Link
                                                                href={`/user/${replyReview?.receiverId}`}
                                                            >
                                                                <h2 className="text-blue-600 font-semibold cursor-pointer mr-1">
                                                                    @
                                                                    {
                                                                        replyReview?.receiverName
                                                                    }
                                                                </h2>
                                                            </Link>
                                                            {convertFromRaw(
                                                                JSON.parse(
                                                                    replyReview?.commentText ||
                                                                        ""
                                                                )
                                                            ).getPlainText()}
                                                        </div>
                                                    </div>
                                                    <div className="flex text-sm gap-2 text-[#3f94d5] fill-[#3f94d5] font-semibold">
                                                        <button
                                                            onClick={() => setIsFormSend((value) => !value)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <i className="w-3 h-3 block">{iconComment}</i>
                                                            <span>Phản hồi</span>
                                                        </button>

                                                        <Tippy
                                                            trigger="click"
                                                            arrow={true}
                                                            animation="fade"
                                                            interactive={true}
                                                            theme="light-border"
                                                            appendTo="parent"
                                                            placement="bottom-start"
                                                            className="p-0"
                                                            content={
                                                                <div className="-mx-[9px]">
                                                                    <div
                                                                        onClick={() =>
                                                                            handleDestroyReplyReview(
                                                                                replyReview?.reviewId
                                                                            )
                                                                        }
                                                                        className="py-2 px-3 cursor-pointer hover:bg-gray-300"
                                                                    >Xóa</div>
                                                                    <div
                                                                        className="py-2 px-3 cursor-pointer hover:bg-gray-300"
                                                                    >Báo cáo vi phạm</div>
                                                                </div>
                                                            }
                                                        >
                                                            <button className="p-2 rounded-full">
                                                                <i className="w-3 h-3 block">{iconEllipsis}</i>
                                                            </button>
                                                        </Tippy>

                                                        <div className="ml-auto text-xs flex gap-1 items-center text-gray-500 fill-gray-500 font-normal">
                                                            <i className="w-3 h-3 block =">
                                                                {iconOclock}
                                                            </i>
                                                            <span className="whitespace-nowrap">
                                                                {moment(replyReview.createdAt).fromNow()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {isFormSend && (
                        <div className="flex">
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
                            <div className="flex-1 ml-3 py-2 pl-2 pr-24 border bg-gray-100 border-opacity-5 relative">
                                <EditorStyle
                                    name="comment"
                                    text={commentText}
                                    handleOnchange={setCommentText}
                                />
                                <button
                                    onClick={handleAddReplyReview}
                                    className="py-2 px-4 rounded-sm transition-all bg-yellow-600 hover:bg-yellow-700 absolute bottom-4 right-4"
                                >
                                    <i className="w-6 h-6 fill-white block translate-x-[1px]">
                                        {iconSend}
                                    </i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default ReviewItem;
