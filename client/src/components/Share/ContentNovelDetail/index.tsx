import Link from "next/link";

import Tippy from "@tippyjs/react";
import LazyLoad from "react-lazy-load";

import { PROPERTIES_NOVEL } from "@/constants/data";
import BlurImage from "@/components/Layout/BlurImage";
import { convertViewsCount } from "@/utils/convertViewsCount";
import { LoadingButton } from "@/components/Layout/LoadingLayout";
import { ListStarLayout } from "@/components/Layout/ListStarLayout";
import { iconAuthor, iconClose, iconHeartFull, iconTimes } from "../../../../public/icons";
import { NovelBySlugType } from "@/types";
import { placeholderBlurhash } from "@/constants";
import { ItemLazy } from "@/components/Layout/ItemLazy";

interface ContentNovelDetailProps {
    novel: NovelBySlugType;
    handleUnfollowNovel: () => void;
    handleFollowNovel: () => void;
    isFollow: boolean | null;
}

const ContentNovelDetail = ({
    novel,
    handleUnfollowNovel,
    handleFollowNovel,
    isFollow,
}: ContentNovelDetailProps) => {

    if(!novel) {
        return null
    }

    return (
        <article className="mb-6 sm:flex">
            <Link href={`/truyen/${novel.slug}`} className="sm:w-3/12 w-full max-sm:mb-6 px-4 text-center justify-center">
                <BlurImage
                    width={208}
                    height={280}
                    key={`image-${novel.slug}`}
                    alt={`truyện ${novel?.title}`}
                    blurDataURL={novel?.imageBlurHash || placeholderBlurhash}
                    className="group-hover:scale-105 group-hover:duration-500 mx-auto object-cover shadow"
                    placeholder="blur"
                    src={novel?.thumbnailUrl}
                />
            </Link>
            <div className="sm:w-9/12 max-sm:mx-auto px-4">
                <h1 className="sm:text-xl text-base  line-clamp-2 font-semibold uppercase mb-3 max-sm:text-center">
                    {novel?.title}
                </h1>

                <div className="sm:hidden mb-3 flex items-center max-sm:justify-center">
                    <i className="w-4 h-4 mr-2 block">{iconAuthor}</i>
                    <p title={`tác giả ${novel?.author}`}>{novel?.author}</p>
                </div>

                <ul className="flex items-center flex-wrap gap-2 sm:text-sm text-xs mb-4 max-sm:justify-center">
                    {novel?.author && (
                        <li className="border-[#666] text-[#666] px-3 py-1 border rounded-full ">
                            <p title={`tác giả ${novel?.author}`}>{novel?.author}</p>
                        </li>
                    )}
                    <li className="border-[#bf2c24] text-[#bf2c24] px-3 py-1 border rounded-full ">
                        {novel?.newChapterCount > 0 ? "Đang ra" : "Chưa ra chương mới"}
                    </li>
                    {novel?.category && (
                        <li className="border-[#b78a28] text-[#b78a28] px-3 py-1 border rounded-full ">
                            {PROPERTIES_NOVEL["genres"][novel?.category - 1].value}
                        </li>
                    )}
                    {novel?.personality && (
                        <li className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                            {PROPERTIES_NOVEL["personality"][novel?.personality - 1].value}
                        </li>
                    )}
                    {novel?.scene && (
                        <li className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                            {PROPERTIES_NOVEL["scene"][novel?.scene - 1].value}
                        </li>
                    )}
                    {novel?.classify && (
                        <li className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                            {PROPERTIES_NOVEL["classify"][novel?.classify - 1].value}
                        </li>
                    )}
                    {novel?.viewFrame && (
                        <li className="border-[#088860] text-[#088860] px-3 py-1 border rounded-full ">
                            {PROPERTIES_NOVEL["viewFrame"][novel?.viewFrame - 1].value}
                        </li>
                    )}
                </ul>

                <ul className="max-sm:justify-center flex gap-9 mb-4">
                    <li className="text-center">
                        <span className="font-semibold">{novel?.chapterCount || 0}</span>
                        <div className="sm:text-base text-xs">Chương</div>
                    </li>
                    <li className="text-center">
                        <span className="font-semibold">{novel?.newChapterCount || 0}</span>
                        <div className="sm:text-base text-xs">Chương/tuần</div>
                    </li>
                    <Tippy
                        theme="light"
                        arrow={true}
                        delay={[500, 0]}
                        content={novel?.views || 0}
                    >
                        <div className="text-center cursor-default">
                            <span className="font-semibold">
                                {convertViewsCount(novel?.views) || 0}
                            </span>
                            <div className="sm:text-base text-xs">Lượt đọc</div>
                        </div>
                    </Tippy>
                    <li className="text-center">
                        <span className="font-semibold">{novel?.followerCount || 0}</span>
                        <div className="sm:text-base text-xs">Cất giữ</div>
                    </li>
                </ul>

                <div className="flex mb-4">
                    <ListStarLayout numb={novel?.mediumScore} />
                    <span className="text-sm">
                        {novel?.mediumScore}
                        <span className="text-xs ml-2">({10} đánh giá)</span>
                    </span>
                </div>

                <button
                    onClick={isFollow ? handleUnfollowNovel : handleFollowNovel}
                    className={`btn text-white mb-2
                        ${
                            isFollow === null ||
                            (isFollow
                                ? "bg-[#d9534f] border-[#d9534f]  hover:bg-[#ac2925]"
                                : "bg-[#5cb85c] border-[#449d44] hover:bg-[#449d44]")
                        }
                    `}
                >
                    <>
                        <i className="w-4 h-4 block fill-white sm:mr-1 mb-[1px]">
                            {isFollow === null ? (
                                <LoadingButton className="text-white" />
                            ) : isFollow ? (
                                iconClose
                            ) : (
                                iconHeartFull
                            )}
                        </i>
                        <span className="text-white text-sm whitespace-nowrap">
                            { isFollow ? "Bỏ theo dõi" : "Theo dõi" }
                        </span>
                    </>
                </button>
                <ul className="lg:text-base text-sm flex flex-wrap gap-2">
                    <li>
                        <Link
                            className="btn bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white"
                            href={`/truyen/${novel?.slug}/chuong-1`}
                        >
                            Đọc từ đầu
                        </Link>
                    </li>

                    <li>
                        <Link
                            className="btn bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white"
                            href={`/truyen/${novel?.slug}/chuong-${novel?.chapterRead || 1}`}
                        >
                            Đọc tiếp
                        </Link>
                    </li>

                    <li>
                        <Link
                            className="btn bg-yellow-500 border-yellow-500 hover:bg-yellow-600 text-white"
                            href={`/truyen/${novel?.slug}/chuong-${novel?.chapterCount || 1}`}
                        >
                            Đọc mới nhất
                        </Link>
                    </li>
                </ul>
            </div>
        </article>
    );
};

export default ContentNovelDetail;
