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
            `max-w-6xl min-h-[300px] mx-auto lg:px-4 grid bg-white rounded-xl py-7 px-4 my-4 mb-8`
        )}>{props.children}</div>
    )
}

export default WrapperLayout;