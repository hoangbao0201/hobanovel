import { ReactNode } from "react";

import cn from "clsx"
import { WithClassName } from "@/types/common";

interface WrapperLayoutProps extends WithClassName {
    children?: ReactNode
    bg?: string
}

const WrapperLayout = (props: WrapperLayoutProps) => {

    return (
        <div className={cn(
            props.className,
            `transition-all max-w-6xl min-h-[300px] mx-auto grid bg-white rounded-xl`
        )}>{props.children}</div>
    )
}

export default WrapperLayout;