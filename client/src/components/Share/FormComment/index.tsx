import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import CommentItem from "./ItemComment";
import { iconSend } from "../../../../public/icons";
import { addCommentHandle, destroyCommentHandle, getCommentsHandle } from "@/services/comment.services";
import { getAccessToken } from "@/services/cookies.servies";
import { CommentSliceType, addCommentsRDHandle, destroyCommentsNovelRDHandle, loadCommentsNovelRDHandle, setCommentsRDHandle } from "@/redux/commentSlice";
import { LoadingForm } from "@/components/Layout/LoadingLayout";
import InputText from "@/components/features/InputText";
import { PaginationLayout } from "@/components/Share/PaginationLayout";
import { ShowToastify } from "@/components/features/ShowToastify";
import { error } from "console";


interface FormCommentProps {
    commentId?: string;
    novelId?: string;
    chapterId?: string;
    chapterNumber?: number
    isFormSendComment?: boolean
    isRpComment?: boolean
}

const FormComment = ({commentId, novelId, chapterId, chapterNumber, isFormSendComment = true, isRpComment = false }: FormCommentProps) => {

    const dispatch = useDispatch();
    
    const { currentUser, isAuthenticated } = useSelector((state: any) => state.user);
    const { loadComment, comments } : CommentSliceType = useSelector(
        (state: any) => state.comment
    );
    
    const anchorRef = useRef<HTMLAnchorElement>(null);
    
    const [commentText, setCommentText] = useState("");
    const [sender, setSender] = useState({
        senderId: currentUser?.userId || '',
        senderUsername: currentUser?.username || '',
        senderName: currentUser?.name || '',
    })
    const [loadComments, setLoadComments] = useState(false);
    const [isFormSend, setIsFormSend] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const [countPage, setCountPage] = useState(1)


    // Handle On Top
    const handleOpTop = () => {
        if (anchorRef.current) {
            anchorRef.current.scrollIntoView({});
        }
    }

    // Handle Next Page
    const handleNextPage = (page: number) => {
        setLoadComments(true);
        handleGetComments(true, page);
        setCurrentPage(page);
    }

    // Handle Get Comments
    const handleGetComments = async (next?: boolean, page?: number) => {
        try {
            const commentsResponse = await getCommentsHandle(commentId, novelId, chapterId, chapterNumber, page || currentPage);

            if (commentsResponse?.success) {
                setCountPage(commentsResponse?.countPage || 1)
                dispatch(setCommentsRDHandle(Array.from(commentsResponse.comments)))

                if(next) {
                    handleOpTop();
                    setLoadComments(false);
                }

            }
        } catch (error) {
            dispatch(setCommentsRDHandle([]))
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
        if(sender?.senderName.length < 5) {
            alert("Tên tài khoản tối thiểu 5 ký tự!");
            return;
        }
        if(!novelId) {
            return
        }
        
        try {
            const dataReq = {
                token,
                novelId,
                chapterId,
                chapterNumber,
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

                    novelId: novelId || null,
                    chapterId: chapterId || null,
                    
                    createdAt: String(new Date()),
                    updatedAt: String(new Date()),
                }

                dispatch(addCommentsRDHandle(newComment));

                return;
            }

            alert(commentRes.message as string);
            // ShowToastify({
            //     data: commentRes.message as string,
            //     type: "error"
            // });
        } catch (error) {
            console.log(error);
        }
    };    

    // Handle Destroy Comment
    const handleDestroyComment = async (senderId: string, commentId: string) => {

        if(currentUser?.userId !== senderId && currentUser.userId != 1) {
            return;
        }
        
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }
            
            const reviewResponse = await destroyCommentHandle(commentId, token);
            if(reviewResponse?.success) {
                dispatch(destroyCommentsNovelRDHandle({ commentId }))
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

    //Call Handle Get Comments
    useEffect(() => {
        dispatch(loadCommentsNovelRDHandle(true))
        handleGetComments();
    }, [novelId, chapterId])

    return (
        <>
            <div className="relative">
    
                <a ref={anchorRef} href="#target"></a>
    
                {
                    novelId && isFormSendComment && (  
                        <div className="relative grid mb-8 px-4">
                            {
                                !isFormSend ? (
                                    <div
                                        onClick={() => setIsFormSend(true)}
                                        className="p-4 h-28 text-sm cursor-text text-gray-400 border border-gray-400 rounded-sm"
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
            
                        </div>
                    )
                }
    
                {
                    loadComment ? (
                        <LoadingForm theme="dark"/>
                    ) : (
                        <ul className="transition-all ease-linear px-4 min-h-[120px]">
                            {
                                comments.length === 0 ? (
                                    <li>Hãy là người đầu tiên bình luận</li>
                                ) : (
                                    <>
                                        {
                                            comments?.map((comment) => {
                                                return (
                                                    <li key={comment.commentId} className="grid">
                                                        <CommentItem
                                                            key={comment?.commentId}
                                                            novelId={novelId}
                                                            chapterId={chapterId}
                                                            comment={comment}
                                                            user={currentUser}
                                                            isRpComment={isRpComment}
                                                            handleDeleteComment={handleDestroyComment}
                                                        />
                                                    </li>
                                                );
                                            })
                                        }
    
                                        <li className="flex justify-center my-5">
                                            <PaginationLayout
                                                countPage={countPage}
                                                currentPage={currentPage}
                                                handleChangePage={handleNextPage}
                                            />
                                        </li>
                                    </>
                                )
                            }
                        </ul>
                    )
                }
    
    
            </div>
            <div className={`${loadComments ? 'sticky' : 'hidden'} w-full left-0 right-0 bottom-[40%]`}>
                <div className={`z-[99999] w-[150px] border rounded-md bg-white text-black py-1 pr-5 pl-3 mx-auto text-sm shadow-md`}>
                    <img className="max-w-full inline-block align-middle" src="/emotions/loading-small.gif"/>
                    <span className="align-middle">Đang xử lí</span>
                </div>
            </div>
        </>
    );
};

export default FormComment;
