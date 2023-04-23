import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Layout/BlurImage";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { CommentItemWith, CommentType, UserType } from "@/types";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import {
    iconArrowTurnUp,
    iconComment,
    iconSend,
    iconTrash,
} from "../../../../public/icons";
import { getAccessToken } from "@/services/cookies.servies";
import { addReplyCommentHandle, destroyCommentHandle, getReplyCommentsHandle } from "@/services/comment.services";

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
            const commentResponse = await addReplyCommentHandle(dataReplyComment as CommentType & { token: string });

            console.log(commentResponse)
            
            if (commentResponse?.data.success) {
                setCommentText(() => EditorState.createEmpty())
                const dataReplyCommentNew : any = {
                    receiverName: comment.name,
                    receiverId: comment.userId,
                    senderName: user?.name ?? "",
                    senderId: user?.userId ?? "",
                    commentText: dataReplyComment.commentText,
                    commentId: commentResponse?.data.data.commentId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
                setReplyComments([
                    ...replyComments,
                    dataReplyCommentNew
                ])
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetReplyComments = async () => {
        console.log(123)
        setIsReplyComment(true)
        setIsFormSend(true)
        try {
            const dataComments = {
                page: 1,
                commentId: comment.commentId
            }
            const commentsResponse = await getReplyCommentsHandle(dataComments as CommentType & { page: number });
            // console.log(commentsResponse)
            if (commentsResponse?.data.success) {
                setReplyComments([
                    ...commentsResponse?.data?.comments,
                ]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDestroyReplyComment = async (commentId: string | undefined) => {
        if(!user?.userId || !comment.commentId) {
            return;
        }
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }
            const dataReplyComment = {
                commentId: commentId,
                token
            }
            const commentResponse = await destroyCommentHandle(dataReplyComment as CommentType & { token: string });
            if(commentResponse?.data.success) {
                const filterReplyComments = replyComments.filter((replyComment) => replyComment?.commentId !== commentId)
                setReplyComments(filterReplyComments);
            }

            console.log(commentResponse);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div key={comment?.commentId || ""} className="border-b-2">
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

                        <span className="
                            absolute
                            w-0 h-0 left-0 top-3
                            -translate-x-[9px]
                            border-t-[8px] border-t-transparent
                            border-r-[10px] border-gray-300
                            border-b-[8px] border-b-transparent
                        "></span>

                        <div className="flex-1 mb-3 p-3 bg-gray-100 border">
                            <h2 className="line-clamp-1 text-base w-full font-semibold mb-3 border-b pb-2">
                                <Link href={""}>{comment?.name || ""}</Link>
                            </h2>
                            <div className="text-gray-600 text-base">
                                {convertFromRaw(
                                    JSON.parse(comment?.commentText || "")
                                ).getPlainText()}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="mr-auto">
                                {
                                    !!comment.countReplyComment && !isReplyComment && (
                                        <button onClick={handleGetReplyComments} className="p-1 flex items-center cursor-pointer">
                                            <i className="w-3 h-3 mr-2 block translate-y-[1px] rotate-90 fill-gray-700">{iconArrowTurnUp}</i>{comment?.countReplyComment} phản hồi
                                        </button>
                                    ) 
                                }
                            </div>
                            <button
                                onClick={() => setIsFormSend(value => !value)}
                                className={`border p-2 group rounded ${
                                    isFormSend && "bg-gray-400"
                                }`}
                            >
                                <i className={`w-4 h-4 block ${
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
                                        handleDeleteComment(comment?.userId, comment?.commentId)
                                    }
                                    className=" border p-2 group rounded"
                                >
                                    <i className="w-4 h-4 block fill-gray-500 group-hover:fill-gray-600">
                                        {iconTrash}
                                    </i>
                                </button>
                            )}
                        </div>

                        <div>

                            {
                                replyComments.length > 0 && (
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
                                                            <span className="
                                                                absolute
                                                                w-0 h-0 left-0 top-3
                                                                -translate-x-[9px]
                                                                border-t-[8px] border-t-transparent
                                                                border-r-[10px] border-gray-300
                                                                border-b-[8px] border-b-transparent
                                                            "></span>
                                                            <h2 className="line-clamp-1 text-base w-full font-semibold mb-3 border-b pb-2">
                                                                <Link href={`/user/${replyComment?.senderId}`}>
                                                                    {replyComment?.senderName || ""} - {replyComment?.commentId}
                                                                </Link>
                                                            </h2>
                                                            <div className="flex flex-wrap text-gray-600 text-base">
                                                                <Link href={`/user/${replyComment?.receiverId}`}>
                                                                    <h2 className="text-blue-600 font-semibold cursor-pointer mr-1">@{replyComment?.receiverName}</h2>
                                                                </Link>
                                                                {convertFromRaw(
                                                                    JSON.parse(
                                                                        replyComment?.commentText || ""
                                                                    )
                                                                ).getPlainText()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-end gap-2">
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
                                                            {user?.userId == replyComment?.senderId && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleDestroyReplyComment(replyComment?.commentId)
                                                                    }
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
                                            );
                                        })}                   
                                    </div>
                                )
                            }

                            {
                                isFormSend && (
                                    <div>
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
                                    </div>
                                )
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="ml-20 mb-4">
                
                {/* {
                    (
                        <div>
                            {
                                replyComments.length > 0 && (
                                    <div>
                                        {replyComments.map((replyComment, index) => {
                                            return (
                                                <div
                                                    key={replyComment?.commentId || index}
                                                    className="p-4 rounded-lg bg-gray-100 border my-4"
                                                >
                                                    <div className="flex mb-6">
                                                        <Link
                                                            href={`/user/1`}
                                                            className="w-8 h-8 mt-2 rounded-full overflow-hidden shadow align-middle inline-block"
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
                                                        <div className="flex-1 ml-4">
                                                            <h2 className="line-clamp-1 text-base w-full font-semibold mb-2">
                                                                <Link href={`/user/${replyComment?.senderId}`}>
                                                                    {replyComment?.senderName || ""} - {replyComment?.commentId}
                                                                </Link>
                                                            </h2>
                                                            <div className="flex flex-wrap text-gray-600 text-base">
                                                                <Link href={`/user/${replyComment?.receiverId}`}>
                                                                    <h2 className="text-blue-600 font-semibold cursor-pointer mr-1">@{replyComment?.receiverName}</h2>
                                                                </Link>
                                                                {convertFromRaw(
                                                                    JSON.parse(
                                                                        replyComment?.commentText || ""
                                                                    )
                                                                ).getPlainText()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-end gap-2">
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
                                                            {user?.userId == replyComment?.senderId && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleDestroyReplyComment(replyComment?.commentId)
                                                                    }
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
                                            );
                                        })}                   
                                    </div>
                                )
                            }
                        </div>
                    )
                } */}

                {/* {
                    isFormSend && (
                        <div>
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
                        </div>
                    )
                } */}
            </div>
        </div>
    );
};

export default CommentItem;
