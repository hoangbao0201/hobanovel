import dynamic from "next/dynamic";
import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode
    isHeader?: boolean
    isFooter?: boolean
    isBannerPage?: boolean
}

const Header = dynamic(() => import('../partials/Header'));
const Footer = dynamic(() => import('../partials/Footer'));
const BannerPage = dynamic(() => import('../partials/BannerPage'));


const MainLayout= ({ children, isHeader = true, isFooter = true, isBannerPage = true } : MainLayoutProps) => {

    return (
        <>
        
            { isHeader && <Header /> }

            { isBannerPage && <BannerPage /> }

            <div className={`${isBannerPage && "top-0 -translate-y-28"}`}>
                {children}
            </div>

            { isFooter && <Footer /> }
        
        </>
    )
}

export default MainLayout;