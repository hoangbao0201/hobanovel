import { ReactNode } from "react";

import CreatorLayout from "@/components/Layout/CreatorLayout";

interface newNovelPageProps {
    children?: ReactNode
}

const newNovelPage = ({} : newNovelPageProps) => {

    return (    
        <div className="">
            Thêm truyện mới
        </div>
    )
}

newNovelPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/novels/new">
            {page}
        </CreatorLayout>
    )
}

export default newNovelPage;
