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
            `grid transition-all max-w-5xl min-h-[300px] mx-auto bg-white sm:rounded-xl px-4`
        )}>{props.children}</div>
    )
}

export default WrapperLayout;