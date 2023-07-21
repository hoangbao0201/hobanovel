import { Fragment } from "react";

import { NovelType } from "@/types";
import ItemNovel from "@/components/Share/ItemNovel";

type NovelHighlyRated = NovelType & { mediumScore: number }

interface HighlyRatedProps {
    novels?: NovelHighlyRated[]
}

const HighlyRated = ({ novels = [] } : HighlyRatedProps) => {

    return (
        <ul className="px-4 mb-4 grid md:grid-cols-2 grid-cols-1 gap-6">
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
                    <li>Không có truyện</li>
                )
            }
        </ul>
    )
}

export default HighlyRated;