import { ReactNode } from "react";

import CreatorLayout from "@/components/Layout/CreatorLayout";

interface DocumentPageProps {
}

const DocumentPage = ({} : DocumentPageProps) => {

    return (    
        <div className="">
            Tư liệu
        </div>
    )
}

DocumentPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/novels/documents">
            {page}
        </CreatorLayout>
    )
}

export default DocumentPage;
