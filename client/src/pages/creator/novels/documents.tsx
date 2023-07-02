import { ReactNode } from "react";

import CreatorLayout from "@/components/Layout/CreatorLayout";

interface StealNovelPageProps {
    children?: ReactNode
}

const StealNovelPage = ({ children } : StealNovelPageProps) => {

    return (    
        <div className="">
            Page Document
        </div>
    )
}

StealNovelPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/novels/documents">
            {page}
        </CreatorLayout>
    )
}

export default StealNovelPage;
