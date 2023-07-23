import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import moment from "moment";
import "moment/locale/vi";

import { placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Share/BlurImage";
import { CommentItemType, UserType } from "@/types";
import {
    iconArrowTurnUp,
    iconComment,
    iconEllipsis,
    iconOclock,
    iconSend,
} from "../../../../public/icons";
import { getAccessToken } from "@/services/cookies.servies";
import {
    addReplyCommentHandle,
    destroyReplyCommentHandle,
    getReplyCommentsHandle,
} from "@/services/comment.services";
import TextRank from "@/components/Share/TextRank";
import InputText from "@/components/features/InputText";
import { useClickOutSide } from "@/hook/useClickOutSide";
import { ShowToastify } from "@/components/features/ShowToastify";

interface CommentItemProps {
    novelId?: string
    chapterId?: string
    user?: UserType;
    comment: CommentItemType
    isRpComment?: boolean
    handleDeleteComment: (senderId: string, commentId: string) => void
}

const CommentItem = ({ novelId, chapterId, comment, user, isRpComment = false, handleDeleteComment }: CommentItemProps) => {

    const [isFormSend, setIsFormSend] = useState<boolean>(false);
    const [isReplyComment, setIsReplyComment] = useState<boolean>(isRpComment);
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
    
    // Handle Send Reply Comment
    const handleSendReplyComment = async () => {
        const token = getAccessToken();
        if (!user || !token) {
            alert("Vui lòng đăng nhập để bình luận.")
            return;
        }
        if(commentText.length < 17) {
            alert("Nội dung bình luận quá ngắn, tối thiểu 10 ký tự!");
            return;
        }
        if(sender?.senderName.length < 5) {
            alert("Tên tài khoản tối thiểu 5 ký tự!");
            return;
        }
        if(!novelId) {
            return;
        }

        try {
            const dataReplyCommentReq = {
                parentId: comment.commentId,
                novelId: novelId,
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

                return;
            }

            alert(commentResponse.message as string);
        } catch (error) {
            alert(error as string);
        }
    };

    // Handle Get Reply Comments
    const handleGetReplyComments = async () => {
        setIsReplyComment(true);
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
            setReplyComments([])
        }
    };

    // Handle Delete Reply Comment
    const handleDestroyReplyComment = async (senderId: string, commentId: string) => {
        const token = getAccessToken();
        if(!user || !token) {
            alert("Vui lòng đăng nhập để bình luận.")
            return
        }
        if( user?.userId !== senderId && user.userId != '1') {
            alert("Lỗi load comment")
            return;
        }

        try {
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

    // Handle Set Is Show Form Comment
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

    // Call Handle Get Reply Comments
    useEffect(() => {
        if(isRpComment) {
            handleGetReplyComments();
        }
    }, [])

    return (
        <div className="mb-3">
            <Comment position={novelId ? (chapterId ? ("chapter") : ("novel")) : ("home")} user={user} comment={comment} handleSetFormSend={handleSetIsForm} handleDestroyComment={handleDeleteComment}/>
            
            <div className="ml-[52px]">
                {
                    !!comment.countReplyComment && !isReplyComment && (
                        <button
                            onClick={handleGetReplyComments}
                            className="ml-4 p-1 text-sm flex items-center cursor-pointer"
                        >
                            <i className="w-3 mr-2 block flex-shrink translate-y-[1px] rotate-90 fill-gray-700">
                                {iconArrowTurnUp}
                            </i>
                            {comment?.countReplyComment} phản hồi
                        </button>
                    )
                }
            </div>

            <div className="ml-[52px]">
                {
                    replyComments.length > 0 && (
                        <ul>
                            {
                                replyComments.map((replyComment) => {
                                    return (
                                        <li key={replyComment.commentId}>
                                            <Comment user={user} comment={replyComment} position={novelId ? (chapterId ? ("chapter") : ("novel")) : ("home")} handleSetFormSend={handleSetIsForm} handleDestroyComment={handleDestroyReplyComment}/>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    )
                }
            </div>

            {
                isFormSend && (
                    <div className="mt-3 ml-[52px]">
                        <InputText
                            text={commentText}
                            isShow={isFormSend}
                            receiver={receiver}
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
                )
            }

        </div>
    )
};

export default CommentItem;


interface CommentProps {
    user?: UserType
    comment: CommentItemType
    position?: 'home' | 'novel' | 'chapter' 
    handleSetFormSend: ({ rcId, rcUsername, rcName } : { rcId: string, rcUsername: string, rcName: string }) => void
    handleDestroyComment: (senderId: string, commentId: string) => void
}
export const Comment = ({ user, comment, position, handleSetFormSend, handleDestroyComment } : CommentProps) => {

    const optionRef = useRef<HTMLDivElement>(null)
    const [isOptions, setIsOptions] = useState(false);

    const handleHiddenOptions = () => {
        setIsOptions(false);
    }
    useClickOutSide(optionRef, handleHiddenOptions);

    const handleReportComment = () => {
        ShowToastify({
            data: 'Cảm ơn vì đã thông báo cho chúng tôi',
            type: "success",
        })
        handleHiddenOptions()
    }

    return (
        <div className="flex">

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
                    src={`${comment?.avatarUrl || "/images/avatar-default.png"}`}
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
                                
                            {
                                comment?.chapterNumber && (
                                    <span className="text-blue-600 italic text-xs">Chapter {comment.chapterNumber}</span>
                                )
                            }
                        </div>
                        {
                            comment?.receiverId && (
                                <Link
                                    href={`/user/${comment?.receiverId}`}
                                >
                                    <h2 className="text-blue-600 font-semibold cursor-pointer mr-1">
                                        @
                                        {
                                            comment?.receiverName
                                        }
                                    </h2>
                                </Link>
                            )
                        }
                        <div className="text-gray-600 text-base" dangerouslySetInnerHTML={{ __html: comment.commentText }}></div>
                    </div>


         
                    <div className="flex my-1 text-sm text-[#3f94d5] fill-[#3f94d5] font-semibold">
                        {
                            position !== "home" && (
                                <button
                                    onClick={() => handleSetFormSend({
                                        rcId: comment.senderId,
                                        rcUsername: comment.senderUsername,
                                        rcName: comment.senderName
                                    })}
                                    className="flex items-center gap-1 mr-2"
                                >
                                    <i className="w-3 h-3 block">{iconComment}</i>
                                    <span>Phản hồi</span>
                                </button>
                            )
                        }

                        <div ref={optionRef} className="relative">
                            <button onClick={() => setIsOptions(value => !value)} className="p-2 rounded-full hover:bg-gray-200">
                                <i className="w-3 h-3 block">{iconEllipsis}</i>
                            </button>
                            {
                                isOptions && (
                                    <div className="-mx-[9px] absolute z-10 bg-white whitespace-nowrap border shadow-md py-1">
                                        {
                                            ( (comment?.senderId == user?.userId) || (user?.userId == "1") ) && (
                                                <div
                                                    onClick={() =>(
                                                        handleDestroyComment(
                                                            comment?.senderId,
                                                            comment?.commentId
                                                        )
                                                    )}
                                                    className="py-2 px-3 cursor-pointer hover:bg-gray-300"
                                                >Xóa</div>
                                            )
                                        }
                                        <div
                                            onClick={() => {
                                                handleReportComment()
                                            }}
                                            className="py-2 px-3 cursor-pointer hover:bg-gray-300"
                                        >Báo cáo vi phạm</div>
                                    </div>
                                )
                            }
                        </div>
    
                        <div className="ml-auto text-xs flex gap-1 items-center text-gray-500 fill-gray-500 font-normal">
                            <i className="w-3 h-3 block =">
                                {iconOclock}
                            </i>
                            <span className="whitespace-nowrap">
                                {moment(new Date(comment.createdAt)).fromNow()}
                            </span>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}