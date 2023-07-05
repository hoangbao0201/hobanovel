import { ReactNode } from "react";

import CreatorLayout from "@/components/Layout/CreatorLayout";

interface DraftsNovelPageProps {
}

const DraftsNovelPage = ({ } : DraftsNovelPageProps) => {

    return (    
        <div className="">
            Các bản thảo
        </div>
    )
}

DraftsNovelPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/drafts">
            {page}
        </CreatorLayout>
    )
}

export default DraftsNovelPage;
