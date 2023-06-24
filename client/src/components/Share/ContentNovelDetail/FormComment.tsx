import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { CommentType } from "@/types";
import { EditorState, convertToRaw } from "draft-js";
import { iconSend } from "../../../../public/icons";
import { addCommentHandle, destroyCommentHandle, getCommentsHandle } from "@/services/comment.services";
import CommentItem from "./CommentItem";
import { getAccessToken } from "@/services/cookies.servies";
import { CommentSliceType, addCommentsRDHandle, setCommentsRDHandle } from "@/redux/commentSlice";
import { LoadingForm } from "@/components/Layout/LoadingLayout";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { dataFakeBannersMobile } from "@/components/partials/BannersIntro";


interface FormCommentProps {
    tab?: number;
    novelId?: string;
}

const FormComment = ({ tab, novelId }: FormCommentProps) => {
    const dispatch = useDispatch();
    const { currentUser, isAuthenticated } = useSelector((state: any) => state.user);
    const { isLoading, comments } : CommentSliceType = useSelector(
        (state: any) => state.comment
    );

    // ---



    // ---
    // const socket = useRef<Socket>(io("http://localhost:4000"));
    const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);

    const getListComments = async () => {

        const dataComments = { novelId }
        const commentsResponse = await getCommentsHandle(dataComments as CommentType);

        if (commentsResponse?.data.success) {
            dispatch(setCommentsRDHandle(Array.from((commentsResponse.data.comments))))
        }
        setHasLoadedData(true);
    };

    useEffect(() => {
        if (tab === 3 && !hasLoadedData) {
            getListComments();
            setHasLoadedData(true);
        }
    }, [tab, hasLoadedData]);

    const [commentText, setCommentText] = useState(() => EditorState.createEmpty());

    const handleSendComment = async () => {
        if (!isAuthenticated) {
            console.log("Bạn chưa đăng nhập");
            return;
        }
        if (!commentText) {
            console.log("Data not found");
            return;
        }

        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const data = {
                token,
                novelId,
                commentText: JSON.stringify(convertToRaw(commentText.getCurrentContent())),
            };
            
            
            const reviewResponse = await addCommentHandle(data as CommentType & { token: string });
            if (reviewResponse?.data.success) {
                const newComment = {
                    commentId: reviewResponse.data.data.commentId,
                    commentText: String(data.commentText),
                    countReplyComment: null,
                    novelId: String(novelId),
                    chapterId: null,
                    parentId: null,
                    userId: currentUser.userId,
                    name: currentUser?.name,
                    createdAt: String(new Date()),
                    updatedAt: String(new Date()),
                }
                dispatch(addCommentsRDHandle(newComment));
                // socket.current.emit("send_message", newComment);
            }

            setCommentText(EditorState.createEmpty());
        } catch (error) {
            setCommentText(EditorState.createEmpty());
            console.log(error);
        }
    };

    // ---
    

    const handleDestroyComment = async (userId: string, commentId: string) => {
        if(currentUser?.userId !== userId) {
            return;
        }
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }
            const dataComment = {
                token,
                commentId
            }
            const reviewResponse = await destroyCommentHandle(dataComment as CommentType & { token: string });
            if(reviewResponse?.data.success) {
                const filterComments = comments.filter((comment) => comment?.commentId !== commentId);
                dispatch(setCommentsRDHandle(filterComments))
            }
            console.log(reviewResponse)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex -mx-4">
            <div className="lg:w-8/12 w-full px-4">

                <div className="flex mb-10">
                    <div className="flex-1 pr-24 pl-2 py-2 border bg-gray-100 border-opacity-5 relative">
                        <EditorStyle
                            name="comment"
                            text={commentText}
                            handleOnchange={setCommentText}
                        />
                        <button
                            onClick={handleSendComment}
                            className="py-2 px-4 rounded-sm transition-all bg-yellow-600 hover:bg-yellow-700 absolute bottom-4 right-4"
                        >
                            <i className="w-6 h-6 fill-white block translate-x-[1px]">
                                {iconSend}
                            </i>
                        </button>
                    </div>
                </div>

                <div className="transition-all ease-linear">
                    {
                        isLoading ? (
                            <LoadingForm theme="dark"/>
                        ) : (
                            comments.length === 0 ? (
                                <span>Hãy là người đầu tiên bình luận</span>
                            ) : (
                                comments?.map((comment) => {
                                    return (
                                        <Fragment key={comment.commentId}>
                                            <CommentItem key={comment?.commentId} comment={comment} user={currentUser} handleDeleteComment={handleDestroyComment}/>
                                        </Fragment>
                                    );
                                })
                            )
                        )
                    }
                </div>
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
