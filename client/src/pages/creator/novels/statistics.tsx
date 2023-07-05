import { ReactNode } from "react";

import CreatorLayout from "@/components/Layout/CreatorLayout";

interface StatisticsPageProps {
}

const StatisticsPage = ({} : StatisticsPageProps) => {

    return (    
        <div className="">
            Thống kê
        </div>
    )
}

StatisticsPage.getLayout = (page : ReactNode) => {

    return (
        <CreatorLayout tab="/creator/novels/statistics">
            {page}
        </CreatorLayout>
    )
}

export default StatisticsPage;
