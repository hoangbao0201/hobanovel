import { NovelType } from "@/types";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";


import { EffectCoverflow, Pagination } from "swiper";
import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";


const SwiperButton = dynamic( () => import('../Buttons/SwiperButton') )

interface JustPostedProps {
    novels?: NovelType[]
}

interface dataNovelProps {
    title: string
    description: string
    author: string
    genres: string
}

const JustPosted = ({ novels = [] } : JustPostedProps) => {

    const [dataNovel, setDataNovel] = useState<dataNovelProps>({ title: novels[0].title, description: novels[0].description, author: novels[0].author, genres: novels[0].category })

    return (
        <div className="px-4">
            <div className="p-4 rounded-lg bg-gray-100 mb-3">
                <h3 className="mb-5 text-xl font-semibold">Mới đăng</h3>

                <div className="relative">
                    <Swiper
                        loop={true}
                        autoplay={{delay: 2500}}
                        spaceBetween={10}
                        slidesPerView={3}
                        effect="coverflow"
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        modules={[EffectCoverflow]}
                        className=""
                    >
                        <div className="absolute w-full top-1/2 -translate-y-1/2 z-40 flex justify-between">
                            <SwiperButton
                                type="prev"
                                styleButton="p-3 bg-slate-50 rounded-full border left-0"
                                styleIcon="h-4 w-4 fill-slate-400 stroke-slate-600"   
                            />
                            <SwiperButton
                                type="next"
                                styleButton="p-3 bg-slate-50 rounded-full border right-0"
                                styleIcon="h-4 w-4 fill-slate-400 stroke-slate-600"   
                            />
                        </div>
    
                        {
                            // novels && novels.length > 0 ? (
                                novels.map((novel) => {
                                    return (
                                        <SwiperSlide key={novel.novelId} className="">
                                            <Link className="block relative" href={`/truyen/${novel.slug}`}>
                                                <Image
                                                    width={120}
                                                    height={120}
                                                    alt="banner thumbnail novel"
                                                    className="w-36 h-36 block object-cover"
                                                    src={novel.thumbnailUrl}
                                                />
                                            </Link>
                                        </SwiperSlide>
                                    )
                                })
                            // ) : (
                            //     <div></div>
                            // )
                        }
    
                    </Swiper>
                </div>
                <div>
                    <h3>{dataNovel.title}</h3>
                    <span className="line-clamp-2">{dataNovel.description.replace(/<[^>]+>/g, '')}</span>
                </div>
            </div>
        </div>
    )
}

export default JustPosted;