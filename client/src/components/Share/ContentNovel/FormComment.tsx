import Image from "next/image";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { CommentItemWith, CommentType } from "@/types";
import { EditorState, convertToRaw } from "draft-js";
import { EditorStyle } from "@/components/Layout/EditorStyle";
import { iconSend } from "../../../../public/icons";
import { addCommentHandle, destroyCommentHandle, getCommentsHandle } from "@/services/comment.services";
import Link from "next/link";
import CommentItem from "./CommentItem";
import { getAccessToken } from "@/services/cookies.servies";

interface FormCommentProps {
    tab?: number;
    novelId?: string;
}

const FormComment = ({ tab, novelId }: FormCommentProps) => {
    const { currentUser, isAuthenticated } = useSelector((state: any) => state.user);
    // ---
    const [bodyContent, setBodyContent] = useState<CommentType[]>([]);
    const [hasLoadedData, setHasLoadedData] = useState<boolean>(false);

    const getListComments = async () => {

        const dataComments = { novelId }
        const commentsResponse = await getCommentsHandle(dataComments as CommentType);
        if (commentsResponse?.data.success) {
            // console.log(commentsResponse.data.comments);
            setBodyContent(commentsResponse.data.comments);
        }
        setHasLoadedData(true);
    };

    useEffect(() => {
        if (tab === 4 && !hasLoadedData) {
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
                setBodyContent([
                    {
                        commentId: reviewResponse.data.data.commentId,
                        commentText: String(data.commentText),
                        countReplyComment: null,
                        novelId: String(novelId),
                        chapterId: null,
                        parentId: null,
                        userId: currentUser.name,
                        name: currentUser?.name,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    ...bodyContent,
                ]);
                // console.log(reviewResponse.data);
            }

            setCommentText(EditorState.createEmpty());
        } catch (error) {
            setCommentText(EditorState.createEmpty());
            console.log(error);
        }
    };

    // console.log(bodyContent)

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
                const filterComments = bodyContent.filter((comment) => comment?.commentId !== commentId)
                setBodyContent(filterComments);
            }
            console.log(reviewResponse)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex">
            <div className="w-8/12 p-5 -ml-5 relative">
                <div className="flex mb-16">
                    <Link
                        href={`/user/1`}
                        className="w-10 h-10 mt-2 rounded-full overflow-hidden shadow align-middle inline-block"
                    >
                        <Image
                            width={500}
                            height={500}
                            alt="image-demo"
                            className="object-cover w-10 h-10"
                            src={`${currentUser?.avatarUrl ?? "/images/50.jpg"}`}
                        />
                    </Link>
                    <div className="flex-1 pr-24 pl-3 py-3 ml-4 border bg-gray-100 border-opacity-5 relative">
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
                    {bodyContent &&
                        bodyContent?.map((comment) => {
                            return (
                                comment ? (
                                    <CommentItem key={comment?.commentId} comment={comment} user={currentUser} handleDeleteComment={handleDestroyComment}/>
                                ) : (
                                    <div></div>
                                )   
                            );
                        })}
                </div>
            </div>
            <div className="w-4/12 p-5 -ml-5 relative">r</div>
        </div>
    );
};

export default FormComment;