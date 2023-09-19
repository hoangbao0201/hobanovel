import { NovelResType } from "@/types"
import Link from "next/link"
import LazyLoad from "react-lazy-load"
import BlurImage from "./BlurImage"
import { placeholderBlurhash } from "@/constants"
import { PROPERTIES_NOVEL } from "@/constants/data"
import { iconAuthor, iconList } from "../../../public/icons"

interface ItemNovelProps {
    novel: NovelResType
    isRating?: boolean 
    isAuthor?: boolean
    isChapterCount?: boolean
}

const ItemNovel = ({ novel, isRating = false, isAuthor = false, isChapterCount = false } : ItemNovelProps) => {

    return (
        <div className={`flex ${isRating && 'items-center'}`}>
            <Link href={`/truyen/${novel.slug}`} className="drop-shadow flex-shrink-0">
                <LazyLoad className="relative w-20 h-28 overflow-hidden shadow">
                    <BlurImage
                        width={80}
                        height={112}
                        alt={`truyện ${novel.title}`}
                        blurDataURL={novel?.imageBlurHash || placeholderBlurhash}
                        // blurDataURL={placeholderBlurhash}
                        className="group-hover:scale-105 group-hover:duration-500 h-28 w-20"
                        placeholder="blur"
                        src={novel?.thumbnailUrl}
                    />
                </LazyLoad>
            </Link>
            <figcaption className="flex-1 ml-3">
                <h3 title={`truyện ${novel.title}`} className="mb-2 text-base line-clamp-1 font-semibold">
                    <Link className="block" href={`/truyen/${novel.slug}`}>
                        {novel.title}
                    </Link>
                </h3>
                {
                    isRating && (
                        <div className="flex items-center mb-2">
                            <div className="py-[3px] lg:px-3 px-2 rounded lg:text-sm text-xs leading-none text-white font-semibold bg-red-700">{novel.mediumScore || "5.0"}</div>
                            <div className="ml-3 text-green-700 lg:text-base text-sm font-semibold line-clamp-1">{}</div>
                        </div>
                    )
                }
                <div className="line-clamp-2 text-sm mb-2 text-slate-900">
                    {novel.description && novel?.description.replace(/<[^>]+>/g, '')}
                </div>
                <div className="text-base flex align-middle items-center justify-between">
                    <span className="flex items-center max-w-[52%] text-sm mr-1">
                        <i className="w-4 h-4 block flex-shrink-0">{iconAuthor}</i> <span className="ml-1 line-clamp-1 align-middle" title={`tác giả ${novel.author}`}>{novel.author}</span>
                    </span>
                    <span className="px-2 text-xs text-orange-700 line-clamp-1 align-middle text-center border border-orange-700">
                        {PROPERTIES_NOVEL['genres'][novel?.category-1].value || PROPERTIES_NOVEL['genres'][0].value}
                    </span>
                </div>
                {
                    isChapterCount && (
                        <span className="text-sm flex items-center">
                            <i className="w-3 block mr-2">{iconList}</i> {novel.chapterCount} chương
                        </span>
                    )
                }
            </figcaption>
        </div>
    )
}

export default ItemNovel;