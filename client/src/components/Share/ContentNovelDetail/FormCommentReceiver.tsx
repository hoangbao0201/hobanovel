import { useEffect, useState } from "react";
import FormComment from "../FormComment";
import { iconClose } from "../../../../public/icons";
import { getAccessToken } from "@/services/cookies.servies";
import { useRouter } from "next/router";


interface FormCommentReceiverProps {
    novelId: string
}

export const FormCommentReceiver = ({novelId} : FormCommentReceiverProps) => {

    const router = useRouter();

    const [isFormComments, setIsFormComments] = useState<string | null>(null);

    useEffect(() => {
        const bodyElement = document.querySelector('body');
        
        if (isFormComments) {
            bodyElement?.classList.add('overflow-hidden');
            bodyElement?.classList.add('pr-4');
        }
        else {
            bodyElement?.classList.remove('overflow-hidden');
            bodyElement?.classList.remove('pr-4');
        }
    }, [isFormComments]);

    useEffect(() => {
        const token = getAccessToken();
        const commentId = router.asPath.split('#comment-')[1];
        if(commentId && !isNaN(Number(commentId)) && token) {
            setIsFormComments(commentId as string)
        }
    }, [router]);

    if(!isFormComments) {
        return null;
    }

    return (
        <div className={`${ !!isFormComments ? 'fixed block overflow-y-scroll' : 'hidden' } transition-all z-50 top-0 right-0 bottom-0 left-0 bg-black/10`}>

            <div className="mx-auto max-w-lg w-full top-0">
                <div className="bg-white rounded-md shadow-lg mt-[30px] mx-4 relative">

                    <button onClick={() => setIsFormComments(null)} className="p-2 hover:bg-gray-200 rounded-full absolute right-3 top-3">
                        <i className="w-5 h-5 block">{iconClose}</i>
                    </button>

                    <div className="min-h-[400px]">
                        <div className="px-4 py-4 mb-4 border-b">
                            <h4 className="w-2/3 font-semibold">Bình luận mới</h4>
                        </div>
                        <FormComment
                            novelId={novelId}
                            commentId={isFormComments}
                            isRpComment={true}
                            isFormSendComment={false}
                        />
                    </div>

                    <div className="border-t h-[50px] flex items-center px-4">
                        <span onClick={() => setIsFormComments(null)} className="py-1 px-3 border rounded-md ml-auto mr-5 cursor-pointer select-none">Đóng</span>
                    </div>

                </div>
            </div>

        </div>
    )
}