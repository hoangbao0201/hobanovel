import Image from "next/image"
import { WithClassName } from "@/types/common"
import { ComponentProps, useState } from "react"

import cn from "clsx"

interface BlurImage extends WithClassName, ComponentProps<typeof Image> {
    alt: string
}

const BlurImage = (props : BlurImage) => {
    const [isLoading, setLoading] = useState(true);

    return (
        <Image
            {...props}
            alt={props.alt}
            className={cn(
                props.className,
                props.className,
                "block duration-300 ease-in-out",
                // isLoading
                // ? "grayscale blur-sm"
                // : "grayscale-0 blur-0"
            )}
            loading="lazy"
            onLoadingComplete={() => setLoading(false)}
        />
    )
}

export default BlurImage