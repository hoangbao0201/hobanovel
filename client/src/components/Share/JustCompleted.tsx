import Link from "next/link";

import { NovelType } from "@/types";
import { placeholderBlurhash } from "@/constants";
import BlurImage from "../Layout/BlurImage";

interface JustCompletedProps {
    novels?: NovelType[]
}

const JustCompleted = ({ novels = [] } : JustCompletedProps) => {

    return (
        <div className="mb-5">
            <h3 className="px-4 mb-5 text-xl font-semibold">Mới hoàn thành</h3>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 px-4">
    
                {   
                    novels?.length ? (
                        novels.map((novel : NovelType) => {
                            return (
                                <div key={novel.novelId} className="flex">
                                    <Link href={`/truyen/${novel.slug}`} className="w-20 h-28 overflow-hidden shadow align-middle inline-block">
                                        <BlurImage
                                            width={720}
                                            height={960}
                                            alt="image-demo"
                                            blurDataURL={placeholderBlurhash}
                                            className="group-hover:scale-105 group-hover:duration-500 object-cover w-20 h-28"
                                            placeholder="blur"
                                            src={novel.thumbnailUrl}
                                        />
                                    </Link>
                                    <div className="flex-1 ml-3">
                                        <h2 className="mb-2 text-base line-clamp-1 font-semibold">
                                            <Link className="block" href={`/truyen/${novel.slug}`}>{novel.title}</Link>
                                        </h2>
                                        <div className="line-clamp-2 text-sm mb-2 text-slate-900">{novel.description.replace(/<[^>]+>/g, '')}</div>
                                        <div className="text-base flex align-middle items-center justify-between">
                                            <span className="max-w-[60%] text-base inline-block line-clamp-1 align-middle">{novel.author}</span>
                                            <span className="px-2 text-xs text-orange-700 inline-block line-clamp-1 align-middle text-center border rounded border-orange-700">{novel.category}</span>
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

export default JustCompleted;