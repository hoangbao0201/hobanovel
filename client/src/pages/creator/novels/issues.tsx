import { ReactNode } from "react";

import CreatorLayout from "@/components/Layout/CreatorLayout";

interface StealNovelPageProps {
    children?: ReactNode
}

interface Message {
    id: number;
    message: string;
}

const StealNovelPage = ({ children } : StealNovelPageProps) => {

    return (    
        <div className="">
            Page Issues
        </div>
    )
}

StealNovelPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/novels/issues">
            {page}
        </CreatorLayout>
    )
}

export default StealNovelPage;
