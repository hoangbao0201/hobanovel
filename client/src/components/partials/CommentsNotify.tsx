import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import LazyLoad from "react-lazy-load"

import BlurImage from "../Share/BlurImage"
import { LoadingForm } from "../Layout/LoadingLayout"
import { iconComment } from "../../../public/icons"
import { useClickOutSide } from "@/hook/useClickOutSide";
import { getAccessToken } from "@/services/cookies.servies"
import { getCommentsNotifyHandle, readCommentNotifyHandle } from "@/services/comment.services"
import ClientOnly from "../Share/ClientOnly"
import { useRouter } from "next/router"


interface CommentNotifyRes {
    commentId: string
    parentId: string
    senderName: string
    title: string
    slug: string
    isRead: boolean
    createdAt: Date
}

interface CommentsNotifyProps {
    receiverId: string | undefined
}

export const CommentsNotify = ({ receiverId } : CommentsNotifyProps) => {

    const router = useRouter()

    const notifyDropdownRef = useRef<any>();

    const [isDropdownNotify, setIsDropdownNotify] = useState(false);
    const [comments, setComments] = useState<CommentNotifyRes[] | null>(null)

    // Handle Get Comments Notify
    const handleGetCommentsNotify = async () => {
        const token = getAccessToken();
        if(!token || !receiverId) {
            return
        }

        try {
            
            const commentsRes = await getCommentsNotifyHandle(1, token);
            if(commentsRes?.success) {
                setComments(commentsRes.comments);
            }
        } catch (error) {
            setComments([])
        }
    }
    
    // Handle Hidden Dropdown
    const handleHiddenDropdownNotify = () => {
        setIsDropdownNotify(false);
    }

    // Handle Read Comment Notify
    const handleReadCommentNotify = (commentId: string) => {
        const token = getAccessToken();
        if(!token || !comments) {
            return;
        }
        try {
            readCommentNotifyHandle(commentId, token);

            setComments((comment) => {
                if(!comment) {
                    return []
                }
                return comment?.map(item => {
                    return item.commentId === commentId ? ({...item, isRead: true}) : (item)
                })
            })

        } catch (error) {}
    }
    
    // Call Handle Get Comments Notify
    useEffect(() => {
        handleGetCommentsNotify()
    }, [receiverId])

    //Call Handle Hidden Dropdown
    useEffect(() => {
        handleHiddenDropdownNotify()
    }, [router])

    useClickOutSide(notifyDropdownRef, handleHiddenDropdownNotify);

    return (
        <>
            <ClientOnly>
                <div ref={notifyDropdownRef} className="ml-auto mr-2 h-[50px]">

                    <button onClick={() => setIsDropdownNotify(value => !value)} className={`h-[50px]  top-0 px-2 ${isDropdownNotify ? 'bg-white [&>i]:fill-blue-400' : ''}`}>
                        <i className="w-6 h-6 mx-1 block fill-gray-500">{iconComment}</i>
                    </button>
                    <div ref={notifyDropdownRef} className={`absolute ${isDropdownNotify ? "block" : "hidden"} md:right-14 right-0 max-md:left-0 md:max-w-lg w-full bg-white top-[50px] shadow-lg rounded z-20`}>
                        <div className="grid">
                            <div className="px-4 py-3 border-b whitespace-nowrap text-center font-semibold">Thông báo</div>
                            
                                {
                                    receiverId ? (
                                        <ul className="h-72 overflow-y-auto">
                                            {
                                                comments ? (
                                                    comments.length > 0 ? (
                                                        comments.map(comment => {
                                                            return (
                                                                <li key={comment?.commentId} className={`${ comment?.isRead ? "bg-white" : "bg-[#fff2ee]" } transition-colors hover:bg-slate-100 border-b`}>
                                                                    <Link onClick={() => {
                                                                        if(!comment.isRead) {
                                                                            handleReadCommentNotify(comment.commentId);
                                                                        }
                                                                    }} className="flex px-4 py-3" href={`/truyen/${comment?.slug}#comment-${comment?.parentId}`}>
                                                                        <LazyLoad className="w-12 h-12 flex-shrink-0 mt-1 border rounded overflow-hidden">
                                                                            <BlurImage
                                                                                alt="image avatar"
                                                                                width={50}
                                                                                height={50}
                                                                                src={`/images/avatar-default-2.png`}
                                                                                className="w-12 h-12 object-cover"
                                                                            />
                                                                        </LazyLoad>
                                                                        <div className="pl-3 text-sm">
                                                                            <strong className="">{comment?.senderName}</strong>&nbsp;đã nhắc đến bạn ở bình luận trong&nbsp;
                                                                            <strong className="">{comment?.title}</strong>
                                                                        </div>
                                                                    </Link>
                                                                </li>
                                                            )
                                                        })
                                                    ) : (
                                                        <li className="px-4 my-3">Bạn không có thông báo nào</li>
                                                    )
                                                ) : (
                                                    <LoadingForm />
                                                )
                                            }
                                        </ul>
                                    ) : (
                                        <div className="px-4 my-3">
                                            <span>Bạn chưa đăng nhập! </span>
                                            <Link href={`/auth/login?callbackurl=${router.query?.callbackurl ? `${router.query.callbackurl}` : router.asPath || "/"}`} className="text-blue-800">
                                                Đăng nhập ngay
                                            </Link>
                                        </div>
                                    )
                                }
                            
                            <Link className="text-center hover:bg-slate-100 border-t py-1 font-semibold" href="#">Xem tất cả</Link>
                        </div>
                    </div>

                </div>
            </ClientOnly>
        </>
    )
}