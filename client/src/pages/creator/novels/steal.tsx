import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";

import { getAccessToken } from "@/services/cookies.servies";
import CreatorLayout from "@/components/Layout/CreatorLayout";
import { createNovelByUrlHandle } from "@/services/novels.services";
import { createChapterByUrlHandle } from "@/services/chapter.services";

interface StealNovelPageProps {
    children?: ReactNode
}

interface Message {
    id: number;
    message: string;
}

const StealNovelPage = ({ children } : StealNovelPageProps) => {

    const router = useRouter();

    const messageProgressRef = useRef<HTMLDivElement>(null)
    const [urlInput, setUrlInput] = useState<string>("")
    const [progress, setProgress] = useState<number>(0);
    const [isProgress, setIsProgress] = useState<boolean>(false);
    const [dataMessageProgress, setDataMessageProgress] = useState<Message[]>([])

    // Value Form
    const eventOnChangeInputUrl = (e: any) => {
        setUrlInput(e.target.value)
    };

    const handleSubmitButtonCreatNovel = async (e: any) => {
        e.preventDefault();

        if(!urlInput || isProgress) {
            return
        }
        
        try {

            const token = getAccessToken();
            if(!token) {
                setIsProgress(false);
                setProgress(0);
                return;
            }

            const novelResponse = await createNovelByUrlHandle(urlInput as string, token as string);
            if(novelResponse?.data.success) {

                setIsProgress(true)

                setDataMessageProgress(value => [...value, { id: 1, message: "Creact Novel - Thành công" }])
                setDataMessageProgress(value => [...value, { id: 2, message: "Upload Thumbnail Novel - Thành công" }])
                setProgress(1)

                for (let i = 1; i <= 99; i++) {
                    console.log(`${novelResponse?.data.novel.slug}/${i}`)
                    const chapterResponse = await createChapterByUrlHandle(`${novelResponse?.data.novel.slug}/${i}` as string, token as string)

                    if(chapterResponse?.data.success) {
                        setDataMessageProgress(value => [ ...value, { id: i+2, message: `Upload Chương ${i} - Thành công` } ])
                        setProgress(value => value + 1)
                    }
                    else {
                        setIsProgress(false);
                        setProgress(0)
                        return
                    }
                    
                }
            }

            setIsProgress(false);
            setProgress(0)
            return

        } catch (error) {
            setIsProgress(false);
            setProgress(0)
            console.log(error)
            // router.reload();
        }
    };

    const scrollToBottom = () => {
        if (messageProgressRef.current) {
            messageProgressRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [dataMessageProgress]);

    return (    
        <div className="">
            <div className="flex flex-col mb-3">
                <label className="w-full mb-4">Url novel (metruyenchu)</label>
                <input
                    className="border-gray-300 border outline-none rounded-md py-2 px-6 text-base"
                    placeholder=""
                    name="urlText"
                    value={urlInput}
                    onChange={eventOnChangeInputUrl}
                />
            </div>

            <div className="mb-5">
                {
                    isProgress && (
                        <div className="border border-gray-300 rounded-full overflow-hidden">
                            <span style={{ width: `${progress}%` }} className="left-0 h-2 bg-red-400 block"/>
                        </div>
                    )
                }
            </div>

            <div className="">

                <div className="mb-8">
                    <div className="bg-gray-200 border border-gray-300 rounded-md h-40 w-[400px] overflow-y-auto p-2 text-gray-500">
                        {  
                            dataMessageProgress.map((data) => {
                                return <div key={data.id} className="select-none">{data.message}</div>
                            })
                        }
                        <div ref={messageProgressRef}></div>
                    </div>
                </div>

                <button onClick={handleSubmitButtonCreatNovel} className="border border-gray-300 rounded-lg py-2 px-8">
                    Cập nhật {isProgress && " - loading"}
                </button>

            </div>
        </div>
    )
}

StealNovelPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/novels/steal">
            {page}
        </CreatorLayout>
    )
}

export default StealNovelPage;
