import dynamic from "next/dynamic";
import { ReactNode } from "react";

interface WrapperLayoutProps {
    children?: ReactNode
}

const WrapperLayout = ({ children } : WrapperLayoutProps) => {

    return (    
        <div>
            {children}
        </div>
    )
}

export default WrapperLayout;