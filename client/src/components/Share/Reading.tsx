import Link from "next/link";

import { NovelType } from "@/types";
import { placeholderBlurhash } from "@/constants";
import BlurImage from "../Layout/BlurImage";

interface ReadingProps {
    novels?: NovelType[] | []
}

const Reading = ({ novels } : ReadingProps) => {

    return (
        <div className="mb-5">
            <h3 className="px-4 mb-5 text-xl font-semibold">Truyện đang đọc</h3>
            <div className="px-4">
                {
                    novels?.map((novel : NovelType, index) => {
                        return (
                            <div key={index} className="flex mb-3">
                                <Link href={`/truyen/${novel.slug}`} className="w-10 h-14 overflow-hidden shadow align-middle inline-block">
                                    <BlurImage
                                        width={38}
                                        height={54}
                                        alt="image-demo"
                                        blurDataURL={placeholderBlurhash}
                                        className="group-hover:scale-105 group-hover:duration-500 object-cover w-10 h-14"
                                        placeholder="blur"
                                        src={novel.thumbnailUrl}
                                    />
                                </Link>
                                <div className="flex-1 ml-3">
                                    <Link className="block" href={`/truyen/${novel.slug}`}>
                                        <h2 className="mb-1 text-sm line-clamp-1 font-semibold">
                                            {novel.title}
                                        </h2>
                                        <div className="text-slate-600 text-sm">Đã đọc: 0/1466</div>
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Reading;