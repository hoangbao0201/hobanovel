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
            router.reload();
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
            <div className="">
                /creator/drafts/new
            </div>
        </div>
    )
}

StealNovelPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/drafts/new">
            {page}
        </CreatorLayout>
    )
}

export default StealNovelPage;
