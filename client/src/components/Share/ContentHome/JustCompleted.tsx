import { Fragment } from "react";

import { NovelType } from "@/types";
import ItemNovel from "@/components/Share/ItemNovel";

interface JustCompletedProps {
    novels?: NovelType[]
}

const JustCompleted = ({ novels = [] } : JustCompletedProps) => {

    return (
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
                    <span>Không có truyện</span>
                )
            }
        </div>
    )
}

export default JustCompleted;