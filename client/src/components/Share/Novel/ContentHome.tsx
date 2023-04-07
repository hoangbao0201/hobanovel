import Link from "next/link";
import { useEffect, useState } from "react";

import { ChapterType, NovelType } from "@/types";
import { getChaptersNovelByUrlHandle } from "@/services/chapter.services";
import FormIntroduce from "../Home/FormIntroduce";
import FormListChapters from "./FormListChapters";


interface ContentNovelProps {
    tab?: number
    slug?: string
    description?: string
}

const ContentNovel = ({ tab, slug, description } : ContentNovelProps) => {

    const [bodyContent, setBodyContent] = useState<ChapterType[] | null>(null)

    return (
        <>
            {/* <style jsx>{`
                .my-custom-hiddent {
                    display: none;
                    opacity: 0;
                }
                .my-custom-show {
                    display: block !important;
                    opacity: 1 !important;
                }
            `}</style> */}
            <div className="">
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-300 ease-in-out ${tab==1 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    <FormIntroduce description={description || ""}/>
                </div>
                <div role="tabpanel" aria-labelledby="nav-tab-intro" className={`transition-opacity duration-300 ease-in-out ${tab==2 ? "block opacity-100" : "invisible h-0 opacity-0"}`}>
                    Đánh giá
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


