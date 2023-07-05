import { ReactNode } from "react";

import CreatorLayout from "@/components/Layout/CreatorLayout";

interface IssuesPageProps {
    children?: ReactNode
}

const IssuesPage = ({ children } : IssuesPageProps) => {

    return (    
        <div className="">
            Vấn đề
        </div>
    )
}

IssuesPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/novels/issues">
            {page}
        </CreatorLayout>
    )
}

export default IssuesPage;
