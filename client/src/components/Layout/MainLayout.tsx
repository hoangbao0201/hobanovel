import dynamic from "next/dynamic";
import { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode
}

const Header = dynamic(() => import('../partials/Header'));


const MainLayout= ({ children } : MainLayoutProps) => {

    return (
        <>
        
            <Header />

            <div>
                {children}
            </div>
        
        </>
    )
}

export default MainLayout;