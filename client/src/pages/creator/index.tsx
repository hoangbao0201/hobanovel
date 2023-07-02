import CreatorLayout from "@/components/Layout/CreatorLayout";
import { ReactNode } from "react";

interface CreatorHomePageProps {
    children?: ReactNode
}

const CreatorHomePage = ({ children } : CreatorHomePageProps) => {

    return (    
        <div className="bg-red-500 min-h-[600px]">
        </div>
    )
}

CreatorHomePage.getLayout = (page : ReactNode) => {
    return (
        <CreatorLayout>
            {page}
        </CreatorLayout>
    )
}

export default CreatorHomePage;