import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";

import { toast } from 'react-toastify';

import { getAccessToken } from "@/services/cookies.servies";
import CreatorLayout from "@/components/Layout/CreatorLayout";
import { createNovelByUrlHandle } from "@/services/novels.services";
import { createChapterByUrlHandle } from "@/services/chapter.services";
import { ShowToastify } from "@/components/features/ShowToastify";

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
    const [numberGetChapters, setNumberGetChapters] = useState<number | null>(null);

    // Value Form
    const eventOnChangeInputUrl = (e: any) => {
        setUrlInput(e.target.value)
    };

    const handleSubmitButtonCreatNovel = async (e: any) => {
        e.preventDefault();

        if(!urlInput || isProgress) {
            ShowToastify({ data: "Chưa điền url", type: "error" });
            return
        }
        
        try {

            const token = getAccessToken();
            if(!token) {
                setIsProgress(false);
                setProgress(0);
                return;
            }
            setDataMessageProgress([])

            // Upload Novel
            const novelResponse = await createNovelByUrlHandle(urlInput as string, token as string);
            if(!novelResponse?.success) {
                throw new Error()
            }

            // SET STATE START RUN
            setIsProgress(true)

            setDataMessageProgress(value => [...value, { id: 1, message: "Novel đang được tạo" }])
            setProgress(1)

            console.log(novelResponse)
            
            const { novelId, slug, chapterCount, chapterLatest } = novelResponse.novel;
            const stepProgress = 100 / chapterLatest;
            
            if(chapterCount >= chapterLatest) {
                setDataMessageProgress(value => [...value, { id: 2, message: "Novel đang ở chapter mới nhất" }])
                ShowToastify({ data: "Novel đang ở chapter mới nhất", type: "success" });
            }
            else if(chapterCount < chapterLatest) {


                for (let i = chapterCount + 1; i <= chapterLatest; i++) {
                    const chapterResponse = await createChapterByUrlHandle(`${slug}/${i}` as string, token as string);
    
                    // SET DEFAULT STATE
                    if(chapterResponse?.success) {
                        setDataMessageProgress(value => [ ...value, { id: i+2, message: `Upload Chương ${i} - Thành công` } ])
                        setProgress(value => value + stepProgress)
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

    // const hadnle = async () => {
    //     const url = "http://res.cloudinary.com/djrbd6ftt/image/upload/v1683736340/hobanovel/novel/thumbnail/1683736339630.jpg"
    //     const hash = await getBlurDataURL(url)
    //     console.log(hash)
    // }

    // useEffect(() => {
    //     hadnle()
    // }, [])

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
