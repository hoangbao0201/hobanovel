import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { CommentType } from "@/types";
import { EditorState, convertToRaw } from "draft-js";
// import { EditorStyle } from "@/components/Layout/EditorStyle";
import { iconSend } from "../../../../public/icons";
import { addCommentHandle, destroyCommentHandle, getCommentsHandle } from "@/services/comment.services";
import Link from "next/link";
import CommentItem from "./CommentItem";
import { getAccessToken } from "@/services/cookies.servies";
import { CommentSliceType, addCommentsRDHandle, setCommentsRDHandle } from "@/redux/commentSlice";
import { LoadingForm } from "@/components/Layout/LoadingLayout";
// import { socket } from "@/socket";
// import { io, Socket } from "socket.io-client";
import { EditorStyle } from "@/components/Layout/EditorStyle";

// import { CKEditor } from '@ckeditor/ckeditor5-react';

// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// const CKEditor = dynamic(import("@ckeditor/ckeditor5-react"))


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

        setTimeout(() => {
            if (commentsResponse?.data.success) {
                dispatch(setCommentsRDHandle(Array.from((commentsResponse.data.comments))))
            }
            setHasLoadedData(true);
        }, 2000)

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


    // ---

    const editorRef = useRef<{ CKEditor: any, ClassicEditor: any } | null>(null);
    const { CKEditor, ClassicEditor } = editorRef.current || {};

    useEffect(() => {
        editorRef.current = {
        CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
        ClassicEditor: require("@ckeditor/ckeditor5-build-classic")
        };
    }, []);


    return (
        <div className="flex">
            <div className="w-8/12 p-5 -ml-5 relative">

                {/* <CKEditorWrapper />
                <code>
                    {value}
                </code> */}

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
                    {
                        isLoading ? (
                            <LoadingForm theme="dark"/>
                        ) : (
                            comments.length === 0 ? (
                                <span>Hãy là người đầu tiên bình luận</span>
                            ) : (
                                comments?.map((comment) => {
                                    return (
                                        <CommentItem key={comment?.commentId} comment={comment} user={currentUser} handleDeleteComment={handleDestroyComment}/> 
                                    );
                                })
                            )
                        )
                    }
                </div>
            </div>
            <div className="w-4/12 p-5 -ml-5 relative">r</div>
        </div>
    );
};

export default FormComment;
