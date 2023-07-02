import { Fragment } from "react";

import { NovelType } from "@/types";
import ItemNovel from "@/components/Layout/ItemNovel";

interface OutstandingProps {
    novels?: NovelType[]
}

const Outstanding = ({ novels = [] } : OutstandingProps) => {

    return (
        <div className="px-4 grid md:grid-cols-2 grid-cols-1 gap-6">

            {   
                novels?.length ? (
                    novels.map((novel : NovelType) => {
                        return (
                            <Fragment key={novel?.novelId}>
                                <ItemNovel novel={novel}/>
                            </Fragment>
                        )
                    })
                ) : (
                    <span>Không có truyện</span>
                )
            }
        </div>
    )
}

export default Outstanding;