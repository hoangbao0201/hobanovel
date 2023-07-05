import { ReactNode } from "react";

import cn from "clsx";
import { WithClassName } from "@/types/common";

interface WrapperLayoutProps extends WithClassName<object> {
    children?: ReactNode
    bg?: string
}

const WrapperLayout = (props: WrapperLayoutProps) => {
    return (
        <div
            className={cn(
                props.className,
                `grid transition-all max-w-5xl mx-auto bg-white sm:rounded-xl px-4 py-5`
            )}
        >
            <div className="-mx-4">{props.children}</div>
        </div>
    );
};

export default WrapperLayout;
