import { useState } from "react";

import { ChapterType, NovelType } from "@/types";
import FormIntroduce from "./FormIntroduce";
import FormListChapters from "./FormListChapters";
import FormFeedback from "./FormFeedback";


interface ContentNovelProps {
    tab?: number
    novel?: NovelType
}

const ContentNovel = ({ tab, novel } : ContentNovelProps) => {

    const [bodyContent, setBodyContent] = useState<ChapterType[] | null>(null)

    return (
        <>
            <div className="">
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-400 ease-in-out ${tab==1 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    <FormIntroduce description={novel?.description || ""}/>
                </div>
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-400 ease-in-out ${tab==2 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    <FormFeedback tab={tab} novelId={novel?.novelId}/>
                </div>
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-400 ease-in-out ${tab==3 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    <FormListChapters tab={tab} slug={novel?.slug}/>
                </div>
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-400 ease-in-out ${tab==4 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    Bình luận
                </div>
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-400 ease-in-out ${tab==5 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    Hâm mộ
                </div>
            </div>
        </>
    )
}

export default ContentNovel;


