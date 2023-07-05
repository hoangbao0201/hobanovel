import { ReactNode } from "react";

import CreatorLayout from "@/components/Layout/CreatorLayout";

interface MyNovelPageProps {
    children?: ReactNode
}

const MyNovelPage = ({ children } : MyNovelPageProps) => {

    return (    
        <div className="">
            Truyện của tôi
        </div>
    )
}

MyNovelPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/novels">
            {page}
        </CreatorLayout>
    )
}

export default MyNovelPage;
