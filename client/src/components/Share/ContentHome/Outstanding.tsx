import Link from "next/link";

import LazyLoad from "react-lazy-load";

import { NovelType } from "@/types";
import { placeholderBlurhash } from "@/constants";
import BlurImage from "@/components/Layout/BlurImage";
import { PROPERTIES_NOVEL } from "@/constants/data";
import ItemNovel from "@/components/Layout/ItemNovel";
import { Fragment } from "react";

interface OutstandingProps {
    novels?: NovelType[]
}

const Outstanding = ({ novels = [] } : OutstandingProps) => {

    return (
        <div className="-mx-4">
            <h3 className="px-4 mb-4 text-xl font-semibold">Truyện nổi bật</h3>
            <div className="px-4 mb-4 grid md:grid-cols-2 grid-cols-1 gap-6">
    
                {   
                    novels?.length ? (
                        novels.map((novel : NovelType) => {
                            return (
                                // <Fragment key={novel?.novelId}>
                                //     <ItemNovel novel={novel}/>
                                // </Fragment>
                                <div key={novel.novelId} className="flex">
                                    <Link href={`/truyen/${novel.slug}`}>
                                        <LazyLoad className="relative w-20 h-28 overflow-hidden shadow">
                                            <BlurImage
                                                width={85}
                                                height={125}
                                                alt="image-demo"
                                                blurDataURL={novel.imageBlurHash || placeholderBlurhash}
                                                className="group-hover:scale-105 group-hover:duration-500 object-cover h-full w-full"
                                                placeholder="blur"
                                                src={novel.thumbnailUrl}
                                            />
                                        </LazyLoad>
                                    </Link>
                                    <div className="flex-1 ml-3">
                                        <h2 className="mb-2 text-base line-clamp-1 font-semibold">
                                            <Link className="block" href={`/truyen/${novel.slug}`}>{novel.title}</Link>
                                        </h2>
                                        <div className="line-clamp-2 text-sm mb-2 text-slate-900">{novel.description.replace(/<[^>]+>/g, '')}</div>
                                        <div className="text-base flex align-middle items-center justify-between">
                                            <span className="max-w-[50%] text-base mr-2 line-clamp-1 align-middle">{novel.author}</span>
                                            <span className="px-2 text-xs text-orange-700 line-clamp-1 align-middle text-center border border-orange-700">{PROPERTIES_NOVEL['genres'][novel.category-1].value}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div>Không có truyện</div>
                    )
                }
            </div>
        </div>
    )
}

export default Outstanding;