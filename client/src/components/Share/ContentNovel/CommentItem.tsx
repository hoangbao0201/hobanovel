import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Layout/BlurImage";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { CommentType, UserType } from "@/types";
import {
    EditorState,
    convertFromRaw,
    convertToRaw,
} from "draft-js";
import {
    iconArrowTurnUp,
    iconComment,
    iconOclock,
    iconSend,
    iconTrash,
} from "../../../../public/icons";
import { getAccessToken } from "@/services/cookies.servies";
import {
    addReplyCommentHandle,
    destroyReplyCommentHandle,
    getReplyCommentsHandle,
} from "@/services/comment.services";
import moment from "moment";
import "moment/locale/vi";

interface CommentItemProps {
    novelId?: string;
    user?: UserType;
    comment: CommentType;
    handleDeleteComment: any;
}

const CommentItem = ({ comment, user, handleDeleteComment }: CommentItemProps) => {
    const [isFormSend, setIsFormSend] = useState<boolean>(false);
    const [isReplyComment, setIsReplyComment] = useState<boolean>(false);
    const [replyComments, setReplyComments] = useState<CommentType[]>([]);
    const [commentText, setCommentText] = useState(() => EditorState.createEmpty());

    // ---
    

    // ---

    const handleAddReplyComment = async () => {
        const token = getAccessToken();
        if (!token) {
            console.log("Bạn chưa đăng nhập");
            return;
        }
        if (!commentText) {
            console.log("Data not found");
            return;
        }
        try {
            const dataReplyComment = {
                token,
                commentId: comment.commentId,
                commentText: JSON.stringify(convertToRaw(commentText.getCurrentContent())),
            };
            const commentResponse = await addReplyCommentHandle(
                dataReplyComment as CommentType & { token: string }
            );

            console.log(commentResponse);

            if (commentResponse?.data.success) {
                setCommentText(() => EditorState.createEmpty());
                const dataReplyCommentNew: any = {
                    receiverName: comment.name,
                    receiverId: comment.userId,
                    senderName: user?.name ?? "",
                    senderId: user?.userId ?? "",
                    commentText: dataReplyComment.commentText,
                    commentId: commentResponse?.data.data.commentId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                setReplyComments([...replyComments, dataReplyCommentNew]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetReplyComments = async () => {
        setIsReplyComment(true);
        setIsFormSend(true);
        try {
            const dataComments = {
                page: 1,
                commentId: comment.commentId,
            };
            const commentsResponse = await getReplyCommentsHandle(
                dataComments as CommentType & { page: number }
            );
            // console.log(commentsResponse)
            if (commentsResponse?.data.success) {
                setReplyComments([...commentsResponse?.data?.comments]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDestroyReplyComment = async (commentId: string | undefined) => {
        if (!user?.userId || !comment.commentId) {
            return;
        }
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }
            const dataReplyComment = {
                commentId: commentId,
                token,
            };
            const commentResponse = await destroyReplyCommentHandle(
                dataReplyComment as CommentType & { token: string }
            );
            if (commentResponse?.data.success) {
                const filterReplyComments = replyComments.filter(
                    (replyComment) => replyComment?.commentId !== commentId
                );
                setReplyComments(filterReplyComments);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div key={comment?.commentId || ""} className="border-b">
            <div className="rounded-lg my-4 relative">
                <div className="mb-4 flex">
                    <Link
                        href={`/user/1`}
                        className="w-10 h-10 rounded-full overflow-hidden shadow align-middle inline-block"
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
                    <div className="ml-4 flex-1 relative">
                        <span
                            className="
                            absolute
                            w-0 h-0 left-0 top-3
                            -translate-x-[9px]
                            border-t-[8px] border-t-transparent
                            border-r-[10px] border-gray-300
                            border-b-[8px] border-b-transparent
                        "
                        ></span>

                        <div className="flex-1 mb-3 p-3 bg-gray-100 border">
                            <div className="flex items-center gap-2 pb-3 mb-4 border-b">
                                <h2 className="line-clamp-1 text-base leading-tight font-semibold">
                                    <Link href={""}>{comment?.name || ""}</Link>
                                </h2>
                                <span> - </span>
                                <div className="flex items-center mr-auto">
                                    <i className="w-3 h-3 mr-1 translate-y-[1px] leading-tight block fill-gray-500">
                                        {iconOclock}
                                    </i>
                                    <span className="leading-tight whitespace-nowrap text-[13px] text-gray-500">
                                        {moment(comment.createdAt).fromNow()}
                                    </span>
                                    <span className="ml-2">{comment.commentId}</span>
                                </div>
                                <button
                                    onClick={() => setIsFormSend((value) => !value)}
                                    className={`drop-shadow-sm border p-2 group rounded ${
                                        isFormSend && "bg-gray-400"
                                    }`}
                                >
                                    <i
                                        className={`w-4 h-4 block ${
                                            isFormSend
                                                ? "fill-white"
                                                : "fill-gray-500 group-hover:fill-gray-600"
                                        }`}
                                    >
                                        {iconComment}
                                    </i>
                                </button>
                                {user?.userId == comment?.userId && (
                                    <button
                                        onClick={() =>
                                            handleDeleteComment(
                                                comment?.userId,
                                                comment?.commentId
                                            )
                                        }
                                        className="drop-shadow-sm border p-2 group rounded"
                                    >
                                        <i className="w-4 h-4 block fill-gray-500 group-hover:fill-gray-600">
                                            {iconTrash}
                                        </i>
                                    </button>
                                )}
                            </div>
                            <div className="text-gray-600 text-base">
                                {convertFromRaw(
                                    JSON.parse(comment?.commentText || "")
                                ).getPlainText()}
                            </div>
                        </div>

                        {!!comment.countReplyComment && !isReplyComment && (
                            <button
                                onClick={handleGetReplyComments}
                                className="p-1 text-sm flex items-center cursor-pointer"
                            >
                                <i className="w-3 h-3 mr-2 block translate-y-[1px] rotate-90 fill-gray-700">
                                    {iconArrowTurnUp}
                                </i>
                                {comment?.countReplyComment} phản hồi
                            </button>
                        )}

                        <div>
                            {replyComments.length > 0 && (
                                <div>
                                    {replyComments.map((replyComment, index) => {
                                        return (
                                            <div
                                                key={replyComment?.commentId || index}
                                                className="my-4"
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
                                                                replyComment?.avatarUrl ??
                                                                "/images/50.jpg"
                                                            }
                                                        />
                                                    </Link>
                                                    <div className="flex-1 ml-4 p-3 bg-gray-100 border relative">
                                                        <span
                                                            className="
                                                                absolute
                                                                w-0 h-0 left-0 top-3
                                                                -translate-x-[9px]
                                                                border-t-[8px] border-t-transparent
                                                                border-r-[10px] border-gray-300
                                                                border-b-[8px] border-b-transparent
                                                            "
                                                        ></span>
                                                        <div className="flex items-center pb-3 mb-4 border-b gap-2">
                                                            <h2 className="line-clamp-1 leading-tight text-base font-semibold">
                                                                <Link
                                                                    href={`/user/${replyComment?.senderId}`}
                                                                >
                                                                    {replyComment?.senderName ||
                                                                        ""}
                                                                </Link>
                                                            </h2>
                                                            <span> - </span>
                                                            <div className="flex items-center mr-auto">
                                                                <i className="w-3 h-3 mr-1 translate-y-[1px] leading-tight block fill-gray-500">
                                                                    {iconOclock}
                                                                </i>
                                                                <span className="mr-auto leading-tight whitespace-nowrap text-[13px] text-gray-500">
                                                                    {moment(
                                                                        replyComment.createdAt
                                                                    ).fromNow()}
                                                                </span>
                                                            </div>
                                                            <button
                                                                // onClick={() => }
                                                                className={`border p-2 group rounded ${
                                                                    false && "bg-gray-400"
                                                                }`}
                                                            >
                                                                <i
                                                                    className={`w-4 h-4 block ${
                                                                        false
                                                                            ? "fill-white"
                                                                            : "fill-gray-500 group-hover:fill-gray-600"
                                                                    }`}
                                                                >
                                                                    {iconComment}
                                                                </i>
                                                            </button>
                                                            {user?.userId ==
                                                                replyComment?.senderId && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleDestroyReplyComment(
                                                                            replyComment?.commentId
                                                                        )
                                                                    }
                                                                    className=" border p-2 group rounded"
                                                                >
                                                                    <i className="w-4 h-4 block fill-gray-500 group-hover:fill-gray-600">
                                                                        {iconTrash}
                                                                    </i>
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap text-gray-600 text-base">
                                                            <Link
                                                                href={`/user/${replyComment?.receiverId}`}
                                                            >
                                                                <h2 className="text-blue-600 font-semibold cursor-pointer mr-1">
                                                                    @
                                                                    {
                                                                        replyComment?.receiverName
                                                                    }
                                                                </h2>
                                                            </Link>
                                                            {convertFromRaw(
                                                                JSON.parse(
                                                                    replyComment?.commentText ||
                                                                        ""
                                                                )
                                                            ).getPlainText()}
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
                                    <div className="flex-1 ml-4 py-3 pl-4 pr-24 border bg-gray-100 border-opacity-5 relative">
                                        <EditorStyle
                                            name="comment"
                                            text={commentText}
                                            handleOnchange={setCommentText}
                                        />
                                        <button
                                            onClick={handleAddReplyComment}
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
            </div>
        </div>
    );
};

export default CommentItem;
