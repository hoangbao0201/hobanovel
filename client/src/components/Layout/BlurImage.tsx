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
                "block duration-700 ease-in-out",
                // isLoading
                // ? "grayscale blur-2xl scale-105"
                // : "grayscale-0 blur-0 scale-100"
            )}
            loading="lazy"
            onLoadingComplete={() => setLoading(false)}
        />
    )
}

export default BlurImage