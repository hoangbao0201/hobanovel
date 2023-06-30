import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import moment from "moment";
import "moment/locale/vi";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import {
    EditorState,
    convertFromRaw,
    convertToRaw,
} from "draft-js";

import { placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Layout/BlurImage";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { CommentType, UserType } from "@/types";
import {
    iconArrowTurnUp,
    iconComment,
    iconEllipsis,
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
import TextRank from "@/components/Layout/TextRank";

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

                <div className="">
                    <div className="bg-gray-100 border p-2">
                        <h2 className="line-clamp-1 text-base pb-2 mb-2 border-b font-semibold flex items-center">
                            {/* <Link href={""}>{comment?.name || ""}</Link>*/}
                            <TextRank className="uppercase max-sm:text-xs" rank={comment.rank || 0} text={comment.name + `${" "}-`}/>
                            <TextRank className="uppercase ml-2 max-sm:text-xs" rank={comment.rank || 0}/>
                        </h2>
                        <div className="text-gray-600 text-base">
                            {convertFromRaw(
                                JSON.parse(comment?.commentText || "")
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
                                            handleDeleteComment(
                                                comment?.userId,
                                                comment?.commentId
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
                                {moment(comment.createdAt).fromNow()}
                            </span>
                        </div>
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
                                                                    href={`/user/${replyComment?.senderId}`}
                                                                >
                                                                    {replyComment?.senderName ||
                                                                        ""}
                                                                </Link>
                                                            </h2>
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
                                                                            handleDestroyReplyComment(
                                                                                replyComment?.commentId
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
                                                                {moment(replyComment.createdAt).fromNow()}
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
    );
};

export default CommentItem;
