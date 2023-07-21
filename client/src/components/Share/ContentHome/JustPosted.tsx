import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";

import 'swiper/css';
import "swiper/css/effect-coverflow";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";

import { NovelType } from "@/types";
import { EffectCoverflow } from "swiper";
import { Transition } from "@headlessui/react";
import { PROPERTIES_NOVEL } from "@/constants/data";


const SwiperButton = dynamic( () => import('../../features/SwiperButton', { ssr: false } as ImportCallOptions))

interface JustPostedProps {
    novels?: NovelType[]
}

interface dataNovelProps {
    title: string
    description: string
    author: string
    genres: string
}

const GridSwiperStyled = styled.div`
    .swiper-slide {
        opacity: 0.5;
        box-shadow: 0 3px 10px 0 rgba(0,0,0,.25);
        background-color: #eee;
        transition: all .2s ease-in-out;
    }
    .swiper-slide-active {
        opacity: 1;
    }
`

const JustPosted = ({ novels = [] } : JustPostedProps) => {

    const [indexActiveNovel, setIndexActiveNovel] = useState(0)

    if(!novels) {
        return <div>Không có truyện</div>
    }

    return (
        <div className="px-4">
            <div className="px-4 py-5 rounded-lg bg-gray-100 mb-3 min-h-[400px]">
    
                <GridSwiperStyled className="relative overflow-hidden">
                    <Swiper
                        loop={true}
                        centeredSlides
                        slidesPerView={2}
                        spaceBetween={10}
                        effect={"coverflow"}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 200,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        modules={[EffectCoverflow]}
                        
                        onSlideChangeTransitionStart={(swiper) => {
                            setIndexActiveNovel(swiper.realIndex);
                        }}
                    >
    
                        <SwiperButton
                            type="prev"
                            styleButton="absolute top-1/2 -translate-y-1/2 z-40 p-3 focus:bg-slate-100 bg-slate-50 rounded-full border left-0"
                            styleIcon="h-4 w-4 fill-slate-400 stroke-slate-600"   
                        />
                        <SwiperButton
                            type="next"
                            styleButton="absolute top-1/2 -translate-y-1/2 z-40 p-3 focus:bg-slate-100 bg-slate-50 rounded-full border right-0"
                            styleIcon="h-4 w-4 fill-slate-400 stroke-slate-600"   
                        />
                        
                        {
                            novels.map((novel, index) => {
                                return ( 
                                    <SwiperSlide data-novel-id={novel?.slug} key={index} className="">
                                        <Link className="w-[180px] h-[240px]" href={`/truyen/${novel?.slug}`}>
                                            <Image
                                                width={180}
                                                height={240}
                                                alt={`truyện ${novel.title}`}
                                                className="h-full w-full inset-0 block object-cover"
                                                src={novel?.thumbnailUrl}
                                            />
                                        </Link>
                                    </SwiperSlide>
                                )
                            })
                        }

                    </Swiper>
                </GridSwiperStyled>
    
                <div className="flex items-center overflow-hidden relative">
                    <Transition
                        show={true}
                        enter="transition ease-in-out duration-2000 transform"
                        enterFrom=""
                        enterTo=""
                        leave="transition ease-in-out duration-2000 transform"
                        leaveFrom=""
                        leaveTo=""
    
                        className="overflow-hidden"
                    >
                        <div className="mt-8 min-w-full flex-1">
                            {
                                novels.length > 0 && (
                                    <>
                                        <h3 title={`truyện ${novels[indexActiveNovel].title}`} className="mb-4">
                                            <Link className="text-center font-semibold text-lg" href={`/truyen/${novels[indexActiveNovel].slug}`}>
                                                {novels[indexActiveNovel].title}
                                            </Link>
                                        </h3>
                                        <span className="line-clamp-2 mb-5 text-gray-500">{novels[indexActiveNovel].description.replace(/<[^>]+>/g, '')}</span>
                                        <div className="text-base flex align-middle items-center justify-between">
                                            <span title={`tác giả ${novels[indexActiveNovel].author}`} className="max-w-[54%] text-base mr-2 line-clamp-1 align-middle">{novels[indexActiveNovel].author}</span>
                                            <span className="px-2 text-xs text-orange-700 line-clamp-1 align-middle text-center border border-orange-700">{PROPERTIES_NOVEL['genres'][novels[indexActiveNovel].category-1].value}</span>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </Transition>
                </div>
    
    
            </div>
        </div>
    )
}

export default JustPosted;