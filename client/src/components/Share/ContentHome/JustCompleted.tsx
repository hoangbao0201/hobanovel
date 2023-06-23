import Link from "next/link";

import LazyLoad from "react-lazy-load";

import { NovelType } from "@/types";
import { placeholderBlurhash } from "@/constants";
import { PROPERTIES_NOVEL } from "@/constants/data";
import BlurImage from "@/components/Layout/BlurImage";
import ItemNovel from "@/components/Layout/ItemNovel";
import { Fragment } from "react";

interface JustCompletedProps {
    novels?: NovelType[]
}

const JustCompleted = ({ novels = [] } : JustCompletedProps) => {

    return (
        <div className="mb-5">
            <h3 className="px-4 mb-5 text-xl font-semibold">Mới hoàn thành</h3>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 px-4">
    
                {   
                    novels?.length ? (
                        novels.map((novel) => {
                            return (
                                <Fragment key={novel?.novelId}>
                                    <ItemNovel novel={novel}/>
                                </Fragment>
                            )
                        })
                    ) : (
                        <div>Không có truyện</div>
                    )
                }
            </div>
        </div>
    )
}

export default JustCompleted;