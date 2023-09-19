import Image from "next/image"
import { WithClassName } from "@/types/common"
import { ComponentProps, useState } from "react"

import cn from "clsx"

interface BlurImage extends WithClassName, ComponentProps<typeof Image> {
    alt: string
}

const BlurImage = (props : BlurImage) => {
    // const [isLoading, setLoading] = useState(true);
    const [imgSrc, setImgSrc] = useState(props.src);

    return (
        <Image
            {...props}
            alt={props.alt}
            className={cn(
                props.className,
                props.className,
                "block duration-300 ease-in-out object-cover align-middle",
                // isLoading
                // ? "grayscale blur-sm"
                // : "grayscale-0 blur-0"
            )}
            loading="lazy"
            src={imgSrc || "/images/novel-default.png"}
            // src={"/images/novel-default.png"}
            // onLoadingComplete={() => setLoading(false)}
            onError={() => setImgSrc("/images/novel-default.png")}
        />
    )
}

export default BlurImage