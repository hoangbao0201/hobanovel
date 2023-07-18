

import cn from "clsx"
import { WithClassName } from "@/types/common"



export const ItemLazy = (props : WithClassName) => {


    return (
        <div
            className={cn(
                props.className,
                "bg-gray-300"
            )}
            style={{ animation: "2s ease-in-out infinite c" }}
        ></div>
    )
}