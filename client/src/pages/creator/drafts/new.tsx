import { ReactNode } from "react";

import CreatorLayout from "@/components/Layout/CreatorLayout";

interface newDraftsNovelPageProps {
}

const newDraftsNovelPage = ({} : newDraftsNovelPageProps) => {

    return (    
        <div className="">
            Thêm bản thảo
        </div>
    )
}

newDraftsNovelPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/drafts/new">
            {page}
        </CreatorLayout>
    )
}

export default newDraftsNovelPage;
