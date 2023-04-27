import { ReactNode } from "react";

import cn from "clsx"
import { WithClassName } from "@/types/common";

interface WrapperLayoutProps extends WithClassName {
    children?: ReactNode
}

const WrapperLayout = (props: WrapperLayoutProps) => {

    return (    
        <div className="max-w-7xl min-h-[300px] mx-auto px-4 grid bg-white rounded-xl">
            <div className={cn(
                props.className,
                "my-4 mb-8"
            )}>{props.children}</div>
        </div>
    )
}

export default WrapperLayout;