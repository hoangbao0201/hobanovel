import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { CommentType } from "@/types";
// import { EditorState, convertToRaw } from "draft-js";
import CommentItem from "./CommentItem";
import { iconSend } from "../../../../public/icons";
import { addCommentHandle, destroyCommentHandle, getCommentsHandle } from "@/services/comment.services";
import { getAccessToken } from "@/services/cookies.servies";
import { CommentSliceType, addCommentsRDHandle, setCommentsRDHandle } from "@/redux/commentSlice";
import { LoadingForm } from "@/components/Layout/LoadingLayout";
// import { EditorStyle } from "@/components/Layout/EditorStyle";
import { dataFakeBannersMobile } from "@/components/partials/BannersIntro";
import InputText from "@/components/features/InputText";


interface FormCommentProps {
    tab?: number;
    novelId?: string;
    chapterId?: string
}

const FormComment = ({ tab, novelId, chapterId }: FormCommentProps) => {
    const dispatch = useDispatch();
    const { currentUser, isAuthenticated } = useSelector((state: any) => state.user);
    
    const { isLoading, comments } : CommentSliceType = useSelector(
        (state: any) => state.comment
    );

    const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);
    const [commentText, setCommentText] = useState("");
    const [sender, setSender] = useState({
        senderId: currentUser?.userId || '',
        senderUsername: currentUser?.username || '',
        senderName: currentUser?.name || '',
    })
    const [isFormSend, setIsFormSend] = useState(false);

    const getListComments = async () => {
        try {
            const commentsResponse = await getCommentsHandle(novelId);

            if (commentsResponse?.success) {
                dispatch(setCommentsRDHandle(Array.from((commentsResponse.comments))))
            }

            setHasLoadedData(true);

        } catch (error) {
            
        }
    };

    // Handle Send Comment
    const handleSendComment = async () => {
        const token = getAccessToken();
        if(!isAuthenticated || !token) {
            alert("Vui lòng đăng nhập để bình luận.")
            return;
        }
        if(commentText.length < 17) {
            alert("Nội dung bình luận quá ngắn, tối thiểu 10 ký tự!");
            return;
        }
        if(sender?.senderName.length < 10) {
            return;
        }
        
        try {
            const dataReq = {
                token,
                novelId,
                chapterId,
                commentText,
                senderName: sender.senderName
            }
            const commentRes = await addCommentHandle(dataReq);
            if (commentRes?.success) {

                setCommentText('');

                const newComment = {
                    commentId: commentRes.commentId,
                    commentText: commentText,

                    parentId: null,
                    senderId: currentUser.userId,
                    senderName: sender.senderName,
                    senderUsername: currentUser.username,
                    senderRank: currentUser.rank || 0,

                    novelId: novelId,
                    chapterId: chapterId || null,
                    
                    createdAt: String(new Date()),
                    updatedAt: String(new Date()),
                }

                dispatch(addCommentsRDHandle(newComment));
            }

            
        } catch (error) {
            // console.log(error);
        }
    };    

    // Handle Destroy Comment
    const handleDestroyComment = async (senderId: string, commentId: string) => {

        console.log(currentUser?.userId, senderId)
        if(currentUser?.userId !== senderId && currentUser.userId != 1) {
            console.log(1)
            return;
        }
        
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }
            
            const reviewResponse = await destroyCommentHandle(commentId, token);
            if(reviewResponse?.success) {
                const filterComments = comments.filter((comment) => comment?.commentId !== commentId);
                dispatch(setCommentsRDHandle(filterComments))
            }

        } catch (error) {
            console.log(error)
        }
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

    // Call Function "getListComments" and set state "setHasLoadedData"
    useEffect(() => {
        if (tab === 3 && !hasLoadedData) {
            getListComments();
            setHasLoadedData(true);
        }
    }, [tab, hasLoadedData]);


    // console.log({
    //     ...sender,
    //     commentText,
    //     novelId: novelId || null,
    //     chapterId: chapterId || null
    // })


    return (
        <div className="flex">
            <div className="lg:w-8/12 w-full px-4">

                <div className="relative grid mb-8">

                        {
                            !isFormSend ? (
                                <div
                                    onClick={() => setIsFormSend(true)}
                                    className="px-3 pt-1 p-7 text-sm cursor-text text-gray-500 border rounded-sm"
                                >
                                    Mời bạn thảo luận, vui lòng không spam, share link kiếm tiền, thiếu lành mạnh,... để tránh bị khóa tài khoản
                                </div>
                            ) : (
                                <>
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
                                            disabled={isAuthenticated}
                                            className="border rounded w-full px-3 py-1 focus:outline-none focus:border-blue-700"
                                            value={sender.senderUsername}
                                        />
    
                                        <button
                                            onClick={handleSendComment}
                                            className="right-0 text-right py-2 px-4 rounded-sm transition-colors bg-yellow-600 hover:bg-yellow-700"
                                        >
                                            <i className="w-6 h-6 fill-white block translate-x-[1px]">
                                                {iconSend}
                                            </i>
                                        </button>
                                    </div>
                                </>
                            )
                        }

                        {/* <EditorStyle
                            name="comment"
                            text={commentText}
                            handleOnchange={setCommentText}
                        /> */}
                </div>

                <ul className="transition-all ease-linear">
                    {
                        isLoading ? (
                            <LoadingForm theme="dark"/>
                        ) : (
                            comments.length === 0 ? (
                                <li>Hãy là người đầu tiên bình luận</li>
                            ) : (
                                comments?.map((comment) => {
                                    return (
                                        <li key={comment.commentId}>
                                            <CommentItem key={comment?.commentId} comment={comment} user={currentUser} handleDeleteComment={handleDestroyComment}/>
                                        </li>
                                    );
                                })
                            )
                        )
                    }
                </ul>
            </div>
            <div className="max-lg:hidden lg:w-4/12 w-full px-4">
                {
                    dataFakeBannersMobile?.slice(0, 4).map((item, index) => {
                        return (
                            <div key={index} className="mb-4">
                                <Image
                                    width={500}
                                    height={500}
                                    alt="image banner"
                                    src={item.bannersUrl}
                                    className="w-full h-40 object-cover"
                                />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default FormComment;
