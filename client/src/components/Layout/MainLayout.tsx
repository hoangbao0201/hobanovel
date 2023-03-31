import dynamic from "next/dynamic";
import { ReactNode } from "react";
import Footer from "../partials/Footer";

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

            <Footer />
        
        </>
    )
}

export default MainLayout;