import { NovelBySlugType, NovelType } from "@/types"
import Link from "next/link"
import LazyLoad from "react-lazy-load"
import BlurImage from "./BlurImage"
import { placeholderBlurhash } from "@/constants"
import { PROPERTIES_NOVEL } from "@/constants/data"

interface ItemNovelProps {
    novel: NovelType & { mediumScore?: number }
    isRating?: boolean 
    isAuthor?: boolean 
}

const ItemNovel = ({ novel, isRating = false, isAuthor = false } : ItemNovelProps) => {

    return (
        <>
            <div key={novel.novelId} className="flex">
                <Link href={`/truyen/${novel.slug}`} className="">
                    <LazyLoad className="relative w-20 h-28 overflow-hidden shadow">
                        <BlurImage
                            id={novel?.imageBlurHash}
                            width={80}
                            height={112}
                            alt="image-demo"
                            blurDataURL={novel?.imageBlurHash || placeholderBlurhash}
                            className="group-hover:scale-105 group-hover:duration-500 object-cover h-28 w-20"
                            placeholder="blur"
                            src={novel?.thumbnailUrl}
                        />
                    </LazyLoad>
                </Link>
                <div className="flex-1 ml-3">
                    <h2 className="mb-2 text-base line-clamp-1 font-semibold">
                        <Link className="block" href={`/truyen/${novel.slug}`}>{novel.title}</Link>
                    </h2>
                    {
                        isRating && (
                            <div className="flex items-center mb-2">
                                <div className="py-[3px] lg:px-3 px-2 rounded-full lg:text-base text-sm leading-none text-white font-semibold bg-red-700">{novel.mediumScore || "5.0"}</div>
                                <div className="ml-3 text-green-700 lg:text-base text-sm font-semibold line-clamp-1">{}</div>
                            </div>
                        )
                    }
                    <div className="line-clamp-2 text-sm mb-2 text-slate-900">{novel.description.replace(/<[^>]+>/g, '')}</div>
                    <div className="text-base flex align-middle items-center justify-between">
                        <span className="max-w-[50%] text-base mr-2 line-clamp-1 align-middle">{novel.author}</span>
                        <span className="px-2 text-xs text-orange-700 line-clamp-1 align-middle text-center border border-orange-700">{PROPERTIES_NOVEL['genres'][novel.category-1].value}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ItemNovel;