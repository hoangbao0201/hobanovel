import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

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
import { CommentItemType, UserType } from "@/types";
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
import InputText from "@/components/features/InputText";

interface CommentItemProps {
    novelId?: string;
    user?: UserType;
    comment: CommentItemType;
    handleDeleteComment: any;
}

const CommentItem = ({ comment, user, handleDeleteComment }: CommentItemProps) => {
    const [isFormSend, setIsFormSend] = useState<boolean>(false);
    const [isReplyComment, setIsReplyComment] = useState<boolean>(false);
    const [replyComments, setReplyComments] = useState<CommentItemType[]>([]);
    const [commentText, setCommentText] = useState('');
    const [receiver, setReceiver] = useState<{
        receiverId: string
        receiverUsername: string
        receiverName: string
    }>({
        receiverId: "",
        receiverUsername: "",
        receiverName: ""
    })
    const [sender, setSender] = useState({
        senderId: user?.userId || '',
        senderUsername: user?.username || '',
        senderName: user?.name || '',
    })
    // ---
    
    // ---

    // Handle Send Reply Comment
    const handleSendReplyComment = async () => {
        const token = getAccessToken();
        if (!user?.userId || !token) {
            return;
        }

        try {
            const dataReplyCommentReq = {
                parentId: comment.commentId,
                senderName: sender.senderName,
                receiverId: receiver.receiverId,
                commentText: commentText,
                token: token,
            };
            const commentResponse = await addReplyCommentHandle(dataReplyCommentReq);

            if (commentResponse?.success) {
                setCommentText('');

                const dataReplyCommentNew: CommentItemType = {
                    commentId: commentResponse.commentId,
                    commentText: dataReplyCommentReq.commentText,

                    senderId: user.userId,
                    senderName: sender.senderName,
                    senderUsername: user.username,
                    senderRank: user.rank || 0,

                    ...receiver,
                    
                    avatarUrl: user.avatarUrl || null,
                    avatarPublicId: user.avatarPublicId || null,

                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                setReplyComments([...replyComments, dataReplyCommentNew]);
            }
        } catch (error) {
            // console.log(error);
        }
    };

    // Handle Get Reply Comments
    const handleGetReplyComments = async () => {
        setIsReplyComment(true);
        setIsFormSend(true);
        try {
            const dataComments = {
                page: 1,
                commentId: comment.commentId,
            };
            const commentsResponse = await getReplyCommentsHandle(dataComments.commentId, dataComments.page);

            if (commentsResponse?.success) {
                setReplyComments([...commentsResponse?.comments]);
            }
        } catch (error) {
            // console.log(error);
        }
    };

    // Handle Delete Reply Comment
    const handleDestroyReplyComment = async (commentId: string) => {
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
            const commentResponse = await destroyReplyCommentHandle(dataReplyComment.commentId, token);
            if (commentResponse?.success) {
                const filterReplyComments = replyComments.filter(
                    (replyComment) => replyComment?.commentId !== commentId
                );
                setReplyComments(filterReplyComments);
            }
        } catch (error) {
            // console.log(error);
        }
    };

    // Handle Set Is Show Form Reply Comment
    const handleSetIsForm = (rc: { rcId: string, rcUsername: string, rcName: string }) => {
        if(receiver.receiverId === rc.rcId) {
            setIsFormSend(false);
            setReceiver({
                receiverId: "",
                receiverUsername: "",
                receiverName: ""
            })
        }
        else {
            setIsFormSend(true)
            setReceiver({
                receiverId: rc.rcId,
                receiverUsername: rc.rcUsername,
                receiverName: rc.rcName
            })
        }
        // setIsFormSend((value) => !value);
    }

    // Handle Set Name Sender
    const handleOnchangeSender = (e : ChangeEvent<HTMLInputElement>) => {
        setSender({
            ...sender,
            [e.target.name]: e.target.value
        })
    }

    // Handle Set Comment Text
    const handleOnchangeCommentText = (value: string) => {
        setCommentText(value)
    }

    // console.log(receiver)

    return (
        <div className="flex mb-4">
            <Link
                href={`/user/${comment.senderUsername}`}
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
                        <div className="flex flex-wrap gap-2 items-center mb-3">
                            <TextRank className="" rank={comment.senderRank || 0} text={comment.senderName}/>
                            <TextRank className="" rank={comment.senderRank || 0}/>
                        </div>
                        <div className="text-gray-600 text-base" dangerouslySetInnerHTML={{__html: comment.commentText}}></div>
                    </div>
                    <div className="flex text-sm gap-2 text-[#3f94d5] fill-[#3f94d5] font-semibold">
                        <button
                            onClick={() => handleSetIsForm({
                                rcId: comment.senderId,
                                rcUsername: comment.senderUsername,
                                rcName: comment.senderName
                            })}
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
                                    {
                                        ( (comment?.senderId == user?.userId) || (user?.userId == "1") ) && (
                                            <div
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        comment?.senderId,
                                                        comment?.commentId
                                                    )
                                                }
                                                className="py-2 px-3 cursor-pointer hover:bg-gray-300"
                                            >Xóa</div>
                                        )
                                    }
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
                        <ul>
                            {replyComments.map((replyComment, index) => {
                                return (
                                    <li
                                        key={replyComment?.commentId || index}
                                        className="my-4"
                                    >
                                        <div className="flex mb-3">
                                            <Link
                                                href={`/user/${replyComment.senderUsername}`}
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
                                                        {/* <div className="flex items-center pb-2 mb-2 border-b gap-2 text-sm">
                                                            <div className="line-clamp-1 flex items-center">
                                                                <TextRank className="uppercase max-sm:text-xs" rank={replyComment.senderRank || 0} text={replyComment.senderName + `${" "}-`}/>
                                                                <TextRank className="uppercase ml-2 max-sm:text-xs" rank={replyComment.senderRank || 0}/>
                                                            </div>
                                                        </div> */}
                                                        <div className="flex flex-wrap gap-2 items-center mb-3">
                                                            <TextRank className="" rank={replyComment.senderRank || 0} text={replyComment.senderName}/>
                                                            <TextRank className="" rank={replyComment.senderRank || 0}/>

                                                            {/* <span>{replyComment.senderId} - {user?.userId}</span> */}
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
                                                            <div className="" dangerouslySetInnerHTML={{__html: replyComment.commentText}}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-sm gap-2 text-[#3f94d5] fill-[#3f94d5] font-semibold">
                                                        <button
                                                            onClick={() =>handleSetIsForm({
                                                                rcId: replyComment.senderId,
                                                                rcUsername: replyComment.senderUsername,
                                                                rcName: replyComment.senderName
                                                            })}
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
                                                                    {
                                                                        ( (replyComment.senderId == user?.userId) || (user?.username == "admin") ) && (
                                                                            <div
                                                                                onClick={() =>
                                                                                    handleDestroyReplyComment(
                                                                                        replyComment?.commentId
                                                                                    )
                                                                                }
                                                                                className="py-2 px-3 cursor-pointer hover:bg-gray-300"
                                                                            >Xóa</div>
                                                                        )
                                                                    }
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
                                                                {moment(new Date(replyComment.createdAt)).fromNow()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {isFormSend && (
                        <div className="mt-7">
                            <InputText
                                text={commentText}
                                isShow={isFormSend}
                                handleOnchange={handleOnchangeCommentText}
                            />
                            <div className="flex mt-3 gap-3">
                                <input
                                    name="senderName"
                                    className="border rounded w-full px-3 py-1 focus:outline-none focus:border-blue-700"
                                    value={sender.senderName}
                                    onChange={handleOnchangeSender}
                                    placeholder="Họ tên (bắt buộc)"
                                />
                                <input
                                    disabled={!!user?.username}
                                    className="border rounded w-full px-3 py-1 focus:outline-none focus:border-blue-700"
                                    value={sender.senderUsername}
                                />

                                <button
                                    onClick={handleSendReplyComment}
                                    className="right-0 text-right py-2 px-4 rounded-sm transition-colors bg-yellow-600 hover:bg-yellow-700"
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
