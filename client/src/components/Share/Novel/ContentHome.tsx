import { useState } from "react";

import { ChapterType } from "@/types";
import FormIntroduce from "../Home/FormIntroduce";
import FormListChapters from "./FormListChapters";
import FormFeedback from "./FormFeedback";


interface ContentNovelProps {
    tab?: number
    slug?: string
    description?: string
}

const ContentNovel = ({ tab, slug, description } : ContentNovelProps) => {

    const [bodyContent, setBodyContent] = useState<ChapterType[] | null>(null)

    return (
        <>
            <div className="">
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-300 ease-in-out ${tab==1 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    <FormIntroduce description={description || ""}/>
                </div>
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-300 ease-in-out ${tab==2 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    <FormFeedback />
                </div>
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-300 ease-in-out ${tab==3 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    <FormListChapters tab={tab} slug={slug}/>
                </div>
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-300 ease-in-out ${tab==4 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    Bình luận
                </div>
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-300 ease-in-out ${tab==5 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    Hâm mộ
                </div>
            </div>
        </>
    )
}

export default ContentNovel;


