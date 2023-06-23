import Link from "next/link";

import LazyLoad from "react-lazy-load";

import { NovelType } from "@/types";
import { placeholderBlurhash } from "@/constants";
import BlurImage from "../../Layout/BlurImage";
import { PROPERTIES_NOVEL } from "@/constants/data";
import ItemNovel from "@/components/Layout/ItemNovel";
import { Fragment } from "react";

type NovelHighlyRated = NovelType & { mediumScore: number }

interface HighlyRatedProps {
    novels?: NovelHighlyRated[]
}

const HighlyRated = ({ novels = [] } : HighlyRatedProps) => {

    return (
        <div className="-mx-4">
            <h3 className="px-4 mb-4 text-xl font-semibold">Truyện đánh giá cao</h3>
            <div className="px-4 mb-4 grid md:grid-cols-2 grid-cols-1 gap-6">
    
                {   
                    novels?.length ? (
                        novels.map((novel) => {
                            return (
                                <Fragment key={novel?.novelId}>
                                    <ItemNovel novel={novel} isRating={true}/>
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

export default HighlyRated;